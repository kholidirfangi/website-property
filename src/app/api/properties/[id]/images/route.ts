import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { imageUploadRateLimit } from "@/lib/ratelimit";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  if (user.role !== "SUPERADMIN") {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      { status: 403 },
    );
  }

  // =========================
  // RATE LIMIT UPLOAD
  // =========================

  const { success, remaining, reset } =
    await imageUploadRateLimit.limit(`image-upload:${user.id}`);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Terlalu banyak upload gambar. Silakan coba lagi nanti.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(0, Math.ceil((reset - Date.now()) / 1000)),
          ),
          "X-RateLimit-Remaining": String(remaining),
        },
      },
    );
  }

  let uploadedPublicId: string | null = null;

  try {
    const { id } = await params;

    // =========================
    // CEK PROPERTY
    // =========================

    const property = await prisma.property.findUnique({
      where: {
        id,
      },
    });

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          message: "Properti tidak ditemukan",
        },
        { status: 404 },
      );
    }

    // =========================
    // AMBIL FILE
    // =========================

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "File gambar tidak ditemukan",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI TIPE FILE
    // =========================

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format gambar harus JPG, PNG, atau WebP.",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI UKURAN FILE
    // =========================

    const maxFileSize = 10 * 1024 * 1024;

    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Ukuran gambar terlalu besar. Maksimal 10 MB.",
        },
        { status: 400 },
      );
    }

    // =========================
    // KONVERSI FILE → BUFFER
    // =========================

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // =========================
    // UPLOAD CLOUDINARY
    // =========================

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "property-website/properties",
          resource_type: "image",
          transformation: [
            {
              width: 2000,
              height: 2000,
              crop: "limit",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary upload gagal"));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      uploadStream.end(buffer);
    });

    // Simpan public_id untuk kebutuhan cleanup
    uploadedPublicId = uploadResult.public_id;

    // =========================
    // CEK GAMBAR PROPERTY
    // =========================

    const imageCount = await prisma.propertyImage.count({
      where: {
        propertyId: id,
      },
    });

    // Jika gambar pertama → jadikan primary
    const isPrimary = imageCount === 0;

    // =========================
    // SIMPAN KE DATABASE
    // =========================

    const image = await prisma.propertyImage.create({
      data: {
        propertyId: id,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        isPrimary,
      },
    });

    // Database berhasil → tidak perlu cleanup Cloudinary
    uploadedPublicId = null;

    return NextResponse.json(
      {
        success: true,
        message: "Gambar berhasil diupload",
        data: image,
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": String(remaining),
        },
      },
    );
  } catch (error) {
    console.error("UPLOAD PROPERTY IMAGE ERROR:", error);

    // =========================
    // CLEANUP CLOUDINARY
    // =========================

    if (uploadedPublicId) {
      try {
        await cloudinary.uploader.destroy(uploadedPublicId);
      } catch (cleanupError) {
        console.error(
          "CLOUDINARY CLEANUP ERROR:",
          cleanupError,
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengupload gambar",
      },
      { status: 500 },
    );
  }
}

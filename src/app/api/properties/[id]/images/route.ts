import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

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

  try {
    const { id } = await params;

    // Pastikan property tersedia
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

    // Ambil file dari FormData
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

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "File harus berupa gambar",
        },
        { status: 400 },
      );
    }

    // Konversi File → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload ke Cloudinary
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

    // Cek apakah property sudah memiliki gambar
    const imageCount = await prisma.propertyImage.count({
      where: {
        propertyId: id,
      },
    });

    // Jika ini gambar pertama → jadikan primary
    const isPrimary = imageCount === 0;

    // Simpan ke database
    const image = await prisma.propertyImage.create({
      data: {
        propertyId: id,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        isPrimary,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Gambar berhasil diupload",
        data: image,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("UPLOAD PROPERTY IMAGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengupload gambar",
      },
      { status: 500 },
    );
  }
}

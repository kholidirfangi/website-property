import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

type RouteContext = {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
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
    const { id, imageId } = await params;

    const image = await prisma.propertyImage.findFirst({
      where: {
        id: imageId,
        propertyId: id,
      },
    });

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "Gambar tidak ditemukan",
        },
        { status: 404 },
      );
    }

    const nextImage = image.isPrimary
      ? await prisma.propertyImage.findFirst({
          where: {
            propertyId: id,
            id: {
              not: imageId,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        })
      : null;

    // Hapus data dari database
    await prisma.$transaction(async (tx) => {
      await tx.propertyImage.delete({
        where: {
          id: imageId,
        },
      });

      if (image.isPrimary && nextImage) {
        await tx.propertyImage.update({
          where: {
            id: nextImage.id,
          },
          data: {
            isPrimary: true,
          },
        });
      }
    });

    // Hapus file dari Cloudinary
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (cloudinaryError) {
      console.error("CLOUDINARY DELETE ERROR:", cloudinaryError);
    }

    return NextResponse.json({
      success: true,
      message: "Gambar berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE PROPERTY IMAGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus gambar",
      },
      { status: 500 },
    );
  }
}

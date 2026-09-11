import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
};

export async function PATCH(
  _request: Request,
  { params }: RouteContext,
) {
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

    await prisma.$transaction([
      prisma.propertyImage.updateMany({
        where: {
          propertyId: id,
        },
        data: {
          isPrimary: false,
        },
      }),

      prisma.propertyImage.update({
        where: {
          id: imageId,
        },
        data: {
          isPrimary: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Gambar utama berhasil diubah",
    });
  } catch (error) {
    console.error("SET PRIMARY IMAGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengubah gambar utama",
      },
      { status: 500 },
    );
  }
}
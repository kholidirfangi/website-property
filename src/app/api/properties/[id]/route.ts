import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const validTypes = [
  "HOUSE",
  "LAND",
  "SHOPHOUSE",
  "APARTMENT",
  "VILLA",
  "OFFICE",
] as const;

const validStatuses = ["AVAILABLE", "SOLD", "RENTED"] as const;

const validListingTypes = ["SALE", "RENT"] as const;

export async function PUT(request: Request, { params }: RouteContext) {
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
    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const type = String(body.type ?? "").trim();
    const city = String(body.city ?? "").trim();
    const price = Number(body.price);
    const status = String(body.status ?? "").trim();
    const listingType = String(body.listingType ?? "").trim();
    const address = String(body.address ?? "").trim();
    const district = String(body.district ?? "").trim();
    const province = String(body.province ?? "").trim();
    const postalCode = String(body.postalCode ?? "").trim();

    const landArea =
      body.landArea !== null &&
      body.landArea !== undefined &&
      body.landArea !== ""
        ? Number(body.landArea)
        : null;

    const buildingArea =
      body.buildingArea !== null &&
      body.buildingArea !== undefined &&
      body.buildingArea !== ""
        ? Number(body.buildingArea)
        : null;

    const bedrooms =
      body.bedrooms !== null &&
      body.bedrooms !== undefined &&
      body.bedrooms !== ""
        ? Number(body.bedrooms)
        : null;

    const bathrooms =
      body.bathrooms !== null &&
      body.bathrooms !== undefined &&
      body.bathrooms !== ""
        ? Number(body.bathrooms)
        : null;

    const floors =
      body.floors !== null && body.floors !== undefined && body.floors !== ""
        ? Number(body.floors)
        : null;

    if (
      !title ||
      !city ||
      !Number.isFinite(price) ||
      !validTypes.includes(type as (typeof validTypes)[number]) ||
      !validStatuses.includes(status as (typeof validStatuses)[number]) ||
      !validListingTypes.includes(
        listingType as (typeof validListingTypes)[number],
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data property tidak valid",
        },
        { status: 400 },
      );
    }

    const property = await prisma.property.findUnique({
      where: {
        id,
      },
    });

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          message: "Property tidak ditemukan",
        },
        { status: 404 },
      );
    }

    const updatedProperty = await prisma.property.update({
      where: {
        id,
      },
      data: {
        title,
        type: type as (typeof validTypes)[number],
        city,
        price,
        status: status as (typeof validStatuses)[number],
        listingType: listingType as (typeof validListingTypes)[number],

        address,
        district,
        province,
        postalCode,

        landArea,
        buildingArea,
        bedrooms,
        bathrooms,
        floors,
      },
    });

    return NextResponse.json({
      success: true,
      property: updatedProperty,
    });
  } catch (error) {
    console.error("UPDATE PROPERTY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengupdate property",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
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

    const property = await prisma.property.findUnique({
      where: {
        id,
      },
    });

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          message: "Property tidak ditemukan",
        },
        { status: 404 },
      );
    }

    await prisma.property.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Property berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE PROPERTY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus property",
      },
      { status: 500 },
    );
  }
}

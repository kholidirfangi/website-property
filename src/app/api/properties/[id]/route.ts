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

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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
    const description = String(body.description ?? "").trim();
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

    const numericFields = [
      {
        value: landArea,
        label: "Luas tanah",
        min: 0,
      },
      {
        value: buildingArea,
        label: "Luas bangunan",
        min: 0,
      },
      {
        value: bedrooms,
        label: "Jumlah kamar tidur",
        min: 0,
        integer: true,
      },
      {
        value: bathrooms,
        label: "Jumlah kamar mandi",
        min: 0,
        integer: true,
      },
      {
        value: floors,
        label: "Jumlah lantai",
        min: 1,
        integer: true,
      },
    ];

    for (const field of numericFields) {
      if (field.value === null) {
        continue;
      }

      if (!Number.isFinite(field.value)) {
        return NextResponse.json(
          {
            success: false,
            message: `${field.label} harus berupa angka yang valid.`,
          },
          { status: 400 },
        );
      }

      if (field.value < field.min) {
        return NextResponse.json(
          {
            success: false,
            message:
              field.min === 0
                ? `${field.label} tidak boleh kurang dari 0.`
                : `${field.label} harus minimal ${field.min}.`,
          },
          { status: 400 },
        );
      }

      if (field.integer && !Number.isInteger(field.value)) {
        return NextResponse.json(
          {
            success: false,
            message: `${field.label} harus berupa bilangan bulat.`,
          },
          { status: 400 },
        );
      }
    }

    // =========================
    // VALIDASI TITLE
    // =========================

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Judul property wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (title.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Judul property minimal 3 karakter.",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI CITY
    // =========================

    if (!city) {
      return NextResponse.json(
        {
          success: false,
          message: "Kota wajib diisi.",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI TEXT
    // =========================

    const textFields = [
      { value: title, label: "Nama property", max: 150 },
      { value: city, label: "Kota", max: 100 },
      { value: description, label: "Deskripsi", max: 3000 },
      { value: address, label: "Alamat", max: 500 },
      { value: district, label: "Kecamatan", max: 100 },
      { value: province, label: "Provinsi", max: 100 },
      { value: postalCode, label: "Kode pos", max: 20 },
    ];

    for (const field of textFields) {
      if (field.value.length > field.max) {
        return NextResponse.json(
          {
            success: false,
            message: `${field.label} maksimal ${field.max} karakter.`,
          },
          { status: 400 },
        );
      }
    }

    // =========================
    // VALIDASI PRICE
    // =========================

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Harga property harus lebih dari 0.",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI TYPE
    // =========================

    if (!validTypes.includes(type as (typeof validTypes)[number])) {
      return NextResponse.json(
        {
          success: false,
          message: "Tipe property tidak valid.",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI STATUS
    // =========================

    if (!validStatuses.includes(status as (typeof validStatuses)[number])) {
      return NextResponse.json(
        {
          success: false,
          message: "Status property tidak valid.",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI LISTING TYPE
    // =========================

    if (
      !validListingTypes.includes(
        listingType as (typeof validListingTypes)[number],
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Jenis listing tidak valid.",
        },
        { status: 400 },
      );
    }

    // =========================
    // CREATE SLUG
    // =========================

    const slug = createSlug(title);

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Judul property tidak dapat digunakan sebagai slug.",
        },
        { status: 400 },
      );
    }

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
          message: "Property tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    // =========================
    // CEK SLUG DUPLIKAT
    // =========================

    const existingProperty = await prisma.property.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    });

    if (existingProperty) {
      return NextResponse.json(
        {
          success: false,
          message: "Property dengan nama tersebut sudah ada.",
        },
        { status: 409 },
      );
    }

    // =========================
    // UPDATE PROPERTY
    // =========================

    const updatedProperty = await prisma.property.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
        type: type as (typeof validTypes)[number],
        city,
        price,
        status: status as (typeof validStatuses)[number],
        listingType: listingType as (typeof validListingTypes)[number],
        description,

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
        message: "Gagal mengupdate property.",
      },
      { status: 500 },
    );
  }
}

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

    await prisma.$transaction([
      prisma.lead.updateMany({
        where: {
          propertyId: id,
        },
        data: {
          propertyId: null,
        },
      }),

      prisma.property.delete({
        where: {
          id,
        },
      }),
    ]);

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

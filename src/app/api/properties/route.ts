import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const PROPERTY_TYPES = [
  "HOUSE",
  "LAND",
  "SHOPHOUSE",
  "APARTMENT",
  "VILLA",
  "OFFICE",
] as const;

const PROPERTY_STATUSES = ["AVAILABLE", "SOLD", "RENTED"] as const;

const LISTING_TYPES = ["SALE", "RENT"] as const;

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
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
    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const type = String(body.type ?? "").trim();
    const city = String(body.city ?? "").trim();
    const price = Number(body.price);
    const status = String(body.status ?? "");
    const listingType = String(body.listingType ?? "");

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

    // =========================
    // VALIDASI ANGKA TAMBAHAN
    // =========================

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
            message: `${field.label} tidak valid`,
          },
          { status: 400 },
        );
      }

      if (field.value < field.min) {
        return NextResponse.json(
          {
            success: false,
            message: `${field.label} tidak valid`,
          },
          { status: 400 },
        );
      }

      if (field.integer && !Number.isInteger(field.value)) {
        return NextResponse.json(
          {
            success: false,
            message: `${field.label} harus berupa bilangan bulat`,
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
          message: "Nama property wajib diisi",
        },
        { status: 400 },
      );
    }

    if (title.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama property minimal 3 karakter",
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
          message: "Kota wajib diisi",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI PRICE
    // =========================

    if (!Number.isFinite(price)) {
      return NextResponse.json(
        {
          success: false,
          message: "Harga tidak valid",
        },
        { status: 400 },
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Harga harus lebih dari 0",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI TYPE
    // =========================

    if (!PROPERTY_TYPES.includes(type as (typeof PROPERTY_TYPES)[number])) {
      return NextResponse.json(
        {
          success: false,
          message: "Tipe property tidak valid",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI STATUS
    // =========================

    if (
      !PROPERTY_STATUSES.includes(status as (typeof PROPERTY_STATUSES)[number])
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Status property tidak valid",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI LISTING TYPE
    // =========================

    if (
      !LISTING_TYPES.includes(listingType as (typeof LISTING_TYPES)[number])
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Listing type tidak valid",
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
          message: "Nama property tidak dapat digunakan sebagai slug",
        },
        { status: 400 },
      );
    }

    // =========================
    // CEK SLUG
    // =========================

    const existingProperty = await prisma.property.findUnique({
      where: {
        slug,
      },
    });

    if (existingProperty) {
      return NextResponse.json(
        {
          success: false,
          message: "Property dengan nama tersebut sudah ada",
        },
        { status: 409 },
      );
    }

    // =========================
    // CREATE PROPERTY
    // =========================

    const property = await prisma.property.create({
      data: {
        title,
        slug,
        type: type as (typeof PROPERTY_TYPES)[number],
        city,
        price,
        status: status as (typeof PROPERTY_STATUSES)[number],
        listingType: listingType as (typeof LISTING_TYPES)[number],

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

    return NextResponse.json(
      {
        success: true,
        property,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat property",
      },
      { status: 500 },
    );
  }
}

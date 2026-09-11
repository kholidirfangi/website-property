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
    const status = String(body.status ?? "").trim();
    const listingType = String(body.listingType ?? "").trim();

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

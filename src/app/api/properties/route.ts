import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

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

    if (!title || !type || !city || !Number.isFinite(price)) {
      return NextResponse.json(
        {
          success: false,
          message: "Data property tidak lengkap",
        },
        { status: 400 },
      );
    }

    const slug = createSlug(title);

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

    const property = await prisma.property.create({
      data: {
        title,
        slug,
        type: type as never,
        city,
        price,
        status: status as never,
        listingType: listingType as never,
      },
    });

    return NextResponse.json({
      success: true,
      property,
    });
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
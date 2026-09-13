import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
] as const;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    if (user.role !== "SUPERADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden.",
        },
        { status: 403 },
      );
    }

    const { id } = await params;

    const body = await request.json();

    const status = String(body.status ?? "").trim();

    if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      return NextResponse.json(
        {
          success: false,
          message: "Status lead tidak valid.",
        },
        { status: 400 },
      );
    }

    const existingLead = await prisma.lead.findUnique({
      where: {
        id,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    const lead = await prisma.lead.update({
      where: {
        id,
      },
      data: {
        status: status as (typeof VALID_STATUSES)[number],
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Status lead berhasil diperbarui.",
      lead,
    });
  } catch (error) {
    console.error("UPDATE LEAD STATUS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui status lead.",
      },
      { status: 500 },
    );
  }
}
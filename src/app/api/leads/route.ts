import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();
    const propertyId = String(body.propertyId ?? "").trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor WhatsApp wajib diisi.",
        },
        { status: 400 },
      );
    }

    // Jika propertyId dikirim, pastikan property memang ada
    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: {
          id: propertyId,
        },
        select: {
          id: true,
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
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        message: message || null,
        propertyId: propertyId || null,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        source: true,
        propertyId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry berhasil dikirim.",
        lead,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE LEAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengirim inquiry.",
      },
      { status: 500 },
    );
  }
}
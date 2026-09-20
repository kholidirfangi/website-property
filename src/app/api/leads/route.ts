import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadRateLimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const { success, remaining, reset } = await leadRateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
            "X-RateLimit-Remaining": String(remaining),
          },
        },
      );
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();
    const propertyId = String(body.propertyId ?? "").trim();

    // =========================
    // VALIDASI NAMA
    // =========================

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama minimal 2 karakter.",
        },
        { status: 400 },
      );
    }

    if (name.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama maksimal 100 karakter.",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI PHONE
    // =========================

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor WhatsApp wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (phone.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor WhatsApp minimal 8 karakter.",
        },
        { status: 400 },
      );
    }

    if (phone.length > 20) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor WhatsApp maksimal 20 karakter.",
        },
        { status: 400 },
      );
    }

    const phoneRegex = /^[+]?[0-9]+$/;

    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor WhatsApp hanya boleh berisi angka.",
        },
        { status: 400 },
      );
    }

    // =========================
    // VALIDASI EMAIL
    // =========================

    if (email) {
      if (email.length > 150) {
        return NextResponse.json(
          {
            success: false,
            message: "Email maksimal 150 karakter.",
          },
          { status: 400 },
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return NextResponse.json(
          {
            success: false,
            message: "Format email tidak valid.",
          },
          { status: 400 },
        );
      }
    }

    // =========================
    // VALIDASI MESSAGE
    // =========================

    if (message.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: "Pesan maksimal 1000 karakter.",
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

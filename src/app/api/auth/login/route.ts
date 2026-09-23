import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  authenticateUser,
  createSessionToken,
} from "@/lib/auth";

import { loginRateLimit } from "@/lib/ratelimit";

export async function POST(request: NextRequest) {
  try {
    // =========================
    // RATE LIMIT LOGIN
    // =========================

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const { success, remaining, reset } =
      await loginRateLimit.limit(`login:${ip}`);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Terlalu banyak percobaan login. Silakan coba lagi nanti.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(0, Math.ceil((reset - Date.now()) / 1000)),
            ),
            "X-RateLimit-Remaining": String(remaining),
          },
        },
      );
    }

    // =========================
    // PARSE REQUEST
    // =========================

    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    // =========================
    // VALIDASI
    // =========================

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email dan password wajib diisi.",
        },
        { status: 400 },
      );
    }

    // =========================
    // AUTHENTICATE
    // =========================

    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah.",
        },
        { status: 401 },
      );
    }

    // =========================
    // CREATE SESSION
    // =========================

    const token = await createSessionToken({
      userId: user.id,
      role: user.role,
    });

    // =========================
    // RESPONSE
    // =========================

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    const secureCookie =
      process.env.NODE_ENV === "production"
        ? "; Secure"
        : "";

    response.headers.append(
      "Set-Cookie",
      `session=${token}; HttpOnly${secureCookie}; Path=/; SameSite=Lax; Max-Age=${
        60 * 60 * 24 * 30
      }`,
    );

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 },
    );
  }
}
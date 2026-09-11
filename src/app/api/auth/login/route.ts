import { NextRequest } from "next/server";
import { authenticateUser, createSessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      return Response.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 },
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return Response.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      role: user.role,
    });

    const response = Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.headers.append(
      "Set-Cookie",
      `session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
    );

    return response;
  } catch {
    return Response.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
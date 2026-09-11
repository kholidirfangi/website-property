import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/agent/login", request.url),
    );
  }

  try {
    await verifySessionToken(token);

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL("/agent/login", request.url),
    );
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
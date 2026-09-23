import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is not defined");
}

const secretKey = new TextEncoder().encode(secret);

const VALID_ROLES = ["ADMIN", "SUPERADMIN"] as const;

type UserRole = (typeof VALID_ROLES)[number];

function isValidRole(role: unknown): role is UserRole {
  return typeof role === "string" && VALID_ROLES.includes(role as UserRole);
}

export async function createSessionToken(payload: {
  userId: string;
  role: UserRole;
}) {
  return new SignJWT({
    userId: payload.userId,
    role: payload.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ["HS256"],
  });

  if (typeof payload.userId !== "string") {
    throw new Error("Invalid session userId");
  }

  if (!isValidRole(payload.role)) {
    throw new Error("Invalid session role");
  }

  return {
    userId: payload.userId,
    role: payload.role,
  };
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return null;
  }

  if (!user.isActive) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPERADMIN";
}

export function isSuperAdmin(role: string) {
  return role === "SUPERADMIN";
}

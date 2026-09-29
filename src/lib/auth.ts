import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "./db";
import { SESSION_COOKIE, getAuthSecret, verifySessionToken } from "./session";

export type Role = "user" | "admin";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export { SESSION_COOKIE };
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(userId: number) {
  return new SignJWT({ sub: String(userId) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getAuthSecret());
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const userId = await verifySessionToken(token);
  if (!userId) return null;

  const doc = await getDb().collection("users").doc(String(userId)).get();
  if (!doc.exists) return null;

  const data = doc.data()!;
  return { id: data.id, name: data.name, email: data.email, role: data.role };
}

type AuthResult =
  | { user: SessionUser; response: null }
  | { user: null; response: NextResponse };

export async function requireUser(request: NextRequest): Promise<AuthResult> {
  const user = await getSessionUser(request);
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    };
  }
  return { user, response: null };
}

export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  const result = await requireUser(request);
  if (!result.user) return result;

  if (result.user.role !== "admin") {
    return {
      user: null,
      response: NextResponse.json({ error: "Admin access required" }, { status: 403 }),
    };
  }
  return result;
}

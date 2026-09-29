import { jwtVerify } from "jose";

// Kept separate from auth.ts (which pulls in Firestore) so src/proxy.ts can
// check the session cookie without loading the database client.

export const SESSION_COOKIE = "rtd_session";

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function verifySessionToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    const id = Number(payload.sub);
    return Number.isInteger(id) ? id : null;
  } catch {
    return null;
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { hashPassword, requireUser, verifyPassword } from "@/lib/auth";

// Requires the caller's current password — there is no email-based "forgot
// password" flow. A logged-in user proves identity with the old password,
// same as any other authenticated action.
export async function POST(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (!user) return response;

  const body = await request.json().catch(() => null);
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "currentPassword and newPassword are required" },
      { status: 400 }
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const sql = getSql();
  const [row] = await sql`SELECT password_hash FROM users WHERE id = ${user.id}`;
  if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  const newHash = await hashPassword(newPassword);
  await sql`UPDATE users SET password_hash = ${newHash} WHERE id = ${user.id}`;

  return NextResponse.json({ ok: true });
}

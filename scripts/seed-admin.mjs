import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

// Bootstraps or promotes the first admin account. Run directly against the
// database with server-side env vars — this is intentionally NOT exposed
// over HTTP, since regular users must never be able to grant themselves
// the admin role through the API.
async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!databaseUrl) throw new Error("DATABASE_URL environment variable is not set");
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the first admin");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const sql = neon(databaseUrl);
  const [existing] = await sql`SELECT id FROM users WHERE email = ${normalizedEmail}`;

  if (existing) {
    await sql`UPDATE users SET role = 'admin' WHERE id = ${existing.id}`;
    console.log(`Promoted existing user ${normalizedEmail} to admin.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (${name}, ${normalizedEmail}, ${passwordHash}, 'admin')
  `;
  console.log(`Created admin user ${normalizedEmail}.`);
}

main().catch((err) => {
  console.error("Seeding admin failed:", err);
  process.exit(1);
});

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const sql = neon(databaseUrl);
  const schemaPath = path.join(__dirname, "../src/lib/schema.sql");
  const schema = readFileSync(schemaPath, "utf8");

  const statements = schema
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0 && !statement.startsWith("--"));

  for (const statement of statements) {
    await sql.query(statement);
  }

  console.log(`Applied ${statements.length} statement(s) from schema.sql`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

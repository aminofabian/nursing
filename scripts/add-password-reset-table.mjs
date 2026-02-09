import { createClient } from "@libsql/client";
import { config } from "dotenv";

// Load env vars
config();

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error("TURSO_DATABASE_URL is not set");
    process.exit(1);
  }

  console.log("Connecting to Turso:", url.substring(0, 40) + "...");

  const client = createClient({ url, authToken });

  const createTableSql = `
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires_at" DATETIME NOT NULL,
  "used_at" DATETIME,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "password_reset_tokens_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "password_reset_tokens_user_id_idx"
  ON "password_reset_tokens"("user_id");

CREATE INDEX IF NOT EXISTS "password_reset_tokens_expires_at_idx"
  ON "password_reset_tokens"("expires_at");
`.trim();

  const statements = createTableSql.split(";\n").map((s) => s.trim()).filter(Boolean);

  console.log(`Executing ${statements.length} statements...`);

  for (const statement of statements) {
    try {
      await client.execute(statement + ";");
      console.log("✓", statement.replace(/\s+/g, " ").substring(0, 80) + "...");
    } catch (err) {
      console.error("✗ Error:", err.message);
      console.error("  Statement:", statement.substring(0, 120));
      process.exitCode = 1;
    }
  }

  // Verify table exists
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='password_reset_tokens';",
  );
  console.log("password_reset_tokens table present:", tables.rows.length > 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


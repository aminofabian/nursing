import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Determine the URL to use (Turso in prod, local SQLite fallback)
  let url;
  if (tursoUrl && tursoUrl.startsWith("libsql://")) {
    url = tursoUrl;
    console.log("[SetAdmin] Using Turso database:", tursoUrl.substring(0, 40) + "...");
  } else {
    url = "file:prisma/dev.db";
    console.log("[SetAdmin] Using local SQLite database:", url);
  }

  const adapter = new PrismaLibSql({
    url,
    authToken: tursoUrl && tursoUrl.startsWith("libsql://") ? authToken : undefined,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const prisma = createPrismaClient();

async function main() {
  const email = "aminofab@gmail.com";

  console.log(`[SetAdmin] Promoting ${email} to ADMIN...`);

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  console.log("[SetAdmin] Updated user:", {
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

main()
  .catch((err) => {
    console.error("[SetAdmin] Error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


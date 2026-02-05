import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  console.log("[Prisma Init] TURSO_DATABASE_URL:", tursoUrl ? `${tursoUrl.substring(0, 40)}...` : "undefined")
  console.log("[Prisma Init] Has auth token:", !!authToken)

  // Determine the URL to use
  let url: string
  if (tursoUrl && tursoUrl.startsWith("libsql://")) {
    url = tursoUrl
    console.log("[Prisma Init] Using TURSO remote database")
  } else {
    url = "file:prisma/dev.db"
    console.log("[Prisma Init] FALLBACK to local SQLite - tursoUrl was:", tursoUrl)
  }

  const adapter = new PrismaLibSql({
    url,
    authToken: tursoUrl?.startsWith("libsql://") ? authToken : undefined,
  })

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma

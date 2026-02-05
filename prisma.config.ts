import "dotenv/config"
import path from "node:path"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  // Local SQLite file for schema validation and migrations
  // The actual runtime adapter (Turso) is configured in src/lib/prisma.ts
  datasource: {
    url: `file:${path.join(__dirname, "prisma", "dev.db")}`,
  },
})

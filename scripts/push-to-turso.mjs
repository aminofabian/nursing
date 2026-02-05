import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { config } from "dotenv";

// Load env vars
config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log("Connecting to Turso:", process.env.TURSO_DATABASE_URL?.substring(0, 40) + "...");
  
  // Check existing tables
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
  console.log("Existing tables:", tables.rows.map(r => r.name));

  if (tables.rows.length > 0) {
    console.log("\nTables already exist. Skipping migration.");
    process.exit(0);
  }

  // Read the migration SQL
  const sql = readFileSync("prisma/init.sql", "utf-8");
  
  // Split by semicolon followed by newline to get complete statements
  const rawStatements = sql.split(/;\s*\n/);
  console.log("Raw split count:", rawStatements.length);
  
  const statements = rawStatements
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`\nExecuting ${statements.length} SQL statements...`);

  for (const statement of statements) {
    // Remove comment lines but keep the SQL
    const cleanStatement = statement.replace(/^--.*$/gm, "").trim();
    if (!cleanStatement) continue;
    
    try {
      await client.execute(cleanStatement + ";");
      // Log first 60 chars of each statement
      const preview = cleanStatement.replace(/\n/g, " ").substring(0, 60);
      console.log("✓", preview + "...");
    } catch (err) {
      console.error("✗ Error:", err.message);
      console.error("  Statement:", cleanStatement.substring(0, 100));
    }
  }

  // Verify tables created
  const newTables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
  console.log("\nTables after migration:", newTables.rows.map(r => r.name));
}

main().catch(console.error);

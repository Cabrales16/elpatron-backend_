import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pool from "./connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🗄️  EL PATRÓN - Database Migration");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const connection = await pool.getConnection();

  try {
    // Read schema file
    const schemaPath = join(
      __dirname,
      "..",
      "..",
      "..",
      "database",
      "schema.sql",
    );
    console.log(`📖 Leyendo schema desde: ${schemaPath}\n`);

    const schema = readFileSync(schemaPath, "utf8");

    // Split by semicolon and filter empty statements
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📝 Ejecutando ${statements.length} statements...\n`);

    let executed = 0;
    for (const statement of statements) {
      try {
        await connection.query(statement);
        executed++;

        // Show progress for major operations
        if (statement.includes("CREATE TABLE")) {
          const match = statement.match(/CREATE TABLE (\w+)/);
          if (match) {
            console.log(`✅ Tabla creada: ${match[1]}`);
          }
        } else if (statement.includes("CREATE VIEW")) {
          const match = statement.match(/CREATE VIEW (\w+)/);
          if (match) {
            console.log(`✅ Vista creada: ${match[1]}`);
          }
        }
      } catch (error) {
        // Ignore "already exists" errors
        if (!error.message.includes("already exists")) {
          console.error(`❌ Error ejecutando statement: ${error.message}`);
        }
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ Migration completada`);
    console.log(`📊 ${executed} statements ejecutados correctamente`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  } catch (error) {
    console.error("\n❌ Error en migration:", error.message);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

// Run migration
migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});

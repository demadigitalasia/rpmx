import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { loadEnv } from "./env.mjs";

loadEnv();

/**
 * Menerapkan migrasi SQL dari folder ./drizzle.
 * Dipakai saat container produksi start (lihat Dockerfile) maupun manual:
 *   node scripts/migrate.mjs
 */
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL tidak diset.");
  process.exit(1);
}

const client = postgres(url, { max: 1 });
const db = drizzle(client);

try {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrasi database selesai.");
} finally {
  await client.end();
}

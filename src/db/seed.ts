import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { loadEnv } from "../../scripts/env.mjs";
import { seedContent } from "./seed-content";

loadEnv();

/**
 * Seed konten awal RPMX ke PostgreSQL.
 * Jalankan setelah schema tersinkron:
 *   npm run db:push   (dev, tanpa migrasi)
 *   npm run db:seed
 *
 * Idempotent (N1): tabel konten HANYA diisi bila kosong — hasil edit di /admin
 * tidak ditimpa. Timpa paksa: npm run db:seed -- --fresh
 * Data inquiry TIDAK disentuh.
 */

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL tidak diset — salin .env.example ke .env.local dulu.");
    process.exit(1);
  }

  const client = postgres(url, { max: 1 });
  const db = drizzle(client);

  const fresh = process.argv.includes("--fresh");
  const filled = await seedContent(db, { fresh });

  if (Object.keys(filled).length === 0) {
    console.log(
      fresh
        ? "Seed --fresh: semua tabel konten ditimpa."
        : "Seed selesai (tabel kosong diisi; tabel berisi dilewati). Data inquiry tidak disentuh.",
    );
  } else {
    console.log("Seed mengisi:", JSON.stringify(filled));
  }
  await client.end();
}

main().catch((err) => {
  console.error("Seed gagal:", err);
  process.exit(1);
});

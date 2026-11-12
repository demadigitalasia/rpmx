import { loadEnv } from "./env.mjs";

/**
 * check:prod — validasi env produksi sebelum deploy (TASK E).
 * Paritas dengan src/lib/env-check.ts: NODE_ENV=production + ADMIN_PASSWORD
 * lemah/absen → exit 1. Dipakai di server/CI: npm run check:prod
 */
loadEnv();

const WEAK = new Set(["admin123", "changeme"]);
const problems = [];

if (process.env.NODE_ENV !== "production") {
  console.log(
    "— Melewati: NODE_ENV bukan production. Jalankan di server/CI produksi (atau `NODE_ENV=production npm run check:prod`) —",
  );
  process.exit(0);
}

const password = process.env.ADMIN_PASSWORD;
if (!password) {
  problems.push("ADMIN_PASSWORD kosong — login admin mati total di produksi.");
} else if (WEAK.has(password) || password.length < 8) {
  problems.push(
    "ADMIN_PASSWORD terlalu lemah — minimal 8 karakter, bukan admin123/changeme.",
  );
}

if (!process.env.DATABASE_URL) {
  problems.push("DATABASE_URL kosong — aplikasi tidak punya database.");
}
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  problems.push(
    "NEXT_PUBLIC_SITE_URL kosong — metadata/OG/sitemap akan memakai localhost.",
  );
}

if (problems.length > 0) {
  console.error("✗ env produksi belum aman:");
  for (const problem of problems) {
    console.error(`  - ${problem}`);
  }
  process.exit(1);
}

console.log(
  "✓ env produksi aman — ADMIN_PASSWORD kuat, DATABASE_URL & NEXT_PUBLIC_SITE_URL terisi.",
);

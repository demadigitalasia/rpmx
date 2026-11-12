# RPMX — Konveksi & Brand Jersey Custom

Website company profile + lead generation untuk RPMX: brand jersey kasual &
sport sekaligus layanan konveksi custom (Tasikmalaya).

- **Stack:** Next.js 16 (App Router, React 19, Turbopack) · Tailwind CSS v4 ·
  PostgreSQL 17 · Drizzle ORM · Zod
- **Dokumen produk:** lihat [PRD.md](./PRD.md)
- **Deploy VPS:** lihat [DEPLOYMENT.md](./DEPLOYMENT.md)

## Halaman

| Route | Isi |
|---|---|
| `/` | Beranda: hero, keunggulan, 6 layanan, proses produksi, galeri, testimoni, CTA |
| `/layanan` | Detail layanan (dari DB) |
| `/galeri` | Portofolio (dari DB) |
| `/tentang` | Profil brand + kontak |
| `/kontak` | Form Minta Penawaran → tersimpan ke PostgreSQL |
| `/admin` | Login password (env `ADMIN_PASSWORD`) → kelola status inquiry |

## Menjalankan di Lokal

1. **PostgreSQL lokal** — contoh cepat via Docker:

   ```bash
   docker run -d --name rpmx-db \
     -e POSTGRES_USER=rpmx -e POSTGRES_PASSWORD=rpmx_dev -e POSTGRES_DB=rpmx \
     -p 5432:5432 postgres:17-alpine
   ```

2. **Environment** — salin `.env.example` → `.env.local` (nilai bawaan sudah
   cocok dengan container di atas).

3. **Siapkan database & konten:**

   ```bash
   npm install
   npm run db:migrate   # buat tabel dari migrasi drizzle/
   npm run db:seed      # isi konten awal (layanan, galeri, testimoni contoh)
   ```

4. **Jalankan:**

   ```bash
   npm run dev          # http://localhost:3000
   ```

> Tanpa database pun website tetap jalan (fallback konten statis) — form
> penawaran dan `/admin` saja yang butuh DB.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Build produksi |
| `npm run start` | Jalankan hasil build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate migrasi dari `src/db/schema.ts` |
| `npm run db:migrate` | Terapkan migrasi |
| `npm run db:push` | Sinkron langsung schema → DB (dev) |
| `npm run db:seed` | Isi konten awal |

## Struktur

```
src/
  app/            # Halaman (App Router), API, sitemap, robots, OG image
  components/     # Header, footer, section beranda, form, kartu
  db/             # Skema Drizzle + client + seed
  lib/            # Konfigurasi situs, konten fallback, data (use cache), validasi
scripts/          # Migrasi runtime untuk Docker
drizzle/          # Migrasi SQL (di-commit)
```

## Catatan Konten

- Testimoni pada seed adalah **data contoh** dan nonaktif — aktifkan
  (`is_active = true`) setelah mengganti dengan testimoni asli.
- Galeri memakai placeholder gradien per kategori; isi `image_url` dengan URL
  foto asli untuk menampilkan foto produksi.

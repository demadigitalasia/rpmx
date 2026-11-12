# PRD — Website RPMX

> **Product Requirements Document** — v1.0 · 9 November 2026
> Status: Disetujui untuk implementasi MVP (Fase 1)

---

## 1. Ringkasan Eksekutif

RPMX adalah ekosistem fashion custom yang menggabungkan **brand jersey kasual & sport** dengan **kemampuan konveksi profesional**. Website ini berfungsi sebagai:

1. **Etalase digital** — company profile yang menjelaskan brand, keunggulan, dan layanan RPMX.
2. **Kanal lead generation** — form "Minta Penawaran" yang menyimpan permintaan ke database.
3. **Katalog layanan & portofolio** — data layanan, galeri, dan testimoni dikelola dari PostgreSQL.

Website dibangun dengan **Next.js 16 (App Router) + PostgreSQL**, di-deploy **mandiri (self-hosted) di VPS milik RPMX** menggunakan Docker.

---

## 2. Latar Belakang & Masalah

| Masalah Saat Ini | Solusi dari Website |
|---|---|
| Calon pelanggan hanya bisa menghubungi via telepon/WA tanpa referensi visual | Landing page profesional yang meyakinkan kredibilitas |
| Informasi layanan, keunggulan, dan kontak tidak terpusat | Satu sumber informasi resmi dengan navigasi jelas |
| Permintaan penawaran masuk tidak terstruktur (campur chat WA/telepon) | Form penawaran terstruktur → tersimpan rapi di database |
| Portofolio kerja tidak terdokumentasi untuk publik | Halaman galeri yang mudah diperbarui |

---

## 3. Tujuan & Metrik Keberhasilan

**Tujuan:**
- Menjadi titik masuk resmi calon pelanggan (individu, komunitas, corporate) ke layanan RPMX.
- Meningkatkan jumlah inquiry yang terstruktur dan mudah ditindaklanjuti.
- Memperkuat identitas brand RPMX sebagai brand jersey + konveksi profesional.

**Metrik keberhasilan (6 bulan pasca-launch):**
- Form penawaran terkirim dan tersimpan di DB tanpa kehilangan data.
- Waktu load halaman utama < 2 detik (LCP) pada koneksi 4G.
- Skor Lighthouse (Performance / SEO / Best Practices) ≥ 90 untuk halaman publik.
- Website bisa diakses stabil via HTTPS di domain VPS.

---

## 4. Target Pengguna

| Persona | Kebutuhan Utama |
|---|---|
| **Individu** | Pesan 1–beberapa pcs custom (kaos, jersey, jaket) |
| **Komunitas / Tim Olahraga** | Paket jersey tim lengkap (desain → produksi → kirim) |
| **Corporate / Event / Sekolah** | Produksi massal (kaos polo, jaket, merch) dengan harga kompetitif |
| **Reseller** | Harga grosir dan kapasitas produksi konsisten |

---

## 5. Ruang Lingkup

### 5.1 Fase 1 — MVP (In Scope, implementasi saat ini)

- Landing page lengkap: Hero, Keunggulan, Layanan (6 kartu), Proses Produksi, Galeri, Testimoni, CTA, Kontak.
- Halaman: `/` (beranda), `/layanan`, `/galeri`, `/tentang`, `/kontak`.
- **Form Minta Penawaran** → API → tersimpan di PostgreSQL (dengan validasi + honeypot anti-spam).
- Konten layanan/galeri/testimoni **dari database** dengan fallback statis bila DB tidak tersedia.
- Admin mini (`/admin`): lihat daftar inquiry, ubah status, login password sederhana.
- SEO dasar: metadata, Open Graph, sitemap, robots, JSON-LD LocalBusiness.
- Tombol WhatsApp mengambang + link `tel:` dan `mailto:`.
- Artefak deployment VPS: `Dockerfile`, `docker-compose.yml`, `DEPLOYMENT.md`, migrasi & seed database.

### 5.2 Fase 2 (Backlog — tidak diimplementasikan sekarang)

- Admin CMS penuh: CRUD layanan, upload foto galeri, kelola testimoni.
- Katalog produk dengan varian (ukuran, bahan, harga paket).
- Notifikasi inquiry ke WA/email admin.
- Google Analytics / tracking, WhatsApp API.

### 5.3 Non-Goals

- E-commerce / checkout online (Fase 3+, belum dibutuhkan).
- Multi-bahasa (hanya Bahasa Indonesia untuk MVP).
- Mobile app.

---

## 6. Tech Stack

| Layer | Teknologi | Catatan |
|---|---|---|
| Framework | **Next.js 16** (App Router, React 19, TypeScript, Turbopack) | Versi terbaru, `output: "standalone"` untuk Docker |
| Styling | **Tailwind CSS v4** | Tema gelap sporty, aksen volt |
| Database | **PostgreSQL 17** | Berjalan di VPS (container compose) |
| ORM | **Drizzle ORM** + drizzle-kit | Migrasi SQL terekam (`./drizzle`), seed via `tsx` |
| Validasi | **Zod** | Skema form inquiry |
| Ikon | **lucide-react** | Konsisten, ringan |
| Runtime | Node.js ≥ 20.9 | VPS menggunakan Node 22 di Docker |
| Deploy | Docker + docker-compose (app + postgres) | Reverse proxy Nginx + SSL Let's Encrypt di VPS |

---

## 7. Struktur Halaman & Sitemap

```
/            Beranda  — hero, keunggulan, layanan (ringkas), proses, galeri, testimoni, CTA
/layanan     Detail 6 layanan (dari DB) + CTA penawaran
/galeri      Grid portofolio (dari DB, kategori berwarna; foto nyata menyusul)
/tentang     Profil RPMX, nilai brand, alamat & jam operasional
/kontak      Info kontak + Form Minta Penawaran
/admin       Login + daftar inquiry (proteksi cookie + env ADMIN_PASSWORD)
```

Struktur section beranda:

1. **Navbar** (sticky, blur) — logo RPMX, nav, CTA "Minta Penawaran".
2. **Hero** — headline besar, subcopy, CTA (Penawaran + WA), badge keunggulan.
3. **Marquee** — strip berjalan: Sublimasi · Full Print · Bordir · Hoodie · Varsity · …
4. **Keunggulan (4 kartu)** — Brand Original · Konveksi Custom · Bahan Berkualitas · Desain Bebas.
5. **Layanan (6 kartu)** — Jersey Custom · Jaket Custom · Baju Custom · Produksi Massal · Jersey Komunitas · Produksi Cepat, masing-masing dengan tag.
6. **Proses Produksi (5 langkah)** — Konsultasi → Desain → Produksi → QC → Pengiriman.
7. **Galeri preview** — 6 item terbaru dari DB.
8. **Testimoni** — dari DB (seed = contoh, diganti asli sebelum go-live).
9. **CTA + Kontak** — ajakan penawaran, telepon/email/alamat.
10. **Footer** — brand, navigasi, kontak, copyright.

---

## 8. Spesifikasi Fitur

### F1 · Navbar
- Sticky, latar `backdrop-blur`, border tipis; menu mobile hamburger.
- Link: Beranda, Layanan, Galeri, Tentang, Kontak + tombol aksen "Minta Penawaran".

### F2 · Hero
- Headline besar uppercase (font display), satu kata beraksen warna volt.
- Subcopy: posisi RPMX sebagai ekosistem fashion custom (individu → produksi massal).
- CTA utama "Minta Penawaran" → `/kontak`; sekunder "Chat WhatsApp".
- Elemen visual: glow gradien, grid pattern, kartu mengambang (tanpa foto stok — foto produksi asli ditambahkan belakangan).

### F3 · Keunggulan
4 kartu ikon + judul + deskripsi (copy resmi dari brand RPMX, lihat §16).

### F4 · Layanan
- 6 kartu dari tabel `services` (judul, deskripsi, tag array, urutan).
- Halaman `/layanan` menampilkan detail per layanan + CTA.

### F5 · Proses Produksi
Timeline 5 langkah bernomor, deskripsi singkat per langkah.

### F6 · Galeri
- Kartu dari tabel `gallery_items` (judul, kategori, warna gradien per kategori, `image_url` opsional).
- Jika `image_url` kosong → tampil placeholder gradien + ikon; siap diganti foto asli.
- Sumber: DB; halaman `/galeri` menampilkan semua item aktif.

### F7 · Testimoni
- Kartu nama, peran, isi, rating bintang (tabel `testimonials`).
- **Catatan produksi:** seed berisi data *contoh* — wajib diganti testimoni asli sebelum go-live.

### F8 · Form Minta Penawaran (`/kontak`)
- Field: Nama*, No. WhatsApp/Telepon*, Email (ops.), Jenis Layanan (select dari DB), Perkiraan Jumlah (ops.), Detail Kebutuhan*.
- Honeypot field tersembunyi (bot → ditolak diam-diam).
- Validasi Zod (server) + validasi HTML (client); pesan sukses/error inline.
- Berhasil → tersimpan ke `inquiries` dengan status `new`.

### F9 · Admin Mini (`/admin`)
- Login: password dari `ADMIN_PASSWORD` (env), sesi via cookie httpOnly.
- Daftar inquiry terbaru (nama, kontak, layanan, jumlah, pesan, tanggal) + ubah status (`new` / `contacted` / `quoted` / `done` / `closed`).
- Bukan CMS; pengelolaan konten konten masih via DB/seed (Fase 2).

### F10 · Kontak & WhatsApp
- Telepon `0851-8085-1428` → `tel:+6285180851428` & `https://wa.me/6285180851428`.
- Email `renaldimaulanarahmanputra@email.com`.
- Alamat: Kp. Gununggede RT/RW 01/08, Kel. Gununggede, Kec. Kawalu, Kota Tasikmalaya.
- Tombol WhatsApp mengambang di semua halaman publik.

### F11 · SEO
- Metadata per halaman (title template `%s | RPMX`), Open Graph + Twitter Card, OG image dinamis sederhana.
- `sitemap.xml` + `robots.txt` (disallow `/admin`).
- JSON-LD `LocalBusiness` (nama, telepon, alamat, email) di beranda.

### F12 · Non-Fungsional
- Responsif penuh (mobile-first), kontras AA, fokus keyboard jelas.
- Font via `next/font` (Geist + Space Grotesk) — tanpa layout shift.
- Halaman berbasis DB: ISR `revalidate = 60` + fallback konten statis bila DB down → website tetap tampil.

---

## 9. Skema Database (PostgreSQL)

```sql
-- Layanan (6 kartu)
CREATE TABLE services (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- Portofolio
CREATE TABLE gallery_items (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL,             -- jersey | jaket | kaos | polo | ...
  image_url   TEXT,                      -- null → placeholder gradien
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- Testimoni (seed = contoh, ganti sebelum go-live)
CREATE TABLE testimonials (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL,              -- mis. "Ketua Tim Futsal Garut"
  content    TEXT NOT NULL,
  rating     INTEGER NOT NULL DEFAULT 5, -- 1..5
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true
);

-- Permintaan penawaran dari form
CREATE TABLE inquiries (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  email        TEXT,
  service_slug TEXT,
  quantity     TEXT,                    -- fleksibel: "12 pcs", "100+"
  message      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'new',  -- new|contacted|quoted|done|closed
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

- ORM Drizzle dengan skema TypeScript di `src/db/schema.ts`.
- Migrasi SQL di-generate ke `./drizzle/` (di-commit ke repo) dan dijalankan otomatis saat container app start (`scripts/migrate.mjs`).
- Seed konten awal: `npm run db:seed`.

---

## 10. API

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/inquiries` | POST | Kirim permintaan penawaran. Validasi Zod + honeypot. Response JSON `{ ok: true }` / error field. |
| Admin (server action) | — | Login, logout, update status inquiry (cookie httpOnly, proteksi password env). |

---

## 11. Desain & Branding

- **Logo utama:** `public/rpmx-logo.png` (3533×831, background transparan) — wordmark "RPM" putih + "X" merah dengan slash petir. Dipakai di header, footer, dan OG image.
- **Mood:** sporty, tegas, modern — membanggakan dipakai komunitas & korporat.
- **Tema:** gelap (zinc-950) dengan aksen **merah brand #E83030** (disampling langsung dari huruf X pada logo) + gradien merah.
- **Tipografi:** Space Grotesk (display, uppercase tebal) + Geist (body).
- **Elemen khas:** marquee tag layanan, kartu sudut tegas, hover aksen merah, angka besar proses, jersey ilustrasi bernomor 10.
- **Foto:** MVP memakai placeholder gradien berkategori; foto produksi asli RPMX tinggal mengganti `image_url` di tabel galeri (atau dipasok ke dev).

---

## 12. Deployment di VPS

- `Dockerfile` multi-stage (node:22-alpine) → output `standalone`, ukuran kecil.
- `docker-compose.yml`: service `db` (postgres:17-alpine + volume + healthcheck) dan `app` (migrasi otomatis saat start → next server di port 3000).
- File env: `.env.example` berisi `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`.
- Reverse proxy Nginx + HTTPS (Let's Encrypt) menghadap `127.0.0.1:3000`.
- Backup DB: `pg_dump` cron harian (panduan di `DEPLOYMENT.md`).

---

## 13. Roadmap

| Fase | Isi | Status |
|---|---|---|
| **1 — MVP** | Landing + form penawaran + admin mini + deploy VPS | 🚧 Implementasi sekarang |
| 2 | Admin CMS penuh (CRUD konten, upload foto), notifikasi inquiry | Backlog |
| 3 | Katalog produk + e-commerce ringan | Backlog |

---

## 14. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| DB belum berisi data saat build/deploy | Fallback konten statis; seed otomatis terdokumentasi |
| Spam masuk ke form penawaran | Honeypot + validasi ketat; rate-limit bisa ditambah di Nginx |
| Foto portofolio belum ada | Placeholder gradien berkategori yang tetap estetik |
| Kehilangan data inquiry | Volume Docker untuk postgres + cron `pg_dump` |

---

## 15. Lampiran — Konten Resmi (sumber copywriting)

**Tentang brand:** RPMX bukan sekadar brand baju — ekosistem lengkap fashion custom yang menggabungkan identitas brand jersey kasual & sport dengan kemampuan konveksi profesional. Didirikan dengan semangat memberikan akses produk fashion berkualitas tinggi dengan harga terjangkau, melayani pemesanan individu hingga produksi massal untuk komunitas dan perusahaan.

**Keunggulan:** Brand Original · Konveksi Custom · Bahan Berkualitas · Desain Bebas.

**Layanan (6):** Jersey Custom (Sublimasi/Full Print/Bordir) · Jaket Custom (Hoodie/Varsity/Windbreaker) · Baju Custom (Kaos/Polo/Kemeja) · Produksi Massal (Grosir/Corporate/Event) · Jersey Komunitas (Tim/Komunitas/Kompetisi) · Produksi Cepat (Ekspres/On-Time/Terjamin).

**Kontak:**
- Telepon/WA: **0851-8085-1428**
- Email: **renaldimaulanarahmanputra@email.com**
- Alamat: **Kp. Gununggede RT/RW 01/08, Kel. Gununggede, Kec. Kawalu, Kota Tasikmalaya**

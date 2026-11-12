# ADMIN_CMS_REPORT.md — Analisis & Rekomendasi Fitur CMS Dashboard Admin RPMX

> **STATUS FASE 1: ✅ SELESAI & TERVERIFIKASI END-TO-END (13 Nov 2026)** —
> N1 penjaga seed (tabel berisi dilewati; `--fresh` untuk timpa — teruji 2×),
> N2 newsletter menyimpan sungguhan (tabel `newsletter_subscribers` + `/api/newsletter`
> honeypot+duplikat-amank + section admin + ekspor CSV `/api/newsletter/export` guard-cookie —
> teruji: valid/duplikat/honeypot/CSV/401), **F1 Pengaturan Situs & SEO** (tabel `site_settings`
> + section admin + resolver `src/lib/site-info.ts` yang dipakai layout metadata, footer,
> kontak, tentang, CTA, JSON-LD beranda, FAB WhatsApp, form inquiry, cart drawer —
> teruji: ubah tagline → footer ikut, hapus setting → fallback ke kode),
> **F2 editor layanan** (CRUD — teruji tambah), **F3 editor galeri** (CRUD — teruji tambah).
> Catatan gotcha: tabel baru dari `db:push` dimiliki superuser → `ALTER TABLE … OWNER TO rpmx`
> diperlukan. Fase 2 (artikel) & Fase 3 tetap menunggu.
>
> **Laporan analisis** — 13 November 2026
> Metode: inventaris lengkap konten situs (8 tabel DB, komponen section, lib konstanta),
> pemeriksaan alur data (cache tag, seed), dan penyelarasan dengan PRD (backlog #2:
> "Admin CMS penuh — CRUD konten, upload foto, notifikasi inquiry").
> Tujuan: peta jalan fitur CMS yang **proporsional untuk bisnis konveksi** — bukan
> WordPress mini. Sesuai alur kerja: dokumen ini dulu disetujui, baru dieksekusi.

---

## 1. Ringkasan (TL;DR)

Admin hari ini sudah mengelola **inquiry, produk, testimoni, dan drop** (semua
terverifikasi end-to-end). Yang belum: **pengaturan situs & SEO, layanan, galeri,
artikel** — dan saya menemukan **2 masalah struktural** yang harus selesai lebih dulu:

1. 🔴 **Form newsletter tidak menyimpan email** — pengunjung mengisi, pesan
   "Terdaftar" muncul, data hilang begitu saja. Ini kebocoran aset marketing
   (daftar email = daftar calon pelanggan yang sudah menunjukkan minat).
2. 🔴 **Seed menimpa konten** — `db:seed` menghapus + mengisi ulang 7 tabel konten
   (services, gallery, testimonials, products, categories, drops, relasi). Begitu
   admin jadi sumber kebenaran, **satu kali re-seed = semua hasil edit admin musnah**.
   Wajib diberi penjaga sebelum fitur CMS lain dipakai sungguhan.

| Fase | Fitur | Nilai bisnis | Effort | Kapan |
|---|---|---|---|---|
| **1** | N1. Penjaga seed (tidak menimpa hasil admin) | Wajib — fondasi | 30 mnt | Sebelum deploy |
| **1** | N2. Newsletter benar-benar menyimpan | Aset email marketing | 1 jt | Sebelum deploy |
| **1** | F1. Pengaturan Situs + SEO (identitas, kontak, sosmed, meta) | Akurasi info & Google | 2–3 jt | Sebelum deploy |
| **1** | F2. Editor Layanan (tabel sudah ada) | Kelola penawaran jasa | 1–2 jt | Sebelum deploy |
| **1** | F3. Editor Galeri (tabel sudah ada) | Update portofolio foto | 1–2 jt | Sebelum deploy |
| **2** | F4. Artikel / Blog (+ sitemap, OG) | SEO jangka panjang | ±1 hari | Pasca deploy |
| **3** | F5–F7 (konten section, upload media, meta per halaman) | Polesan | per item | Opsional, jangan dulu |

---

## 2. Kondisi Admin Saat Ini — Terverifikasi

| Modul admin | Sumber | Status |
|---|---|---|
| Inquiry penawaran | DB `inquiries` | ✅ Lengkap (status, WA deep-link, feedback login, env-guard) |
| Produk (CRUD + flag + hapus soft) | DB `products` | ✅ TASK C — terverifikasi end-to-end |
| Testimoni & Drop | DB `testimonials`, `drops` | ✅ TASK D — terverifikasi end-to-end |
| **Layanan** (halaman /layanan + beranda) | DB `services` | ⚠️ DB-driven tapi **tanpa editor** — ubah via SQL |
| **Galeri** (halaman /galeri) | DB `gallery_items` | ⚠️ DB-driven tapi **tanpa editor** |
| Identitas situs, kontak, sosmed, SEO global | **Kode** (`site.ts`, `layout.tsx`) | ❌ Hardcoded |
| Konten section beranda (hero, why-us, proses, kategori, stores) | **Kode** (`sections/*`) | ❌ Hardcoded |
| Brand lines (halaman /tentang) | **Kode** (`brands.ts`) | ❌ Hardcoded |
| Offer popup ("Diskon 15%") | **Kode** | ❌ Hardcoded |
| **Artikel / blog** | — | ❌ Belum ada sama sekali (belum di PRD pun) |
| Newsletter | **Tidak menyimpan apa pun** | 🔴 Temuan kritis |

---

## 3. Prinsip Desain yang Saya Sarankan

1. **Konten editable, desain tetap di kode.** Tampilan RAWLINE adalah aset yang
   sudah selesai dipoles berbulan-bulan — jangan ekspose ke editor (satu klik
   salah bisa merusak identitas visual). CMS mengelola **isi** (teks, foto, data),
   bukan **tata letak**. Ini bedanya CMS dengan page-builder.
2. **Tabel yang sudah ada didahulukan.** `services` & `gallery_items` sudah
   DB-driven — tinggal tambah editor, tanpa migrasi besar.
3. **Satu tabel pengaturan** (`site_settings`, key-value) untuk identitas + SEO +
   kontak + sosmed — satu section admin, satu tempat kebenaran.
4. **Foto tetap berbasis path** (`/media/…`) untuk saat ini — file ada di dalam
   image Docker. Upload langsung butuh volume persistent + mengubah model deploy
   (F7, opsional nanti). Editor sudah bisa ganti URL foto dengan bebas.
5. **Pola teknis sudah matang** — setiap fitur baru tinggal mengikuti resep TASK
   C/D: server action auth-guarded + `updateTag(<cache tag>)` + `revalidatePath`
   + form inline URL-driven tanpa client JS + feedback `?perr/?pok`.

---

## 4. Rekomendasi Bertahap

### 🔵 Fase 1 — Sebelum Deploy (fondasi, semua effort kecil)

**N1. Penjaga seed** *(±30 menit)*
Ubah `db:seed`: tabel konten hanya diisi bila **kosong**; penimpaan paksa lewat
flag eksplisit (`npm run db:seed -- --fresh`). Tanpa ini, satu kebiasaan lama
("sesuatu aneh → jalankan seed") menghapus kerja admin.

**N2. Newsletter menyimpan sungguhan** *(±1 jam)*
Tabel `newsletter_subscribers` (email unik, createdAt, source) + endpoint API
+ tampil di admin (daftar + ekspor CSV sederhana). Email yang masuk = pipeline
penawaran & announcement drop.

**F1. Pengaturan Situs + SEO** *(±2–3 jam)*
Tabel `site_settings` (key-value) + section **"Pengaturan Situs"** di admin:
- Identitas: nama situs, tagline, deskripsi (meta description beranda), keywords
- Kontak: telepon/WhatsApp, email, alamat (terpakai di footer, kontak, schema)
- Sosmed: link X/Facebook/Instagram/TikTok (mengganti placeholder generik)
- OG image: gambar saat link dibagikan (WA/IG/FB)
Semua `generateMetadata` & komponen membaca settings (fallback ke nilai kode bila
kosong → tidak ada risiko regression). Ini sekaligus menjawab permintaan "SEO di
admin" sekaligus "pengaturan tampilan" yang proporsional.

**F2. Editor Layanan** *(±1–2 jam)*
CRUD `services` (title, deskripsi, icon/urutan, aktif) — mengelola penawaran jasa
di /layanan + beranda tanpa SQL.

**F3. Editor Galeri** *(±1–2 jam)*
CRUD `gallery_items` (imageUrl, label kategori, urutan, aktif) — update portofolio
foto hasil produksi terbaru, hal paling menjual untuk konveksi.

### 🟢 Fase 2 — Pasca Deploy (pertumbuhan)

**F4. Artikel / Blog** *(±1 hari)*
Tabel `articles` (slug, title, excerpt, content, coverImage, publishedAt, status
draft/published) + halaman `/artikel` & `/artikel/[slug]` + admin CRUD + otomatis
masuk sitemap + meta OG per artikel. Nilai: SEO jangka panjang (studi kasus drop,
tips memilih bahan jersey, behind-the-scene workshop) — konten rutin adalah satu
dari sedikit cara organis konveksi menang pencarian lokal. Jangan dibangun sebelum
situs live & ada 2–3 ide artikel nyata.

### ⚪ Fase 3 — Opsional (kerjakan hanya jika benar-benar terasa perlu)

| # | Fitur | Catatan |
|---|---|---|
| F5 | Editor konten section beranda (hero tagline, offer popup) | Jarang berubah; kode cukup |
| F6 | Upload media (volume Docker) | Baru relevan setelah deploy; path-based sudah cukup |
| F7 | Meta override per halaman statis | Nice to have |
| F8 | Notifikasi inquiry baru (email/WA) | Sudah di rekomendasi ADMIN_AUDIT_REPORT |
| F9 | Editor brand lines /tentang | Konten stabil |

---

## 5. Yang Saya TIDAK Rekomendasikan (dan alasannya)

| Fitur | Alasan tidak |
|---|---|
| Page builder / editor tema visual | Merusak konsistensi RAWLINE; kompleksitas besar; desain bukan pekerjaan admin |
| Checkout/e-commerce penuh | Alur bisnis RPMX = penawaran via WhatsApp (PRD); checkout online justru melawan model |
| Multi-user & role management | Satu admin; kompleksitas auth tidak proporsional (prinsip ADMIN_AUDIT_REPORT) |
| Komentar blog | Moderasi = beban; cukup CTA share/WA di artikel |

---

## 6. Estimasi Total & Urutan

- **Fase 1 lengkap: ±1 hari kerja** (N1+N2+F1+F2+F3) — membuat admin "lengkap
  sebagai CMS konveksi" dan situs siap dipublikasikan dengan info yang benar.
- **Fase 2: ±1 hari** — jalankan setelah live, saat ada 2–3 artikel nyata.
- Semua mengikuti pola TASK C/D yang sudah teruji (auth-guard, updateTag,
  validasi, feedback) — risiko rendah, konsisten.

## 7. Keputusan yang Dibutuhkan

1. Setujui **Fase 1 penuh** atau pilih item (N1+N2 saya anggap wajib)?
2. **Konten awal** untuk Pengaturan Situs: sosmed mana yang aktif (IG? TikTok?),
   OG image pakai logo atau foto produk?
3. Artikel: nama rutenya `/artikel` atau `/blog`?

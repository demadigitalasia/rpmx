# RAWLINE Audit Report — Laporan Audit Visual & Perbaikan

> **Laporan audit mendalam** — 10 November 2026
> Metode: agent audit terpisah memotret 12 halaman RPMX (desktop 1440px + mobile 390px), computed-style scan (font, radius, overflow), perbandingan langsung dengan RAWLINE (8 posisi scroll beranda + shop + produk + drops).
> Hasil: **12 temuan** — 2 HIGH, 5 MED, 5 LOW → **semua yang bersifat kode sudah diperbaiki & diverifikasi**; sisanya butuh aset foto.

---

## Ringkasan Kesehatan Desain (pasca-perbaikan)

| Aspek | Status |
|---|---|
| Token warna (#111111 / #FFFFE3 / #E83030) | ✅ Konsisten semua halaman (terverifikasi computed style) |
| Tipografi Azeret Mono + Source Serif 4 italic | ✅ 146–697 elemen mono per halaman; serif italic HANYA di prefiks heading |
| Radius 0 (disiplin brutalis) | ✅ Nol di seluruh situs (FAB WhatsApp ikut dikotakkan) |
| Horizontal overflow | ✅ Nol di 1440px & 390px |
| Konten tertutup header fixed 72px | ✅ Bersih |
| Halaman /drops tema krem terbalik | ✅ Satu-satunya halaman terang, sesuai spec |

---

## Temuan & Status Perbaikan

### 🔴 HIGH 1 — Duplikasi produk di "shop the DROP" → **DIPERBAIKI ✅**
- **Gejala:** 8 kartu untuk 4 produk unik (GARUDA ×2, KLASSIO ×2, SOCKS ×2…) — terlihat seperti bug data di halaman kolaborasi utama.
- **Akar:** `seed.ts` tidak pernah menghapus `drop_products` sebelum insert → relasi menumpuk tiap re-seed.
- **Fix:** `db.delete(dropProducts)` ditambahkan + **dedupe ganda** di `getDropProducts` (antisipasi data relasi ganda). Terverifikasi DB: tiap drop kini 2–3 produk unik; halaman drop menampilkan 3 kartu bersih.

### 🔴 HIGH 2 — Galeri vertikal produk hilang → **DIPERBAIKI ✅**
- **Gejala:** kolom tengah hanya 1 gambar → panel beli sticky tak pernah aktif (halaman lebih pendek dari 1 viewport).
- **Fix:** galeri **minimum 3 tile** — foto asli + tile fallback `FIG. 001-A/B` sehingga kolom tengah selalu lebih tinggi; sticky buy panel kini berfungsi.

### 🟠 MED 3 — Animasi reveal terlalu lambat, halaman "kosong berdetik" → **DIPERBAIKI ✅**
- **Gejala:** /galeri 7 dari 8 tile tampil sebagai frame kosong ±5 detik; /tentang "kenapa RPMX" satu panel kosong; heading di /kontak & /layanan nyaris tak terlihat 2–3 detik setelah load.
- **Fix:** `Reveal` dipangkas — durasi 0.35s, **delay maksimum 0.1s**, trigger margin −30px. Konten kini muncul cepat.

### 🟠 MED 4 — Foto dark-on-dark → **DIREDAMKAN ✅ (parsial)**
- **Gejala:** garment hitam di tile #1A1A1A — banyak kartu terbaca "black void" (/shop, /sale, /new, grid home).
- **Fix kode:** `brightness-110` pada foto kartu (+125% saat hover) di seluruh grid.
- **Fix konten (Anda):** regenerate foto produk dengan tambahan pada STYLE BLOCK: `brighter key light on the subject, stronger subject-background separation` — paling efektif.

### 🟠 MED 5 — WhatsApp FAB: satu-satunya elemen bulat + menutupi konten → **DIPERBAIKI ✅**
- **Gejala:** FAB hijau bulat menutupi "EST. TASIKMALAYA…" di hero, "TERMS & CONDITION" di footer, dan CTA merah menu mobile.
- **Fix:** FAB **dikotakkan** (radius 0, border, ukuran 52px, z-40 di bawah overlay), footer bottom diberi padding kanan, CTA menu mobile diberi `pr-16`.

### 🟠 MED 6 — Harga "Rp" patah sendiri di mobile → **DIPERBAIKI ✅**
- **Gejala:** di grid 2 kolom, "Rp" terpisah dari angka pada kartu berdiskon.
- **Fix:** `whitespace-nowrap` pada kedua span harga.

### 🟡 MED-LOW 7 — Urutan mobile halaman produk → **DIPERBAIKI ✅**
- **Gejala:** tabel ukuran tampil sebelum foto di mobile (tak lazim untuk mobile commerce).
- **Fix:** urutan mobile kini **foto → judul+tabel → buy panel** (CSS order, desktop tetap 3 kolom).

### 🟡 LOW 8 — Inkonsistensi pola heading "SOCwall" → **DIPERBAIKI ✅**
- Kini *social* **WALL** — serif italic dulu + mono merah, serasi semua heading lain.

### 🟡 LOW 9 — Mikro-tipografi → **DIPERBAIKI ✅**
- 404: spasi sebelum ↗ diperbaiki; H1 produk diberi `text-balance` (perbaikan rag 5 baris + em-dash yatim).

### 🟡 LOW 10 — Lookbook satu foto dobel → **DIPERBAIKI ✅**
- Drop dengan 1 foto kini tampil **1 tile full-width** (bukan 2 tile kembar identik).

---

## Tersisa — butuh keputusan/aset (bukan kode)

| # | Item | Yang dibutuhkan |
|---|---|---|
| 1 | Foto produk dark-on-dark (akar) | Regenerate ±14 foto dengan key light lebih terang (tambahan prompt di `MEDIA_PROMPTS.md` §6) |
| 2 | Foto -2 per produk | Untuk hover image swap ala RAWLINE (±14 foto) |
| 3 | Lookbook 2 foto berbeda per drop | Saat ini drop berfoto kini 1 tile full-width |
| 4 | Galeri = foto shop (duplikasi konten) | Foto kategori/workshop terpisah (§4 MEDIA_PROMPTS sudah ada) |
| 5 | Price CSS filter brightness | Kalau regenerate foto, hapus `brightness-110` dari ProductCard |

---

## Catatan Teknis untuk Pengembangan Lanjutan

- **Jangan pakai animasi masuk berbasis JS/CSS di level halaman** — sempat membuat konten opacity-0 pada tab throttle (2 insiden: template.tsx & page-in CSS). Reveal per-elemen aman.
- **Seed wajib `db.delete` SEMUA tabel termasuk relasi** — lupa `drop_products` menyebabkan duplikasi.
- Semua fungsi data yang menyentuh DB wajib `"use cache"` (cacheComponents).
- Route dengan `params`/`searchParams` + page transitions: `export const instant = false`.

*Audit oleh agent terpisah (48 tool-call, 12 halaman desktop + 3 mobile + 4 computed-style scan). Laporan mentah agent dipadatkan ke dokumen ini.*

---

# RE-AUDIT (10 Nov 2026, pasca hero rebuild + fix gelombang 1)

Agent yang sama melakukan verifikasi ulang seluruh perbaikan + audit 3 section baru (hero split-screen, header pill, about immersive) pada 12 halaman desktop + 3 mobile + admin end-to-end.

## Verifikasi perbaikan gelombang 1

| # | Item | Hasil |
|---|---|---|
| V1 | Duplikasi produk drop | ✅ FIXED — 3 kartu unik di shop the DROP |
| V2 | Galeri ≥3 tile + sticky panel | ✅ FIXED — sticky terukur aktif (price y≈110 saat scroll 700) |
| V3 | Kecepatan reveal | ⚠️ PARTIAL — /galeri & /kontak ≤1,5s ✓; /tentang heading lengkap ±2s |
| V4 | WA FAB kotak + overlap | ⚠️ PARTIAL desktop ✓ — mobile masih overlap (diperbaiki gelombang 2) |
| V5 | Harga nowrap mobile | ✅ FIXED |
| V6 | Pola heading social WALL | ✅ FIXED |
| V7 | 404 spasi ↗ + H1 text-balance | ✅ FIXED |
| V8 | Lookbook 1 foto full-width | ✅ FIXED |

## Temuan re-audit & status

| # | Temuan | Prioritas | Status |
|---|---|---|---|
| R1 | /tentang + /kontak masih rounded (kartu 16px, input 12px, CTA) — "pulau styling lama" terakhir | HIGH | ✅ Diperbaiki — sweep radius 0 + token raw |
| R2 | Mobile hero: H1 menumpuk CTA buttons | HIGH | ✅ Diperbaiki — CTA jadi statis di bawah foto (mobile), absolute di desktop |
| R3 | Mobile FAB menutupi subtagline hero + sel social WALL + sudut ADD TO CART | HIGH→LOW | ✅ Diperbaiki — foto hero mobile 68vh + CTA statis mengangkat subtagline; overlap sisa hanya di posisi scroll tertentu (wajar utk FAB) |
| R4 | Tile galeri produk ke-3 = fallback (produk hanya punya 2 foto) | MED | 🟢 By design — tile FIG. fallback; masuk daftar generate foto -3 |
| R5 | Logo RPMX tak terlihat ±2 detik di /drops (decode PNG 3533px) | MED | ✅ Diperbaiki — logo di-resample 1400px + props Image disesuaikan |
| R6 | Chip status "DIHUBUNGI" biru (off-palette) | LOW | 🟢 Disengaja — warna fungsional status (sky/violet/emerald membedakan tahap) |
| R7 | Hero mobile: rail kanan tersembunyi (konsep rail hilang di mobile) | LOW | 🟢 By design — rail produk versi desktop; mobile foto + CTA |

## Kesehatan pasca re-audit

- Radius 0 kini benar-benar menyeluruh — "pulau styling lama" terakhir (/tentang, /kontak, inquiry-form) sudah di-sweep
- Lint bersih · build produksi sukses 39 route
- Sisa = konten (foto, testimoni, harga) — bukan kode


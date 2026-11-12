# Analisis Transisi Hero RAWLINE vs RPMX — Temuan & Rencana Perbaikan

> **Laporan analisis** — 10 November 2026
> Metode: pengukuran objektif di rawline.framer.website — screenshot animasi masuk
> (t=250ms / 750ms / 1,75s), pengukuran posisi elemen saat scroll 0/400/900
> (getBoundingClientRect + computed transform), perbandingan dengan implementasi RPMX.

---

## 1. TEMUAN KRITIS — Hero RPMX dibangun dari section yang salah

Selama ini beranda RPMX memakai **footage underpass sebagai hero**. Setelah pengukuran
ulang terbukti bahwa footage itu adalah media **section ABOUT** RAWLINE. Struktur
asli RAWLINE berbeda total:

### Struktur asli RAWLINE (terverifikasi screenshot + pengukuran)

```
┌──────────────────────────────────────┬──────────────┐
│  [FOTO 70% — 3 model, latar marun]   │  RAIL 30%    │
│                                      │  (hitam)     │
│  ┌──────── floating pill header ───┐ │  ▣ produk 1  │
│  │ X  SHOP▾ DROPS SALE NEW 🔍 ♡ 🛒 │ │  ▣ produk 2  │
│  └─────────────────────────────────┘ │  ▣ produk 3  │
│                                      │  ▣ produk 4  │
│  DRESS THE UNCONVENTIONAL            │              │
│  WEAR THE                            │  █ SHOP NOW █│
│  HYPE "RAW"  ← H1 kiri-bawah         │              │
└──────────────────────────────────────┴──────────────┘
         ↓ scroll ↓
┌──────────────────────────────────────────────────────┐
│  ABOUT = MEDIA FULL-SCREEN (video underpass)         │
│                                                      │
│        ABOUT US ← heading komposit tumpang tindih    │
│   manifesto uppercase 3 baris di tengah media        │
│        [ VIEW MORE ] ← tombol outline                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Detail yang terukur

| Aspek | RAWLINE (terukur) | RPMX sekarang | Status |
|---|---|---|---|
| **Hero layout** | Split 70/30: foto + rail produk vertikal + band SHOP NOW | Full-bleed 1 foto + manifesto tengah | ❌ Beda struktur |
| **Header** | **Pill melayang di tengah** (kotak gelap, logo X merah, ikon crown di DROPS), tetap fixed saat scroll (top 43px konstan) | Bar penuh lebar, flat | ❌ Beda |
| **Posisi H1** | Kiri-bawah, 2 baris, menempel tepi kiri | Tengah-bawah (di bawah media) | ❌ Beda |
| **Rail produk** | 30% kanan: thumbnail vertikal (baju/kaos kaki/jeans) + band merah SHOP NOW | Tidak ada (quick-link 3 baris teks di bawah) | ❌ Belum ada |
| **Section About** | **Media full-screen (video underpass)** + heading komposit overlap `ABO`*us*`UT` + manifesto + VIEW MORE **menumpuk di atas media**; media fixed saat teks scroll | Foto workshop kecil + VIEW MORE overlay di tengah + manifesto di bawah media | ❌ Beda total |
| **Animasi masuk** | Layar hitam ±1,5 detik (preloader) lalu konten muncul | Langsung tampil | 🟡 Beda (preloader opsional) |
| **Parallax** | Tidak ada parallax pada foto hero (top = −scrollY, transform "none") — transisi murni scroll biasa | Sama (tanpa parallax) | ✅ Setara |
| **Header saat scroll** | Fixed konstan (tidak sembunyi) | Sama | ✅ Setara |

### Transisi antar-section yang teramati

1. **Load pertama:** hitam penuh (preloader) ±1,5s → konten muncul (fade).
2. **Hero → About:** scroll biasa TANPA parallax — tapi section About memakai
   **media tinggi ~1.400px dengan teks menumpuk di atasnya** sehingga terasa
   seperti transisi "teks berjalan di atas layar bioskop".
3. **About → latest DROPS:** potongan tajam ke tema hitam (kontras section).

---

## 2. REKOMENDASI — Rencana Rebuild Hero + About

### Fase A — Hero split-screen (prioritas tertinggi)

1. **Layout baru**: grid 2 kolom `70% | 30%`, tinggi `100vh`:
   - Kiri: foto model (latar marun) full-height, H1 kiri-bawah 2 baris,
     label `DRESS THE UNCONVENTIONAL` di atas H1
   - Kanan: panel hitam berisi **rail 4 thumbnail produk** (foto + harga +
     panah) vertikal + band merah `SHOP NOW ↗` di bawah rail
2. **Header pill melayang**: kotak gelap rounded-2xl (pengecualian radius —
   elemen UI mengambang), posisi `top-4 left-1/2 -translate-x-1/2`, isi: logo
   X-merah kecil + nav + ikon; kembali flat full-width saat scroll > 100px
   (opsional) atau tetap pill konstan.
3. **Garis aksen merah**: border-right 2px merah pada kolom kiri (bingkai
   khas RAWLINE).

### Fase B — About jadi media full-screen menumpuk

1. Section tinggi `100vh` berisi foto underpass (`hero.jpg` lama — pas
   sempurna untuk ini!) sebagai **sticky background**;
   konten (heading komposit `ABO`*us*`UT` + manifesto + VIEW MORE)
   **scroll menumpuk di atas media** (pola CSS sticky sederhana).
2. Foto workshop (`about.jpg`) pindah ke halaman /tentang.

### Fase C — Media yang dibutuhkan

- **1 foto baru**: "3 model berdiri frontal menghadap kamera, latar dinding
  merah marun, jersey hitam-putih-merah" — prompt lengkap akan ditambahkan
  ke MEDIA_PROMPTS.md §1 (hero lama tetap dipakai untuk About).
- Video opsional: footage underpass (rawline memakai video; foto + grain
  sudah memberi 80% rasa yang sama).

### Fase D — Preloader (opsional)

- Overlay hitam dengan counter/logo yang fade ±1,2s saat kunjungan pertama
  (localStorage), lalu konten fade-in — meniruEntrance RAWLINE.

---

## 3. Estimasi dampak

Perbaikan ini menutup **gap terbesar yang tersisa** — setelah Fase A–B,
kesan pertama beranda RPMX akan 1:1 dengan bahasa visual RAWLINE
(split-screen + pill header + about bioskop). Estimasi: 1 sesi kerja
(±150 baris perubahan di 4 file + 1 foto baru dari Anda).

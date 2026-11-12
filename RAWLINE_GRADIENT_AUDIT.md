# Audit Gradien Media — Konsistensi "Hero ke Hero" RPMX vs Referensi RAWLINE

> **Status: Tahap A + B telah diimplementasikan** (9 November 2026) — utility `media-blend-bottom` / `media-scrim` / `media-fallback` ditambahkan di `globals.css`, semua overlay diserapkan, `galleryCategoryGradients` (gradien warna-warni di luar sistem) dihapus, lint bersih, diverifikasi visual di dev server. Tahap C menunggu persetujuan terpisah.

> **Audit ulang visual + kode** — 9 November 2026
> Metode: screenshot langsung beranda RPMX (dev server, 1440×900) dibandingkan dengan preview RAWLINE (rawline.framer.website, 1440×900), ditelusuri ke resep CSS di kode.
> Fokus: treatment overlay/gradien pada semua section bermédia full-bleed / editorial ("hero ke hero") — Hero, About, Latest Drops, Kategori, plus scrim sekunder (galeri, kartu produk, fallback).
> Skala: 🔴 = terlihat langsung & melanggar konsistensi · 🟡 = sedang · 🟢 = polesan

---

## 1. Kesimpulan Singkat

Perasaan Anda **benar dan bisa dibuktikan di kode**: saat ini ada **4 resep gradien berbeda** yang dipakai bergantian pada section-section media, dengan **dua warna hitam berbeda** (`#111` vs `#000`). Referensi RAWLINE memakai **satu bahasa**: foto tetap vivid, media tersusun sebagai "slab" bertumpuk, teks duduk langsung di atas foto dengan scrim lokal minimal. RPMX justru meredupkan tiap foto dengan cara yang berbeda-beda — inilah kenapa transisi antar "hero" terasa tidak seragam dan tidak sama dengan referensi.

---

## 2. Bukti Kode — 4 Resep Gradien yang Berbeda

| # | Section | Lokasi | Resep overlay | Arah | Warna dasar | Efek di layar |
|---|---|---|---|---|---|---|
| 1 | **Hero** | `src/components/sections/hero.tsx:26` | `bg-gradient-to-b from-raw/45 via-raw/15 to-raw` | atas → bawah | `#111` (raw) | Foto diredup 45% di atas, dibersihkan 15% di tengah, lalu **melarut sempurna ke background halaman** di bawah |
| 2 | **About** | `src/components/sections/home.tsx:23` | `bg-raw/35` (flat, tanpa gradien) | — | `#111` | Seluruh foto ter-dim rata 35%, **tepi atas & bawah keras** (tidak blend) |
| 3 | **Latest Drops — kartu besar** | `src/components/sections/home.tsx:83` | `bg-gradient-to-t from-black/80 via-transparent to-black/30` | bawah → atas | **`#000` murni** | Void hitam pekat di bawah kartu + wash tipis di atas (hanya kartu besar) |
| 4 | **Latest Drops — kartu setengah** | `src/components/sections/home.tsx:119` | `bg-gradient-to-t from-black/80 via-transparent to-transparent` | bawah → atas | **`#000` murni** | Void hitam bawah, **tanpa** wash atas → **beda resep dengan kakaknya sendiri di section yang sama** |
| 5 | **Kategori (4 tile)** | `src/components/sections/home.tsx:219` | `bg-gradient-to-t from-black/80 via-transparent to-transparent` | bawah → atas | **`#000` murni** | Sama dengan #4 |
| 6 | Caption galeri | `src/components/gallery-card.tsx:29` | `from-black/90 via-black/40 to-transparent` | bawah → atas | **`#000`** | Resep keenam, opacity beda lagi (90%) |
| 7 | Fallback tile kosong (produk, galeri, drop, detail shop) | `product-card.tsx:47`, `gallery-card.tsx:21`, `home.tsx:81,117`, `drops/[slug]/page.tsx:89`, `shop/[slug]/page.tsx:143` | `bg-gradient-to-br from-raw-surface to-black` | diagonal | `#1A1A1A → #000` | Sudut hitam fallback lebih pekat daripada bg halaman `#111` — seam halus tapi terlihat |

### Ketidakkonsistenan struktural yang turut terasa

- **Lebar media tidak seragam**: Hero full-bleed `w-full` (100vw, `hero.tsx:16`), About inset `max-w-[1400px]` (di viewport 1440 menyisakan gutter ±20px, `home.tsx:15`), kartu Drops/Kategori inset dalam container + border 1px. Tiga "radius penampungan" berbeda untuk jenis media yang sama.
- **Hero full-bleed tapi section setelahnya tidak** → ritme "slab bersambung" ala RAWLINE terputus di titik pertama transisi.

---

## 3. Bukti Visual — RPMX vs RAWLINE

### RPMX (screenshot dev server)

1. **Hero**: foto underpass terbaca bagus, tapi gradien `to-raw` membuat ⅓ bawah foto *melebur ke halaman* — H1 tampak "melayang di kabut hitam", bukan di atas foto.
2. **About**: foto workshop ter-dim rata (flat 35%), tepi bawah foto berhenti mendadak — kontras gaya dengan hero yang melarut. Dua section berurutan, dua bahasa gradien.
3. **Latest Drops**: bawah ketiga kartu "tenggelam" ke hitam `#000` pekat. Kartu besar ter-dim di atas (wash 30%), dua kartu setengah tidak — terlihat sebagai perbedaan brightness antar kartu sejajar.
4. **Kategori**: pola sama dengan kartu setengah Drops — void hitam bawah.

### RAWLINE (screenshot preview, sama-sama 1440px)

1. **Hero**: foto model latar merah **vivid tanpa overlay gelap**; H1 `WEAR THE HYPE "RAW"` duduk langsung di atas foto di bagian bawah.
2. **Hero → About**: media underpass **menempel langsung** di bawah hero (tanpa celah/border) — dua foto penuh bertumpuk membentuk alur sinematik satu tarikan napas. Teks `ABOUT` merah duduk langsung di atas media.
3. **Latest Drops**: kartu drop besar = foto penuh vivid, teks overlay semi-transparan di tengah/atas foto — **tidak ada gradien hitam pekat di bawah foto**. Gap antar kartu tipis (±8px), tanpa border.
4. **Sale / grid produk**: foto produk bersih tone-on-tone `#161616`, tanpa scrim.

> Catatan: hero RAWLINE versi live kini ber-layout split (media kiri + rail produk kanan + band SHOP NOW) — berbeda dari deskripsi §3.1 di spec yang menggambarkan underpass (yang kini jadi media About). Untuk audit gradien ini yang dipakai sebagai acuan adalah **bahasa overlay & ritme antar media** RAWLINE, bukan layout hero spesifiknya.

---

## 4. Penjelasan — Mengapa Terasa "Belum Sama"

Tiga akar masalah, urut dari paling terasa:

### 🔴 Akar 1 — Dua hitam berbeda di halaman yang sama
Halaman berlatar `#111`. Hero melarut ke `#111` (raw), kartu Drops/Kategori/Galeri menusuk ke `#000` murni. Mata menyebut keduanya "hitam" tapi melihat perbedaannya: `#000` terasa lebih "dalam & dingin", `#111` lebih hangat menyatu. Hasilnya: hero terasa *menyatu* dengan halaman, kartu-kartu terasa *lubang terpisah* — transisi antar section media jadi tidak punya aturan yang bisa diantisipasi mata.

### 🔴 Akar 2 — Empat resep untuk satu fungsi yang sama
Scrim untuk keterbacaan teks di atas foto adalah SATU fungsi, tapi dieksekusi 4 cara: blend keluar-bg (hero), flat wash (About), scrim bawah + wash atas (Drops besar), scrim bawah saja (Drops kecil, Kategori), scrim bawah 90% (Galeri). Tidak ada satu pun pasangan section berurutan yang memakai resep sama — itu yang membuat "gradasi antara hero ke hero lainnya" terasa tidak konsisten.

### 🟡 Akar 3 — Bahasa "framed tiles" vs bahasa "media slabs" referensi
RAWLINE memperlakukan foto sebagai slab arsitektural: full-bleed, bertumpuk/berdempet, foto vivid, teks langsung di atasnya. RPMX memperlakukan foto sebagai objek berbingkai: di-inset, diberi border, lalu diredup dengan gradien. Selama kerangka ini campur (hero full-bleed melarut + About inset keras + kartu inset ber-border ber-scrim), gradien sekecil apa pun akan tetap terasa "beda galak".

---

## 5. Rekomendasi

### Tahap A — Quick win (murni konsistensi, tanpa keputusan desain baru) ✅ aman langsung

1. **Ganti semua scrim `black/*` → `raw/*`** di: `home.tsx:83,119,219`, `gallery-card.tsx:29`. Semua gradasi hitam lalu menyatu dengan bg `#111` — menghilangkan "hitam dua rasa" dalam satu perubahan kecil.
2. **Samakan resep kartu serumpun**: kartu besar & kartu setengah Drops + 4 tile Kategori pakai scrim bawah yang sama: `bg-gradient-to-t from-raw/85 via-raw/30 to-transparent`. Hapus `to-black/30` di kartu besar supaya ketiga kartu Drops sejajar brightness-nya.
3. **Fallback tile** `from-raw-surface to-black` → `from-raw-surface to-raw` (5 lokasi di tabel §2 baris 7) supaya sudut fallback tidak lebih pekat dari halaman.
4. (Opsional kecil) Naikkan scrim caption galeri dari `black/90` → `raw/85` — sekalian menyatu.

### Tahap B — Penyelarasan About dengan pola hero 🟡

5. Ganti flat wash `bg-raw/35` di `home.tsx:23` dengan scrim arah bawah yang sama seperti kartu (atau blend ringan ke `#111` di tepi bawah) supaya: atas foto tetap terang (workshop terbaca), bawah melembut ke halaman, dan bahasa gradiennya sama dengan sisanya. Flat wash penuh adalah satu-satunya resep yang tersisa "yatim" setelah Tahap A.

### Tahap C — Keputusan desain: mengikuti bahasa "slab" RAWLINE 🔴-butuh-persetujuan

6. **Opsional, dampak besar**: buat media About full-bleed (keluar dari `max-w-[1400px]`), pertimbangkan mendempetkan hero→About (hapus/mperkecil jeda) seperti referensi, dan longgarkan scrim agar foto lebih vivid (teks tetap terbaca karena scrim lokal di belakang teks saja). Ini mengubah karakter halaman dari "katalog berbingkai" menuju "slab editorial" RAWLINE — sebaiknya lewat dokumen spec kecil yang disetujui dulu (doc-first), karena menyentuh ritme & spacing keseluruhan.

### Usulan token (Tahap A+B, ±20 baris perubahan)

```css
/* globals.css — satu bahasa scrim, semua berbasis #111 */
@utility media-scrim {
  /* teks di atas foto: gelap di bawah, memudar ke atas */
  background-image: linear-gradient(
    to top,
    rgb(17 17 17 / 0.85) 0%,
    rgb(17 17 17 / 0.35) 40%,
    transparent 72%
  );
}
@utility media-blend-bottom {
  /* khusus hero: foto melebur ke halaman */
  background-image: linear-gradient(
    to bottom,
    rgb(17 17 17 / 0.45),
    rgb(17 17 17 / 0.15) 45%,
    #111111 100%
  );
}
@utility media-fallback {
  background-image: linear-gradient(to bottom right, #1a1a1a, #111111);
}
```

Kemudian semua section media memakai: hero → `media-blend-bottom`; About & semua kartu editorial/label → `media-scrim`; tile kosong → `media-fallback`. Satu aturan, satu warna, mudah diaudit.

---

## 6. Catatan yang Sudah Benar (tidak perlu disentuh)

- Arah gradien hero (atas→bawah, melarut ke bg) sudah sesuai spesifikasi §3.1.1 dan terlihat bagus — ini justru acuan bahasanya.
- Overlay hero `via-raw/15` menjaga manifesto tetap terbaca tanpa mematikan foto — dipertahankan.
- Tema krem halaman `/drops` tidak menyentuh sistem gradien ini — aman.
- Border tipis pada kartu kategori/drops adalah pilihan selera yang sudah dicatat di gap analysis §C — Tahap A tidak mengubahnya; pembongkaran border masuk Tahap C.

*Dokumen audit internal RPMX. Referensi visual: RAWLINE preview (framer) + RAWLINE_DESIGN_SPEC.md §1.3/§3.1 + RAWLINE_GAP_ANALYSIS.md.*

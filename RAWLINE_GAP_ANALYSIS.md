# RAWLINE Gap Analysis — Audit Kesesuaian Implementasi RPMX

> **Audit visual** — 9 November 2026
> Metode: screenshot beranda RAWLINE pada 8 kedalaman scroll (0 → 10.600px) dibandingkan langsung dengan implementasi RPMX saat ini (1440px).
> Skala prioritas: 🔴 = signifikan & terlihat langsung di beranda · 🟡 = sedang · 🟢 = polesan
> Catatan umum: sebagian gap terbesar butuh **foto/video asli RPMX** — struktur bisa dibangun sekarang, foto tinggal disisipkan.

---

## A. Gap Prioritas Tinggi (beranda)

### 🔴 1. Hero — belum ada media asli
- **RAWLINE:** video/foto full-bleed orang berjalan (media hidup), manifesto di tengah, H1 di bawah media.
- **RPMX sekarang:** gradien gelap + grid — ruang media terasa kosong.
- **Fix:** slot media (video loop/mp4 atau foto full-bleed) + overlay gradient. Struktur teks sudah benar.

### 🔴 2. Section About — beda format total
- **RAWLINE:** media full-bleed (foto tim berjalan) dengan **tombol outline `VIEW MORE` menumpuk di atas foto**, lalu manifesto.
- **RPMX sekarang:** hanya teks + link kecil, tanpa media sama sekali.
- **Fix:** ubah AboutStrip → media full-width + overlay `VIEW MORE` + manifesto.

### 🔴 3. Latest Drops — skala kartu salah
- **RAWLINE:** kartu drop = **editorial BESAR**: 1 media full-width + 2 media setengah-lebar (susunan asimetris), foto dominan dengan judul & tag `⚠ ATTENTION LIMITED STOCK` di atas foto.
- **RPMX sekarang:** 3 kartu kecil rasio 4:3 sejajar — terasa seperti grid produk biasa.
- **Fix:** layout asimetris besar (full + 2 half), overlay judul/tag di atas media.

### 🔴 4. Section CATEGORIES — baru "foto", belum "kategori"
- **RAWLINE:** heading merah **CATEGORIES** + `SHOP ALL ↗` + masonry 2 kolom foto per kategori (sepatu, hoodie, kaos, dst — masing-masing mewakili kategori toko).
- **RPMX sekarang:** MasonryPhotos tanpa heading, tanpa label kategori, tidak bisa diklik.
- **Fix:** tambah heading komposit *kategori* **SEMUA** + action `SHOP ALL ↗`; tiap tile = kategori produk (label + link `/shop?category=slug`).

### 🔴 5. Why RPMX — skala ghost title kurang
- **RAWLINE:** judul ghost (`FAST SHIPPING`) sangat besar (±64px, 2 baris), warna abu gelap; deskripsi mono di ATAS judul; stagger diagonal dalam (tiap kolom turun bertingkat jauh).
- **RPMX sekarang:** judul 3xl abu 35%, stagger hanya `mt-14`.
- **Fix:** perbesar ghost title (text-6xl, 2 baris uppercase), naikkan offset stagger bertahap (mt-0/24/48/72).

### 🔴 6. Social Wall — varian kartu & jumlah item
- **RAWLINE:** grid 4 kolom × 2 baris (8 sel); kartu testimonial ada **2 varian**: solid merah DAN **gelap ber-border merah**; foto B&W & berwarna bercampur; tinggi sel bervariasi (masonry feel).
- **RPMX sekarang:** 4 item, 2 varian (merah solid / gelap polos), semua foto grayscale.
- **Fix:** 8 sel (4 testimoni + 4 foto), tambah varian outline merah, variasi tinggi, foto tidak semua grayscale.

---

## B. Gap Prioritas Sedang (fitur template)

### 🟡 7. Smart Search — belum ada
Fitur listing RAWLINE: "smart product search by name, category, or tags". RPMX belum punya ikon/overlay search di header. Fix: tombol search di header → overlay pencarian instan (client filter atas `getProducts`).

### 🟡 8. Offer Popup — belum ada
Popup penawaran sekali-kunjungi (localStorage) — bagian fitur template. Fix: modal newsletter/promo sederhana muncul setelah delay.

### 🟡 9. Currency Selector Modal — belum ada
Popup "SELECT YOUR CURRENCY" bergaya glitch + dropdown. RPMX memakai IDR statis di footer. Fix opsional: modal serupa (IDR default, format harga tetap).

### 🟡 10. Page Transitions — belum ada
RAWLINE: "seamless page transitions" antar halaman. RPMX pindah halaman biasa. Fix: `template.tsx` + AnimatePresence fade/slide ringan.

### 🟡 11. Hover image swap di kartu produk
RAWLINE: kartu produk menampilkan foto ke-2 saat hover. RPMX hanya zoom (karena semua produk cuma punya 1 gambar placeholder). Fix: kalau `images.length ≥ 2`, crossfade ke gambar kedua saat hover.

### 🟡 12. Gift Card section — tergantikan
RAWLINE: full-bleed foto + manifesto + outline `GET NOW`. RPMX memakai band CTA merah (pengganti sadar). Keputusan: pertahankan CTA merah ATAU tambahkan section gift card asli setelahnya.

### 🟡 13. `/drops` index — baris teks vs kartu gambar
RAWLINE: drop dipajang sebagai kartu gambar besar. RPMX: baris editorial teks (masih bagus, tapi kurang "image-forward"). Fix: kartu gambar besar dengan overlay.

### 🟡 14. Grails & New Arrivals — proporsi
- Grails RAWLINE: **3 kolom** kartu lebih besar (RPMX 4 kolom).
- New Arrivals RAWLINE: tab berupa **swatch kotak kecil** (■ MEN ■ WOMEN) menyatu dengan heading + ada banner media full-width di atasnya. RPMX: tombol kotak besar, tanpa banner.

---

## C. Polesan Prioritas Rendah

- 🟢 **404 custom** bergaya RAWLINE (heading raksasa + link) — saat ini default Next.
- 🟢 Kartu produk RAWLINE **tanpa border** (flat tone-on-tone #161616 di atas #111) — RPMX memakai border `#2A2A2A` (selera; boleh dipertahankan).
- 🟢 Label teknis tambahan (`FIG.`, garis kecil) di RAWLINE lebih banyak variasi penempatan.
- 🟢 H2 section RAWLINE 70px (RPMX clamp 2–3rem) — boleh dinaikkan di layar besar.

## D. Yang Sudah Setara (tidak perlu diubah)

✅ Header fixed 72px + nav + ikon · ✅ Sistem warna & Azeret Mono + serif italic komposit · ✅ Grid produk 4 kolom + hati + badge OFF + harga strikethrough · ✅ Shop filter (gender/price/sale/new/sort) + sort by · ✅ Halaman produk 3 kolom + tabel ukuran + buy panel sticky · ✅ Cart drawer slide-over · ✅ Wishlist + halaman · ✅ Footer lengkap (newsletter merah, tombol kotak, sosial) · ✅ Marquee · ✅ Mobile menu fullscreen · ✅ Tema krem di halaman Drops.

---

## E. Urutan Perbaikan yang Disarankan

1. **AboutStrip → media + overlay VIEW MORE** (butuh 1 foto)
2. **DropsRow → kartu editorial asimetris** (butuh 3 foto drop)
3. **MasonryPhotos → section CATEGORIES** dengan label & link kategori
4. **WhyStaggered → ghost title besar + stagger dalam**
5. **SocialWall → 8 sel + varian outline merah**
6. **Search overlay di header**
7. **Offer popup + currency modal** (opsional)
8. **Page transitions** (`template.tsx`)
9. **Hover image swap + grails 3 kolom + swatch tabs**
10. **404 custom**

> Semua perbaikan struktural bisa dikerjakan tanpa menunggu foto — slot media ditandai `data-media-slot` agar mudah diganti begitu foto asli tersedia.

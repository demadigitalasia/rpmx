# RAWLINE Design Spec — Blueprint Kloning Desain untuk Website RPMX

> **Dokumen spesifikasi desain** — v1.0 · 9 November 2026
> Sumber: [RAWLINE — Framer Marketplace](https://www.framer.com/marketplace/templates/rawline/) ($99, Syed Tahoor Ali) · Preview: [rawline.framer.website](https://rawline.framer.website/)
> Tujuan: blueprint detail untuk membangun ulang seluruh pola desain RAWLINE di **website Next.js 16 RPMX** (yang sudah berjalan) — hero, halaman, section, efek, hingga polesan micro-interaction.
>
> **Catatan lisensi:** RAWLINE adalah template berbayar. Dokumen ini mendokumentasikan *struktur, pola layout, token desain, dan pola interaksi* (fakta fungsional) sebagai referensi implementasi internal — bukan salinan kode/asets template. Foto & aset RAWLINE tidak dipakai; semua konten diganti milik RPMX. Bila ingin memakai file Framer aslinya, beli lisensinya.

---

## 0. Ringkasan DNA Desain

RAWLINE = **streetwear brutalis dengan sentuhan editorial**. Tiga kata kunci:

1. **Monokrom + satu aksen** — hampir seluruh halaman hitam `#111111` dengan teks krem `#FFFFE3`; merah `#EA301F` hanya muncul untuk: aksen heading, badge diskon, harga, tombol utama, kartu quote, dan underline form.
2. **Satu keluarga font monospace untuk SEMUA** — `Azeret Mono` dipakai dari H1 96px sampai label 11px. Keseluruhan situs terasa seperti "dokumen teknis/spesifikasi produk" (uppercase, letter-spacing negatif, baris tabel ukuran).
3. **Kontras serif italic** — judul section memakai pasangan dua font: prefiks *Source Serif 4 Italic* (lowercase, krem) + kata kedua *Azeret Mono Bold Uppercase* (merah). Ini "tanda tangan" visual RAWLINE. Contoh: *latest* **DROPS**, *black friday* **SALE**, SOC*wall*, LONDON *Canary Wharf*.

Nuansa yang harus terasa di hasil akhir: **katalog teknis bertemu zine jalanan** — barcode, label "FIG.", teks manifesto uppercase, foto full-bleed, dan garis-garis tipis.

---

## 1. Design Tokens

### 1.1 Warna (diekstrak dari computed style preview)

| Token | Nilai | Pemakaian |
|---|---|---|
| `--bg` | `#111111` | Background global seluruh halaman |
| `--surface` | `#1A1A1A`–`#1D1D1D` | Kartu produk, panel filter, tabel |
| `--ink` / teks utama | `#FFFFE3` | Judul, isi, label (krem tulang, bukan putih murni) |
| `--muted` | `#787878` | Harga lama (strikethrough), teks sekunder |
| `--accent` | `#EA301F` | Merah RAWLINE: kata kedua heading, harga, ADD TO CART, badge diskon, kartu quote, underline input, teks "CONTACT US" |
| `--accent-hover` | `#C4271A` (turunan) | Hover tombol merah |
| `--light-surface` | `#FAF7E3`–`#FFFFE3` | **Halaman Drops memakai tema terbalik**: latar krem, teks hitam |
| Garis/border | `#2A2A2A` | Border tabel ukuran, pemisah tipis |

> Untuk RPMX: merah `#EA301F` hampir identik dengan merah logo RPMX `#E83030` — pertahankan `#E83030` sebagai `--accent` agar selaras logo, sisanya identik.

### 1.2 Tipografi

| Peran | Font | Spesifikasi terukur |
|---|---|---|
| **Display / semua teks** | `Azeret Mono` (Google Fonts) | H1: 96px · 700 · uppercase · `letter-spacing: -4.8px` · krem |
| H2 section | `Azeret Mono` | 70.4px · 700 · uppercase · `-3.52px` · krem ATAU merah |
| Judul section komposit | `Source Serif 4` italic + `Azeret Mono` | 48px · 700 · `-2.4px` — prefiks serif *italic lowercase* krem + kata kedua mono **uppercase merah** |
| Judul produk (kartu) | `Azeret Mono` | ~16–18px · 700 · uppercase · krem |
| Harga aktif | `Azeret Mono` | 22.4px · 700 · krem |
| Harga lama | `Azeret Mono` | 16px · 500 · `#787878` + `line-through` |
| Badge diskon | `Azeret Mono` | 11.2px · 500 · krem di atas chip merah |
| Body/manifesto | `Azeret Mono` | 14–16px · 400–500 · uppercase (manifesto) / sentence (deskripsi) |
| Label teknis | `Azeret Mono` | 11–12px · uppercase · `letter-spacing` lebar · sering disertai "FIG." / garis |

**Aturan main:** hampir tidak ada teks non-mono. Serif italic HANYA untuk prefiks heading & aksen nama (kota, "clothing store", "wall"). Ini yang membuat situs terasa unik — pertahankan disiplin ini.

### 1.3 Spasi, Grid, Bentuk

- Container: full-width dengan padding sisi ±24–40px; grid produk **4 kolom** (desktop) → 2 (tablet) → 2/1 (mobile), gap ±8–12px (rapat, nyaris menyatu).
- Section padding vertikal besar (±96–140px) — banyak "ruang napas" hitam.
- **Radius: 0** — semua sudut tegas (brutalis). Tidak ada shadow; pemisah memakai garis 1px & perbedaan tone `#111` vs `#1A1A1A`.
- Tombol: kotak penuh (tanpa radius). Merah = teks krem; outline = border krem 1px, hover → fill krem teks hitam.
- Ikon: garis tipis (outline) — hati (wishlist), panah ↗, slider (filter), X (tutup), +/− (stepper).

---

## 2. Elemen Global

### 2.1 Header (fixed, 72px)

- Latar `#111` (solid saat scroll; transparan di atas media hero).
- Kiri: **logo gambar** (versi dark — wordmark). RPMX → pakai `public/rpmx-logo.png`.
- Tengah/kiri-tengah: 4 link uppercase mono kecil — `SHOP` · `DROPS` · `SALE` · `NEW` — masing-masing ditemani **ikon svg kecil** (tanda ↗/•). Hover: warna berubah krem→merah.
- Kanan: **ikon wishlist (hati)** → `/wishlist`; ikon keranjang (muncul via Framer Commerce — di kloning: ikon tas dengan counter) → membuka **cart drawer**; ikon negara/mata uang (buka popup currency).
- Mobile: hamburger → overlay fullscreen hitam, link besar uppercase mono bertumpuk + ikon sosial di bawah.

### 2.2 Heading Komposit (signature) — komponen `SectionHeading`

Struktur: `<span class="serif-italic">prefiks</span> <span class="mono-red">KATA</span>` — 48px, kadang **tumpang tindih** (kata serif italic overlap di atas kata mono, lihat "SOC*wall*"). Dipakai di: latest DROPS · black friday SALE · SOC*wall* · *the story* we wear · LONDON *Canary Wharf*.

### 2.3 Kartu Produk (`ProductCard`)

- Tile `#1A1A1A`, tanpa radius, rasio gambar ±3:4, objek `cover`.
- Overlay kiri-atas: **ikon hati** (wishlist toggle — outline → fill merah saat aktif).
- Overlay kanan-atas (kondisional): **chip merah "24% OFF"** (mono 11px krem).
- Hover (desktop): gambar **zoom lambat/scale** + (di beberapa kartu) swap ke gambar kedua; kursor pointer; judul tetap.
- Bawah gambar: judul uppercase mono bold (2 baris maks) + baris harga: harga bold krem + harga lama abu strikethrough (jika diskon).
- Seluruh kartu = link ke halaman produk.

### 2.4 Footer (hitam, kaya komponen)

Urutan vertikal:
1. **Kolom kiri**: logo (ikon merah + wordmark "RAWLINE *clothing store*" — kata kedua serif italic).
2. **CONTACT US** (label merah mono) + alamat uppercase + `EMAIL ↗` + `TELEPON ↗` (link dengan panah).
3. **Newsletter**: teks uppercase "…EXCLUSIVE OFFERS AND **15% OFF** YOUR FIRST ORDER." + input email **underline merah** (border-bottom saja) + tombol teks `SEND` di kanan.
4. **Baris tombol kotak** selebar-container, lebar sama: `ALL | DROPS | NEW | SALE | ABOUT | 404` — border krem 1px, teks mono uppercase, hover invert.
5. Baris sosial: `X · FACEBOOK · INSTAGRAM` + toggle `USD ▪` (pembuka popup currency).
6. Baris akhir: `BUILT IN FRAMER BY SYED` (→ ganti: "Dibangun oleh RPMX") · Privacy Policy · Terms · `© 2026 RAW C…`.

### 2.5 Popup Currency Selector (modal)

- Modal kecil di tengah: bar hitam atas "SELECT YOUR CURRENCY" + tombol X; **gambar glitch-art** di tengah; bar krem bawah: `UNITED STATES` (merah) + dropdown `(USD) ⌄`. Muncul saat pertama kali (persist via localStorage) & dari toggle footer. → Di kloning: modal serupa dengan bendera/Artwork sendiri, opsi `IDR`.

### 2.6 Offer Popup

Popup penawaran terpisah (dari daftar fitur) — muncul sekali (dismissable, localStorage) berisi promo & email capture. → Dipetakan ke popup newsletter RPMX.

---

## 3. Halaman & Section (satu per satu)

> Urutan & konten di bawah hasil observasi langsung preview + DOM. Struktur RPMX = struktur RAWLINE dengan konten diganti.

### 3.1 Halaman Beranda (`/`) — 13 section

1. **Hero media penuh** — video/foto full-bleed (orang berjalan di underpass, gelap) + manifesto uppercase mono di tengah ("RAWLINE IS MORE THAN CLOTHING…") + H1 raksasa `WEAR THE HYPE "RAW"` (96px) di bawah media + **3 quick-link produk** (thumbnail kecil → /shop/…) + tombol `SHOP NOW`. → RPMX: media produksi/workshop + H1 versi RPMX (mis. `WEAR THE HYPE "RPMX"` → konten id: "DRESS THE UNCONVENTIONAL" → "PAKAI KEPEERCASAANMU").
2. **About** — H2 merah `About` (70px) + paragraf manifesto + foto + `View More ↗` → /about.
3. **latest DROPS** — heading komposit + `VIEW ALL ↗`; **3 kartu kolaborasi** (foto + judul `RAWLINE x NOVA` + 1 kalimat) → halaman drop. → RPMX: drop = rilis jersey musim/kompetisi (mis. "RPMX x GARUDA FUTSAL").
4. **black friday SALE** — heading komposit + grid **8 kartu produk** (badge OFF, wishlist) + `VIEW ALL ↗` → /categories/sale.
5. **Why RAWLINE** — grid 4 kolom **mengundir (staggered)**: tiap kolom turun bertingkat; tiap sel = teks mono kecil (deskripsi) + judul display raksasa abu (`FAST SHIPPING`, `EASY RETURNS`, `SECURE PAYMENTS`, …) + sub-label kecil ("3–5 BUSINESS DAYS"). → RPMX: `PRODUKSI CEPAT`, `BAHAN PREMIUM`, `PEMBAYARAN AMAN`, `KIRIM SE-INDONESIA`.
6. **Kategori / masonry foto** — grid 2 kolom foto gaya hidup berukuran tak rata (editorial), tanpa teks.
7. **Grails** — H2 merah `Grails` + grid **6 kartu produk** kurasi.
8. **Collection CTA** — H2 krem `Rawline` + tombol `SHOP COLLECTION ↗` (band foto).
9. **New Arrivals** — **tabs `MEN / WOMEN`** (boxed, aktif = fill) + `View All ↗` + grid **8 produk**; tab mengganti set produk tanpa reload. → RPMX: tab `JERSEY / JAKET / KAOS`.
10. **SOC*wall*** — heading komposit overlap + link `X FACEBOOK INSTAGRAM` kanan; grid asimetris selang-seling: **kartu quote merah** (isi testimonial uppercase mono + `—@HANDLE`) dan **foto B&W** pelanggan. → RPMX: testimoni tim/komunitas + foto mereka pakai jersey (dari DB `testimonials` + `gallery_items`).
11. **Gift Card** — full-bleed foto + manifesto tengah + tombol outline `GET NOW`. → Boleh dipertahankan (gift card) ATAU diganti CTA "Paket Tim".
12. **Walk-in Stores** — 2 kartu toko: foto etalase + `LONDON` (display besar) *Canary Wharf* (serif italic) + jam `Mon-Sun, 10am-6pm` (serif italic) + link Google Maps. → RPMX: alamat workshop Tasikmalaya (1 kartu) + jam operasional.
13. **Footer** (§2.4).

### 3.2 Halaman Shop (`/categories/all` + 10 varian kategori)

- Heading komposit: *shop* **ALL** (varian: *shop* **SALE/NEW/Shoes/…**).
- Kanan-atas: dropdown `PRODUCT TYPE ⌄` (pemilih kategori).
- **Bar FILTERS** (penuh, bg `#1A1A1A`): ikon slider + `FILTERS ⌃` (collapse/expand).
- Panel filter terbuka: **GENDER** → dua tombol kotak `MEN` `WOMEN` (aktif = fill krem); **PRICE** → 4 checkbox krem `< $100`, `$101-$200`, `$201-300`, `> $300`; baris kedua: checkbox `ON SALE`, `NEW ARRIVALS`.
- `SORT BY` → `RELEVANCE ⌄` (dropdown: Relevance, Price ↑, Price ↓, Newest).
- Grid produk 4 kolom (kartu §2.3), hasil filter live tanpa reload.
- Varian kategori memakai heading berbeda + grid sama. → RPMX: kategori = jersey-futsal, jersey-bola, jaket, kaos, polo, kemeja (ganti GENDER → `TIM`/`INDIVIDU` bila perlu).

### 3.3 Halaman Produk (`/shop/[slug]`)

Layout **3 kolom** (desktop):
- **Kiri**: breadcrumb `RAWLINE` + ikon hati; **judul produk raksasa** (Azeret 64–72px, krem, 3 baris, rata kanan-ke-kiri tengah); **tabel ukuran** bergaris 1px: kolom `SIZE | CHEST (IN) | SLEEVE (IN) | LENGTH (IN)` × baris `S 38 17 25 / M 40 18 26 / L 42 19 27 / XL 44 20 28`.
- **Tengah**: galeri vertikal — foto produk flat, tampilan belakang, foto on-model (scroll dengan halaman).
- **Kanan (sticky)**: harga **merah** `$247.00 USD` (mono bold); **pills ukuran** `S M L XL` (kotak; aktif = fill merah, lainnya border); **stepper qty** (kotak bordered: − 1 +); tombol **`ADD TO CART`** merah penuh; deskripsi uppercase mono; `MATERIAL & CARE` + bullet ("• COTTON-POLY BLEND…").
- Bawah: (listing) related products / size table custom.
- Aksi ADD TO CART → **cart drawer slide-over** (dari kanan) berisi item, qty, subtotal, tombol checkout. → Di kloning Next.js: drawer client-side (state) + checkout = arahkan ke WhatsApp penawaran ATAU checkout Shopify bila aktif.

### 3.4 Halaman Latest Drops (`/latest-drops`) — **tema terbalik (krem)**

- Latar krem `#FFFFE3`, teks hitam — satu-satunya halaman terang (kontras kuat).
- Hero tagline: *"Every drop tells a story. Limited runs, designed to stay timeless."*
- Daftar 4 drop: kartu besar (foto + `RAWLINE x NOVA` + 1 kalimat) → halaman drop detail.

### 3.5 Halaman Drop Detail (`/latest-drops/[slug]`)

1. Judul kolaborasi + **cerita editorial** (1–2 paragraf).
2. **Lookbook** — galeri foto gaya editorial.
3. **Shop the Drop** — daftar produk angka kolaborasi (kartu produk).
4. CTA tunggal besar.
→ RPMX: halaman ini jadi **katalog paket jersey tim** (story tim → lookbook desain → produk paket → CTA "Minta Penawaran Paket").

### 3.6 Halaman About (`/about`)

1. Paragraf intro manifesto (origin brand).
2. **Our Story** — cue "SCROLL DOWN" + heading komposit *the story* **WE WEAR** + blok `Our Journey so far` & `Our culture` (dua kolom teks besar).
3. **FAQs** — akordeon: Why RAWLINE? / Shipping / Payments / Authenticity.
4. CTA.
→ RPMX: cerita brand dari PRD (ekosistem fashion custom) + FAQ konveksi (minimal order, lama produksi, bahan, pengiriman).

### 3.7 Wishlist (`/wishlist`)

Grid kartu produk yang di-heart (client state; kosong = empty state teks mono).

### 3.8 Halaman lain

- `/legal/privacy-policy`, `/legal/terms-and-conditions` — layout dokumen mono sederhana.
- `/404` — halaman error bergaya brutalis (heading raksasa + link pulang).
- **Search** (fitur "smart search by name/category/tag") — overlay/dropdown hasil instan dari header.

---

## 4. Efek & Micro-interaction (polesan)

Semua animasi Framer = spring/scroll-driven. Padanan Next.js: **framer-motion**.

| # | Efek | Detil | Implementasi |
|---|---|---|---|
| 1 | Page transition | Crossfade/clip halus antar halaman (template: "seamless page transitions") | `framer-motion` AnimatePresence + template.tsx |
| 2 | Reveal on scroll | Heading & section muncul naik + fade, sekali per masuk viewport | `whileInView` (once: true, ease "easeOut", y 24→0) |
| 3 | Kartu produk hover | Zoom gambar lambat (scale 1.03–1.06, durasi 400–600ms) + swap gambar kedua (opacity crossfade) | CSS transform + dua `<img>` |
| 4 | Wishlist heart | Outline → fill merah dengan pop kecil (scale 1→1.2→1) | CSS/`motion` + state |
| 5 | Tabs MEN/WOMEN | Underline/fill pindah dengan spring layout | `motion.layoutId` |
| 6 | Marquee/ticker | Teks berjalan horizontal (ada di elemen promo & hero) | CSS keyframes (sudah kita punya `.animate-marquee`) |
| 7 | Countdown | Detik berjalan (drop), angka mono besar | `setInterval` client component |
| 8 | Filter shop | Panel expand/collapse (height animate), hasil filter instan | `AnimatePresence` + state |
| 9 | Cart drawer | Slide dari kanan + backdrop gelap; item slide-in bertahap | `AnimatePresence` slide x:100% |
| 10 | Currency modal | Scale/fade in, backdrop blur ringan | `motion` modal + localStorage |
| 11 | Offer popup | Muncul setelah delay singkat, sekali per visitor | localStorage flag + motion |
| 12 | Tabel ukuran | Baris hover → highlight tipis | CSS `:hover` bg `#1F1F1F` |
| 13 | Link ↗ & tombol | Hover: invert (fill krem/merah), panah geser diagonal | CSS transition |
| 14 | Sticky buy panel | Panel kanan produk menempel saat galeri di-scroll | `sticky top-24` |
| 15 | Header | Transparent di atas hero → solid `#111` + border bawah saat scroll | scroll listener / `useScroll` |
| 16 | Image parallax ringan | Foto full-bleed bergerak lebih lambat dari scroll | `useScroll` + `useTransform` (opsional) |

**Prinsip polesan:** cepat & tegas (durasi 250–600ms, ease-out), tanpa bounce berlebihan; tidak ada animasi loop kecuali marquee & countdown; hormati `prefers-reduced-motion`.

---

## 5. Perilaku Responsif

- Breakpoint inti: 1440 / 1200 / 810 / 390.
- Grid produk: 4 → 2 → 2 (mobile tetap 2 kolom kecil) atau 1 untuk kartu besar.
- Produk 3 kolom → tumpuk: galeri dulu → judul+beli; tabel ukuran jadi scroll horizontal.
- Why RAWLINE staggered → kolom tunggal.
- Header → hamburger fullscreen; footer tombol kotak → grid 2 kolom.
- Semua teks display mengecil proporsional (H1 96 → ±40px mobile).

---

## 6. Pemetaan ke Implementasi Next.js RPMX

### 6.1 Fondasi

1. Tambah font: `Azeret_Mono` (400,500,700) + `Source_Serif_4` (italic 600–700) via `next/font/google` → token `--font-mono-display`, `--font-serif-accent`.
2. Perbarui `globals.css`: token warna §1.1 (`--bg:#111`, `--ink:#FFFFE3`, `--accent:#E83030`, `--muted:#787878`, `--surface:#1A1A1A`), radius 0 untuk komponen toko, utility `.heading-composite`.
3. Tema lama (zinc + kartu rounded-2xl) → diganti menyeluruh mengikuti spec ini.

### 6.2 Komponen baru/penyusunan ulang

```
components/
  layout/site-header.tsx        → §2.1 (fixed 72px, wishlist+cart counter)
  layout/site-footer.tsx        → §2.4 (newsletter merah, tombol kotak)
  layout/cart-drawer.tsx        → §4.9 (client, context)
  layout/currency-modal.tsx     → §2.5 (opsional; IDR default)
  layout/offer-popup.tsx        → §2.6 (opsional)
  shop/product-card.tsx         → §2.3 (badge, wishlist, hover swap)
  shop/filters-bar.tsx          → §3.2 (gender/price/toggle + sort)
  shop/shop-grid.tsx            → grid 4 kolom + filter client-side
  product/size-table.tsx        → tabel S–XXL (dari DB)
  product/buy-panel.tsx         → §3.3 kanan (sticky)
  product/product-gallery.tsx   → kolom tengah
  home/*                        → 13 section §3.1 (Hero, About, DropsRow,
                                   SaleGrid, WhyUs, CategoryMasonry, Grails,
                                   CollectionCta, NewArrivalsTabs, SocialWall,
                                   GiftCard, Stores, …)
  drops/drop-card.tsx           → kartu drop (tema krem)
motion/Reveal.tsx               → wrapper whileInView (§4.2)
```

### 6.3 Pemetaan database (skema现有 → kebutuhan RAWLINE)

| Tabel RPMX | Dipakai untuk |
|---|---|
| `services` | tetap (halaman layanan) — tidak diubah |
| `products` **(baru)** | katalog: slug, title, price, compare_at_price, category, gender/tipe, is_new, is_on_sale, sizes JSON (S–XXL + stok), images JSON, material_care |
| `product_categories` **(baru)** | All/Shoes/T-Shirt/… → jersey-futsal, jaket, kaos, polo, kemeja, aksesori |
| `drops` **(baru)** | judul kolaborasi, slug, story, hero_image, is_active |
| `drop_products` **(baru)** | relasi drop ↔ product (+urutan) |
| `testimonials` | Social Wall (tambah kolom `handle`, `image_url`) |
| `gallery_items` | masonry foto, lookbook drop, foto toko |
| `inquiries` | tetap — form penawaran (alur pesanan tim) |

### 6.4 Rute baru

```
/                        → beranda 13 section
/categories/[category]   → shop + filter (all, sale, new, per-kategori)
/product/[slug]          → detail produk (ganti/melengkapi /layanan)
/latest-drops            → indeks drop (tema krem)
/latest-drops/[slug]     → detail drop (story → lookbook → shop the drop)
/wishlist                → wishlist (client state)
/about, /kontak, /admin  → tetap (restyle mengikuti token baru)
```

### 6.5 Konten — "RPMX-ification" (ganti seluruh copy)

| RAWLINE | Versi RPMX (contoh) |
|---|---|
| WEAR THE HYPE "RAW" | WEAR THE HYPE "RPMX" / DARI KAMPUUNG JADI KOMANDAN LAPANGAN |
| Dress the unconventional | Dress the unconventional — *Dress the unconventional* (boleh dipertahankan sebagai tagline EN) atau "Pakaian untuk yang bergerak beda" |
| Manifesto about | Manifesto RPMX dari PRD §15 (ekosistem fashion custom, individu → massal) |
| RAWLINE x NOVA/VERO/LUNA/ORDEN | RPMX × [Nama Tim/Komunitas] — drop jersey kolaborasi |
| Fast Shipping 3–5 days | Produksi Cepat — ekspres sesuai kesepakatan |
| Why RAWLINE 4 kolom | Produksi Cepat · Bahan Premium · Pembayaran Aman · Kirim Se-Indonesia |
| Size table (chest/sleeve/length) | Tabel ukuran jersey: S–XXL + panjang + lingkar dada (inch/cm) |
| Add to Cart | Add to Cart (satuan) **+ tombol kedua "Minta Penawaran Tim"** (form bulk → `inquiries`) |
| Walk-in stores London/NYC | Workshop Tasikmalaya (Kp. Gununggede, Kawalu) + jam operasional |
| Gift card | Gift Card RPMX (opsional) atau CTA Paket Komunitas |

### 6.6 Yang sengaja TIDAK diikutkan

- Foto/model/asets gambar RAWLINE (ganti foto produksi RPMX asli).
- Nama "RAWLINE", logo, dan copy aslinya (semua diganti konten RPMX — tabel §6.5).
- Checkout Polar/Framer Commerce — diganti: WhatsApp penawaran (fase 1) / Shopify (fase 3, bila diaktifkan).

---

## 7. Urutan Implementasi yang Disarankan

1. **Fondasi**: font + token warna + radius 0 + header/footer baru (§1–2).
2. **Kartu produk + heading komposit** (§2.2–2.3) — elemen paling menentukan rasa.
3. **Beranda 13 section** (§3.1) dengan data fallback statis.
4. **Shop + filter** (§3.2) — butuh tabel `products` + `product_categories` + seed.
5. **Halaman produk + size table + buy panel + cart drawer** (§3.3, §4.9).
6. **Drops (tema krem) + drop detail** (§3.4–3.5) — butuh `drops` + `drop_products`.
7. **Social wall + About restyle** (§3.6, §3.1.10).
8. **Wishlist, currency modal, offer popup** (§2.5–2.6, §3.7) — polesan akhir.
9. **Responsif audit 390/810/1440** + `prefers-reduced-motion`.
10. Deploy: `docker compose up -d --build` (migrasi produk baru otomatis).

**Estimasi bobot kerja:** fondasi+home ±35% · shop+produk ±35% · drops+about+polesan ±30%.

---

## 8. Checklist "Terasa RAWLINE" (QA visual)

- [ ] Semua teks memakai Azeret Mono; tidak ada font sans biasa di area display
- [ ] Setiap judul section memakai pasangan serif-italic + mono-merah
- [ ] Background global `#111111`; kartu `#1A1A1A`; tidak ada radius > 0 di komponen toko
- [ ] Merah hanya untuk: harga, badge, CTA utama, kartu quote, aksen heading, underline form
- [ ] Halaman Drops = satu-satunya yang terang (krem)
- [ ] Kartu produk punya hati wishlist + badge OFF + harga strikethrough
- [ ] Produk punya tabel ukuran bergaris + pills ukuran + stepper qty
- [ ] Footer punya: newsletter underline merah, baris tombol kotak selebar-container, alamat workshop
- [ ] Semua reveal animasi sekali (bukan loop), durasi ≤ 600ms
- [ ] Mobile 390px: header hamburger fullscreen, grid 2 kolom, tabel ukuran scroll-x

---

*Dokumen ini adalah cetak biru implementasi internal RPMX. Referensi desain: RAWLINE by Syed Tahoor Ali (framer.com/marketplace/templates/rawline). Semua konten, foto, dan brand tetap milik RPMX.*

# CODEX COMMANDS — Perintah Siap Tempel untuk Codex CLI/Agent di Proyek RPMX

> Cara pakai: buka folder proyek ini di Codex → **tempel PREAMBLE sekali di awal sesi** →
> lalu tempel **satu perintah tugas** yang ingin dikerjakan. Satu sesi = satu tugas agar hasil bersih.
> Setiap perintah sudah memuat konteks + kriteria selesai + perintah verifikasi.

---

## PREAMBLE — tempel ini di awal setiap sesi Codex

```text
Kamu bekerja di proyek website RPMX: Next.js 16.4.5 (App Router, cacheComponents AKTIF,
Turbopack) + Tailwind CSS v4 + PostgreSQL + Drizzle ORM + framer-motion.

WAJIB BACA DULU sebelum coding:
- RAWLINE_DESIGN_SPEC.md  → spesifikasi desain (token, komponen, halaman)
- RAWLINE_AUDIT_REPORT.md → temuan audit + perbaikan yang sudah diterapkan
- src/app/globals.css     → token & utility resmi (bg-raw #111111, text-raw-ink #FFFFE3,
  accent #E83030, font-raw Azeret Mono, font-serif-italic Source Serif 4, btn-accent,
  btn-boxed, media-scrim, media-fallback)

KONVENSI WAJIB (jangan langgar):
1. Radius 0 di semua komponen toko — TIDAK ADA rounded-*
2. Semua teks pakai font-raw (Azeret Mono); serif italic hanya prefiks heading komposit
3. Warna hanya dari token: bg-raw/text-raw-ink/bg-raw-surface/border-raw-line/text-raw-muted/
   bg-accent/text-accent — jangan pakai palet zinc/slate/gray Tailwind di komponen toko
4. Semua fungsi data yang menyentuh DB wajib diawali "use cache" + cacheLife("minutes") + cacheTag(...)
5. JANGAN membuat animasi fade/opacity di level halaman (pernah membuat konten tersembunyi)
6. localStorage = external store pakai useSyncExternalStore (lihat src/lib/cart-store.ts sebagai pola)
7. Selesai = jalankan: npm run lint && npm run build — keduanya harus bersih, lalu tampilkan ringkasan diff
```

---

## TASK A — Hover image swap di kartu produk
*(jalankan SETELAH foto `-2.jpg` tersedia di `public/media/product/`)*

```text
TASK: Aktifkan hover image swap pada kartu produk ala RAWLINE.

KONTEKS:
- Kartu produk: src/components/product-card.tsx
- Foto produk tersedia di public/media/product/<slug>-1.jpg dan beberapa sudah ada <slug>-2.jpg
- Kolom images di tabel products berisi array path foto

PERINTAH:
1. Di ProductCard: jika product.images.length >= 2, render dua <img> bertumpuk
   (gambar [0] + gambar [1]) dengan crossfade — gambar kedua opacity 0 dan menjadi 1
   saat .group:hover (transisi 400ms). Jika hanya 1 gambar, perilaku tetap (zoom saja).
2. Gunakan <img> biasa (bukan next/image) dengan className yang sama seperti sekarang,
   tambahkan brightness-110.
3. Pastikan tidak mengubah struktur wishlist/badge/info.
4. Jalankan: npm run lint && npm run build — harus bersih.
Selesaikan, lalu tampilkan ringkasan perubahan.
```

---

## TASK B — Currency modal (IDR/USD)

> **STATUS: ✅ SELESAI 12 Nov 2026 — JANGAN ulangi.** Dikerjakan langsung (bukan via Codex):
> `src/lib/currency-store.ts` + `src/components/currency/` (`currency-modal.tsx` = selector+modal,
> `price.tsx` = harga reaktif, `use-currency.ts`), `formatPrice(value, currency)` + `USD_RATE 15800`
> di `src/lib/site.ts`, trigger `{IDR|USD} ▪` di footer, label filter harga shop ikut currency.
> Pesan checkout WhatsApp TETAP IDR (formatIDR). Lint/build bersih + terverifikasi end-to-end
> via browser (modal buka/tutup, harga IDR↔USD tanpa reload, persist localStorage, cart drawer).

```text
TASK: Buat currency selector modal ala RAWLINE (RAWLINE_DESIGN_SPEC.md §2.5).

KONTEKS:
- Trigger: tombol "IDR ▪" yang sudah ada di footer (src/components/site-footer.tsx)
- Pola modal: tiru AnimatePresence + backdrop di src/components/cart/cart-drawer.tsx
- Semua harga format via formatIDR() di src/lib/site.ts

PERINTAH:
1. Buat src/components/currency/currency-modal.tsx (client): modal kotak brutalis —
   bar atas "SELECT YOUR CURRENCY" + tombol X, bagian tengah foto glitch-art
   (pakai /media/about.jpg), bar bawah: dua pilihan IDR / USD (tombol kotak, aktif = fill krem).
2. State currency disimpan di localStorage key "rpmx-currency" via external store
   useSyncExternalStore (tiru pola src/lib/wishlist-store.ts) — jangan useEffect setState.
3. Ubah formatIDR(value, currency?) agar USD tampil "$ 1.299" dengan konversi statis
   di src/lib/site.ts (const USD_RATE = 15800) — konversi hanya tampilan.
4. Tombol "IDR ▪" di footer membuka modal; pilihan tersimpan; harga di semua halaman
   berganti format tanpa reload.
5. JANGAN ubah data DB — konversi murni tampilan.
6. Selesai = npm run lint && npm run build bersih + ringkasan diff.
```

---

## TASK C — Editor produk di /admin (CRUD)

> **STATUS: ✅ SELESAI 12 Nov 2026 — JANGAN ulangi.** Dikerjakan langsung (bukan via Codex):
> Server actions auth-guarded di `src/app/admin/actions.ts` (`createProduct`, `updateProduct`,
> `deleteProduct` soft, `toggleProductActive`, `toggleProductFlag`) dengan **`updateTag("products")`**
> (API Next 16 untuk read-your-own-writes di Server Action — `revalidateTag` kini wajib 2 argumen)
> + `revalidatePath("/admin")`. Section "Katalog Produk" di `src/app/admin/page.tsx`: counter,
> form tambah/edit inline (URL-driven `?new=1` / `?edit=<id>`, tanpa client JS), toggle NEW/SALE,
> Hapus = soft (Nonaktif) + Pulihkan, validasi (judul ≥3, harga > 0, compare > harga, slug unik,
> kategori dikenal), feedback `?perr/`?pok`. Terverifikasi end-to-end via browser (semua alur).

```text
TASK: Tambahkan editor produk di halaman /admin agar harga/stok/foto bisa diubah
tanpa SQL (RAWLINE_AUDIT_REPORT — sisa item #5 konten).

KONTEKS:
- Halaman admin: src/app/admin/page.tsx + server actions src/app/admin/actions.ts
- Skema: src/db/schema.ts (tabel products — price integer rupiah, images text[], sizes text[])
- Pola server action + cookie auth: lihat loginAction/updateStatusAction
- Setelah mutasi data, panggil revalidateTag("products") (data.ts memakai cacheTag itu)
- Gaya: border-raw-line bg-raw-surface, radius 0, font-raw uppercase — lihat kartu inquiry

PERINTAH:
1. Di actions.ts tambah server action auth-guarded: createProduct, updateProduct,
   deleteProduct (soft: isActive=false), toggleProductFlag (is_new/is_on_sale).
   Semua wajib cek isAuthenticated() dan panggil revalidateTag("products").
2. Di page.tsx tambah tab/section "PRODUK" di atas daftar inquiry:
   - Tabel ringkas semua produk (foto thumb, judul, harga, kategori, flag new/sale, aktif)
   - Tombol "TAMBAH PRODUK" → form inline (title, slug auto dari title, price, comparePrice,
     categorySlug select, sizes comma-separated, description, materialCare, imageUrl URL tunggal,
     checkbox isNew/isOnSale/isActive)
   - Tiap baris: tombol EDIT (form inline sama) + TOGGLE AKTIF + HAPUS (confirm)
3. Validasi manual sederhana (harga > 0, title min 3 char) — tampilkan pesan error inline.
4. Gaya harus konsisten RAWLINE (kotak, mono, tanpa radius).
5. Selesai = npm run lint && npm run build bersih + ringkasan.
```

---

## TASK D — Editor testimoni & drop di /admin

> **STATUS: ✅ SELESAI 12 Nov 2026 — JANGAN ulangi.** Dikerjakan langsung (bukan via Codex):
> Server actions auth-guarded di `src/app/admin/actions.ts` (`updateTestimonial` — name/role/
> content/isActive dgn validasi panjang, `deleteTestimonial` soft, `toggleTestimonialActive`,
> `toggleDrop`, `updateDropImageUrl` — validasi path/URL) dgn `updateTag("testimonials")`/
> `updateTag("drops")` (API Next 16). UI: section "Testimoni" (kartu + edit inline URL-driven
> `?tedit=<id>` + Hapus/Pulihkan) & "Drops" (thumb + toggle aktif + input URL foto) di
> `src/app/admin/page.tsx`. Terverifikasi end-to-end via browser: edit tersimpan, Social Wall
> beranda & /drops langsung ikut (updateTag terbukti), state demo dipulihkan via seed.

```text
TASK: Perluas admin (lanjutan TASK C) agar testimoni dan drop bisa dikelola.

KONTEKS: sama seperti sebelumnya — tabel testimonials (isActive mengontrol Social Wall
di beranda) dan drops + drop_products. Cache tag: "testimonials" dan "drops".

PERINTAH:
1. Server actions auth-guarded: updateTestimonial (content, name, role, isActive),
   deleteTestimonial, toggleDrop (isActive), updateDropImageUrl.
   Panggil revalidateTag("testimonials") / revalidateTag("drops") setelah mutasi.
2. UI: section "TESTIMONI" (kartu per testimoni + toggle aktif + edit inline) dan
   section "DROPS" (kartu per drop + toggle aktif + input URL foto).
3. Gaya RAWLINE konsisten; selesai = lint && build bersih + ringkasan.
```

---

## TASK E — Safety deploy: git hygiene & env guard

> **STATUS: ✅ SELESAI 12 Nov 2026 — JANGAN ulangi.** Dikerjakan langsung (bukan via Codex):
> `src/lib/env-check.ts` (`validateProdEnv()` dipanggil di `loginAction` + `adminPasswordProblem()`
> mengunci halaman admin dengan Notice di produksi), `scripts/check-prod.mjs` + `npm run check:prod`,
> `.env.production.example`, `.gitignore` `!.env.production.example`. Lint/build bersih.
> Detail: `ADMIN_AUDIT_REPORT.md` §3 H2.

```text
TASK: Perkuat keamanan pre-deploy.

PERINTAH:
1. Buat src/lib/env-check.ts: fungsi validateProdEnv() yang melempar error jelas bila
   NODE_ENV=production tapi ADMIN_PASSWORD salah satu dari: kosong, "admin123",
   "changeme", atau panjang < 8. Panggil di src/app/admin/actions.ts loginAction.
2. Pastikan .gitignore memblokir .env, .env.local, .env*.local (sudah ada — verifikasi).
3. Buat .env.production.example berisi daftar var produksi + komentar pengamanan.
4. Tambah script npm "check:prod": node script env-check di atas.
5. Selesai = lint && build bersih + ringkasan.
```

---

## TASK F — Lighthouse / performa pass

```text
TASK: Audit performa gambar & font.

PERINTAH:
1. Semua <img> manual di komponen (product-card, hero, drops, galeri, admin thumb)
   ganti ke next/image dengan sizes prop yang benar — KECUALI di dalam
   opengraph-image.tsx (biarkan).
2. Hero image: pastikan priority + sizes="100vw" dan kualitas optimizer 80
   (images: { qualities: [75, 80] } di next.config.ts bila perlu).
3. Jalankan build, laporkan ukuran route terbesar & saran 3 perbaikan berikutnya.
Selesaikan dengan npm run lint && npm run build bersih.
```

---

## YANG JANGAN DIPERINTAHKAN KE CODEX (kerjakan manual/bersama saya)

- ❌ Regenerate foto (Codex tidak bisa buat foto — pakai ChatGPT + MEDIA_PROMPTS.md)
- ❌ Mengubah token desain / "mempercantik" di luar spec RAWLINE
- ❌ Menulis/menjalankan migrasi DB tanpa backup (backup dulu: pg_dump)
- ❌ Deploy ke VPS (ikuti DEPLOYMENT.md manual, butuh akses server)
```

---

## Contoh alur sesi Codex

```
[Anda]  (tempel PREAMBLE)
[Anda]  (tempel TASK C)
[Codex] mengerjakan… menampilkan diff…
[Anda]  "commit dengan pesan: feat(admin): product editor"
```

> Ulangi untuk task berikutnya di sesi baru. Simpan file ini di repo — Codex juga bisa
> membacanya: *"baca CODEX_COMMANDS.md lalu kerjakan TASK D sesuai PREAMBLE."*

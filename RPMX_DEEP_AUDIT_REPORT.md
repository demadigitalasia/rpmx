# RPMX — AUDIT MENDALAM & REKOMENDASI

**Tanggal:** 14 November 2026
**Objek:** rpmx-website (Next.js 16.4.5, React 19, Tailwind 4, drizzle + Postgres, Docker/Coolify) — live di https://rpmx.demadigitalasia.com
**Metode:** 5 audit domain paralel (keamanan, performa, data layer, SEO/a11y/kualitas, produksi/ops) + verifikasi live produksi via curl + verifikasi mandiri klaim kunci. Read-only — tidak ada file yang diubah, tidak ada kredensial di dokumen ini.

---

## 1. RINGKASAN EKSEKUTIF

**82 temuan mentah → 73 temuan unik setelah deduplikasi: 1 P0 · 12 P1 · 26 P2 · 34 P3.**

**Verdict: 6,0/10 — "Fondasi bagus, site hidup dan sehat hari ini, tetapi profil risikonya terkonsentrasi di infrastruktur dan biaya performa."**

Situs saat ini **sehat** (TTFB median 60 ms, cache HIT, tidak ada eksploitasi aktif, secrets bersih, guard admin solid). Tapi tiga hal menahan kualitasnya:

1. **P0 performa** — setiap pageview katalog mengunduh **25–35 MB foto full-res eager** (kartu produk pakai `<img>` mentah tanpa lazy-load; thumbnail hero rail 64px pun memuat file 470–792 KB). Ini menyiksa pengunjung 4G dan bandwidth VPS.
2. **Lima celah infrastruktur P1** — backup tidak otomatis, tanpa monitoring/healthcheck, security headers kosong (terverifikasi live), image optimizer bisa mem-fetch URL arbitrer (terverifikasi live), port 3000 terekspos publik tanpa TLS (terverifikasi live).
3. ** Risiko data** — skema tanpa foreign key/index, workflow migrasi ganda berisiko drift, dan fallback demo yang tampil diam-diam bisa menipu admin (katalog kosong → publik lihat 30 produk demo).

**Top 5 aksi (urut dampak ÷ effort):**

| # | Aksi | Effort | Dampak |
|---|------|--------|--------|
| 1 | `next/image` + lazy-load untuk semua foto produk (kartu, galeri, rail hero) | ½ hari | transfer −90%, LCP turun drastis |
| 2 | Security headers + `poweredByHeader: false` + `remotePatterns: []` di `next.config.ts` | 15 menit | menutup SSRF proxy + clickjacking + MIME-sniffing (live verified) |
| 3 | Port compose `3000:3000` → `127.0.0.1:3000:3000` | 1 baris | menutup bypass TLS publik (live verified 200) |
| 4 | Healthcheck container + uptime monitor eksternal | 1 jam | downtime terdeteksi dalam menit, bukan hari |
| 5 | Backup otomatis harian + offsite + uji restore | ½ hari | aset bisnis (leads, subscriber, CMS) tidak lagi hidup di satu volume |

---

## 2. KARTU SKOR BERBOBOT

Bobot disusun menurut konteks bisnis RPMX (konveksi B2B premium; leads via form penawaran + WhatsApp; katalog = etalase).

| Domain | Bobot | Skor | Alasan singkat |
|--------|-------|------|----------------|
| Keamanan & perlindungan data | 25% | **6,5** | Guard solid (16/16 server action auth-guarded, SQLi nol, secrets bersih, zod+honeypot). Tapi permukaan infra terbuka: image optimizer menerima host arbitrer (live verified), login tanpa throttle, headers kosong, sesi admin tak revocable, JSON-LD bisa jadi vektor XSS via CMS. |
| Reliabilitas, data & ops | 20% | **5,0** | Situs hidup & graceful, tapi: backup manual tak terverifikasi, nol FK/index sekunder, drift risiko antara db:push (dev) vs migrate (prod), fallback demo diam-diam, nol monitoring/CI/rollback. |
| Performa | 20% | **5,0** | TTFB 60 ms & cache in-container bagus; fonts next/font rapi. Tapi 1 P0: 25–35 MB transfer/pageview + framer-motion 49 KB gzip di semua halaman. |
| SEO | 15% | **7,0** | Fondasi benar & live-verified (sitemap/robots/OG, metadata unik per halaman, lang id). Gap: structured data hanya LocalBusiness, tanpa canonical, kontak tanpa H1, sitemap lastmod generik. |
| Aksesibilitas & UX mikro | 10% | **6,0** | Baseline baik (aria-label, alt, label form). Tapi semua modal tanpa focus trap/aria-modal/Escape (P1 ×2), kontras muted gagal AA, error form tak diumumkan screen reader. |
| Kualitas kode | 10% | **7,0** | Lint 0/0, tsc strict bersih, nol `any`, konvensi repo konsisten (use cache, useSyncExternalStore, tanpa Tailwind dinamis). Tapi admin monolit 1.620 baris, nol test/prettier/husky, 31 catch diam. |
| **TOTAL BERBOBOT** | **100%** | **6,0** | — |

---

## 3. VERIFIKASI LIVE PRODUCTION (curl, 11 request)

| Uji | Hasil | Penilaian |
|-----|-------|-----------|
| Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | **Semua absen**; hanya `cache-control` + `x-powered-by: Next.js` | ❌ P1 |
| TTFB homepage (3×) | median **0,060 s** (total 0,10 s) | ✅ sangat baik |
| Cache | `x-nextjs-cache: STALE → HIT`, `s-maxage=60` — HTML ter-cache di dalam container | ✅ bagus (tanpa CDN) |
| Kompresi | gzip aktif; **brotli tidak** | ⚠️ P3 |
| robots.txt / sitemap.xml | valid, semua URL https domain produksi, disallow /admin & /api | ✅ |
| /admin | HTTP 200 halaman login normal | ✅ |
| `/_next/image?url=https://example.com/image.png` | HTTP 404 *"url parameter is valid but upstream response is invalid"* → **fetch upstream dieksekusi** (bukan penolakan konfigurasi) | ❌ P1 — SSRF |
| `http://72.62.122.241:3000/robots.txt` | **HTTP 200** — aplikasi reachable plaintext langsung dari internet | ❌ P1 |

---

## 4. MASTER LIST TEMUAN (konsolidasi & dedup)

### P0 — 1 temuan

| ID | Temuan | Domain |
|----|--------|--------|
| **P0-1** | Semua foto produk eager full-res via `<img>` mentah — 25–35 MB/pageview | Performa |

### P1 — 12 temuan

| ID | Temuan | Domain |
|----|--------|--------|
| P1-1 | SSRF via `/_next/image`: `remotePatterns hostname "**"` + redirect-bypass + tanpa rate limit — **live verified** | Keamanan |
| P1-2 | Login admin tanpa rate limiting — brute-force online tak terbatas | Keamanan |
| P1-3 | Security headers hilang total — **live verified** | Keamanan/Ops |
| P1-4 | Backup DB tidak otomatis & tak terverifikasi — data hidup di satu named volume | Data/Ops |
| P1-5 | Tanpa monitoring, alerting, healthcheck — downtime tak terdeteksi | Ops |
| P1-6 | Port 3000 terekspos publik tanpa TLS — **live verified 200** | Ops |
| P1-7 | framer-motion 139,8 KB (49 KB gzip) termuat di SEMUA halaman | Performa |
| P1-8 | `/shop` & `/kontak` full-dynamic hanya untuk prefill 1 query param | Performa |
| P1-9 | Nol foreign key & nol index sekunder di seluruh skema (10 tabel) | Data |
| P1-10 | Workflow migrasi ganda (db:push dev vs migrate prod) tanpa guard drift; 0002 ditulis tangan | Data |
| P1-11 | Semua dialog tanpa focus trap, aria-modal, return focus | A11y |
| P1-12 | CartDrawer, OfferPopup, menu mobile tak bisa ditutup Escape (inconsisten dengan SearchOverlay/CurrencyModal) | A11y |

### P2 — 26 temuan

| ID | Temuan | Domain |
|----|--------|--------|
| P2-1 | Cookie admin = SHA-256 unsalted password → brute-forceable offline bila bocor; sesi tak revocable per-device | Keamanan |
| P2-2 | JSON-LD `dangerouslySetInnerHTML` tanpa escape `<` → stored XSS lewat Pengaturan Situs CMS | Keamanan |
| P2-3 | API publik POST (inquiries, newsletter) tanpa rate limit → flooding DB PII | Keamanan |
| P2-4 | Fallback demo menelan kegagalan/DB-kosong diam-diam (10 catch tanpa log); admin nonaktifkan semua produk → publik lihat 30 produk demo | Data |
| P2-5 | `seedContent --fresh` tanpa transaksi; bootstrap `?fresh=1` hapus semua konten 1 klik tanpa konfirmasi kedua | Data |
| P2-6 | Newsletter tanpa unsubscribe/status; email unique raw (case-sensitive); CSV export rawan formula injection | Data |
| P2-7 | PII tanpa retensi/pembersihan; admin inquiry cuma 200 terbaru tanpa pagination; tak ada export inquiries | Data |
| P2-8 | Logo PNG 62 KB tanpa `sizes` (default 100vw) di header+footer | Performa |
| P2-9 | Tanpa `loading.tsx`/Suspense — navigasi ke route dynamic tanpa feedback | Performa |
| P2-10 | RSC payload katalog: baris penuh (deskripsi, materialCare) dikirim ke client untuk kartu | Performa |
| P2-11 | `/api/products` proses katalog penuh per keystroke tanpa cache HTTP | Performa |
| P2-12 | Halaman Kontak tanpa H1 | SEO |
| P2-13 | Structured data hanya LocalBusiness — tak ada Product/Offer, BreadcrumbList, Organization | SEO |
| P2-14 | Canonical (`alternates`) tidak diset di mana pun — varian query rawan duplikat | SEO |
| P2-15 | Sitemap `lastModified: new Date()` untuk semua URL — terverifikasi live semua lastmod identik | SEO |
| P2-16 | Kontras `--color-raw-muted #787878` = 4,28:1 (< AA) untuk teks 10–11px; `btn-accent` 4,22:1 | A11y |
| P2-17 | Error form inquiry tak diumumkan screen reader (tanpa role="alert"/aria-describedby) | A11y |
| P2-18 | Button wishlist bersarang di dalam `<Link>` — HTML interaktif invalid | A11y |
| P2-19 | OfferPopup fullscreen auto-muncul 3,5 detik tanpa focus management/scroll lock | A11y |
| P2-20 | `admin/page.tsx` monolit 1.620 baris + `actions.ts` 777 baris | Kualitas |
| P2-21 | Nol test, nol formatter, nol pre-commit | Kualitas |
| P2-22 | 31 blok `catch` diam tanpa log (data.ts, actions.ts, stores) — silent failure tak terdiagnosis | Kualitas |
| P2-23 | DEPLOYMENT.md usang (Nginx era, tanpa "Coolify"); tanpa prosedur rollback | Ops |
| P2-24 | Tanpa CI sama sekali — build/lint tak diverifikasi sebelum deploy ke VPS | Ops |
| P2-25 | Tanpa zero-downtime — build di VPS, deploy = downtime build+migrasi+start | Ops |
| P2-26 | Tanpa error tracking/telemetri — error server action tak pernah terlihat | Ops |

### P3 — 34 temuan (ringkas)

| ID | Temuan | Domain |
|----|--------|--------|
| P3-1 | Metadata produk nonaktif bocor via `generateMetadata` (by-slug tak filter isActive) | Keamanan/Data |
| P3-2 | CSV formula injection export newsletter (escape cuma `"`; email bisa berawalan `=`) | Keamanan |
| P3-3 | `.dockerignore` tidak menutup `.env.production` (COPY . .) | Keamanan |
| P3-4 | `validateProdEnv` hanya jalan saat login/render admin, bukan saat boot | Keamanan |
| P3-5 | PII tanpa kebijakan retensi + export tanpa audit trail (UU PDP 27/2022) | Keamanan/Data |
| P3-6 | Perbandingan non-constant-time (password `!==`, cookie `===`) | Keamanan |
| P3-7 | Aset mati `hero-v2.png` 2,2 MB di public/ (ikut image Docker) | Performa |
| P3-8 | `cacheLife("minutes")` di semua konten padahal invalidasi sudah event-driven via updateTag | Performa |
| P3-9 | Docker tanpa NODE_OPTIONS/mem_limit/logging driver/PID1 (sh -c tak teruskan SIGTERM) | Performa/Ops |
| P3-10 | `/opengraph-image` render Satori runtime per fetch crawler | Performa |
| P3-11 | Index pola spesifik hilang (inquiries created_at, newsletter, sort_order) | Data |
| P3-12 | Honeypot newsletter dead-branch (`max(0)` → bot dapat 400, bukan ok palsu) | Data |
| P3-13 | Admin tak pakai zod; 14 upsert settings berurutan tanpa transaksi | Data |
| P3-14 | Pool tanpa connect_timeout/statement_timeout; drizzle instance dibuat ulang per getDb | Data |
| P3-15 | Slug URL tak dinormalisasi → cache key tak berbatas | Data |
| P3-16 | Versi PG & ekspos port inkonsisten antar dokumen (compose PG17 vs catatan PG15; 127.0.0.1 vs 0.0.0.0) | Data/Ops |
| P3-17 | `/api/products` & sitemap muat baris penuh lalu filter di JS | Data |
| P3-18 | Status inquiries tanpa CHECK constraint di DB | Data |
| P3-19 | Tanpa manifest/apple-icon; favicon hanya SVG | SEO |
| P3-20 | OG image hanya level root — produk/drop tak punya OG sendiri | SEO |
| P3-21 | Metadata "Produk tidak ditemukan" tetap indexable | SEO |
| P3-22 | Tanpa skip link | A11y |
| P3-23 | Tab pattern setengah jadi (tanpa tabpanel/navigasi panah) | A11y |
| P3-24 | Placeholder kontras sangat rendah (~1,3–2,5:1) | A11y |
| P3-25 | "Link" sosial SocialWall = span statis dengan hover (meniru interaktif) | A11y |
| P3-26 | Dead code: Marquee, PageUnderConstruction, navLinks di site.ts | Kualitas |
| P3-27 | Magic number berulang: pt-[72px] ×11, USD_RATE 15800 hardcoded, SIZE_CHART hardcoded, nomor WA fallback | Kualitas |
| P3-28 | Duplikasi sale/new page; container 15× | Kualitas |
| P3-29 | `x-powered-by: Next.js` bocor | Ops |
| P3-30 | Base image node:22-alpine tak di-pin | Ops |
| P3-31 | Kompresi hanya gzip; brotli/zstd tidak aktif di proxy | Ops |
| P3-32 | NEXT_PUBLIC_SITE_URL di-bake build-time via ARG (dokumen: ganti domain = wajib rebuild) | Ops |
| P3-33 | migrasi di CMD → DATABASE_URL salah = crash-loop tanpa alert (tertutup bila P1-5 selesai) | Ops |
| P3-34 | Admin page: 8 query berurutan await (bisa Promise.all) | Kualitas |

---

## 5. DETAIL TEMUAN PRIORITAS (P0 + P1)

### P0-1 — Foto produk eager full-res (~25–35 MB/pageview)
- **Bukti:** `src/components/product-card.tsx:41,49` — `<img src={product.images[0]}>` tanpa `loading`, tanpa srcset, tanpa next/image (foto utama + foto hover, keduanya eager). Sama: `shop/[slug]/page.tsx:151-152` (galeri), `drops/[slug]/page.tsx:87-92`, `hero.tsx:73-79` — **rail hero: thumbnail 64×64px memuat file 470–792 KB**.
- **Angka:** `public/media/product/*.jpg` = 19 MB / ±70 file (470–792 KB each); `/shop` = 32 kartu × 2 foto ≈ **~35 MB eager**; beranda ≈ 25–30 MB. Terverifikasi mandiri.
- **Dampak:** LCP/TTI di 4G menit-bukan-detik; bandwidth VPS tersedot puluhan MB per pageview (biaya transfer nyata); skor PageSpeed SEO turun.
- **Rekomendasi:** ganti ke `next/image` + `sizes="(min-width:1024px) 25vw, 50vw"` untuk kartu grid → varian WebP 400–600px ≈ 30–60 KB/foto (**hemat ~90%**). Foto hover ke-2 lazy. Rail hero: `next/image` dengan `sizes="80px"`. Jika estetika RAWLINE menuntut tanpa placeholder, tetap pakai `<img loading="lazy" decoding="async">` + pra-kompres WebP ≤150 KB.

### P1-1 — SSRF via `/_next/image` (live verified)
- **Bukti:** `next.config.ts:6-8` `remotePatterns: [{ protocol: "https", hostname: "**" }]`. Live test sekali: optimizer **menerima** host arbitrer dan mengeksekusi fetch upstream (404 hanya karena target bukan gambar). Docs Next 16 (`image.md:612`): redirect dari remote pattern **tidak divalidasi ulang** → `https://evil.tld` → 302 ke `http://169.254.169.254/…` atau `http://localhost:…` lolos.
- **Dampak:** server jadi proxy fetch gratis (bandwidth abuse), port-scan jaringan internal Docker/Coolify via timing/error, naik ke P0 bila ada cloud metadata/aplikasi lain di jaringan yang sama.
- **Rekomendasi:** semua media berasal dari `/media/…` internal → kosongkan saja:
  ```ts
  images: { remotePatterns: [] , localPatterns: [{ pathname: "/media/**" }], maximumRedirects: 0 }
  ```

### P1-2 — Login admin tanpa rate limiting
- **Bukti:** `src/app/admin/actions.ts:29-47` — `loginAction` hanya `password !== expected` → redirect; tanpa counter/lockout; tidak ada middleware di repo. `validateProdEnv` cuma menjamin ≥8 char.
- **Dampak:** satu-satunya gerbang ke CMS + PII inquiries + export newsletter dicoba-coba tanpa batas.
- **Rekomendasi:** limiter in-memory per-IP (5 gagal → tolak 15 menit) di `loginAction`; cukup untuk deployment single-container.

### P1-3 — Security headers hilang total (live verified)
- **Bukti:** curl live — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy semuanya absen; `next.config.ts` tanpa `headers()`, tanpa middleware, proxy Coolify tidak menambahkan.
- **Dampak:** clickjacking terhadap operator admin (form login/CMS bisa di-iframe), MIME-sniffing, tanpa HSTS.
- **Rekomendasi:** satu blok `async headers()` di `next.config.ts` (lihat §6 Sprint 0) + `poweredByHeader: false`. CSP mulai report-only.

### P1-4 — Backup DB tidak otomatis (aset bisnis di satu volume)
- **Bukti:** `DEPLOYMENT.md:118-129` cron pg_dump hanyalah panduan manual (path `/home/USER/...` tak cocok layout Coolify); tidak ada sidecar/script/CI; `docker-compose.yml` hanya named volume `db_data`.
- **Dampak:** inquiries pelanggan, subscriber, konten CMS hilang permanen bila disk rusak / `docker compose down -v` / ransomware; tidak pernah ada uji restore.
- **Rekomendasi:** sidecar `pg_dump` harian + rotasi 14 hari di compose, unggah offsite (S3/R2 via rclone), uji restore bulanan; dump pra-migrasi sebelum deploy.

### P1-5 — Tanpa monitoring/healthcheck (downtime tak terdeteksi)
- **Bukti:** Dockerfile tanpa HEALTHCHECK; compose tanpa healthcheck; grep sentry/otel/winston/pino = kosong; crash-loop (mis. migrasi gagal karena DATABASE_URL salah) hanya terlihat sebagai status container di Coolify.
- **Dampak:** situs bisa mati berhari-hari tanpa ada yang tahu; error server action (form leads gagal) tak pernah terlihat.
- **Rekomendasi:** healthcheck container (wget /robots.txt, interval 30s) + uptime monitor eksternal gratis (UptimeRobot/Better Stack, alert email/Telegram) + `/api/health` (ping SELECT 1) untuk healthcheck Coolify; log drain Coolify.

### P1-6 — Port 3000 terekspos publik (live verified)
- **Bukti:** `docker-compose.yml:31-33` `"3000:3000"` tanpa bind; live: `http://72.62.122.241:3000/robots.txt` → HTTP 200.
- **Dampak:** akses plaintext tanpa TLS (form admin/inquiry bisa disniff), dua origin untuk konten sama (SEO), headers/HSTS proxy tak berlaku di jalur ini.
- **Rekomendasi:** `- "127.0.0.1:3000:3000"`; verifikasi mapping domain Coolify tetap jalan (proxy menjangkau via localhost host/jaringan internal).

### P1-7 — framer-motion di bundle global semua halaman
- **Bukti:** chunk 139,8 KB (49 KB gzip) termuat di setiap halaman karena `CartDrawer`/`OfferPopup`/`SiteHeader`(→`SearchOverlay`) di `layout.tsx:3-7` semuanya client + import framer-motion. ~19% dari First Load JS (~230–250 KB gzip).
- **Dampak:** biaya JS + hydrasi untuk animasi yang semuanya transisi satu-tahap (fade/slide/scale).
- **Rekomendasi:** ganti drawer/overlay/modal dengan CSS transition + conditional render (`data-open`); `whileTap` wishlist → CSS `active:scale-125`; Reveal → IntersectionObserver + CSS. framer-motion bisa dihapus total dari dependency; atau minimal `next/dynamic({ ssr:false })` agar chunk load saat pertama dibuka.

### P1-8 — `/shop` & `/kontak` full-dynamic untuk 1 query param
- **Bukti:** build menandai keduanya ƒ Dynamic — `/shop` `await searchParams` untuk `?category=` (`shop/page.tsx:12-21`), `/kontak` `connection()` + searchParams untuk `?service=` (`kontak/page.tsx:15-23`); padahal prefill sudah ditangani client di `ShopClient` via prop.
- **Dampak:** tiap request render ulang server-side di VPS 1-core (±50–150 ms + CPU), padahal data sudah ter-cache.
- **Rekomendasi:** jadikan static shell; baca query param di client (`useSearchParams` di ShopClient/inquiry-form). TTFB → hit cache ~10–20 ms.

### P1-9 — Nol foreign key & nol index sekunder (10 tabel)
- **Bukti:** `drizzle/meta/0003_snapshot.json` → `indexes: []`, `foreignKeys: []` untuk semua tabel; `products.category_slug` text tanpa FK; `drop_products` tanpa FK/unique (dedupe manual di `data.ts:216-221` membuktikan bug duplikasi pernah terjadi).
- **Dampak:** integritas referensi diserahkan ke aplikasi (produk bisa menunjuk kategori hilang; relasi drop bisa dobel); semua `WHERE is_active ORDER BY sort_order` seq-scan — nyaman di 31 baris, tidak di ratusan-ribuan.
- **Rekomendasi:** migration 0004 (via `db:generate`, bukan psql manual):
  ```sql
  ALTER TABLE products ADD CONSTRAINT products_category_fk FOREIGN KEY (category_slug) REFERENCES product_categories(slug) ON UPDATE CASCADE ON DELETE RESTRICT;
  ALTER TABLE drop_products ADD CONSTRAINT dp_drop_fk FOREIGN KEY (drop_slug) REFERENCES drops(slug) ON DELETE CASCADE;
  ALTER TABLE drop_products ADD CONSTRAINT dp_product_fk FOREIGN KEY (product_slug) REFERENCES products(slug) ON DELETE CASCADE;
  CREATE UNIQUE INDEX dp_pair_unique ON drop_products (drop_slug, product_slug);
  CREATE INDEX products_active_sort_idx ON products (is_active, sort_order);
  CREATE INDEX inquiries_created_desc_idx ON inquiries (created_at DESC);
  CREATE INDEX newsletter_created_desc_idx ON newsletter_subscribers (created_at DESC);
  ```

### P1-10 — Workflow migrasi ganda tanpa guard drift
- **Bukti:** `package.json` `db:push` (dev) & `db:migrate` (prod) berdampingan; `drizzle/0002_expand_product_catalog.sql` berisi INSERT tulisan tangan (drizzle-kit tak pernah menghasilkan INSERT); skema hari ini kebetulan sinkron.
- **Dampak:** begitu `schema.ts` diubah lalu di-push ke dev tanpa `db:generate`, folder migrasi tertinggal → prod jalan migrasi lama → query error → ditelan catch → **situs produksi diam-diam tampil fallback demo** (menular dari P2-4).
- **Rekomendasi:** jadikan `drizzle/` sumber kebenaran (hapus `db:push` dari workflow; `db:generate && db:migrate`); pisahkan data-migration 0002; CI jalankan `drizzle-kit check` + migrate terhadap DB ephemeral; tambahkan `/api/health`.

### P1-11 — Dialog tanpa focus trap/aria-modal/return focus
- **Bukti:** `search-overlay.tsx:88-96`, `cart-drawer.tsx:31-38`, `offer-popup.tsx:41-48`, `currency-modal.tsx:58-66`, menu mobile `site-header.tsx:119-147` — tidak ada `aria-modal`, tidak ada trap, fokus tak dikembalikan ke trigger.
- **Dampak:** keyboard user bisa Tab ke konten di belakang backdrop ("tombol hantu"); screen reader membaca konten di luar dialog.
- **Rekomendasi:** satu hook `useModalDialog(open, onClose)` (aria-modal + trap Tab + simpan/restore fokus + scroll lock), terapkan ke 5 komponen.

### P1-12 — Modal tak bisa ditutup Escape (inkonsisten)
- **Bukti:** cart-drawer & offer-popup & menu mobile tanpa keydown Escape; search-overlay:45-53 dan currency-modal:25-32 punya — search-overlay bahkan menjanjikan "Tekan ESC untuk menutup".
- **Rekomendasi:** masukkan Escape ke hook P1-11 agar seragam.

---

## 6. ROADMAP REMEDIASI BERBOBOT

### Sprint 0 — Tutup lubang langsung (± 1 hari, sebagian besar 1-edit)
| # | Aksi | Menutup | Effort |
|---|------|---------|--------|
| 0.1 | `next/image` di ProductCard, galeri detail, drops, rail hero (+ sizes) | P0-1 | ½ hari |
| 0.2 | `next.config.ts`: security headers + `poweredByHeader: false` + `remotePatterns: []` + `maximumRedirects: 0` | P1-1, P1-3, P3-29 | 15 menit |
| 0.3 | compose: `127.0.0.1:3000:3000` | P1-6 | 1 baris |
| 0.4 | Escape JSON-LD: `.replace(/</g, "\\u003c")` di `page.tsx:52` | P2-2 | 1 baris |
| 0.5 | Rate limit login (in-memory, 5 gagal/15 menit) | P1-2 | 1 jam |
| 0.6 | H1 kontak (`as="h1"`) + filter `isActive` di getProductBySlug/getDropBySlug | P2-12, P3-1 | 15 menit |
| 0.7 | Hapus `hero-v2.png` 2,2 MB | P3-7 | 1 menit |
| 0.8 | Healthcheck compose + `/api/health` + uptime monitor eksternal | P1-5 | 1 jam |
| 0.9 | Sidecar backup pg_dump harian + rotasi (+ uji restore sekali) | P1-4 | ½ hari |

### Sprint 1 — Reliabilitas aplikasi & data (± 1 minggu)
| # | Aksi | Menutup |
|---|------|---------|
| 1.1 | Rate limit API publik POST (per-IP, 5/menit) + fix honeypot newsletter dead-branch | P2-3, P3-12 |
| 1.2 | Fallback logging + pisahkan "DB down" vs "katalog kosong" + banner admin saat fallback | P2-4, P2-22 (data.ts) |
| 1.3 | Migration 0004: FK + unique drop_products + index | P1-9, P3-11, P3-18 |
| 1.4 | Workflow migrasi tunggal (hapus db:push; drizzle/ = sumber kebenaran; pisah 0002 data) | P1-10 |
| 1.5 | `seedContent` dibungkus transaksi + bootstrap fresh=1 wajib konfirmasi | P2-5 |
| 1.6 | Newsletter: kolom unsubscribed_at + endpoint unsubscribe + unique lower(email) + guard CSV formula | P2-6, P3-2 |
| 1.7 | CI GitHub Actions: `npm ci && lint && tsc --noEmit && build && check:prod` | P2-24 |

### Sprint 2 — Performa & keandalan (± 1–2 minggu)
| # | Aksi | Menutup |
|---|------|---------|
| 2.1 | Ganti framer-motion → CSS (drawer/overlay/modal/Reveal) atau dynamic-import | P1-7 |
| 2.2 | Static shell /shop & /kontak (useSearchParams di client) + loading.tsx | P1-8, P2-9 |
| 2.3 | Sesi admin revocable: token acak server-side + timingSafeEqual + rotasi per login | P2-1, P3-6 |
| 2.4 | Retensi PII: cron purge inquiry done/closed > 24 bulan + pagination admin + export inquiries | P2-7, P3-5 |
| 2.5 | Rewrite DEPLOYMENT.md ke realita Coolify + bagian Rollback | P2-23, P3-16, P3-32 |
| 2.6 | Sentry (atau log drain + alert) | P2-26, P3-33 |
| 2.7 | Error handling: zod schema admin + transaksi upsert settings + console.error sebelum redirect error | P2-22, P3-13 |

### Sprint 3 — Polesan & kepatuhan (backlog)
| # | Aksi | Menutup |
|---|------|---------|
| 3.1 | A11y: hook modal (P1-11/12 bila belum), kontras muted → #8f8f8f, skip link, role="alert" form, stretched-link wishlist, reduced-motion penuh (MotionConfig + marquee) | P1-11/12, P2-16..19, P3-22..25 |
| 3.2 | SEO: JSON-LD Product/Offer di detail + BreadcrumbList + Organization; canonical; sitemap lastmod dari DB updatedAt; OG per produk; manifest | P2-13..15, P3-19..21 |
| 3.3 | Refactor: pecah admin monolit per domain, PageShell/Container, hapus dead code (Marquee dll), ekstrak konstanta (header-h, USD_RATE, SIZE_CHART, WA) | P2-20, P3-26..28, P3-34 |
| 3.4 | Test pertama: vitest (validations, stores, formatPrice) + Playwright (submit inquiry, add-to-cart) + prettier/husky | P2-21 |
| 3.5 | cacheLife("days") untuk konten (updateTag tetap jalan) + toCardProduct projection + cache /api/products | P3-8, P2-10, P2-11, P3-17 |
| 3.6 | Docker/ops halus: mem_limit + init:true + logging rotation + NODE_OPTIONS heap + pin base image + brotli di proxy + logo sizes/SVG | P3-9, P3-30, P3-31, P2-8, P3-1 |
| 3.7 | Zero-downtime: CI build image → GHCR → `pull && up -d` (rollback = tag image) | P2-25 |

---

## 7. YANG SUDAH SOLID (jangan diubah)

- **Guard admin menyeluruh:** 16/16 server action auth-guarded sebagai statement pertama (tidak ada partial write); route admin API fail-closed 401; bootstrap POST-only; ganti `ADMIN_PASSWORD` otomatis mencabut semua sesi.
- **Secrets bersih:** tidak ada `.env*` pernah ter-commit (git log diperiksa); grep menyeluruh nol hardcoded credential; compose fail-fast `${VAR:?}`.
- **SQL injection nol:** semua query drizzle parameterized; nol string-concat ke SQL.
- **Keamanan form publik:** zod server + honeypot + dedupe `onConflictDoNothing`; error generik tanpa bocor stack; fallback pesan 503 Indonesia + CTA WhatsApp.
- **Arsitektur cache benar:** `"use cache"` + cacheLife + cacheTag konsisten di semua getter; invalidasi event-driven `updateTag` per tag dari admin; build sukses tanpa DB (lazy client).
- **Build & bundle terukur:** 23 route, 60 halaman statis, ~230–250 KB gzip First Load (setelah framer-motion diatasi bisa < 200 KB); hero LCP sudah `next/image` + priority + sizes benar; fonts next/font self-hosted.
- **Stores bebas bug hidrasi:** cart/currency/wishlist via useSyncExternalStore snapshot stabil; nol Tailwind class dinamis.
- **Deploy base rapi:** Dockerfile multi-stage + non-root + layer cache benar; COPY manual drizzle-orm/postgres/scripts **tetap diperlukan** di Next 16.4.5 (komentar Dockerfile akurat); named volume `db_data` bertahan redeploy; env-guard password lemah; TTFB live 60 ms.
- **SEO fondasi:** metadataBase benar, title/description unik 12 halaman, sitemap runtime live-verified, robots disallow /admin & /api, lang="id", OG 1200×630, h1 tunggal di 8 dari 9 halaman utama.
- **A11y baseline:** semua icon-button ber-aria-label, semua img ber-alt, label form + autocomplete, newsletter sudah role="alert" + aria-describedby, wishlist aria-pressed, nol div-onClick.

---

## 8. CATATAN METODE & BATASAN

- Audit read-only; `npm run build` dijalankan untuk pengukuran (sukses, 0 warning); `npm run lint` & `tsc --noEmit` bersih.
- Live check dibatasi 11 request publik (tanpa login attempt, tanpa brute-force).
- Temuan keamanan diuji secara pasif — tidak ada eksploitasi aktif terhadap produksi.
- Angka transfer P0-1 adalah estimasi dari ukuran file × jumlah kartu × perilaku eager `<img>`; verifikasi ulang setelah fix dengan DevTools/analitik.

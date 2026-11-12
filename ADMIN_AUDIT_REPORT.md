# ADMIN_AUDIT_REPORT.md — Audit Dashboard Admin RPMX

> **Laporan audit** — 12 November 2026
> Metode: analisis statis seluruh kode admin (page, actions, lib, API, validasi, schema DB),
> pemeriksaan konfigurasi (robots, sitemap, next.config, env), query langsung ke PostgreSQL,
> dan smoke test live via dev server (`/admin`, `/robots.txt`, `/sitemap.xml`).
> Verifikasi end-to-end sebelumnya (10 Nov): login + update status terkonfirmasi di DB.

---

## 1. CAKUPAN YANG DIAUDIT

| File | Peran |
|---|---|
| `src/app/admin/page.tsx` (300 baris) | Login + dashboard inquiry (server component) |
| `src/app/admin/actions.ts` | Server actions: login, logout, update status |
| `src/lib/admin.ts` | Konstanta cookie + generator token |
| `src/app/api/inquiries/route.ts` | Endpoint publik penerimaan inquiry |
| `src/lib/validations.ts` | Skema zod untuk inquiry |
| `src/db/schema.ts` | Tabel `inquiries` |
| `src/app/robots.ts` · `sitemap.ts` · `next.config.ts` | Konfigurasi eksposur & runtime |

Kondisi DB saat audit: **2 inquiry** (1 `new`, 1 `contacted` — data demo).
Dev server: **jalan di :3000** sejak sesi audit ini.

---

## 2. YANG SUDAH BAIK — TERVERIFIKASI

1. **Autentikasi dasar solid untuk skala saat ini.** Cookie `rpmx_admin`: `httpOnly` ✅,
   `sameSite: lax` ✅, `secure` di produksi ✅, `maxAge` 7 hari ✅. Token = SHA-256
   deterministik atas password → **ganti password otomatis membatalkan semua sesi lama**
   (properti bagus, tanpa session store).
2. **Semua mutasi ter-guard.** `updateStatusAction` cek `isAuthenticated()` sebelum sentuh DB.
   Login/logout tidak butuh guard (set/delete cookie sendiri).
3. **Validasi input ketat di dua lapis.** API publik: zod (nama 2–100, pola telepon, email
   opsional, pesan 10–2000, honeypot `website`). Server action: whitelist status inquiry +
   validasi `id` integer positif. Render defensif: status tak dikenal → fallback `"new"`.
4. **Anti-spam honeypot ter-wiring penuh** (field `website` tersembunyi di form kontak → API
   membalas `ok: true` palsu tanpa menyimpan).
5. **Eksposur bersih.** `robots.txt`: `Disallow: /admin` dan `/api` ✅ (diverifikasi live);
   `sitemap.xml` tanpa admin ✅; `metadata.robots: noindex` di page ✅.
6. **Resiliensi render.** `try/catch` DB → Notice; `ADMIN_PASSWORD`/`DATABASE_URL` absen →
   Notice yang jelas (bukan crash). `export const instant = false` benar untuk halaman cookie.
7. **UX operasional dasar bagus.** Deep link `tel:` dengan normalisasi `0` → `+62`, link
   WhatsApp dengan strip non-digit, waktu `Asia/Jakarta`, `aria-label` per select, badge
   status warna fungsional (merah/sky/violet/emerald), empty state, counter total + belum
   ditindaklanjuti, fix `pt-[104px]` konten vs header fixed.
8. **CSRF dasar tercakup** oleh proteksi Origin/Host bawaan Next.js untuk Server Actions;
   endpoint API JSON tanpa CORS header → tidak bisa dibaca/di-POST lintas origin dari browser.

---

## 3. TEMUAN

### 🔧 PERBAIKAN TAMBAHAN — ditemukan saat uji fungsional end-to-end (12 Nov 2026)

**F1 — Dashboard tidak memperbarui setelah Simpan status.** Uji live mengungkap:
klik Simpan → **DB berubah tapi UI tetap menampilkan status lama** (counter & badge
basi sampai reload manual) — `updateStatusAction` tidak memanggil `revalidatePath`.
Verifikasi awal (10 Nov) hanya mengonfirmasi DB, bukan refresh UI.

> ✅ **FIXED 12 Nov 2026** — dua lapis:
> 1. `revalidatePath("/admin")` di akhir `updateStatusAction` → badge & counter
>    langsung berubah tanpa reload (teruji 2 putaran Baru→Dihubungi→Baru).
> 2. `key={status}` pada `<select>` → dropdown ikut sinkron dengan server setelah
>    re-render (sebelumnya select uncontrolled bernilai `defaultValue` tidak di-reset
>    saat re-render dan sempat menampilkan nilai basi).

### 🔴 HIGH

**H1 — Password salah: tidak ada feedback sama sekali.**
`loginAction` me-redirect ke `/admin?error=1` saat password salah, tetapi
`page.tsx` **tidak pernah membaca `searchParams`** — parameter itu mati. Pengguna salah
password hanya melihat form yang sama ter-reset, tanpa pesan apa pun. Fix kecil namun
dampak UX langsung setiap kali terjadi salah ketik.

> ✅ **FIXED 12 Nov 2026** — `page.tsx` kini membaca `searchParams` (`PageProps<"/admin">`)
> dan menampilkan kotak error `role="alert"` "Password salah — coba lagi" di form login.
> Terverifikasi live: `/admin?error=1` 200 + pesan tampil; `/admin` tanpa pesan.

**H2 — Password produksi masih lemah + tanpa env-guard.**
Password dev = `admin123` (satu karakter brute-force dari akses penuh data PII inquiry:
nama, telepon, email). CODEX_COMMANDS **TASK E** (env-guard password lemah untuk produksi)
belum dieksekusi. Kombinasi H2 + M1 (tanpa rate limit) = skenario kompromi paling realistis
situs ini.

> ✅ **FIXED 12 Nov 2026** — TASK E dieksekusi penuh: `src/lib/env-check.ts`
> (`validateProdEnv()` di `loginAction` + `adminPasswordProblem()` mengunci dashboard dengan
> Notice "Admin dikunci" di produksi bila password kosong/`admin123`/`changeme`/<8 karakter),
> `scripts/check-prod.mjs` + `npm run check:prod` (3 skenario teruji: dev skip, lemah exit 1,
> kuat exit 0), `.env.production.example`, `.gitignore` `!.env.production.example`.
> Password produksi sendiri masih tugas user saat deploy (lihat §5 #2).

### 🟠 MEDIUM

**M1 — Tanpa rate limiting** pada login (brute force) dan `POST /api/inquiries` (spam DB
melewati honeypot bot yang cerdas). Catatan "rate-limit Nginx" sudah ada di roadmap lama
tapi belum diterapkan.

**M2 — Dashboard tanpa pagination/filter/pencarian.** Query `limit(200)` **senyap**:
inquiry ke-201+ tak terlihat dan counter menampilkan angka yang menyesatkan. Tidak ada
filter per status — saat volume naik, mencari inquiry `new` di antara ratusan baris manual.

**M3 — Token cookie statis + perbandingan tidak timing-safe.** Token = SHA-256 tanpa
secret per-deployment, dibandingkan dengan `===`. Risiko aktual rendah (butuh kebocoran
cookie dulu), tapi hardening-nya murah: HMAC dengan secret terpisah + `timingSafeEqual`.

**M4 — Tidak ada notifikasi inquiry baru.** Admin harus membuka `/admin` secara manual
untuk tahu ada calon pelanggan menunggu — untuk bisnis dengan lead time respons yang
menentukan closing, ini kebocoran nilai operasional.

### 🟡 LOW

- **L1** — Tidak ada aksi hapus/arsip inquiry, tidak ada kolom catatan internal (riwayat
  tindak lanjut per inquiry hilang setelah status berubah).
- **L2** — Tidak ada ekspor CSV (berguna untuk penawaran/arsip).
- **L3** — `updateStatusAction` senyap pada input invalid (acceptable, tapi tak ada log).
- **L4** — Header keamanan HTTP global (CSP, X-Frame-Options, HSTS, Referrer-Policy) belum
  diset di mana pun — paling tepat di Nginx sesuai DEPLOYMENT.md.

---

## 4. GAP FUNGSIONAL (roadmap, bukan bug)

| Kapabilitas | Status |
|---|---|
| Kelola status inquiry | ✅ Ada |
| Editor produk CRUD (Codex **TASK C**) | ❌ Belum — katalog masih dikelola via SQL |
| Editor testimoni & drop (TASK D) | ❌ Belum |
| Rekap statistik (per status, 7 hari terakhir) | ❌ Belum (nice to have) |
| Notifikasi inquiry baru | ❌ Belum (= M4) |

---

## 5. REKOMENDASI (urutan eksekusi)

| # | Aksi | Efort | Prioritas |
|---|---|---|---|
| 1 | ✅ **Fix H1**: baca `searchParams` di `page.tsx`, tampilkan pesan "Password salah — coba lagi" saat `error=1` — **selesai 12 Nov** | <30 mnt | Sekarang |
| 2 | ✅ **Env-guard (TASK E)**: produksi dengan `ADMIN_PASSWORD` lemah/absen → gagal cepat + log; dokumentasi password kuat — **selesai 12 Nov** | <30 mnt | Sekarang |
| 3 | **Rate limit** POST `/api/inquiries` + `/admin` — paling murah via `limit_req` Nginx saat deploy; alternatif middleware in-memory untuk dev | 1–2 jt | Sebelum go-live |
| 4 | **Pagination + filter status + pencarian nama/telepon** (sekaligus hilangkan truncation senyap) | 1–2 jt | Sebelum volume naik |
| 5 | **Hardening token**: HMAC dengan secret env terpisah + `timingSafeEqual` | 30 mnt | Opsional |
| 6 | **Editor produk admin (TASK C)** — nilai praktis admin naik drastis, katalog tak lagi via SQL | ½–1 hari | Sesuai roadmap |
| 7 | Notifikasi inquiry baru (email via Resend/SMTP, atau deep-link WA) | ½ hari | Opsional |
| 8 | Hapus/arsip inquiry + catatan internal, ekspor CSV, security headers Nginx | per item | Opsional |

**Prinsip yang dipertahankan:** jangan menambah kompleksitas auth (session store, 2FA)
sebelum situs live — guard saat ini sudah proporsional untuk satu admin; fokuskan effort
ke H1/H2/M1 yang menutup celah nyata, lalu editor produk yang menambah nilai.

---

## 6. VERIFIKASI LIVE (11–12 Nov 2026)

```
GET /admin           → 200, form "Login Admin RPMX" ter-render ✅
GET /robots.txt      → Disallow: /admin, /api ✅
GET /sitemap.xml     → 0 kemunculan "admin" ✅
DB inquiries         → 2 baris (1 new, 1 contacted) ✅
GET /admin?error=1   → 200 + pesan "Password salah — coba lagi" ✅ (fix H1)
GET /admin           → tanpa pesan error ✅ (regresi tidak ada)
npm run check:prod   → dev skip / lemah exit 1 / kuat exit 0 ✅ (TASK E)
lint + build         → bersih ✅ (12 Nov 2026)

Uji fungsional end-to-end via browser (12 Nov 2026):
Logout               → kembali ke form login ✅
Login password salah → redirect ?error=1 + kotak error tampil ✅ (screenshot)
Login admin123       → dashboard, tanpa kebocoran pesan error ✅
Update status (×2)   → DB terubah + badge/counter/dropdown sinkron tanpa reload ✅ (fix F1)
Data demo            → dikembalikan ke kondisi awal (Budi contacted, Sari new) ✅
```

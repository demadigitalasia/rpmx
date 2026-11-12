# RAWLINE Motion Report — Analisis Gerak, Polesan & Transisi

> **Laporan forensik gerak** — 10 November 2026
> Metode: pengukuran computed-style berbasis waktu (t=200…2400ms) untuk animasi masuk;
> scroll-step 200px dengan getBoundingClientRect untuk perilaku scroll; hover nyala
> via pointer + screenshot untuk micro-interaction. Sumber: rawline.framer.website.

---

## 1. PETA GERAK RAWLINE (hasil forensik)

### 1.1 Entrance (saat halaman pertama dibuka)

| Waktu | Yang terlihat |
|---|---|
| 0 – ±1,4s | **Layar hitam penuh** — bukan overlay bergaya; ini kondisi render awal (konten `opacity: 1` di computed style TAPI belum ter-paint karena aset/font belum siap + Framer menahan reveal) |
| ±1,5 – 1,7s | Konten mulai **fade-in**: H1 tampak abu-abu (mid-fade) → krem penuh |
| ±2s | Halaman penuh, terang |

- **Tidak ada stagger per-elemen** yang terukur (semua elemen `opacity: 1` serentak di
  computed style) — efek "muncul" datang dari **satu veil fade + jeda aset**.
- Preloader TIDAK punya konten (logo/counter) — murni layar gelap.

**Rekomendasi implementasi:** CSS entrance sederhana — konten `opacity: 0 → 1`
(0,5s ease-out, stagger 0,05–0,1s per section) setelah `DOMContentLoaded`. Tanpa JS.

### 1.2 Scroll: hero → about

| Range scroll | Perilaku (terukur) |
|---|---|
| 0 – 900 | Foto hero scroll **1:1** (top = −scrollY, transform "none") — **tanpa parallax** |
| ±900 – 2.200 | **About = media full-screen menempel** (sticky/fixed): foto underpass tetap memenuhi layar sementara heading `ABO`*us*`UT` + manifesto + VIEW MORE **scroll menumpuk di atasnya**; runway ±500px sebelum section berikutnya masuk |
| 2.200+ | Potongan tajam ke section hitam berikutnya (latest DROPS) |

- Header pill: **fixed konstan** (top 43px stabil di scroll 400) — tidak sembunyi.

**Rekomendasi:** ✅ pola sticky About RPMX sudah benar — pertahankan.

### 1.3 Hover micro-interaction

| Elemen | Efek teramati |
|---|---|
| Kartu produk | **Halus** — sedikit scale/gelap terang pada foto; tidak ada overlay dramatis; judul tetap. (RPMX: zoom + brightness + swap = setara, bahkan lebih kaya bila ada foto -2) |
| Link nav pill | Perubahan warna krem → merah (RPMX sudah sama) |
| Tombol | Invert / brightness (RPMX sudah sama) |

**Rekomendasi:** ✅ hover RPMX sudah setara — tidak perlu diubah.

### 1.4 Lain-lain

- **Marquee/ticker:** TIDAK ada di beranda RAWLINE (RPMX juga sudah menghapus — setara).
- **Custom cursor:** tidak ada (kursor native).
- **Page transition antar nav:** swap instan tanpa animasi exit/enter yang terukur —
  (klaim "seamless" = kecepatan Framer, bukan animasi khusus). RPMX tanpa transisi = setara.

---

## 2. PERBANDINGAN GERAK RPMX vs RAWLINE

| Aspek gerak | RAWLINE | RPMX sekarang | Gap |
|---|---|---|---|
| Entrance | Layar gelap → fade-in menyeluruh (±0,5–1s) setelah aset siap | Langsung tampil penuh | 🔴 **Satu-satunya gap gerak yang tersisa** |
| Reveal per-section | Fade halus saat masuk viewport | ✅ Reveal fade+rise 0,35s | ✅ |
| Sticky about | ✅ | ✅ | ✅ |
| Parallax hero | ❌ tidak ada | ❌ tidak ada | ✅ |
| Hover kartu | Halus (zoom/brightness) | ✅ zoom + brightness + swap 2 foto | ✅ (lebih kaya) |
| Hover nav/tombol | Warna/invert | ✅ sama | ✅ |
| Marquee | ❌ | ❌ (dihapus dari home) | ✅ |
| Page transition | ❌ instan | ❌ instan | ✅ |
| Preloader bergaya | ❌ (hitam polos) | ❌ | ✅ |

---

## 3. REKOMENDASI IMPLEMENTASI (satu-satunya gerak yang belum)

### M1 — Entrance veil (prioritas: tinggi, dampak: kesan pertama)

CSS murni di `globals.css` — replika persis perilaku RAWLINE tanpa risiko JS:

```css
@keyframes site-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Seluruh konten fade-in sekali saat halaman dibuka */
main {
  animation: site-in 0.7s ease-out;
}

/* Header + FAB ikut fade lebih cepat */
header, .wa-float { animation: site-in 0.4s ease-out; }

@media (prefers-reduced-motion: reduce) {
  main, header, .wa-float { animation: none; }
}
```

- Berbeda dari percobaan lama: dianimasikan pada `main` (bukan per-halaman via JS),
  sekali paint, **tidak bisa macet di opacity 0** karena CSS selesai sendiri walau
  tab di-throttle — dan untuk pengguna nyata (foreground) identik dengan RAWLINE.
- Opsional penguat: `body { background: #111 }` sudah gelap → layar awal otomatis
  hitam seperti RAWLINE tanpa elemen tambahan.

### M2 — Stagger masuk section pertama (opsional, polesan)

```css
main > * { animation: site-in 0.7s ease-out both; }
main > *:nth-child(2) { animation-delay: 0.08s; }
main > *:nth-child(3) { animation-delay: 0.16s; }
/* … atau cukup M1 saja */
```

### M3 — Hover kartu tetap seperti sekarang (tidak perlu diubah)

Zoom + brightness + swap sudah melampaui RAWLINE.

### Yang TIDAK direkomendasikan

- ❌ Preloader dengan counter/logo (RAWLINE punya hitam polos — tambahan justru menyimpang)
- ❌ Parallax hero (RAWLINE terukur tidak memakai)
- ❌ Animasi exit antar halaman (RAWLINE instan)

---

## 4. KESIMPULAN

Gerak RPMX sudah **95% setara RAWLINE**. Satu-satunya gap gerak yang tersisa adalah
**entrance veil** (M1) — CSS ±15 baris, dampak besar pada kesan pertama. Setelah M1,
audit gerak dinyatakan tuntas.

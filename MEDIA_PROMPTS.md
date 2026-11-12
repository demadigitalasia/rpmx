# MEDIA PROMPTS — Paket Prompt Foto/Video RPMX (untuk ChatGPT/DALL·E)

> **Panduan generate media** — 9 November 2026
> Tujuan: mengisi semua slot media gap RAWLINE (lihat `RAWLINE_GAP_ANALYSIS.md`) dengan foto yang konsisten.
> Cara pakai: **salin dulu STYLE BLOCK ke chat**, lalu tempel prompt slot yang mau dibuat. Satu prompt = satu gambar.

---

## 0. STYLE BLOCK — tempel ini dulu di awal chat (sekali saja)

```text
You are helping me create brand photography for "RPMX", an Indonesian custom
jersey & apparel convection brand (streetwear × sportswear). Every image must
follow this art direction:

STYLE BLOCK (apply to every image):
- Cinematic, moody, editorial streetwear photography — like a Nike/Adidas
  lookbook shot in Southeast Asia
- Dark, high-contrast look: deep charcoal backgrounds (#111111), strong
  directional light, deep shadows
- IMPORTANT: keep the SUBJECT clearly visible and well-lit — brighter key
  light on the garment/person, strong subject-background separation. The
  background stays dark, but the subject itself must never disappear into
  the shadows (no dark-on-dark)
- Color palette: black, off-white/cream, and ONE strong red accent (#E83030)
  appearing only in small details (jersey trim, socks, light glow)
- Real people (Indonesian / Southeast Asian), candid documentary energy —
  faces mostly turned away, in shadow, or cropped; no direct smiling poses
- Location vibe: Indonesia — futsal courts, small-city streets, workshops,
  underpasses, warm tungsten practical lights mixed with cool dusk
- Photorealistic, shot on 35mm, shallow depth of field, subtle film grain
- NO text, NO logos, NO watermarks anywhere in the image (plain fabric only)
- NO cartoon, NO 3D render, NO illustration look
```

**Tips penting:**
- Minta rasio sesuai kolom "Ukuran" di tiap slot (ChatGPT: `landscape 3:2`, `portrait 2:3`, dst).
- Wajah sengaja dipalingkan/di-crop → hasil AI lebih natural & aman untuk brand.
- Jersey sengaja polos tanpa teks → logo asli nanti dari produksi nyata (AI jelek menggambar teks).
- Simpan file dengan nama yang saya sebutkan di tiap slot (sudah dipetakan ke kode).
- Prioritas regenerasi saat ini: **14 foto produk (§6)** — foto lama gelap-berlapis
  (audit #4). Kalau hasil masih gelap, tambahkan: `brighter key light, the garment
  must stand out clearly against the dark background`.
- Untuk slot lingkungan (hero/about/drops/social) hasil sebelumnya sudah bagus —
  tidak perlu di-generate ulang kecuali ingin variasi.

---

## 1. HERO SPLIT-SCREEN — foto kiri 70% (slot paling penting)

**Dipakai di:** kolom kiri hero split-screen beranda · **File:** `public/media/hero-split.jpg` · **Ukuran:** portrait lebar (1024×1536, di-crop object-cover)

```text
[STYLE BLOCK]

Editorial fashion group shot: three young Indonesian models standing
frontal, facing the camera with confident neutral expressions, against a
deep maroon/oxblood red painted wall. They wear plain black-and-cream
jerseys and jackets with subtle red trim. Even dramatic studio-style
lighting from above, strong shadows behind them on the red wall, one
holding a football. Full body shot, plenty of wall visible around them.
Portrait orientation, wide framing. No text, no logos.
```

**Catatan:** foto underpass lama (`hero.jpg`) kini dipakai di **section About**
(media full-screen menumpuk) — jangan hapus. Alternatif VIDEO untuk About
(Sora/Runway, 10–15 detik loop):

```text
Slow cinematic shot: young Indonesians in dark streetwear walking toward
the camera through a dim concrete underpass in Indonesia, warm tungsten
light behind them, subtle haze, moody grade with cream highlights, 24fps,
shallow depth of field, seamless loop, no text, no logos.
```

---

## 2. ABOUT — media full-bleed + tombol overlay

**Dipakai di:** section About beranda · **File:** `public/media/about.jpg` · **Ukuran:** landscape lebar (1536×1024)

```text
[STYLE BLOCK]

Documentary photo inside a small Indonesian garment workshop at night:
a tailor operating an industrial sewing machine under a single warm
spotlight, piles of dark fabric and jersey rolls around, red thread spool
in focus in the foreground, everything else falling into deep shadow,
smoke/dust in the light beam. Landscape 3:2.
```

---

## 3. LATEST DROPS — 3 foto editorial (1 full-width + 2 half)

**Dipakai di:** section "latest DROPS" beranda · **File:** `public/media/drop-garuda.jpg`, `drop-ponpes.jpg`, `drop-krb.jpg` · **Ukuran:** full-width = landscape 3:2; dua lainnya boleh 3:2 juga (akan di-crop)

### 3a. Drop Garuda Futsal (full-width)
```text
[STYLE BLOCK]

Night futsal court in a small Indonesian city, wet concrete reflecting
light: one player in a plain dark green jersey with red trim standing alone
in the center holding the ball under his arm, teammates blurred in motion
around him, floodlights flaring from behind, steam rising from the ground.
Landscape 3:2.
```

### 3b. Drop Ponpes Al-Mubarok (half)
```text
[STYLE BLOCK]

Group of Indonesian boarding-school students in plain dark green-and-black
sports uniforms sitting on the steps of a mosque courtyard at dusk,
laughing, shot from behind and to the side so faces are not visible, warm
lantern light, deep shadows. Landscape 3:2.
```

### 3c. Drop Komunitas KRB (half)
```text
[STYLE BLOCK]

Young Indonesian creatives at an underground street event: crowd in plain
black oversized tees facing a small stage with red stage light cutting
through haze, hands raised, shot from the crowd's perspective, motion
blur, gritty concrete walls. Landscape 3:2.
```

---

## 4. KATEGORI — 4 foto masonry (jersey, jaket, kaos, kemeja)

**Dipakai di:** section "kategori SEMUA" beranda · **File:** `public/media/cat-jersey.jpg`, `cat-jaket.jpg`, `cat-kaos.jpg`, `cat-kemeja.jpg` · **Ukuran:** landscape 3:2 (di-crop 4:3 oleh CSS)

### 4a. Jersey
```text
[STYLE BLOCK]

Close-up product story shot: a stack of folded plain sublimated sports
jerseys in black, dark green and crimson on a dark wooden bench, one jersey
draped over the edge showing fabric texture, single dramatic side light,
deep black background. Landscape 3:2.
```

### 4b. Jaket / Hoodie
```text
[STYLE BLOCK]

A heavy black fleece hoodie on an invisible mannequin form, floating
against a deep charcoal wall, dramatic rim light from the left revealing
fabric texture, subtle red zipper pull as the only color accent. Landscape 3:2.
```

### 4c. Kaos
```text
[STYLE BLOCK]

Two Indonesian teenagers in plain black oversized t-shirts standing against
a graffiti-covered concrete wall at night, lit by a red neon sign from the
side (the neon is abstract shapes, no readable text), shot from behind,
candid street energy. Landscape 3:2.
```

### 4d. Kemeja / Polo
```text
[STYLE BLOCK]

Flat-lay of a plain dark flannel shirt and a black polo shirt on a dark
concrete floor with a measuring tape, fabric scissors and red thread
spool arranged neatly beside them, top-down camera, moody workshop
lighting. Landscape 3:2.
```

---

## 5. SOCIAL WALL — 4 foto UGC (selang-seli dengan kartu quote merah)

**Dipakai di:** section SOC*wall* beranda · **File:** `public/media/social-1.jpg` … `social-4.jpg` · **Ukuran:** portrait 2:3 (1024×1536)

### 5a
```text
[STYLE BLOCK]

Candid iPhone-style photo: an Indonesian futsal team huddled in a circle
before a match, plain black-and-red jerseys, gym lights overhead, shot from
inside the huddle, motion and energy, slight grain. Portrait 2:3.
```

### 5b
```text
[STYLE BLOCK]

Candid photo of an Indonesian cyclist in a plain dark cycling jersey
resting on his road bike at dawn on a quiet small-city street, shot from a
low angle, soft orange sunrise light, deep shadows. Portrait 2:3.
```

### 5c
```text
[STYLE BLOCK]

Candid photo of two Indonesian friends in plain black hoodies walking away
down a narrow alley with laundry lines overhead, one glancing back over
his shoulder, late afternoon light raking across the wall. Portrait 2:3.
```

### 5d
```text
[STYLE BLOCK]

Candid photo of an Indonesian office worker in a plain black polo shirt
riding a motorcycle through evening traffic, motion blur on the
background, single red traffic light glowing, documentary energy.
Portrait 2:3.
```

---

## 6. PRODUK — 14 foto flat/garment (paling banyak!)

**Dipakai di:** semua ProductCard, halaman produk (2 foto/produk bagus: #A flat + #B on-model/detail) · **File:** `public/media/product/<slug>-1.jpg` (dan `-2.jpg` bila mau hover swap) · **Ukuran:** portrait 2:3 (1024×1536)

**TEMPLATE (ganti bagian [ ]) — pakai untuk tiap produk:**
```text
[STYLE BLOCK]

E-commerce product shot: [DESKRIPSI PRODUKSI di bawah], displayed on an
invisible mannequin form, floating centered against a deep charcoal
(#1A1A1A) seamless background, soft top light + subtle red rim light from
the right, crisp fabric texture visible, generous empty space around the
garment. Portrait 2:3. No text, no logos.
```

**Daftar per produk (isi [DESKRIPSI PRODUK]):**

| # | slug file | Deskripsi untuk prompt |
|---|---|---|
| 1 | `jersey-futsal-garuda-pro-1` | a short-sleeve futsal jersey, dark green with subtle black geometric side pattern and red collar trim |
| 2 | `jersey-bola-klassio-1` | a short-sleeve football jersey, black with thin vertical pinstripes and red cuff trim |
| 3 | `jersey-basket-court-1` | a reversible basketball jersey, dark charcoal on one tone with red piping |
| 4 | `jersey-voli-smash-1` | a sleeveless volleyball jersey, deep navy with red side panels |
| 5 | `jersey-cycling-aero-1` | a fitted cycling jersey, black with red reflective side stripe, three rear pockets |
| 6 | `hoodie-street-raw-1` | a heavyweight black pullover hoodie, kangaroo pocket, thick drawstrings |
| 7 | `varsity-college-jacket-1` | a varsity jacket, black wool body with black leather sleeves and red ribbed collar |
| 8 | `windbreaker-storm-1` | a lightweight black windbreaker with hidden hood and red half-zip |
| 9 | `kaos-oversize-heavy-cotton-1` | an oversized boxy black t-shirt, drop shoulder, heavy cotton texture |
| 10 | `kaos-longsleeve-basic-1` | a plain black long-sleeve t-shirt, regular fit |
| 11 | `polo-lacerte-corporate-1` | a black piqué polo shirt with two-button placket |
| 12 | `kemeja-flanel-workshop-1` | a dark charcoal-and-black flannel work shirt with chest pocket |
| 13 | `jaket-coach-tapakul-1` | a black coach jacket with snap buttons and small red lining detail |
| 14 | `socks-crew-rpmx-1` | a pair of black crew socks with red heel and toe, folded neatly |

**Foto kedua (opsional, untuk hover swap)** — template:
```text
[STYLE BLOCK]

Detail close-up of the same [GARMENT]: macro shot of the fabric texture and
stitching, red trim detail in frame, dramatic raking light, deep shadows.
Portrait 2:3. No text.
```
Simpan sebagai `<slug>-2.jpg`.

---

## 7. LOOKBOOK DROP — 2 tile per drop (opsional, bisa pakai ulang foto §3)

**Dipakai di:** `/drops/[slug]` section lookbook · **File:** `public/media/lookbook-garuda-1.jpg`, `-2.jpg`, dst. · **Ukuran:** landscape 3:2

Template:
```text
[STYLE BLOCK]

Editorial lookbook shot for a streetwear drop: [VARIASI — mis. "player
tying his shoelaces on the court sideline, others blurred behind" / "team
walking out of the tunnel into the light"], moody cinematic grade, red
accent detail only. Landscape 3:2.
```

---

## 8. WORKSHOP / STOREFRONT

**Dipakai di:** section Stores beranda + halaman tentang · **File:** `public/media/store-workshop.jpg` · **Ukuran:** landscape 3:2

```text
[STYLE BLOCK]

Exterior night shot of a small Indonesian garment workshop storefront:
glass window glowing warm from inside, racks of dark jerseys visible,
red sign glow (abstract, no readable text), quiet street with a parked
motorcycle, light drizzle. Landscape 3:2.
```

---

## 9. CHECKLIST PENEMPATAN FILE

Setelah foto jadi, simpan ke `public/media/…` dengan nama persis di atas.
Struktur akhir yang diharapkan:

```
public/media/
  hero.jpg                about.jpg
  drop-garuda.jpg  drop-ponpes.jpg  drop-krb.jpg
  cat-jersey.jpg  cat-jaket.jpg  cat-kaos.jpg  cat-kemeja.jpg
  social-1.jpg … social-4.jpg
  store-workshop.jpg
  lookbook-garuda-1.jpg … (opsional)
  product/
    jersey-futsal-garuda-pro-1.jpg   (+ -2.jpg opsional)
    jersey-bola-klassio-1.jpg
    … (14 produk)
```

Begitu file tersimpan, beri tahu saya — saya yang wiring-kan ke database
(`images` products, `image_url` drops/gallery) dan aktifkan hover swap.
Total generasi: **±27 foto** (14 produk + 13 slot). Boleh bertahap —
prioritas dulu: **hero → about → 3 drop → 4 kategori** (10 foto) karena
paling terlihat di beranda.

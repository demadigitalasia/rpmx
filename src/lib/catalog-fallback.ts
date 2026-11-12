import type {
  DropRow,
  ProductCategoryRow,
  ProductRow,
} from "@/db/schema";

/**
 * Fallback katalog saat DB belum terisi/terjangkau (spec RAWLINE_DESIGN_SPEC §9).
 * Data = katalog contoh jersey & apparel RPMX; ganti lewat DB/seed.
 */

export const fallbackCategories: ProductCategoryRow[] = [
  { id: 1, slug: "jersey", title: "Jersey", sortOrder: 1, isActive: true },
  { id: 2, slug: "jaket", title: "Jaket & Hoodie", sortOrder: 2, isActive: true },
  { id: 3, slug: "kaos", title: "Kaos", sortOrder: 3, isActive: true },
  { id: 4, slug: "polo", title: "Polo", sortOrder: 4, isActive: true },
  { id: 5, slug: "kemeja", title: "Kemeja", sortOrder: 5, isActive: true },
  { id: 6, slug: "aksesoris", title: "Aksesoris", sortOrder: 6, isActive: true },
];

const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];

export const fallbackProducts: ProductRow[] = [
  { id: 31, slug: "jersey-set-motocross-rpmx", title: "Jersey Set Motocross RPMX", description: "Set jersey lengan panjang dan celana motocross dengan grafis RPMX.", price: 450000, comparePrice: null, categorySlug: "jersey", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Spesifikasi bahan tersedia saat konsultasi", images: [], isNew: true, isOnSale: false, sortOrder: 31, isActive: true },
  { id: 32, slug: "jersey-basket-rpmx", title: "Jersey Basket RPMX", description: "Jersey basket tanpa lengan dengan grafis RPMX.", price: 150000, comparePrice: null, categorySlug: "jersey", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Spesifikasi bahan tersedia saat konsultasi", images: [], isNew: true, isOnSale: false, sortOrder: 32, isActive: true },
  { id: 1, slug: "jersey-futsal-garuda-pro", title: "Jersey Futsal Garuda — Pro Sublimasi", description: "Jersey futsal sublimasi full print, bahan microfiber adem kering cepat, nama & nomor custom per pemain.", price: 185000, comparePrice: 235000, categorySlug: "jersey", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Microfiber dry-fit\n• Cuci manual, jangan disetrika langsung pada print", images: [], isNew: false, isOnSale: true, sortOrder: 1, isActive: true },
  { id: 2, slug: "jersey-bola-klassio", title: "Jersey Bola Klassio — Sublimasi Full", description: "Desain klasik garis vertikal, sublimasi penuh, bebas custom warna tim dan logo sponsor.", price: 199000, comparePrice: null, categorySlug: "jersey", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Microfiber interlock\n• Cuci dengan air dingin", images: [], isNew: true, isOnSale: false, sortOrder: 2, isActive: true },
  { id: 3, slug: "jersey-basket-court", title: "Jersey Basket Court — Reversible", description: "Jersey basket dua sisi (reversible), cocok untuk latihan dan pertandingan resmi.", price: 215000, comparePrice: null, categorySlug: "jersey", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Double-face polyester", images: [], isNew: true, isOnSale: false, sortOrder: 3, isActive: true },
  { id: 4, slug: "jersey-voli-smash", title: "Jersey Voli Smash", description: "Jersey voli ringan dengan sablon vibrasi, nomor punggung awet transparan.", price: 189000, comparePrice: 219000, categorySlug: "jersey", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Microfiber dry-fit", images: [], isNew: false, isOnSale: true, sortOrder: 4, isActive: true },
  { id: 5, slug: "jersey-cycling-aero", title: "Jersey Cycling Aero", description: "Jersey sepeda aerodinamis dengan sisi kantong belakang dan silicone gripper.", price: 249000, comparePrice: null, categorySlug: "jersey", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Lycra aero", images: [], isNew: false, isOnSale: false, sortOrder: 5, isActive: true },
  { id: 6, slug: "hoodie-street-raw", title: "Hoodie Street Raw — Fleece Premium", description: "Hoodie fleece premium 320 gsm, kanguru pocket, bordir logo RPMX di dada.", price: 275000, comparePrice: 320000, categorySlug: "jaket", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Fleece 320gsm\n• Jemur terbalik", images: [], isNew: false, isOnSale: true, sortOrder: 6, isActive: true },
  { id: 7, slug: "varsity-college-jacket", title: "Varsity College Jacket", description: "Jaket varsity wool blend dengan lengan kulit sintetis dan bordir chenille.", price: 385000, comparePrice: null, categorySlug: "jaket", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Dry clean disarankan", images: [], isNew: true, isOnSale: false, sortOrder: 7, isActive: true },
  { id: 8, slug: "windbreaker-storm", title: "Windbreaker Storm", description: "Windbreaker tahan angin & gerimis ringan, packing ringan masuk tas kecil.", price: 299000, comparePrice: null, categorySlug: "jaket", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Water-resistant polyester", images: [], isNew: false, isOnSale: false, sortOrder: 8, isActive: true },
  { id: 9, slug: "kaos-oversize-heavy-cotton", title: "Kaos Oversize Heavy Cotton", description: "Kaos oversize cotton combed 30s heavy weight, sablon plastisol atau DTF.", price: 95000, comparePrice: null, categorySlug: "kaos", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Combed cotton 30s", images: [], isNew: true, isOnSale: false, sortOrder: 9, isActive: true },
  { id: 10, slug: "kaos-longsleeve-basic", title: "Kaos Longsleeve Basic", description: "Longsleeve basic potongan reguler, cocok untuk seragam komunitas dan event.", price: 105000, comparePrice: null, categorySlug: "kaos", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Combed cotton", images: [], isNew: false, isOnSale: false, sortOrder: 10, isActive: true },
  { id: 11, slug: "polo-lacerte-corporate", title: "Polo Lacerte Corporate", description: "Polo shirt pique lacerte untuk seragam kantor dan event perusahaan, minimal order fleksibel.", price: 129000, comparePrice: 155000, categorySlug: "polo", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Pique lacerte", images: [], isNew: false, isOnSale: true, sortOrder: 11, isActive: true },
  { id: 12, slug: "kemeja-flanel-workshop", title: "Kemeja Flanel Workshop", description: "Kemeja flanel potongan workshop, saku dada, jahitan rantai kuat.", price: 149000, comparePrice: null, categorySlug: "kemeja", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Flanel cotton", images: [], isNew: false, isOnSale: false, sortOrder: 12, isActive: true },
  { id: 13, slug: "jaket-coach-tapakul", title: "Jaket Coach Tapakul", description: "Jaket coach klasik dengan lapisan dalam jaring, logo tim depan-dada.", price: 265000, comparePrice: null, categorySlug: "jaket", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Nylon taslan", images: [], isNew: true, isOnSale: false, sortOrder: 13, isActive: true },
  { id: 14, slug: "socks-crew-rpmx", title: "Socks Crew RPMX", description: "Kaos kaki crew dengan jacquard logo RPMX, tersedia satu ukuran.", price: 25000, comparePrice: 35000, categorySlug: "aksesoris", audience: "individu", sizes: ["ALL SIZE"], materialCare: "• Katun spandek", images: [], isNew: false, isOnSale: true, sortOrder: 14, isActive: true },
  { id: 15, slug: "jaket-riding-touring-shell", title: "Jaket Riding Touring Shell", description: "Outerwear custom untuk riding dan perjalanan komunitas, dengan desain panel fungsional serta opsi warna dan grafis sesuai identitas pemesan.", price: 425000, comparePrice: null, categorySlug: "jaket", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Spesifikasi material ditentukan saat konsultasi\n• Ikuti petunjuk perawatan pada label", images: [], isNew: false, isOnSale: false, sortOrder: 15, isActive: true },
  { id: 16, slug: "kaos-classic-combed-24s", title: "Kaos Classic Combed 24s", description: "Kaos regular fit berbahan cotton combed 24s yang nyaman untuk merchandise, komunitas, dan pemakaian harian.", price: 89000, comparePrice: null, categorySlug: "kaos", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Cotton combed 24s\n• Cuci dengan warna sejenis", images: [], isNew: false, isOnSale: false, sortOrder: 16, isActive: true },
  { id: 17, slug: "kaos-oversize-combed-20s", title: "Kaos Oversize Combed 20s", description: "Kaos oversize berbahan cotton combed 20s untuk clothing brand dan komunitas, dapat dipadukan dengan desain sablon custom.", price: 119000, comparePrice: null, categorySlug: "kaos", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Cotton combed 20s\n• Cuci dengan warna sejenis", images: [], isNew: false, isOnSale: false, sortOrder: 17, isActive: true },
  { id: 18, slug: "kaos-raglan-printed", title: "Kaos Raglan Printed", description: "Kaos raglan dengan kombinasi warna badan dan lengan, cocok untuk seragam komunitas dan desain cetak custom.", price: 129000, comparePrice: null, categorySlug: "kaos", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Cotton combed\n• Hindari menyetrika langsung pada area cetak", images: [], isNew: false, isOnSale: false, sortOrder: 18, isActive: true },
  { id: 19, slug: "polo-pique-cotton-classic", title: "Polo Pique Cotton Classic", description: "Polo berkerah berbahan pique cotton dengan siluet klasik untuk kebutuhan harian, komunitas, dan seragam.", price: 139000, comparePrice: null, categorySlug: "polo", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Pique cotton\n• Cuci dengan warna sejenis", images: [], isNew: false, isOnSale: false, sortOrder: 19, isActive: true },
  { id: 20, slug: "polo-sport-mesh", title: "Polo Sport Mesh", description: "Polo bergaya sporty dengan panel mesh untuk kegiatan komunitas dan acara aktif; warna dapat disesuaikan.", price: 149000, comparePrice: null, categorySlug: "polo", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Material mesh pada panel\n• Ikuti petunjuk perawatan pada label", images: [], isNew: false, isOnSale: false, sortOrder: 20, isActive: true },
  { id: 21, slug: "polo-contrast-corporate", title: "Polo Contrast Corporate", description: "Polo dengan detail warna kontras pada kerah dan manset untuk kebutuhan seragam kerja, event, dan identitas perusahaan.", price: 159000, comparePrice: null, categorySlug: "polo", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Pique cotton\n• Cuci dengan warna sejenis", images: [], isNew: false, isOnSale: false, sortOrder: 21, isActive: true },
  { id: 22, slug: "polo-premium-custom", title: "Polo Premium Custom", description: "Polo custom dengan pilihan detail bordir atau cetak untuk clothing brand, organisasi, dan kebutuhan corporate.", price: 179000, comparePrice: null, categorySlug: "polo", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Pilihan material dibahas saat konsultasi\n• Ikuti petunjuk perawatan pada label", images: [], isNew: false, isOnSale: false, sortOrder: 22, isActive: true },
  { id: 23, slug: "kemeja-oxford-office", title: "Kemeja Oxford Office", description: "Kemeja berkerah berbahan oxford untuk seragam kantor, organisasi, dan acara formal kasual.", price: 189000, comparePrice: null, categorySlug: "kemeja", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Kain oxford\n• Setrika suhu sedang", images: [], isNew: false, isOnSale: false, sortOrder: 23, isActive: true },
  { id: 24, slug: "kemeja-drill-utility", title: "Kemeja Drill Utility", description: "Kemeja utility berlengan panjang dengan saku fungsional untuk seragam kerja dan komunitas lapangan.", price: 195000, comparePrice: null, categorySlug: "kemeja", audience: "tim", sizes: APPAREL_SIZES, materialCare: "• Kain drill\n• Cuci dengan warna sejenis", images: [], isNew: false, isOnSale: false, sortOrder: 24, isActive: true },
  { id: 25, slug: "kemeja-chambray-casual", title: "Kemeja Chambray Casual", description: "Kemeja chambray bergaya kasual dengan potongan santai untuk pemakaian harian dan merchandise brand.", price: 185000, comparePrice: null, categorySlug: "kemeja", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Kain chambray\n• Cuci dengan warna sejenis", images: [], isNew: false, isOnSale: false, sortOrder: 25, isActive: true },
  { id: 26, slug: "kemeja-overshirt-twill", title: "Kemeja Overshirt Twill", description: "Overshirt berbahan twill dengan potongan berlapis, cocok untuk gaya kasual, komunitas, dan personalisasi grafis.", price: 225000, comparePrice: null, categorySlug: "kemeja", audience: "individu", sizes: APPAREL_SIZES, materialCare: "• Kain twill\n• Cuci dengan warna sejenis", images: [], isNew: false, isOnSale: false, sortOrder: 26, isActive: true },
  { id: 27, slug: "cap-six-panel-custom", title: "Cap Six Panel Custom", description: "Topi enam panel dengan opsi bordir atau patch untuk identitas komunitas, event, dan clothing brand.", price: 85000, comparePrice: null, categorySlug: "aksesoris", audience: "tim", sizes: ["ALL SIZE"], materialCare: "• Material dan metode dekorasi dapat dipilih\n• Bersihkan sesuai petunjuk label", images: [], isNew: false, isOnSale: false, sortOrder: 27, isActive: true },
  { id: 28, slug: "bucket-hat-canvas", title: "Bucket Hat Canvas", description: "Bucket hat berbahan canvas dengan pilihan warna dan dekorasi custom untuk merchandise serta pemakaian harian.", price: 95000, comparePrice: null, categorySlug: "aksesoris", audience: "individu", sizes: ["ALL SIZE"], materialCare: "• Canvas cotton\n• Cuci manual", images: [], isNew: false, isOnSale: false, sortOrder: 28, isActive: true },
  { id: 29, slug: "tote-bag-canvas-print", title: "Tote Bag Canvas Print", description: "Tote bag canvas untuk merchandise, event, dan kebutuhan harian dengan area cetak yang dapat dipersonalisasi.", price: 79000, comparePrice: null, categorySlug: "aksesoris", audience: "individu", sizes: ["ALL SIZE"], materialCare: "• Canvas cotton\n• Cuci manual", images: [], isNew: false, isOnSale: false, sortOrder: 29, isActive: true },
  { id: 30, slug: "headband-performance-rpmx", title: "Headband Performance RPMX", description: "Headband ringan untuk kegiatan olahraga dan komunitas, dengan opsi warna serta identitas tim custom.", price: 39000, comparePrice: null, categorySlug: "aksesoris", audience: "tim", sizes: ["ALL SIZE"], materialCare: "• Bahan elastis\n• Cuci manual", images: [], isNew: false, isOnSale: false, sortOrder: 30, isActive: true },
];

export const fallbackDrops: DropRow[] = [
  { id: 1, slug: "rpmx-x-garuda-futsal", title: "RPMX × Garuda Futsal", description: "Jersey kompetisi untuk tim futsal — full sublimasi dengan nama dan nomor pemain.", story: "Desain jersey memadukan motif sayap dan garis tegas untuk identitas tim di lapangan.", imageUrl: null, sortOrder: 1, isActive: true },
  { id: 2, slug: "rpmx-x-ponpes-almubarok", title: "RPMX × Ponpes Al-Mubarok", description: "Seragam olahraga santri — kaos daleman, celana, dan jaket coach dalam satu paket.", story: "Paket tim lengkap 120 pcs untuk kegiatan pekanan. Warna hijau tua dipilih santri sendiri lewat voting.", imageUrl: null, sortOrder: 2, isActive: true },
  { id: 3, slug: "rpmx-x-komunitas-krb", title: "RPMX × Komunitas KRB", description: "Kaos event tahunan komunitas kreatif Kota Tasik — sablon DTF edisi terbatas 100 pcs.", story: "Drop perdananya habis dalam seminggu. Desain dibuat bareng ilustrator lokal.", imageUrl: null, sortOrder: 3, isActive: true },
  { id: 4, slug: "rpmx-x-cycling-tasinggal", title: "RPMX × Cycling Tasinggal", description: "Jersey sepeda klub Gowes Tasik — aero cut, kantong belakang, reflektor malam.", story: "Desain jersey mengutamakan kenyamanan dan visibilitas untuk aktivitas bersepeda.", imageUrl: null, sortOrder: 4, isActive: true },
];

/** Produk anggota tiap drop (dipakai seed & fallback data). */
export const DROP_PRODUCT_SLUGS: Record<string, string[]> = {
  "rpmx-x-garuda-futsal": [
    "jersey-futsal-garuda-pro",
    "jersey-bola-klassio",
    "socks-crew-rpmx",
  ],
  "rpmx-x-ponpes-almubarok": [
    "kaos-longsleeve-basic",
    "jaket-coach-tapakul",
    "kaos-oversize-heavy-cotton",
  ],
  "rpmx-x-komunitas-krb": [
    "kaos-oversize-heavy-cotton",
    "hoodie-street-raw",
    "socks-crew-rpmx",
  ],
  "rpmx-x-cycling-tasinggal": ["jersey-cycling-aero", "windbreaker-storm"],
};

/**
 * Wiring media lokal (public/media) yang di-generate AI — dipetakan otomatis
 * ke fallback agar seed & fallback sama-sama punya foto.
 * Foto produk: -1 utama, -2 detail (hover swap) — dideteksi dari file yang ada.
 */
import { existsSync } from "node:fs";
import path from "node:path";

const DROP_MEDIA: Record<string, string> = {
  "rpmx-x-garuda-futsal": "/media/drop-garuda-streetwear.jpg",
  "rpmx-x-ponpes-almubarok": "/media/drop-ponpes-streetwear.jpg",
  "rpmx-x-komunitas-krb": "/media/drop-krb-streetwear.jpg",
};

for (const p of fallbackProducts) {
  // Desain baru memiliki foto utama sendiri tanpa foto hover dari desain lama.
  if (p.slug === "jersey-futsal-garuda-pro" || p.slug === "jersey-voli-smash") {
    p.images = [`/media/product/${p.slug}-v2-1.jpg`];
    continue;
  }
  p.images = [1, 2]
    .map((n) => `/media/product/${p.slug}-${n}.jpg`)
    .filter((f) => existsSync(path.join(process.cwd(), "public", f)));
}
for (const d of fallbackDrops) {
  if (DROP_MEDIA[d.slug]) d.imageUrl = DROP_MEDIA[d.slug];
}

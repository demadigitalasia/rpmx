import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { loadEnv } from "../../scripts/env.mjs";
import {
  dropProducts,
  drops,
  galleryItems,
  productCategories,
  products,
  services,
  testimonials,
} from "./schema";

import {
  DROP_PRODUCT_SLUGS,
  fallbackCategories,
  fallbackDrops,
  fallbackProducts,
} from "@/lib/catalog-fallback";

loadEnv();

/**
 * Seed konten awal RPMX ke PostgreSQL.
 * Jalankan setelah schema tersinkron:
 *   npm run db:push   (dev, tanpa migrasi)
 *   npm run db:seed
 *
 * Idempotent (N1): tabel konten HANYA diisi bila kosong — hasil edit di /admin
 * tidak ditimpa. Timpa paksa: npm run db:seed -- --fresh
 * Data inquiry TIDAK disentuh.
 */

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL tidak diset — salin .env.example ke .env.local dulu.");
    process.exit(1);
  }

  const client = postgres(url, { max: 1 });
  const db = drizzle(client);

  // N1 (ADMIN_CMS_REPORT): tabel konten hanya diisi bila kosong — hasil edit
  // di /admin TIDAK ditimpa. Timpa paksa: npm run db:seed -- --fresh
  const fresh = process.argv.includes("--fresh");

  async function shouldFill(
    table: Parameters<typeof db.delete>[0],
    label: string,
  ): Promise<boolean> {
    const [row] = await db
      .select({ n: sql<number>`count(*)` })
      .from(table);
    const empty = Number(row?.n ?? 0) === 0;
    if (!empty && !fresh) {
      console.log(`— ${label} dilewati (sudah ada data; pakai --fresh untuk menimpa).`);
      return false;
    }
    if (!empty) await db.delete(table);
    return true;
  }

  if (await shouldFill(services, "layanan")) {
  await db.insert(services).values([
    {
      slug: "jersey-custom",
      title: "Jersey Custom",
      description:
        "Pembuatan jersey bola, futsal, basket, voli, dan olahraga lainnya dengan pilihan bahan sublimasi dan printing berkualitas tinggi.",
      tags: ["Sublimasi", "Full Print", "Bordir"],
      icon: "Shirt",
      sortOrder: 1,
    },
    {
      slug: "jaket-custom",
      title: "Jaket Custom",
      description:
        "Produksi jaket kasual, hoodie, hingga jaket olahraga dengan desain bebas. Cocok untuk komunitas, organisasi, dan corporate.",
      tags: ["Hoodie", "Varsity", "Windbreaker"],
      icon: "Wind",
      sortOrder: 2,
    },
    {
      slug: "baju-custom",
      title: "Baju Custom",
      description:
        "Konveksi kaos, polo shirt, kemeja, dan baju kasual sesuai kebutuhan Anda. Minimal order fleksibel untuk berbagai skala.",
      tags: ["Kaos", "Polo", "Kemeja"],
      icon: "Scissors",
      sortOrder: 3,
    },
    {
      slug: "produksi-massal",
      title: "Produksi Massal",
      description:
        "Layanan produksi dalam jumlah besar untuk kebutuhan corporate, event, sekolah, maupun reseller dengan harga kompetitif.",
      tags: ["Grosir", "Corporate", "Event"],
      icon: "Package",
      sortOrder: 4,
    },
    {
      slug: "jersey-komunitas",
      title: "Jersey Komunitas",
      description:
        "Khusus untuk komunitas dan tim olahraga, kami menyediakan paket lengkap dari desain hingga pengiriman ke seluruh Indonesia.",
      tags: ["Tim", "Komunitas", "Kompetisi"],
      icon: "Users",
      sortOrder: 5,
    },
    {
      slug: "produksi-cepat",
      title: "Produksi Cepat",
      description:
        "Tersedia layanan ekspres untuk kebutuhan mendesak. Kami berkomitmen menjaga kualitas meski dalam waktu singkat.",
      tags: ["Ekspres", "On-Time", "Terjamin"],
      icon: "Zap",
      sortOrder: 6,
    },
  ]);
  }

  if (await shouldFill(galleryItems, "galeri")) {
  await db.insert(galleryItems).values([
    { title: "Jersey Futsal Custom", category: "jersey", sortOrder: 1, imageUrl: "/media/cat-jersey.jpg" },
    { title: "Jersey Bola Kompetisi", category: "jersey", sortOrder: 2, imageUrl: "/media/product/jersey-bola-klassio-1.jpg" },
    { title: "Hoodie Komunitas", category: "jaket", sortOrder: 3, imageUrl: "/media/product/hoodie-street-raw-1.jpg" },
    { title: "Varsity Jacket", category: "jaket", sortOrder: 4, imageUrl: "/media/product/varsity-college-jacket-1.jpg" },
    { title: "Kaos Corporate", category: "kaos", sortOrder: 5, imageUrl: "/media/cat-kaos.jpg" },
    { title: "Polo Shirt Custom", category: "polo", sortOrder: 6, imageUrl: "/media/product/polo-lacerte-corporate-1.jpg" },
    { title: "Kemeja Custom", category: "kemeja", sortOrder: 7, imageUrl: "/media/cat-kemeja.jpg" },
    { title: "Jersey Basket Custom", category: "jersey", sortOrder: 8, imageUrl: "/media/product/jersey-basket-court-1.jpg" },
  ]);
  }

  // Testimoni CONTOH (aktif agar Social Wall tampil). Ganti dengan testimoni
  // asli pelanggan, lalu perbarui baris ini lewat DB.
  if (await shouldFill(testimonials, "testimoni")) {
  await db.insert(testimonials).values([
    {
      name: "@arkantimfutsal",
      role: "Tim Futsal (contoh)",
      content:
        "Jersey tim kami jadi rapi, bahan adem, dan desainnya persis seperti mockup. Pengerjaan sesuai jadwal.",
      rating: 5,
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "@komunitasmotor06",
      role: "Komunitas (contoh)",
      content:
        "Pemesanan hoodie komunitas 50 pcs lancar, admin fast response, dan hasil sablonnya awet.",
      rating: 5,
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "@hrd.manufacturing",
      role: "Corporate (contoh)",
      content:
        "Produksi kaos dan polo untuk event perusahaan selesai tepat waktu dengan kualitas konsisten.",
      rating: 5,
      sortOrder: 3,
      isActive: true,
    },
  ]);
  }

  // Katalog produk (fallback = sumber data yang sama)
  if (await shouldFill(productCategories, "kategori produk")) {
  await db.insert(productCategories).values(fallbackCategories.map((c) => ({
    slug: c.slug,
    title: c.title,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
  })));
  }
  if (await shouldFill(products, "produk")) {
  await db.insert(products).values(fallbackProducts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    price: p.price,
    comparePrice: p.comparePrice,
    categorySlug: p.categorySlug,
    audience: p.audience,
    sizes: p.sizes,
    materialCare: p.materialCare,
    images: p.images,
    isNew: p.isNew,
    isOnSale: p.isOnSale,
    sortOrder: p.sortOrder,
    isActive: p.isActive,
  })));
  }
  if (await shouldFill(drops, "drop")) {
  await db.insert(drops).values(fallbackDrops.map((d) => ({
    slug: d.slug,
    title: d.title,
    description: d.description,
    story: d.story,
    imageUrl: d.imageUrl,
    sortOrder: d.sortOrder,
    isActive: d.isActive,
  })));
  }

  // Relasi drop ↔ produk
  // WAJIB: tanpa penghapusan ini, relasi lama menumpuk tiap re-seed → produk
  // dobel di halaman drop (bug "shop the DROP" terdeteksi audit).
  if (await shouldFill(dropProducts, "relasi drop-produk")) {
  await db.insert(dropProducts).values(
    Object.entries(DROP_PRODUCT_SLUGS).flatMap(([dropSlug, slugs]) =>
      slugs.map((productSlug, i) => ({
        dropSlug,
        productSlug,
        sortOrder: i + 1,
      })),
    ),
  );
  }

  console.log(
    fresh
      ? "Seed --fresh selesai: semua tabel konten ditimpa."
      : "Seed selesai (tabel kosong diisi; tabel berisi dilewati). Data inquiry tidak disentuh.",
  );
  await client.end();
}

main().catch((err) => {
  console.error("Seed gagal:", err);
  process.exit(1);
});

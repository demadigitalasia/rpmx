import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/db";
import {
  dropProducts,
  drops,
  galleryItems,
  productCategories,
  products,
  services,
  siteSettings,
  testimonials,
  type DropRow,
  type GalleryItemRow,
  type ProductCategoryRow,
  type ProductRow,
  type ServiceRow,
  type TestimonialRow,
} from "@/db/schema";
import {
  DROP_PRODUCT_SLUGS,
  fallbackCategories,
  fallbackDrops,
  fallbackProducts,
} from "@/lib/catalog-fallback";
import { fallbackGallery, fallbackServices } from "@/lib/content";

/**
 * Pembaca konten publik dengan pola Next 16 (`use cache` + cacheComponents).
 * Bila database belum terisi / tidak terjangkau, halaman tetap tampil
 * memakai fallback konten statis di src/lib/content.ts.
 */

export async function getServices(): Promise<ServiceRow[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services");
  try {
    const db = getDb();
    if (db) {
      const rows = await db
        .select()
        .from(services)
        .where(eq(services.isActive, true))
        .orderBy(asc(services.sortOrder));
      if (rows.length > 0) return rows;
    }
  } catch {
    // DB belum siap → fallback
  }
  return fallbackServices;
}

export async function getGalleryItems(): Promise<GalleryItemRow[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("gallery");
  try {
    const db = getDb();
    if (db) {
      const rows = await db
        .select()
        .from(galleryItems)
        .where(eq(galleryItems.isActive, true))
        .orderBy(asc(galleryItems.sortOrder));
      if (rows.length > 0) return rows;
    }
  } catch {
    // DB belum siap → fallback
  }
  return fallbackGallery;
}

export async function getTestimonials(): Promise<TestimonialRow[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("testimonials");
  try {
    const db = getDb();
    if (db) {
      return await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isActive, true))
        .orderBy(asc(testimonials.sortOrder));
    }
  } catch {
    // DB belum siap → kosong (section disembunyikan)
  }
  return [];
}

export async function getProducts(): Promise<ProductRow[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  try {
    const db = getDb();
    if (db) {
      const rows = await db
        .select()
        .from(products)
        .where(eq(products.isActive, true))
        .orderBy(asc(products.sortOrder));
      if (rows.length > 0) return rows;
    }
  } catch {
    // DB belum siap → fallback
  }
  return fallbackProducts;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductRow | undefined> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  try {
    const db = getDb();
    if (db) {
      const rows = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug))
        .limit(1);
      if (rows[0]) return rows[0];
    }
  } catch {
    // DB belum siap → fallback
  }
  return fallbackProducts.find((p) => p.slug === slug);
}

export async function getProductCategories(): Promise<ProductCategoryRow[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  try {
    const db = getDb();
    if (db) {
      const rows = await db
        .select()
        .from(productCategories)
        .where(eq(productCategories.isActive, true))
        .orderBy(asc(productCategories.sortOrder));
      if (rows.length > 0) return rows;
    }
  } catch {
    // DB belum siap → fallback
  }
  return fallbackCategories;
}

export async function getDrops(): Promise<DropRow[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("drops");
  try {
    const db = getDb();
    if (db) {
      const rows = await db
        .select()
        .from(drops)
        .where(eq(drops.isActive, true))
        .orderBy(asc(drops.sortOrder));
      if (rows.length > 0) return rows;
    }
  } catch {
    // DB belum siap → fallback
  }
  return fallbackDrops;
}

export async function getDropBySlug(slug: string): Promise<DropRow | undefined> {
  "use cache";
  cacheLife("minutes");
  cacheTag("drops");
  try {
    const db = getDb();
    if (db) {
      const rows = await db
        .select()
        .from(drops)
        .where(eq(drops.slug, slug))
        .limit(1);
      if (rows[0]) return rows[0];
    }
  } catch {
    // DB belum siap → fallback
  }
  return fallbackDrops.find((d) => d.slug === slug);
}

/** Produk anggota sebuah drop, urut sesuai relasi. */
export async function getDropProducts(dropSlug: string): Promise<ProductRow[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("drops");
  const all = await getProducts();
  let slugs: string[] = [];
  try {
    const db = getDb();
    if (db) {
      const rows = await db
        .select()
        .from(dropProducts)
        .where(eq(dropProducts.dropSlug, dropSlug))
        .orderBy(asc(dropProducts.sortOrder));
      slugs = rows.map((r) => r.productSlug);
    }
  } catch {
    // DB belum siap → fallback
  }
  if (slugs.length === 0) slugs = DROP_PRODUCT_SLUGS[dropSlug] ?? [];
  // Dedupe + pertahankan urutan relasi (antisipasi data relasi ganda)
  const seen = new Set<string>();
  return slugs
    .filter((s) => (seen.has(s) ? false : (seen.add(s), true)))
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is ProductRow => Boolean(p));
}

/** F1 (ADMIN_CMS_REPORT): pengaturan situs — Record kunci→nilai, kosong bila DB belum siap. */
export async function getSiteSettings(): Promise<Record<string, string>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("settings");
  try {
    const db = getDb();
    if (db) {
      const rows = await db.select().from(siteSettings);
      return Object.fromEntries(rows.map((r) => [r.key, r.value]));
    }
  } catch {
    // DB belum siap → kosong (komponen memakai fallback nilai kode)
  }
  return {};
}

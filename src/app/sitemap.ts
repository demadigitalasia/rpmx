import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getDrops, getProducts } from "@/lib/data";

/**
 * Sitemap dinamis: route statis + semua produk & drop aktif dari DB.
 * `connection()` memaksa render runtime — saat build belum ada DB, sehingga
 * tanpa ini fallback 16 produk membeku di prerender (bug deploy 13 Nov).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes = [
    { route: "", priority: 1, changeFrequency: "weekly" as const },
    { route: "/shop", priority: 0.9, changeFrequency: "daily" as const },
    { route: "/sale", priority: 0.9, changeFrequency: "daily" as const },
    { route: "/new", priority: 0.9, changeFrequency: "daily" as const },
    { route: "/drops", priority: 0.9, changeFrequency: "weekly" as const },
    { route: "/layanan", priority: 0.8, changeFrequency: "monthly" as const },
    { route: "/galeri", priority: 0.8, changeFrequency: "monthly" as const },
    { route: "/tentang", priority: 0.8, changeFrequency: "monthly" as const },
    { route: "/kontak", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r.route}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const [products, drops] = await Promise.all([getProducts(), getDrops()]);

  const productEntries: MetadataRoute.Sitemap = products
    .filter((p) => p.isActive)
    .map((p) => ({
      url: `${base}/shop/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const dropEntries: MetadataRoute.Sitemap = drops.map((d) => ({
    url: `${base}/drops/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries, ...dropEntries];
}

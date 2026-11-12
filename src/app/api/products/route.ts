import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data";

/**
 * Ringkasan katalog untuk overlay pencarian.
 * Menggunakan `request` agar handler selalu runtime (bukan prerender build).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  const all = await getProducts();
  const products = (q
    ? all.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.categorySlug.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    : all
  ).slice(0, 12);

  return NextResponse.json({
    products: products.map((p) => ({
      slug: p.slug,
      title: p.title,
      categorySlug: p.categorySlug,
      price: p.price,
    })),
    total: q ? products.length : all.length,
  });
}

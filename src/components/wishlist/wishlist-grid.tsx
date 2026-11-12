"use client";

import Link from "next/link";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { ProductCard } from "@/components/product-card";
import type { ProductRow } from "@/db/schema";

/** Grid produk yang di-wishlist (halaman /wishlist). */
export function WishlistGrid({ products }: { products: ProductRow[] }) {
  const { slugs } = useWishlist();
  const saved = products.filter((p) => slugs.has(p.slug));

  if (saved.length === 0) {
    return (
      <div className="border border-dashed border-raw-line p-16 text-center">
        <p className="font-raw text-sm font-bold uppercase tracking-[0.14em] text-raw-muted">
          Belum ada produk tersimpan. Tandai dengan ikon hati di katalog.
        </p>
        <Link href="/shop" className="btn-accent mt-8 inline-flex px-6 py-3 text-xs">
          Lihat Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {saved.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

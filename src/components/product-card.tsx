import Image from "next/image";
import Link from "next/link";
import type { ProductRow } from "@/db/schema";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { Price } from "@/components/currency/price";

/**
 * Kartu produk RAWLINE (spec §2.3):
 * tile gelap tanpa radius, hati wishlist kiri-atas, badge OFF kanan-atas,
 * judul uppercase mono bold, harga bold + harga lama strikethrough.
 */
export function ProductCard({ product }: { product: ProductRow }) {
  const initial = product.title.charAt(0).toUpperCase();
  const discountPct =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round((1 - product.price / product.comparePrice) * 100)
      : null;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex flex-col bg-raw-surface"
    >
      {/* Wishlist */}
      <WishlistButton
        slug={product.slug}
        title={product.title}
        className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center"
      />

      {/* Badge diskon */}
      {discountPct && (
        <span className="absolute right-3 top-3 z-10 bg-accent px-2 py-0.5 font-raw text-[11px] font-medium text-raw-ink tabular-nums">
          {discountPct}% OFF
        </span>
      )}

      {/* Media — brightness lift + hover swap ke foto ke-2 (spec §B.11) */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {product.images.length > 0 ? (
          <>
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(min-width:1024px) 33vw, 50vw"
              className="object-cover brightness-110 transition-[transform,filter] duration-500 group-hover:scale-105 group-hover:brightness-125"
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width:1024px) 33vw, 50vw"
                className="object-cover brightness-110 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="relative h-full w-full media-fallback transition-transform duration-500 group-hover:scale-105">
            <span className="absolute inset-0 flex items-center justify-center font-raw text-7xl font-bold uppercase text-raw-ink/10">
              {initial}
            </span>
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <span className="absolute bottom-3 left-3 font-raw text-[10px] uppercase tracking-[0.2em] text-raw-muted">
              FIG. {String(product.id).padStart(3, "0")}
            </span>
          </div>
        )}
      </div>

      {/* Info — judul di atas, harga menempel bawah dengan ruang napas besar (§2.3) */}
      <div className="flex flex-1 flex-col p-4 pb-8">
        <h3 className="font-raw text-sm font-bold uppercase leading-[1.7] tracking-tight text-raw-ink">
          {product.title}
        </h3>
        <p className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0 pt-8">
          <Price
            value={product.price}
            className="whitespace-nowrap font-raw text-lg font-bold text-raw-ink tabular-nums"
          />
          {product.comparePrice && product.comparePrice > product.price && (
            <Price
              value={product.comparePrice}
              className="whitespace-nowrap font-raw text-xs font-medium text-raw-muted line-through tabular-nums"
            />
          )}
        </p>
      </div>
    </Link>
  );
}

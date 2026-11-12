"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ProductRow } from "@/db/schema";
import { useCart } from "@/components/cart/cart-provider";
import { useCurrency } from "@/components/currency/use-currency";
import { formatPrice } from "@/lib/site";

/**
 * Panel beli sticky (spec §3.3 kolom kanan): harga merah, size pills,
 * stepper qty, ADD TO CART, dan CTA kedua "Minta Penawaran Tim".
 */
export function BuyPanel({ product }: { product: ProductRow }) {
  const { add } = useCart();
  const currency = useCurrency();
  const [size, setSize] = useState(product.sizes[0] ?? "ALL SIZE");
  const [qty, setQty] = useState(1);

  return (
    <div>
      <p className="font-raw text-2xl font-bold tracking-[-0.02em] text-accent tabular-nums">
        {formatPrice(product.price, currency)}
        <span className="ml-1 text-sm font-medium text-raw-muted">
          {currency}
        </span>
      </p>

      {/* Size pills */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {product.sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            aria-pressed={size === s}
            className={`py-3 font-raw text-xs font-bold uppercase tracking-wide transition-colors ${
              size === s
                ? "bg-accent text-raw-ink"
                : "border border-raw-line text-raw-ink hover:border-accent"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Stepper + CTA */}
      <div className="mt-4 flex gap-2">
        <div className="flex items-center border border-raw-line">
          <button
            type="button"
            aria-label="Kurangi jumlah"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-3.5 text-raw-ink hover:text-accent"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-10 text-center font-raw text-sm font-bold text-accent tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Tambah jumlah"
            onClick={() => setQty((q) => q + 1)}
            className="px-4 py-3.5 text-raw-ink hover:text-accent"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => add({ slug: product.slug, title: product.title, price: product.price, size, qty })}
          className="btn-accent flex-1 px-6 py-3.5 text-sm"
        >
          Add to Cart
        </button>
      </div>

      <Link
        href={{ pathname: "/kontak", query: { product: product.slug } }}
        className="btn-boxed btn-boxed-hover mt-2 w-full px-6 py-3.5 text-xs"
      >
        Minta Penawaran Tim
      </Link>

      {/* Deskripsi */}
      {product.description && (
        <p className="mt-6 font-raw text-xs font-medium uppercase leading-[1.9] tracking-[0.08em] text-raw-ink/80">
          {product.description}
        </p>
      )}
      {product.materialCare && (
        <>
          <p className="mt-5 font-raw text-xs font-bold uppercase tracking-[0.14em] text-raw-ink">
            Material &amp; Care
          </p>
          <ul className="mt-2 space-y-1 font-raw text-xs font-medium uppercase leading-relaxed text-raw-muted">
            {product.materialCare.split("\n").map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

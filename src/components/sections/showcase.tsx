import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductRow } from "@/db/schema";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

/** Grid produk pakai (sale / grails / new) */
function ProductGrid({ products, cols = 4 }: { products: ProductRow[]; cols?: 3 | 4 }) {
  return (
    <div
      className={`grid grid-cols-2 gap-2 ${
        cols === 3 ? "sm:grid-cols-3" : "lg:grid-cols-4"
      }`}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

/** black friday SALE (§3.1.4) — 8 produk diskon */
export function SaleGrid({ products }: { products: ProductRow[] }) {
  const sale = products.filter((p) => p.isOnSale).slice(0, 8);
  if (sale.length === 0) return null;

  return (
    <section className="border-t border-raw-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          prefix="season"
          word="Sale"
          action={{ label: "View All", href: "/sale" }}
        />
        <Reveal className="mt-12">
          <ProductGrid products={sale} />
        </Reveal>
      </div>
    </section>
  );
}

/** Grails (§3.1.7) — kurasi 6 produk */
export function Grails({ products }: { products: ProductRow[] }) {
  const picks = products.filter((p) => !p.isOnSale).slice(0, 6);
  if (picks.length === 0) return null;

  return (
    <section className="border-t border-raw-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          prefix="pilihan"
          word="Grails"
          action={{ label: "View All", href: "/shop" }}
        />
        <Reveal className="mt-12">
          <ProductGrid products={picks} cols={3} />
        </Reveal>
      </div>
    </section>
  );
}

/** Collection CTA (§3.1.8) */
export function CollectionCta() {
  return (
    <section className="border-t border-raw-line py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 text-center sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="font-raw text-[clamp(2rem,5vw,4.4rem)] font-bold uppercase tracking-[-0.04em] text-raw-ink">
            RPMX
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-raw text-sm uppercase leading-[1.8] tracking-[0.1em] text-raw-muted">
            Satu katalog untuk tim, komunitas, dan perusahaan — semua dibuat di
            workshop kami.
          </p>
          <Link
            href="/shop"
            className="group mt-8 inline-flex items-center gap-2 border border-raw-ink/60 px-7 py-4 font-raw text-sm font-bold uppercase tracking-[0.1em] text-raw-ink transition-colors hover:bg-raw-ink hover:text-raw"
          >
            Shop Collection
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

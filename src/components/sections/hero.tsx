import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductRow } from "@/db/schema";
import { Price } from "@/components/currency/price";

/**
 * Hero split-screen (HERO_TRANSITION_ANALYSIS.md Fase A — struktur asli RAWLINE):
 * kiri 70% foto model + H1 kiri-bawah; kanan 30% rail produk + band SHOP NOW;
 * garis aksen merah sebagai bingkai tengah. Tinggi 100vh.
 */
export function Hero({ quickProducts }: { quickProducts: ProductRow[] }) {
  const rail = quickProducts.slice(0, 4);

  return (
    <section className="relative grid h-auto lg:h-screen lg:min-h-[640px] lg:grid-cols-[7fr_3fr]">
      {/* Kiri 70% — foto + H1 kiri-bawah (foto marun ditandai data-media-slot) */}
      <div className="relative h-[68vh] min-h-[440px] overflow-hidden border-b-2 border-accent lg:h-auto lg:border-b-0 lg:border-r-2">
        <Image
          src="/media/hero-extreme-motocross.jpg"
          alt="Rider motocross mengenakan jersey streetwear RPMX di samping motor"
          fill
          priority
          sizes="70vw"
          data-media-slot="hero-split-70"
          className="object-cover object-[75%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-raw/70 via-transparent to-raw/30" />

        <span className="absolute left-4 top-24 font-raw text-[10px] uppercase tracking-[0.25em] text-raw-ink/80 sm:left-10 lg:top-6">
          DRESS THE UNCONVENTIONAL
        </span>

        <div className="absolute bottom-10 left-4 sm:left-10 lg:bottom-12">
          <h1 className="font-raw text-[clamp(2.8rem,6.5vw,5.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.045em] text-raw-ink">
            Wear the
            <br />
            hype <span className="text-accent">&quot;RPMX&quot;</span>
          </h1>
          <p className="mt-5 max-w-md font-raw text-xs font-medium uppercase leading-[1.8] tracking-[0.14em] text-raw-ink/75">
            Extreme sports & custom jersey
          </p>
          {/* CTA dalam alur kolom teks — tidak pernah menumpuk H1 (audit re-2 #1) */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-accent px-6 py-3.5 text-sm">
              Shop Now
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/kontak"
              className="btn-boxed btn-boxed-hover px-6 py-3.5 text-sm"
            >
              Minta Penawaran Tim
            </Link>
          </div>
        </div>
      </div>

      {/* Kanan 30% — rail produk vertikal + band SHOP NOW */}
      <div className="hidden flex-col border-l-2 border-accent bg-raw lg:flex">
        <div className="flex-1 overflow-hidden px-5 py-6">
          <p className="font-raw text-[10px] uppercase tracking-[0.25em] text-raw-muted">
            FIG. 001 — Latest pieces
          </p>
          <ul className="mt-5 space-y-1">
            {rail.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/shop/${product.slug}`}
                  className="group flex items-center gap-3 py-2.5 transition-colors hover:bg-raw-surface"
                >
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={64}
                      height={64}
                      sizes="64px"
                      className="h-16 w-16 shrink-0 object-cover"
                    />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-raw text-[11px] font-bold uppercase tracking-wide text-raw-ink">
                      {product.title}
                    </span>
                    <span className="block font-raw text-xs text-raw-muted tabular-nums">
                      <Price value={product.price} />
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-raw-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/shop"
          className="group flex items-center justify-center gap-2 bg-accent py-5 font-raw text-sm font-bold uppercase tracking-[0.14em] text-raw-ink transition-[filter] hover:brightness-110"
        >
          Shop Now
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

    </section>
  );
}

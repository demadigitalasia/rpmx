import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyPanel } from "@/components/cart/buy-panel";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { getProductBySlug, getProducts } from "@/lib/data";

type Params = { slug: string };

// Membaca params URL — render blocking saat navigasi (spec §B.10 transitions).
export const instant = false;

/** Tabel ukuran standar apparel RPMX (inch) — spec §3.3 */
const SIZE_CHART: Record<string, [string, string, string]> = {
  S: ["38", "17", "25"],
  M: ["40", "18", "26"],
  L: ["42", "19", "27"],
  XL: ["44", "20", "28"],
  XXL: ["46", "21", "29"],
};

export async function generateStaticParams(): Promise<Params[]> {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

async function getProduct(slug: string) {
  return getProductBySlug(slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produk tidak ditemukan" };
  return { title: product.title, description: product.description };
}

export default async function ProductPage({
  params,
}: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || !product.isActive) notFound();

  const related = (await getProducts())
    .filter((p) => p.slug !== product.slug && p.categorySlug === product.categorySlug)
    .slice(0, 4);

  // Galeri vertikal minimal 3 tile (spec §3.3): foto asli + sisanya tile FIG.
  // agar kolom tengah lebih tinggi dari panel beli sticky.
  const galleryTiles: (string | null)[] =
    product.images.length > 0
      ? [
          ...product.images,
          ...Array.from(
            { length: Math.max(0, 3 - product.images.length) },
            () => null,
          ),
        ]
      : [null, null, null];
  const isOneSize = product.sizes.length === 1 && product.sizes[0] === "ALL SIZE";

  return (
    <section className="pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 pt-8 font-raw text-[11px] uppercase tracking-[0.2em] text-raw-muted"
        >
          <Link href="/shop" className="transition-colors hover:text-accent">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.categorySlug}`}
            className="transition-colors hover:text-accent"
          >
            {product.categorySlug}
          </Link>
          <span>/</span>
          <span className="text-raw-ink">{product.slug}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.15fr_1fr]">
          {/* Kolom kiri: judul raksasa + tabel ukuran (mobile: urutan ke-2) */}
          <div className="order-2 lg:order-1">
            <div className="flex items-start justify-between">
              <p className="font-raw text-xs uppercase tracking-[0.2em] text-raw-muted">
                RPMX
              </p>
              <WishlistButton
                slug={product.slug}
                title={product.title}
                iconClass="h-5 w-5"
              />
            </div>
            <h1 className="mt-3 text-center font-raw text-[clamp(2.4rem,4vw,4.2rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-raw-ink text-balance">
              {product.title}
            </h1>

            {/* Tabel ukuran */}
            <table className="mt-8 w-full border-collapse font-raw text-xs uppercase text-raw-ink">
              <thead>
                <tr className="border border-raw-line bg-raw-surface text-left">
                  <th className="px-3 py-2.5 font-bold tracking-wide">Size</th>
                  {!isOneSize && (
                    <>
                      <th className="px-3 py-2.5 font-bold tracking-wide">Chest (in)</th>
                      <th className="px-3 py-2.5 font-bold tracking-wide">Sleeve (in)</th>
                      <th className="px-3 py-2.5 font-bold tracking-wide">Length (in)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {product.sizes.map((s) => {
                  const row = SIZE_CHART[s];
                  return (
                    <tr key={s} className="border border-raw-line">
                      <td className="px-3 py-2.5 font-bold">{s}</td>
                      {!isOneSize && row && (
                        <>
                          <td className="px-3 py-2.5 text-raw-muted tabular-nums">{row[0]}</td>
                          <td className="px-3 py-2.5 text-raw-muted tabular-nums">{row[1]}</td>
                          <td className="px-3 py-2.5 text-raw-muted tabular-nums">{row[2]}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-2 font-raw text-[10px] uppercase tracking-[0.18em] text-raw-muted">
              Ukuran tubuh (bukan ukuran produk) · toleransi ±1 in — FIG. {String(product.id).padStart(3, "0")}
            </p>
          </div>

          {/* Kolom tengah: galeri vertikal (mobile: tampil pertama) */}
          <div className="order-1 space-y-2 lg:order-2">
            {galleryTiles.map((src, i) => (
              <div
                key={i}
                className="relative aspect-[3/4] overflow-hidden border border-raw-line bg-raw-surface"
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={`${product.title} — ${i + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 media-fallback">
                    <span className="absolute inset-0 flex items-center justify-center font-raw text-8xl font-bold uppercase text-raw-ink/10">
                      {product.title.charAt(0)}
                    </span>
                    <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
                    <span className="absolute bottom-4 left-4 font-raw text-[10px] uppercase tracking-[0.2em] text-raw-muted">
                      FIG. {String(product.id).padStart(3, "0")}-{String.fromCharCode(65 + i)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Kolom kanan: panel beli sticky */}
          <div className="order-3 lg:sticky lg:top-24 lg:self-start">
            <BuyPanel product={product} />
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24 border-t border-raw-line pt-16">
            <h2 className="font-raw text-2xl font-bold uppercase tracking-[-0.03em] text-raw-ink">
              <span className="font-serif-italic mr-1 lowercase">dari kategori</span>
              <span className="text-accent">{product.categorySlug}</span>
            </h2>
            <Reveal className="mt-8">
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { getDropBySlug, getDropProducts, getDrops } from "@/lib/data";

type Params = { slug: string };

// Membaca params URL — render blocking saat navigasi (spec §B.10 transitions).
export const instant = false;

export async function generateStaticParams(): Promise<Params[]> {
  const drops = await getDrops();
  return drops.map((d) => ({ slug: d.slug }));
}

async function getDrop(slug: string) {
  return getDropBySlug(slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/drops/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const drop = await getDrop(slug);
  if (!drop) return { title: "Drop tidak ditemukan" };
  return { title: drop.title, description: drop.description };
}

export default async function DropDetailPage({
  params,
}: PageProps<"/drops/[slug]">) {
  const { slug } = await params;
  const drop = await getDrop(slug);
  if (!drop || !drop.isActive) notFound();
  const products = await getDropProducts(drop.slug);

  return (
    <section className="pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-4 pb-28 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 pt-8 font-raw text-[11px] uppercase tracking-[0.2em] text-raw-muted"
        >
          <Link href="/drops" className="transition-colors hover:text-accent">
            Drops
          </Link>
          <span>/</span>
          <span className="text-raw-ink">{drop.slug}</span>
        </nav>

        {/* Judul + cerita */}
        <h1 className="mt-8 max-w-4xl font-raw text-[clamp(2.4rem,6vw,5rem)] font-bold uppercase leading-[0.95] tracking-[-0.045em] text-raw-ink">
          {drop.title}
        </h1>
        {drop.description && (
          <p className="mt-6 max-w-2xl font-raw text-sm font-medium uppercase leading-[1.9] tracking-[0.08em] text-raw-ink/85">
            {drop.description}
          </p>
        )}
        {drop.story && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-raw-muted">
            {drop.story}
          </p>
        )}

        {/* Lookbook */}
        <h2 className="mt-16 font-raw text-[clamp(1.6rem,3vw,2.4rem)] font-bold uppercase tracking-[-0.03em]">
          <span className="font-serif-italic mr-1 lowercase text-raw-ink">the</span>
          <span className="heading-word">Lookbook</span>
        </h2>
        {/* Satu foto asli = tile full-width; tanpa foto = 2 tile fallback */}
        <div
          className={`mt-6 grid gap-2 ${
            drop.imageUrl ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {(drop.imageUrl ? [0] : [0, 1]).map((i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden border border-raw-line bg-raw-surface"
            >
              {drop.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={drop.imageUrl}
                  alt={`${drop.title} — lookbook ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 media-fallback">
                  <span className="absolute inset-0 flex items-center justify-center font-raw text-7xl font-bold uppercase text-raw-ink/10">
                    ×{i + 1}
                  </span>
                  <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
                  <span className="absolute bottom-4 left-4 font-raw text-[10px] uppercase tracking-[0.2em] text-raw-muted">
                    LOOK. {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Shop the drop */}
        {products.length > 0 && (
          <>
            <h2 className="mt-20 font-raw text-[clamp(1.6rem,3vw,2.4rem)] font-bold uppercase tracking-[-0.03em]">
              <span className="font-serif-italic mr-1 lowercase text-raw-ink">shop the</span>
              <span className="heading-word">Drop</span>
            </h2>
            <Reveal className="mt-8">
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </Reveal>
          </>
        )}

        {/* CTA */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-raw-line pt-10">
          <p className="font-raw text-sm font-medium uppercase leading-[1.8] tracking-[0.1em] text-raw-ink/85">
            Ingin drop seperti ini untuk tim Anda?
          </p>
          <Link href="/kontak" className="btn-accent px-6 py-3.5 text-sm">
            Mulai Kolaborasi
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

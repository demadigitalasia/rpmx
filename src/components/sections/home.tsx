import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DropRow, TestimonialRow } from "@/db/schema";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { advantages } from "@/lib/content";
import { getSiteInfo } from "@/lib/site-info";

/* ------------- About — media full-screen menumpuk (Fase B) ----------------- */

export function AboutImmersive() {
  return (
    <section className="relative">
      {/* Media full-screen menempel saat konten scroll di atasnya */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <Image
          src="/media/about-extreme-streetwear.jpg"
          alt="Komunitas BMX dan skateboard mengenakan jersey streetwear RPMX"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-raw/45" />
      </div>

      {/* Konten menumpuk di atas media */}
      <div className="relative z-10 -mt-[100vh]">
        <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
          <h2 className="relative font-raw text-[clamp(3rem,7vw,6rem)] font-bold uppercase leading-none tracking-[-0.04em] text-accent">
            ABO
            <span className="font-serif-italic absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lowercase text-raw-ink">
              us
            </span>
            UT
          </h2>
          <p className="mx-auto mt-8 max-w-3xl font-raw text-sm font-medium uppercase leading-[1.9] tracking-[0.14em] text-raw-ink sm:text-base">
            RPMX menghadirkan jersey custom dan apparel untuk extreme sports melalui empat lini:
            TRUE NORTH, POLARIS, OVERDRIVE, dan RPMX LIMITLESS. Setiap lini
            memiliki karakter produk tersendiri dalam satu ekosistem produksi.
          </p>
          <Link
            href="/tentang"
            className="mt-10 border border-raw-ink/80 px-8 py-3.5 font-raw text-sm font-bold uppercase tracking-[0.18em] text-raw-ink transition-colors hover:bg-raw-ink hover:text-raw"
          >
            View More
          </Link>
        </div>
        {/* Runway scroll — media tetap menempel selama teks bergeser */}
        <div className="h-[45vh]" />
      </div>
    </section>
  );
}

/* ------------------- Drops row — editorial asimetris ---------------------- */

export function DropsRow({ drops }: { drops: DropRow[] }) {
  if (drops.length === 0) return null;
  const [first, ...rest] = drops;

  return (
    <section className="border-t border-raw-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          prefix="latest"
          word="Drops"
          action={{ label: "View All", href: "/drops" }}
        />

        {/* Kartu full-width */}
        <Reveal className="mt-12">
          <Link
            href="/drops"
            className="group relative block overflow-hidden border border-raw-line"
          >
            <div className="relative aspect-[16/9] w-full bg-raw-surface sm:aspect-[21/9]">
              {first.imageUrl ? (
                <Image
                  src={first.imageUrl}
                  alt={first.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 media-fallback" />
              )}
              <div className="absolute inset-0 media-scrim" />
              <span className="absolute left-4 top-4 flex items-center gap-1.5 bg-accent px-2 py-1 font-raw text-[10px] font-bold uppercase tracking-[0.14em] text-raw-ink">
                ⚠ Limited stock
              </span>
              <div className="absolute bottom-0 left-0 p-6 sm:p-10">
                <h3 className="font-raw text-2xl font-bold uppercase tracking-tight text-raw-ink sm:text-4xl">
                  {first.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-raw-ink/80">
                  {first.description}
                </p>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Dua kartu setengah-lebar */}
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {rest.slice(0, 2).map((drop, i) => (
            <Reveal key={drop.id} delay={i * 0.06}>
              <Link
                href="/drops"
                className="group relative block overflow-hidden border border-raw-line"
              >
                <div className="relative aspect-[16/10] bg-raw-surface">
                  {drop.imageUrl ? (
                    <Image
                      src={drop.imageUrl}
                      alt={drop.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 media-fallback" />
                  )}
                  <div className="absolute inset-0 media-scrim" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="font-raw text-lg font-bold uppercase tracking-tight text-raw-ink">
                      {drop.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-raw-ink/75">
                      {drop.description}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Why RPMX — staggered -------------------------- */

const STAGGER = ["", "lg:mt-[190px]", "lg:mt-[340px]", "lg:mt-[490px]"] as const;

export function WhyStaggered() {
  return (
    <section className="border-t border-raw-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading prefix="kenapa" word="RPMX" />
        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item, i) => (
            <div
              key={item.title}
              className={
                i > 0
                  ? "lg:border-l lg:border-dashed lg:border-raw-line lg:pl-6"
                  : undefined
              }
            >
              <Reveal delay={i * 0.07} className={STAGGER[i]}>
                <div>
                  <p className="font-raw text-[16px] uppercase leading-[1.4] tracking-[0.05em] text-raw-ink">
                    {item.description}
                  </p>
                  <h3 className="mt-20 font-raw text-[clamp(2.2rem,2.8vw,2.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-raw-ink transition-colors duration-300 hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 font-raw text-xs uppercase tracking-[0.14em] text-raw-muted">
                    {item.sub}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Categories — masonry + link ---------------------- */

const CATEGORY_TILES = [
  {
    slug: "jersey",
    label: "Jersey",
    image: "/media/cat-jersey.jpg",
    alt: "Koleksi jersey custom",
  },
  {
    slug: "jaket",
    label: "Jaket & Hoodie",
    image: "/media/cat-jaket.jpg",
    alt: "Outerwear custom",
  },
  {
    slug: "kaos",
    label: "Kaos",
    image: "/media/cat-kaos.jpg",
    alt: "Apparel kaos",
  },
  {
    slug: "polo",
    label: "Polo",
    image: "/media/product/polo-lacerte-corporate-1.jpg",
    alt: "Polo shirt corporate",
  },
  {
    slug: "kemeja",
    label: "Kemeja",
    image: "/media/product/kemeja-flanel-workshop-1.jpg",
    alt: "Kemeja flanel",
  },
  {
    slug: "aksesoris",
    label: "Aksesoris",
    image: "/media/product/socks-crew-rpmx-1.jpg",
    alt: "Kaos kaki crew RPMX",
  },
];

export function Categories() {
  return (
    <section className="border-t border-raw-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          prefix="kategori"
          word="Semua"
          action={{ label: "Shop All", href: "/shop" }}
        />
        <div className="mt-12 grid gap-2 sm:grid-cols-2">
          {CATEGORY_TILES.map((tile, i) => (
            <Reveal key={tile.slug} delay={i * 0.05}>
              <Link
                href={{ pathname: "/shop", query: { category: tile.slug } }}
                className="group relative block overflow-hidden border border-raw-line"
              >
                <div className="relative aspect-[4/3] bg-raw-surface">
                  <Image
                    src={tile.image}
                    alt={tile.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 media-scrim" />
                  <div className="absolute bottom-0 left-0 flex items-center gap-3 p-5">
                    <h3 className="font-raw text-2xl font-bold uppercase tracking-tight text-raw-ink">
                      {tile.label}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Social wall ------------------------------ */

export function SocialWall({
  testimonials,
}: {
  testimonials: TestimonialRow[];
}) {
  if (testimonials.length === 0) return null;

  const photos = [1, 2, 3, 4].map(
    (n) => `/media/social-${n}.jpg`,
  );

  // Selang-seling: quote (varian solid/outline) dan foto UGC
  const cells: Array<
    | { kind: "quote"; t: TestimonialRow; variant: "solid" | "outline" }
    | { kind: "photo"; src: string; alt: string }
  > = [];
  testimonials.forEach((t, i) => {
    cells.push({ kind: "photo", src: photos[i % photos.length], alt: t.name });
    cells.push({
      kind: "quote",
      t,
      variant: i % 2 === 0 ? "solid" : "outline",
    });
  });

  return (
    <section className="border-t border-raw-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-raw text-[clamp(2rem,5vw,4.4rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em]">
            <span className="font-serif-italic lowercase text-raw-ink">social </span>
            <span className="text-accent">Wall</span>
          </h2>
          <div className="flex gap-6 font-raw text-xs font-medium uppercase tracking-[0.14em] text-raw-ink">
            {["X", "Facebook", "Instagram"].map((s) => (
              <span key={s} className="transition-colors hover:text-accent">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cells.map((cell, i) => (
            <Reveal key={i} delay={(i % 4) * 0.05}>
              {cell.kind === "quote" ? (
                <figure
                  className={`flex h-full min-h-[260px] flex-col justify-between p-5 ${
                    cell.variant === "solid"
                      ? "bg-accent text-raw-ink"
                      : "border border-accent bg-raw text-raw-ink"
                  }`}
                >
                  <blockquote className="font-raw text-xs font-bold uppercase leading-[1.8]">
                    “{cell.t.content}”
                  </blockquote>
                  <figcaption className="mt-6 font-raw text-xs font-bold uppercase opacity-80">
                    —{cell.t.name}
                  </figcaption>
                </figure>
              ) : (
                <figure className="relative h-full min-h-[260px] overflow-hidden border border-raw-line bg-raw-surface">
                  <Image
                    src={cell.src}
                    alt={cell.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className={`object-cover ${i % 3 === 0 ? "grayscale" : ""}`}
                  />
                </figure>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Walk-in store ----------------------------- */

export async function Stores() {
  const info = await getSiteInfo();
  return (
    <section className="pt-20 lg:pt-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-2 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden border border-raw-line">
            <Image
              src="/media/store-workshop.jpg"
              alt="Etalase workshop RPMX di Tasikmalaya"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <h2 className="mt-5 font-raw text-4xl font-bold uppercase tracking-[-0.03em] text-raw-ink">
            Tasikmalaya
          </h2>
          <p className="font-serif-italic mt-1 text-2xl text-raw-ink">
            RPMX Studio
          </p>
          <p className="font-raw text-xs uppercase tracking-[0.14em] text-raw-muted">
            Kunjungi workshop — hubungi dulu via WhatsApp
          </p>
          <a
            href={info.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 font-raw text-xs font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:text-raw-ink"
          >
            Buka di Google Maps
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="hidden items-end pb-1 lg:flex">
          <p className="font-raw text-sm uppercase leading-[1.9] tracking-[0.1em] text-raw-muted">
            RPMX mengembangkan desain, memilih material, dan memproduksi jersey
            custom serta apparel untuk kebutuhan olahraga dan komunitas.
          </p>
        </div>
      </div>
    </section>
  );
}

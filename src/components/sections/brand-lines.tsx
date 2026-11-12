import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { brandLines } from "@/lib/brands";

export function BrandLines({
  variant = "full",
}: {
  variant?: "compact" | "full";
}) {
  const compact = variant === "compact";

  return (
    <section
      id={compact ? undefined : "brand-lines"}
      className="scroll-mt-24 border-t border-raw-line py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          prefix="our"
          word="Brands"
          description="Empat lini spesialisasi dengan karakter produk berbeda, ditopang satu ekosistem pengembangan dan produksi RPMX."
          action={
            compact
              ? { label: "Kenali Semua Lini", href: "/tentang#brand-lines" }
              : undefined
          }
        />

        <div
          className={`mt-10 grid gap-px border border-raw-line bg-raw-line ${
            compact ? "sm:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2"
          }`}
        >
          {brandLines.map((brand, index) => (
            <Reveal key={brand.slug} delay={index * 0.05}>
              <article className="h-full bg-raw p-6 transition-colors hover:bg-raw-surface sm:p-8">
                <p className="font-raw text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  0{index + 1} / RPMX BRAND LINE
                </p>
                <h3 className="mt-5 font-raw text-2xl font-bold uppercase tracking-[-0.04em] text-raw-ink sm:text-3xl">
                  {brand.name}
                </h3>
                <p className="mt-2 font-raw text-xs font-bold uppercase leading-relaxed tracking-[0.1em] text-raw-muted">
                  {brand.tagline}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-raw-muted">
                  {compact ? brand.summary : brand.description}
                </p>

                {!compact && (
                  <div className="mt-6 border-t border-raw-line pt-5">
                    <p className="font-raw text-[10px] font-bold uppercase tracking-[0.18em] text-raw-ink">
                      Product &amp; Production Focus
                    </p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {brand.productFocus.map((item) => (
                        <li
                          key={item}
                          className="border border-raw-line px-3 py-2 font-raw text-[10px] font-medium uppercase leading-relaxed tracking-wide text-raw-muted"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {!compact && (
          <p className="mt-8 text-center font-raw text-xs font-bold uppercase tracking-[0.16em] text-raw-muted">
            RPMX — One Manufacturer, Multiple Apparel Specialties.
          </p>
        )}
      </div>
    </section>
  );
}

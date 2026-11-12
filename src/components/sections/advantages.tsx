import { getServiceIcon, advantages } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Advantages() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          prefix="kenapa"
          word="RPMX"
          description="Prinsip yang kami bawa dalam pengembangan produk dan proses produksi apparel custom."
        />
        <div className="mt-12 grid gap-px border border-raw-line bg-raw-line sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item, i) => {
            const Icon = getServiceIcon(item.icon);
            return (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="group h-full bg-raw p-6 transition-colors hover:bg-raw-surface">
                  <span className="flex h-11 w-11 items-center justify-center bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-raw-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-raw text-lg font-bold uppercase tracking-tight text-raw-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-raw-muted">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

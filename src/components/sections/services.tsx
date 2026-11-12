import Link from "next/link";
import { ArrowUpRight, Shirt } from "lucide-react";
import type { ServiceRow } from "@/db/schema";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { serviceIcons } from "@/lib/content";
import { getServices } from "@/lib/data";

export function ServiceCard({
  service,
  index,
}: {
  service: ServiceRow;
  index: number;
}) {
  const Icon = serviceIcons[service.icon] ?? Shirt;
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className="group flex h-full flex-col border border-raw-line bg-raw p-6 transition-colors hover:border-accent/50 hover:bg-raw-surface">
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-raw-ink">
          <Icon className="h-5 w-5" />
        </span>
        <span className="font-raw text-sm text-raw-muted tabular-nums">
          {number}
        </span>
      </div>
      <h3 className="mt-5 font-raw text-xl font-bold uppercase tracking-tight text-raw-ink">
        {service.title}
      </h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-raw-muted">
        {service.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="border border-raw-line px-3 py-1 font-raw text-[10px] font-medium uppercase tracking-[0.12em] text-raw-ink"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={{ pathname: "/kontak", query: { service: service.slug } }}
        className="mt-6 inline-flex items-center gap-1.5 font-raw text-xs font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:text-raw-ink"
      >
        Minta Penawaran
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export async function Services() {
  const services = await getServices();

  return (
    <section className="border-t border-raw-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          prefix="semua"
          word="Layanan"
          description="Dari jersey olahraga hingga jaket kasual, kami siap memproduksi pakaian custom sesuai visi dan kebutuhan Anda."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 3) * 0.06}>
              <ServiceCard service={service} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

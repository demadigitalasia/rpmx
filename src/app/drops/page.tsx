import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getDrops } from "@/lib/data";

export const metadata: Metadata = {
  title: "Latest Drops",
  description:
    "Setiap drop RPMX punya cerita — rilis jersey & apparel terbatas hasil kolaborasi dengan tim dan komunitas.",
};

/** Halaman Drops bertema TERBALIK (krem) — spec §3.4. */
export default async function DropsPage() {
  const drops = await getDrops();

  return (
    <section className="min-h-screen bg-[#ffffe3] pt-[72px] text-[#111111]">
      <div className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-10">
        {/* Hero tagline */}
        <div className="pt-16 text-center">
          <p className="font-raw text-xs font-bold uppercase tracking-[0.25em] text-accent">
            Latest Drops
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl font-raw text-[clamp(1.6rem,4vw,2.6rem)] font-bold uppercase leading-[1.2] tracking-[-0.03em]">
            <span className="font-serif-italic lowercase">every drop </span>
            <span className="text-accent">tells a story.</span>
            <br />
            Limited runs, designed to stay timeless.
          </h1>
        </div>

        {/* Daftar drop — baris editorial besar */}
        <div className="mt-16">
          {drops.map((drop, i) => (
            <Reveal key={drop.id} delay={i * 0.04}>
              <Link
                href={`/drops/${drop.slug}`}
                className="group grid items-center gap-4 border-t border-[#111111]/20 py-8 transition-colors last:border-b hover:bg-[#111111] hover:text-[#ffffe3] sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:px-6"
              >
                <span className="font-raw text-4xl font-bold tracking-[-0.03em] opacity-30 tabular-nums transition-opacity group-hover:opacity-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-raw text-2xl font-bold uppercase tracking-tight">
                    {drop.title}
                  </h2>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed opacity-70">
                    {drop.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 font-raw text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  Lihat Drop
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="mt-16 text-center font-raw text-[11px] uppercase tracking-[0.2em] opacity-50">
          Semua drop diproduksi di workshop RPMX — Tasikmalaya. No restock on regret.
        </p>
      </div>
    </section>
  );
}

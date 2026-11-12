import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { getSiteInfo } from "@/lib/site-info";

export async function Cta() {
  const info = await getSiteInfo();

  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-10 lg:pb-28">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden bg-accent px-6 py-14 text-center sm:px-12 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border-[24px] border-black/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full border-[24px] border-black/10"
        />
        <h2 className="relative font-raw text-3xl font-bold uppercase tracking-[-0.03em] text-raw-ink sm:text-4xl">
          Siap Mewujudkan Kebutuhan Custom Anda?
        </h2>
        <p className="relative mx-auto mt-4 max-w-2xl text-base leading-relaxed text-raw-ink/80">
          Konsultasikan desain, material, spesialisasi brand, dan kebutuhan
          produksi bersama tim RPMX.
        </p>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 bg-raw px-6 py-3.5 font-raw text-sm font-bold uppercase tracking-[0.08em] text-raw-ink transition-colors hover:bg-black"
          >
            Minta Penawaran
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a
            href={info.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-black/30 px-6 py-3.5 font-raw text-sm font-bold uppercase tracking-[0.08em] text-raw-ink transition-colors hover:border-black"
          >
            <MessageCircle className="h-4 w-4" />
            {info.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

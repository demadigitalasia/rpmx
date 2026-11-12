import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** 404 custom bergaya RAWLINE (spec §C): heading raksasa + tautan pulang. */
export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-[72px]">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10">
        <p className="font-raw text-xs font-bold uppercase tracking-[0.25em] text-accent">
          Error — page not found
        </p>
        <h1 className="mt-4 font-raw text-[clamp(4rem,14vw,10rem)] font-bold uppercase leading-[0.9] tracking-[-0.05em] text-raw-ink">
          4<span className="text-accent">0</span>4
        </h1>
        <p className="mt-6 max-w-md font-raw text-sm uppercase leading-[1.8] tracking-[0.1em] text-raw-muted">
          Halaman yang kamu cari tidak ada — mungkin sudah habis di drop
          sebelumnya. No restock on regret.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn-accent px-6 py-3.5 text-sm">
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="btn-boxed btn-boxed-hover gap-2 px-6 py-3.5 text-sm"
          >
            Lihat Katalog
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-12 font-raw text-[11px] uppercase tracking-[0.2em] text-raw-muted">
          FIG. 404 — Nothing to see here.
        </p>
      </div>
    </section>
  );
}

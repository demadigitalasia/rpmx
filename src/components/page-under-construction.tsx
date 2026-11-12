import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Placeholder halaman yang sedang dibangun (fase implementasi RAWLINE).
 * Akan diganti implementasi penuh pada fase berikutnya.
 */
export function PageUnderConstruction({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note: string;
}) {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-[72px]">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10">
        <p className="font-raw text-xs font-bold uppercase tracking-[0.25em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-raw text-[clamp(2.5rem,8vw,6rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-raw-ink">
          {title}
        </h1>
        <p className="mt-6 max-w-xl font-raw text-sm leading-relaxed text-raw-muted">
          {note}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn-accent px-6 py-3.5 text-sm">
            Kembali ke Beranda
          </Link>
          <Link
            href="/kontak"
            className="btn-boxed btn-boxed-hover px-6 py-3.5 text-sm"
          >
            Minta Penawaran
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-12 font-raw text-[11px] uppercase tracking-[0.2em] text-raw-muted">
          FIG. 001 — Under construction. Follow the build.
        </p>
      </div>
    </section>
  );
}

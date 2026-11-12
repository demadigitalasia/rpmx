import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowUpRight } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
import { CurrencySelector } from "@/components/currency/currency-modal";
import { getSiteInfo } from "@/lib/site-info";

/** Tahun berjalan untuk copyright — dicache agar stabil saat prerender. */
async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

const boxedLinks = [
  { href: "/shop", label: "All" },
  { href: "/drops", label: "Drops" },
  { href: "/new", label: "New" },
  { href: "/sale", label: "Sale" },
  { href: "/tentang", label: "About" },
  { href: "/kontak", label: "Contact" },
];

export async function SiteFooter() {
  const year = await getCurrentYear();
  const info = await getSiteInfo();

  return (
    <footer className="border-t border-raw-line bg-raw">
      <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-14 sm:px-6 lg:px-10">
        {/* Baris atas: logo + kontak + newsletter */}
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <Link href="/" aria-label="RPMX — beranda" className="inline-block">
              <Image
                src="/rpmx-logo.png"
                alt="RPMX"
                width={1400}
                height={329}
                className="h-7 w-auto"
              />
            </Link>
            <p className="font-serif-italic mt-1 text-xl text-raw-ink">
              extreme sports &amp; jersey custom
            </p>
          </div>

          <div>
            <p className="font-raw text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Contact Us
            </p>
            <address className="mt-4 font-raw text-sm font-medium uppercase leading-relaxed not-italic text-raw-ink">
              RPMX Studio
              <br />
              {info.addressShort}
            </address>
            <div className="mt-4 flex flex-col items-start gap-1.5 font-raw text-sm font-bold uppercase tracking-wide">
              <a
                href={`mailto:${info.email}`}
                className="inline-flex items-center gap-1 text-raw-ink transition-colors hover:text-accent"
              >
                {info.email}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={`tel:${info.phoneIntl}`}
                className="inline-flex items-center gap-1 text-raw-ink transition-colors hover:text-accent"
              >
                {info.phone}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div>
            <p className="font-raw text-sm font-medium uppercase leading-relaxed text-raw-ink">
              Daftar untuk penawaran eksklusif dan{" "}
              <span className="font-bold text-accent">diskon 15%</span> pesanan
              pertama Anda.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Baris tombol kotak selebar-container (§2.4) */}
        <nav
          aria-label="Navigasi footer"
          className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
        >
          {boxedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="btn-boxed btn-boxed-hover px-4 py-3.5 text-xs"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Baris sosial */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6">
            {info.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-raw text-xs font-medium uppercase tracking-[0.14em] text-raw-ink transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            ))}
            <CurrencySelector />
          </div>
          <p className="font-raw text-xs uppercase tracking-[0.14em] text-raw-muted">
            {info.tagline} — Tasikmalaya
          </p>
        </div>

        {/* Baris legal */}
        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-raw-line pt-6 pr-16 sm:flex-row sm:items-center sm:pr-20">
          <p className="font-raw text-xs uppercase tracking-[0.14em] text-raw-muted">
            Dibangun oleh RPMX · {year}
          </p>
          <div className="flex gap-6 font-raw text-xs uppercase tracking-[0.14em] text-raw-muted">
            <Link href="/tentang" className="transition-colors hover:text-raw-ink">
              Privacy Policy
            </Link>
            <Link href="/tentang" className="transition-colors hover:text-raw-ink">
              Terms &amp; Condition
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

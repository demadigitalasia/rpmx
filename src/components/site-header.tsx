"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { SearchOverlay } from "@/components/search/search-overlay";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/tentang#brand-lines", label: "Brands" },
  { href: "/drops", label: "Drops" },
  { href: "/sale", label: "Sale" },
  { href: "/new", label: "New" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();

  // Kunci scroll saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-raw-line bg-raw md:inset-x-auto md:top-3 md:left-1/2 md:-translate-x-1/2 md:w-auto md:rounded-xl md:border md:border-raw-line md:bg-black/90 md:backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 md:h-14 md:max-w-none md:justify-center md:gap-7 md:px-6">
          <Link
            href="/"
            aria-label="RPMX — beranda"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/rpmx-logo.png"
              alt="RPMX"
              width={1400}
              height={329}
              priority
              className="h-6 w-auto sm:h-7"
            />
          </Link>

          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-7 md:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-1 font-raw text-xs font-medium uppercase tracking-[0.14em] transition-colors ${
                  pathname === link.href
                    ? "text-accent"
                    : "text-raw-ink hover:text-accent"
                }`}
              >
                {link.label}
                <ArrowUpRight
                  className="h-3 w-3 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Cari produk"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center text-raw-ink transition-colors hover:text-accent"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="flex h-9 w-9 items-center justify-center text-raw-ink transition-colors hover:text-accent"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <button
              type="button"
              aria-label={`Keranjang belanja, ${count} item`}
              onClick={() => setCartOpen(true)}
              className="relative text-raw-ink transition-colors hover:text-accent"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-accent px-1 font-raw text-[10px] font-bold leading-none text-raw-ink tabular-nums">
                {count}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center border border-raw-line text-raw-ink md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay pencarian instan */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Menu mobile fullscreen */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-raw pt-[72px] md:hidden">
          <nav aria-label="Navigasi mobile" className="flex flex-col px-6 py-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-raw-line py-5 font-raw text-2xl font-bold uppercase tracking-tight text-raw-ink"
              >
                {link.label}
                <span className="font-raw text-xs text-raw-muted tabular-nums">
                  0{i + 1}
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto px-6 pb-8 pr-16">
            <Link
              href="/kontak"
              onClick={() => setOpen(false)}
              className="btn-accent w-full px-6 py-4 text-sm"
            >
              Minta Penawaran
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

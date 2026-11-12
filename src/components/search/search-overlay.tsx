"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Loader2, Search, X } from "lucide-react";
import { Price } from "@/components/currency/price";

type SearchResult = {
  slug: string;
  title: string;
  categorySlug: string;
  price: number;
};

/**
 * Overlay pencarian instan (spec §B.7 — "smart product search"):
 * full-screen, input mono besar, hasil live dari /api/products.
 */
export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fokus input + kunci scroll saat terbuka
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 220);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Escape untuk menutup
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [open, onClose]);

  // Debounce pencarian
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products${query ? `?q=${encodeURIComponent(query)}` : ""}`,
        );
        const data = (await res.json()) as { products: SearchResult[] };
        setResults(data.products ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query, open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Tutup pencarian"
            className="fixed inset-0 z-[70] bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Pencarian produk"
            className="fixed inset-x-0 top-0 z-[71] border-b border-raw-line bg-raw px-4 pb-6 pt-[88px] sm:px-6 lg:px-10"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center justify-between">
                <p className="font-raw text-xs font-bold uppercase tracking-[0.25em] text-accent">
                  Search RPMX
                </p>
                <button
                  type="button"
                  aria-label="Tutup"
                  onClick={onClose}
                  className="text-raw-ink transition-colors hover:text-accent"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-5 flex items-center gap-3 border-b border-raw-ink/40 pb-3">
                <Search className="h-6 w-6 text-accent" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="CARI PRODUK, KATEGORI…"
                  className="w-full bg-transparent font-raw text-xl font-bold uppercase tracking-[-0.02em] text-raw-ink outline-none placeholder:text-raw-ink/25 sm:text-2xl"
                />
                {loading && (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-raw-muted" />
                )}
              </div>

              <ul className="mt-4 max-h-[46vh] overflow-y-auto">
                {results.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/shop/${p.slug}`}
                      onClick={onClose}
                      className="group flex items-center justify-between gap-4 border-b border-raw-line py-3.5 transition-colors hover:bg-raw-surface"
                    >
                      <span className="font-raw text-sm font-bold uppercase tracking-tight text-raw-ink">
                        {p.title}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-raw text-[10px] uppercase tracking-[0.18em] text-raw-muted">
                          {p.categorySlug}
                        </span>
                        <span className="font-raw text-sm font-bold text-accent tabular-nums">
                          <Price value={p.price} />
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-raw-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                      </span>
                    </Link>
                  </li>
                ))}
                {!loading && results.length === 0 && (
                  <li className="py-6 font-raw text-sm font-bold uppercase tracking-[0.14em] text-raw-muted">
                    Tidak ada hasil untuk “{query}”.
                  </li>
                )}
              </ul>

              <p className="mt-4 text-center font-raw text-[10px] uppercase tracking-[0.2em] text-raw-muted">
                Tekan ESC untuk menutup · hasil instan dari katalog RPMX
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

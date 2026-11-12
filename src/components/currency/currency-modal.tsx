"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { setCurrency } from "@/lib/currency-store";
import { useCurrency } from "@/components/currency/use-currency";
import type { Currency } from "@/lib/site";

const OPTIONS: { value: Currency; label: string }[] = [
  { value: "IDR", label: "Indonesia" },
  { value: "USD", label: "United States" },
];

/**
 * Currency selector modal (spec §2.5, TASK B): trigger "{IDR|USD} ▪" di footer,
 * modal kotak brutalis — bar atas SELECT YOUR CURRENCY + X, foto glitch-art
 * di tengah, bar bawah dua tombol kotak IDR/USD (aktif = fill krem).
 */
export function CurrencySelector() {
  const currency = useCurrency();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Trigger footer — mengganti span IDR statis */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Pilih mata uang"
        className="font-raw text-xs font-medium uppercase tracking-[0.14em] text-raw-muted transition-colors hover:text-accent"
      >
        {currency} ▪
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Tutup pilihan mata uang"
              className="fixed inset-0 z-[60] bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-label="Pilih mata uang"
              className="fixed left-1/2 top-1/2 z-[61] w-[min(90vw,26rem)] -translate-x-1/2 -translate-y-1/2 border border-raw-line bg-raw"
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* Bar atas */}
              <div className="flex items-center justify-between bg-raw-ink px-5 py-4 text-raw">
                <p className="font-raw text-xs font-bold uppercase tracking-[0.18em]">
                  Select Your Currency
                </p>
                <button
                  type="button"
                  aria-label="Tutup"
                  onClick={() => setOpen(false)}
                  className="transition-opacity hover:opacity-60"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Foto glitch-art */}
              <div className="relative h-40 overflow-hidden">
                <Image
                  src="/media/about.jpg"
                  alt=""
                  fill
                  sizes="26rem"
                  className="object-cover grayscale contrast-125"
                />
                <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
                <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-accent" />
                <span className="pointer-events-none absolute bottom-3 left-4 font-raw text-[10px] uppercase tracking-[0.25em] text-raw-ink/70">
                  FIG. CUR — RPMX
                </span>
              </div>

              {/* Bar bawah: pilihan IDR / USD */}
              <div className="grid grid-cols-2 gap-2 p-5">
                {OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setCurrency(opt.value);
                      setOpen(false);
                    }}
                    aria-pressed={currency === opt.value}
                    className={`flex flex-col items-start gap-1 px-4 py-3 font-raw transition-colors ${
                      currency === opt.value
                        ? "bg-raw-ink text-raw"
                        : "border border-raw-line text-raw-ink hover:border-accent"
                    }`}
                  >
                    <span className="text-sm font-bold uppercase tracking-wide">
                      {opt.value}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] opacity-70">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              <p className="px-5 pb-5 text-center font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted">
                Konversi tampilan saja — pesanan ditagih dalam IDR.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

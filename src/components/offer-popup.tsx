"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const STORAGE_KEY = "rpmx-offer";

/**
 * Offer popup (spec §B.8): muncul sekali per visitor setelah delay singkat,
 * dismiss tersimpan di localStorage — pola offer popup RAWLINE.
 */
export function OfferPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center px-4">
          <motion.button
            type="button"
            aria-label="Tutup penawaran"
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />
          <motion.div
            role="dialog"
            aria-label="Penawaran RPMX"
            className="relative w-full max-w-md border border-raw-line bg-raw"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Strip merah kepala */}
            <div className="bg-accent px-6 py-3">
              <p className="font-raw text-xs font-bold uppercase tracking-[0.25em] text-raw-ink">
                ⚡ RPMX First Drop Offer
              </p>
            </div>
            <button
              type="button"
              aria-label="Tutup"
              onClick={dismiss}
              className="absolute right-3 top-3 text-raw-ink/80 transition-colors hover:text-raw-ink"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-8 text-center">
              <h2 className="font-raw text-3xl font-bold uppercase leading-[1.05] tracking-[-0.03em] text-raw-ink">
                Diskon <span className="text-accent">15%</span> pesanan
                pertamamu
              </h2>
              <p className="mt-4 font-raw text-xs font-medium uppercase leading-[1.8] tracking-[0.1em] text-raw-muted">
                Jersey tim, hoodie komunitas, sampai polo kantor — daftar dan
                pakai penawarannya sebelum drop berikutnya.
              </p>
              <Link
                href="/kontak"
                onClick={dismiss}
                className="btn-accent mt-7 w-full px-6 py-4 text-sm"
              >
                Klaim via Penawaran
              </Link>
              <button
                type="button"
                onClick={dismiss}
                className="mt-3 font-raw text-[10px] uppercase tracking-[0.2em] text-raw-muted transition-colors hover:text-raw-ink"
              >
                Nanti saja
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

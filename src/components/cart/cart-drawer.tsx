"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Price } from "@/components/currency/price";

/**
 * Cart drawer slide-over (spec §3.3, §4.9): slide dari kanan, item mono
 * uppercase, stepper qty, subtotal, checkout via WhatsApp.
 * F1: nomor WA dari Pengaturan Situs (prop dari layout).
 */
export function CartDrawer({ waNumber }: { waNumber?: string }) {
  const { items, open, setOpen, updateQty, remove, subtotal, waMessage } =
    useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Tutup keranjang"
            className="fixed inset-0 z-[60] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Keranjang belanja"
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col border-l border-raw-line bg-raw"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-raw-line px-6 py-5">
              <p className="font-raw text-sm font-bold uppercase tracking-[0.14em] text-raw-ink">
                Cart ({items.reduce((a, i) => a + i.qty, 0)})
              </p>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setOpen(false)}
                className="text-raw-ink transition-colors hover:text-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="font-raw text-sm font-bold uppercase tracking-[0.14em] text-raw-muted">
                  Keranjang masih kosong.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="btn-accent px-6 py-3 text-xs"
                >
                  Lihat Katalog
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 py-4">
                  {items.map((item) => (
                    <li
                      key={`${item.slug}-${item.size}`}
                      className="border-b border-raw-line py-4 last:border-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-raw text-sm font-bold uppercase leading-snug text-raw-ink">
                            {item.title}
                          </p>
                          <p className="mt-1 font-raw text-xs uppercase tracking-wide text-raw-muted">
                            Size {item.size} · <Price value={item.price} />
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Hapus ${item.title}`}
                          onClick={() => remove(item.slug, item.size)}
                          className="text-raw-muted transition-colors hover:text-accent"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-raw-line">
                          <button
                            type="button"
                            aria-label="Kurangi jumlah"
                            onClick={() => updateQty(item.slug, item.size, item.qty - 1)}
                            className="px-3 py-1.5 text-raw-ink hover:text-accent"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-8 text-center font-raw text-sm font-bold text-raw-ink tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Tambah jumlah"
                            onClick={() => updateQty(item.slug, item.size, item.qty + 1)}
                            className="px-3 py-1.5 text-raw-ink hover:text-accent"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-raw text-sm font-bold text-raw-ink tabular-nums">
                          <Price value={item.price * item.qty} />
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-raw-line px-6 py-5">
                  <div className="flex items-center justify-between font-raw text-sm font-bold uppercase text-raw-ink">
                    <span>Subtotal</span>
                    <Price value={subtotal} className="tabular-nums" />
                  </div>
                  <a
                    href={`https://wa.me/${waNumber ?? "6285180851428"}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent mt-4 w-full px-6 py-4 text-sm"
                  >
                    Checkout via WhatsApp
                  </a>
                  <p className="mt-3 text-center font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted">
                    Ongkir &amp; jadwal produksi dikonfirmasi admin.
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

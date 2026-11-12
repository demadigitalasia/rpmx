"use client";

import { useSyncExternalStore } from "react";
import {
  getCurrencyServerSnapshot,
  getCurrencySnapshot,
  subscribeCurrency,
} from "@/lib/currency-store";
import { formatPrice } from "@/lib/site";

/**
 * Harga reaktif (TASK B): server & hidrasi pertama render IDR, lalu ikut
 * pilihan currency tersimpan — berganti format tanpa reload. Kelas Tailwind
 * diteruskan agar setiap konteks mempertahankan tipografinya.
 */
export function Price({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const currency = useSyncExternalStore(
    subscribeCurrency,
    getCurrencySnapshot,
    getCurrencyServerSnapshot,
  );
  return <span className={className}>{formatPrice(value, currency)}</span>;
}

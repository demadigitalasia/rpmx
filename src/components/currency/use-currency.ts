"use client";

import { useSyncExternalStore } from "react";
import {
  getCurrencyServerSnapshot,
  getCurrencySnapshot,
  subscribeCurrency,
} from "@/lib/currency-store";

/** Hook currency untuk komponen client — harga ikut berganti tanpa reload. */
export function useCurrency() {
  return useSyncExternalStore(
    subscribeCurrency,
    getCurrencySnapshot,
    getCurrencyServerSnapshot,
  );
}

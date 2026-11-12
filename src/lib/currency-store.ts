/**
 * External store currency (client-only) — pola useSyncExternalStore,
 * tiru wishlist-store. Pilihan tersimpan di localStorage "rpmx-currency".
 * Konversi USD murni tampilan — data & pesanan tetap IDR.
 */

import type { Currency } from "@/lib/site";

const STORAGE_KEY = "rpmx-currency";
const DEFAULT: Currency = "IDR";

let value: Currency = DEFAULT;
let loaded = false;
let snapshot: Currency = DEFAULT;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "USD" || raw === "IDR") value = raw;
    }
  } catch {
    // storage blocked → mulai default
  }
  // refresh snapshot setelah load agar pilihan tersimpan langsung terlihat
  snapshot = value;
}

function emit() {
  snapshot = value;
  persist();
  for (const listener of listeners) listener();
}

function persist() {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, value);
    }
  } catch {
    // storage blocked → in-memory saja
  }
}

export function subscribeCurrency(listener: () => void): () => void {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCurrencySnapshot(): Currency {
  load();
  return snapshot;
}

/** Server & hidrasi pertama selalu IDR — referensi konstanta modul yang stabil. */
export function getCurrencyServerSnapshot(): Currency {
  return DEFAULT;
}

export function setCurrency(next: Currency) {
  load();
  if (next === value) return;
  value = next;
  emit();
}

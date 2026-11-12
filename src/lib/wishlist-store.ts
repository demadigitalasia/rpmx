/**
 * External store wishlist (client-only) — pola useSyncExternalStore.
 */

export type WishlistItem = { slug: string; title: string };

const STORAGE_KEY = "rpmx-wishlist";
const EMPTY: readonly WishlistItem[] = [];

let items: readonly WishlistItem[] = EMPTY;
let loaded = false;
let snapshot: readonly WishlistItem[] = EMPTY;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) items = JSON.parse(raw) as WishlistItem[];
    }
  } catch {
    // korup → mulai kosong
  }
  // refresh snapshot setelah load agar wishlist tersimpan langsung terlihat
  snapshot = items;
}

function emit() {
  snapshot = items;
  persist();
  for (const listener of listeners) listener();
}

function persist() {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // storage blocked → in-memory saja
  }
}

export function subscribeWishlist(listener: () => void): () => void {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getWishlistSnapshot(): readonly WishlistItem[] {
  load();
  return snapshot;
}

export function getWishlistServerSnapshot(): readonly WishlistItem[] {
  return EMPTY;
}

export function toggleWishlistItem(item: WishlistItem) {
  load();
  items = items.some((i) => i.slug === item.slug)
    ? items.filter((i) => i.slug !== item.slug)
    : [...items, item];
  emit();
}

/**
 * External store keranjang (client-only) — pola useSyncExternalStore
 * sesuai rekomendasi React untuk state yang persist di localStorage.
 * Modul ini tidak menyentuh React; konsumen memakai hook useCart().
 */

export type CartItem = {
  slug: string;
  title: string;
  price: number;
  size: string;
  qty: number;
};

const STORAGE_KEY = "rpmx-cart";
const EMPTY: CartItem[] = [];
/** Snapshot kosong yang STABIL — getServerSnapshot wajib mengembalikan referensi cached. */
const EMPTY_SNAPSHOT: { items: CartItem[]; open: boolean } = { items: EMPTY, open: false };

let items: CartItem[] = EMPTY;
let loaded = false;
let open = false;
let snapshot: { items: CartItem[]; open: boolean } = EMPTY_SNAPSHOT;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) items = JSON.parse(raw) as CartItem[];
    }
  } catch {
    // korup → mulai kosong
  }
  // refresh snapshot setelah load agar keranjang tersimpan langsung terlihat
  snapshot = { items, open };
}

function emit() {
  snapshot = { items, open };
  persist();
  for (const listener of listeners) listener();
}

function persist() {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // storage penuh/blocked → biarkan in-memory saja
  }
}

export function subscribeCart(listener: () => void): () => void {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCartSnapshot(): { items: CartItem[]; open: boolean } {
  load();
  return snapshot;
}

export function getCartServerSnapshot(): { items: CartItem[]; open: boolean } {
  // WAJIB referensi stabil (cached) — objek baru di sini memicu infinite loop
  return EMPTY_SNAPSHOT;
}

export function setCartOpen(v: boolean) {
  load();
  open = v;
  emit();
}

export function addCartItem(item: Omit<CartItem, "qty"> & { qty?: number }) {
  load();
  const qty = Math.max(1, item.qty ?? 1);
  const idx = items.findIndex(
    (i) => i.slug === item.slug && i.size === item.size,
  );
  if (idx >= 0) {
    items = items.map((i, n) => (n === idx ? { ...i, qty: i.qty + qty } : i));
  } else {
    items = [...items, { ...item, qty }];
  }
  open = true;
  emit();
}

export function updateCartItemQty(slug: string, size: string, qty: number) {
  load();
  items =
    qty <= 0
      ? items.filter((i) => !(i.slug === slug && i.size === size))
      : items.map((i) =>
          i.slug === slug && i.size === size ? { ...i, qty } : i,
        );
  emit();
}

export function removeCartItem(slug: string, size: string) {
  load();
  items = items.filter((i) => !(i.slug === slug && i.size === size));
  emit();
}

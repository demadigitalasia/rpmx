"use client";

import { useSyncExternalStore } from "react";
import {
  addCartItem,
  getCartServerSnapshot,
  getCartSnapshot,
  setCartOpen,
  subscribeCart,
  updateCartItemQty,
  removeCartItem,
  type CartItem,
} from "@/lib/cart-store";
import { formatIDR } from "@/lib/site";

/**
 * Hook keranjang — external store via useSyncExternalStore (spec §4.9).
 * State persist di localStorage tanpa efek/setState berantai.
 */
export function useCart() {
  const { items, open } = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );

  const count = items.reduce((acc, i) => acc + i.qty, 0);
  const subtotal = items.reduce((acc, i) => acc + i.qty * i.price, 0);

  const waMessage = encodeURIComponent(
    "Halo RPMX, saya ingin order:\n" +
      items
        .map((i) => `- ${i.title} (ukuran ${i.size}) ×${i.qty}`)
        .join("\n") +
      `\nTotal: ${formatIDR(subtotal)}`,
  );

  return {
    items,
    open,
    setOpen: setCartOpen,
    add: addCartItem,
    updateQty: updateCartItemQty,
    remove: removeCartItem,
    count,
    subtotal,
    waMessage,
  };
}

export type { CartItem };

"use client";

import { useSyncExternalStore } from "react";
import {
  getWishlistServerSnapshot,
  getWishlistSnapshot,
  subscribeWishlist,
  toggleWishlistItem,
} from "@/lib/wishlist-store";

/**
 * Hook wishlist — external store via useSyncExternalStore (spec §4.4).
 * Persist di localStorage tanpa efek/setState berantai.
 */
export function useWishlist() {
  const items = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getWishlistServerSnapshot,
  );

  const slugs = new Set(items.map((i) => i.slug));

  return {
    slugs,
    has: (slug: string) => slugs.has(slug),
    toggle: toggleWishlistItem,
    count: items.length,
  };
}

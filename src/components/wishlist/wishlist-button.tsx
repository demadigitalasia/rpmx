"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/components/wishlist/wishlist-provider";

/** Ikon hati wishlist (spec §4.4): outline → fill merah dengan pop kecil. */
export function WishlistButton({
  slug,
  title,
  className = "",
  iconClass = "h-4.5 w-4.5",
}: {
  slug: string;
  title: string;
  className?: string;
  iconClass?: string;
}) {
  const { has, toggle } = useWishlist();
  const active = has(slug);
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      whileTap={reduce ? undefined : { scale: 1.25 }}
      aria-label={active ? `Hapus ${title} dari wishlist` : `Simpan ${title} ke wishlist`}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ slug, title });
      }}
      className={`cursor-pointer transition-colors ${
        active ? "text-accent" : "text-raw-ink group-hover:text-accent"
      } ${className}`}
    >
      <Heart className={iconClass} fill={active ? "currentColor" : "none"} />
    </motion.button>
  );
}

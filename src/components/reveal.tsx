"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reveal on scroll (spec §4.2): fade + naik sekali saat masuk viewport.
 * Hormati prefers-reduced-motion. Durasi/delay dipangkas dari audit
 * (RAWLINE_AUDIT_REPORT #7): konten tidak boleh kosong berdetik.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const cappedDelay = Math.min(delay, 0.1);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -30px 0px" }}
      transition={{ duration: 0.35, delay: cappedDelay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

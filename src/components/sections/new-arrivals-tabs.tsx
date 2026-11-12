"use client";

import { useState } from "react";
import type { ProductRow } from "@/db/schema";
import { ProductCard } from "@/components/product-card";

/**
 * New Arrivals dengan tab kategori (spec §3.1.9) — tab kotak, aktif = fill,
 * pergantian set produk tanpa reload (§4.5 layout spring sederhana).
 */
export function NewArrivalsTabs({
  products,
  tabs,
}: {
  products: ProductRow[];
  tabs: { slug: string; title: string }[];
}) {
  const [active, setActive] = useState(tabs[0]?.slug ?? "");
  const shown = products.filter((p) => p.categorySlug === active).slice(0, 8);

  return (
    <section className="border-t border-raw-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        {/* Heading komposit dengan swatch kotak menyatu (spec §3.1.9) */}
        <h2 className="flex flex-wrap items-center gap-x-4 gap-y-3 font-raw text-[clamp(2rem,5vw,3rem)] leading-none tracking-[-0.04em]">
          <span className="font-serif-italic lowercase text-raw-ink">new </span>
          <span className="heading-word">Arrivals</span>
          <div
            role="tablist"
            aria-label="Kategori produk baru"
            className="ml-2 flex items-center gap-4"
          >
            {tabs.map((tab) => {
              const isActive = tab.slug === active;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(tab.slug)}
                  className="flex items-center gap-2 font-raw text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:text-accent"
                >
                  <span
                    aria-hidden="true"
                    className={`h-4 w-4 border transition-colors ${
                      isActive ? "bg-raw-ink border-raw-ink" : "border-raw-ink/60"
                    }`}
                  />
                  <span className={isActive ? "text-raw-ink" : "text-raw-muted"}>
                    {tab.title}
                  </span>
                </button>
              );
            })}
          </div>
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-2 lg:grid-cols-4" aria-live="polite">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

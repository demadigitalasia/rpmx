"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import type { ProductCategoryRow, ProductRow } from "@/db/schema";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { useCurrency } from "@/components/currency/use-currency";
import { formatPrice, type Currency } from "@/lib/site";

type SortKey = "relevance" | "price-asc" | "price-desc" | "newest";

/** Batas filter selalu dalam IDR (nilai data); label mengikuti currency tampilan. */
const PRICE_RANGES = [
  { id: "lt100", min: null, max: 100_000 },
  { id: "100-200", min: 100_000, max: 200_000 },
  { id: "200-300", min: 200_000, max: 300_000 },
  { id: "gt300", min: 300_000, max: null },
] as const;

function priceRangeLabel(
  range: (typeof PRICE_RANGES)[number],
  currency: Currency,
): string {
  if (range.min === null) return `< ${formatPrice(range.max!, currency)}`;
  if (range.max === null) return `> ${formatPrice(range.min, currency)}`;
  return `${formatPrice(range.min, currency)} – ${formatPrice(range.max, currency)}`;
}

export function ShopClient({
  products,
  categories,
  heading,
  initialCategory = "all",
}: {
  products: ProductRow[];
  categories: ProductCategoryRow[];
  heading: { prefix: string; word: string };
  initialCategory?: string;
}) {
  const [category, setCategory] = useState<string>(
    categories.some((c) => c.slug === initialCategory) ? initialCategory : "all",
  );
  const [audience, setAudience] = useState<"all" | "tim" | "individu">("all");
  const [ranges, setRanges] = useState<Set<string>>(new Set());
  const [onSale, setOnSale] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const currency = useCurrency();

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== "all" && p.categorySlug !== category) return false;
      if (audience !== "all" && p.audience !== audience) return false;
      if (ranges.size > 0) {
        const match = [...ranges].some((id) => {
          const r = PRICE_RANGES.find((range) => range.id === id);
          if (!r) return false;
          return (
            (r.min === null || p.price >= r.min) &&
            (r.max === null || p.price < r.max)
          );
        });
        if (!match) return false;
      }
      if (onSale && !p.isOnSale) return false;
      if (isNew && !p.isNew) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "newest")
      list = [...list].sort(
        (a, b) => Number(b.isNew) - Number(a.isNew) || a.sortOrder - b.sortOrder,
      );
    return list;
  }, [products, category, audience, ranges, onSale, isNew, sort]);

  function toggleRange(id: string) {
    setRanges((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function resetFilters() {
    setCategory("all");
    setAudience("all");
    setRanges(new Set());
    setOnSale(false);
    setIsNew(false);
    setSort("relevance");
  }

  return (
    <section className="pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-4 pb-28 sm:px-6 lg:px-10">
        {/* Heading + pemilih tipe produk */}
        <div className="flex flex-wrap items-end justify-between gap-4 pt-14">
          <h1 className="font-raw text-[clamp(2.2rem,5vw,3rem)] leading-none tracking-[-0.04em]">
            <span className="font-serif-italic mr-1 lowercase text-raw-ink">
              {heading.prefix}{" "}
            </span>
            <span className="heading-word">{heading.word}</span>
          </h1>
          <label className="flex items-center gap-2 border border-raw-line px-4 py-2.5">
            <span className="sr-only">Tipe produk</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent font-raw text-xs font-bold uppercase tracking-[0.14em] text-raw-ink outline-none [&>option]:bg-raw"
            >
              <option value="all">PRODUCT TYPE — ALL</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Bar FILTERS */}
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className="mt-8 flex w-full items-center gap-2 bg-raw-surface px-4 py-3 font-raw text-xs font-bold uppercase tracking-[0.14em] text-raw-ink transition-colors hover:text-accent"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {filtersOpen ? (
            <ChevronUp className="ml-auto h-4 w-4" />
          ) : (
            <ChevronDown className="ml-auto h-4 w-4" />
          )}
        </button>

        {filtersOpen && (
          <div className="border-b border-raw-line bg-raw-surface/60 px-4 py-5">
            <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
              {/* Audience */}
              <div>
                <p className="font-raw text-[11px] font-bold uppercase tracking-[0.2em] text-raw-ink">
                  Pesanan
                </p>
                <div className="mt-3 flex gap-2">
                  {(["all", "tim", "individu"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAudience(a)}
                      aria-pressed={audience === a}
                      className={`px-5 py-2.5 font-raw text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                        audience === a
                          ? "bg-raw-ink text-raw"
                          : "border border-raw-line text-raw-ink hover:border-accent"
                      }`}
                    >
                      {a === "all" ? "Semua" : a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Harga */}
              <div>
                <p className="font-raw text-[11px] font-bold uppercase tracking-[0.2em] text-raw-ink">
                  Harga
                </p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {PRICE_RANGES.map((r) => (
                    <label
                      key={r.id}
                      className="flex cursor-pointer items-center gap-2 font-raw text-xs font-medium uppercase tracking-[0.1em] text-raw-ink"
                    >
                      <input
                        type="checkbox"
                        checked={ranges.has(r.id)}
                        onChange={() => toggleRange(r.id)}
                        className="h-4 w-4 accent-[#ffffe3]"
                      />
                      {priceRangeLabel(r, currency)}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle sale / new */}
            <div className="mt-5 flex flex-wrap gap-x-8 border-t border-raw-line pt-4">
              <label className="flex cursor-pointer items-center gap-2 font-raw text-xs font-bold uppercase tracking-[0.14em] text-raw-ink">
                <input
                  type="checkbox"
                  checked={onSale}
                  onChange={(e) => setOnSale(e.target.checked)}
                  className="h-4 w-4 accent-[#ffffe3]"
                />
                On Sale
              </label>
              <label className="flex cursor-pointer items-center gap-2 font-raw text-xs font-bold uppercase tracking-[0.14em] text-raw-ink">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="h-4 w-4 accent-[#ffffe3]"
                />
                New Arrivals
              </label>
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-raw text-[11px] uppercase tracking-[0.2em] text-raw-muted">
            Sort by
            <label className="flex items-center gap-1 font-raw text-xs font-bold uppercase tracking-[0.14em] text-raw-ink">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-transparent outline-none [&>option]:bg-raw"
              >
                <option value="relevance">RELEVANCE</option>
                <option value="price-asc">PRICE ↑</option>
                <option value="price-desc">PRICE ↓</option>
                <option value="newest">NEWEST</option>
              </select>
            </label>
          </div>
          <p className="font-raw text-[11px] uppercase tracking-[0.2em] text-raw-muted tabular-nums">
            {filtered.length} produk
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <Reveal className="mt-6">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Reveal>
        ) : (
          <div className="mt-6 border border-dashed border-raw-line p-16 text-center">
            <p className="font-raw text-sm font-bold uppercase tracking-[0.14em] text-raw-muted">
              Tidak ada produk yang cocok dengan filter ini.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 border border-raw-line px-5 py-3 font-raw text-xs font-bold uppercase tracking-[0.14em] text-raw-ink transition-colors hover:border-accent hover:text-accent"
            >
              <X className="h-4 w-4" />
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

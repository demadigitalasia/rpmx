import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Koleksi terbaru dari meja produksi RPMX.",
};

export default async function NewPage() {
  const products = (await getProducts())
    .filter((p) => p.isNew)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-4 pb-28 sm:px-6 lg:px-10">
        <h1 className="pt-14 font-raw text-[clamp(2.2rem,5vw,3rem)] leading-none tracking-[-0.04em]">
          <span className="font-serif-italic mr-1 lowercase text-raw-ink">
            new{" "}
          </span>
          <span className="heading-word">Arrivals</span>
        </h1>
        <p className="mt-4 font-raw text-xs uppercase tracking-[0.2em] text-raw-muted tabular-nums">
          {products.length} koleksi terbaru
        </p>

        {products.length > 0 ? (
          <Reveal className="mt-10">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Reveal>
        ) : (
          <p className="mt-10 font-raw text-sm uppercase text-raw-muted">
            Belum ada koleksi baru — pantau drop berikutnya.
          </p>
        )}
      </div>
    </section>
  );
}

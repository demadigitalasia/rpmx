import type { Metadata } from "next";
import { WishlistGrid } from "@/components/wishlist/wishlist-grid";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
};

export default async function WishlistPage() {
  const products = await getProducts();

  return (
    <section className="pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-4 pb-28 sm:px-6 lg:px-10">
        <h1 className="pt-14 font-raw text-[clamp(2.2rem,5vw,3rem)] leading-none tracking-[-0.04em]">
          <span className="font-serif-italic mr-1 lowercase text-raw-ink">
            saved{" "}
          </span>
          <span className="heading-word">Items</span>
        </h1>
        <p className="mt-4 font-raw text-xs uppercase tracking-[0.2em] text-raw-muted">
          Tersimpan di perangkatmu — siap dipesan kapan saja.
        </p>
        <div className="mt-10">
          <WishlistGrid products={products} />
        </div>
      </div>
    </section>
  );
}

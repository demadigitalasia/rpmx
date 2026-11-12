import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/shop-client";
import { getProductCategories, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Katalog lengkap RPMX — jersey futsal & bola, jaket, kaos, polo, kemeja. Filter tipe, harga, dan status diskon.",
};

// Halaman dinamis: membaca query ?category= untuk pre-select kategori.
export const instant = false;

export default async function ShopPage({
  searchParams,
}: PageProps<"/shop">) {
  const [products, categories, params] = await Promise.all([
    getProducts(),
    getProductCategories(),
    searchParams,
  ]);
  const q = typeof params.category === "string" ? params.category : "all";

  return (
    <ShopClient
      products={products}
      categories={categories}
      heading={{ prefix: "shop", word: "All" }}
      initialCategory={q}
    />
  );
}

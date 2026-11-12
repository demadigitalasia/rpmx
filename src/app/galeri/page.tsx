import type { Metadata } from "next";
import { Cta } from "@/components/sections/cta";
import { GalleryCard } from "@/components/gallery-card";
import { SectionHeading } from "@/components/section-heading";
import { getGalleryItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Galeri Portofolio",
  description:
    "Galeri karya RPMX: jersey futsal & bola, hoodie, varsity, kaos corporate, polo, kemeja, dan lainnya.",
};

export default async function GaleriPage() {
  const items = await getGalleryItems();

  return (
    <>
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            as="h1"
            prefix="galeri"
            word="Karya"
            description="Dokumentasi produk dan kapasitas produksi kami. Foto asli akan terus kami perbarui dari pesanan yang selesai."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}

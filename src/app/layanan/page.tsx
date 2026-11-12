import type { Metadata } from "next";
import { Cta } from "@/components/sections/cta";
import { ServiceCard } from "@/components/sections/services";
import { SectionHeading } from "@/components/section-heading";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Layanan Custom Apparel RPMX",
  description:
    "Solusi produksi apparel custom RPMX mencakup casual jersey, cotton dan printed apparel, custom outerwear, serta sportswear.",
};

export default async function LayananPage() {
  const services = await getServices();

  return (
    <>
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            as="h1"
            prefix="layanan"
            word="RPMX"
            description="Dari casual jersey dan printed apparel hingga technical outerwear dan sportswear, RPMX membantu mengembangkan produk sesuai desain serta identitas pelanggan."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}

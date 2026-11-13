import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Hero } from "@/components/sections/hero";
import {
  AboutImmersive,
  Categories,
  DropsRow,
  SocialWall,
  Stores,
  WhyStaggered,
} from "@/components/sections/home";
import {
  CollectionCta,
  Grails,
  SaleGrid,
} from "@/components/sections/showcase";
import { NewArrivalsTabs } from "@/components/sections/new-arrivals-tabs";
import { BrandLines } from "@/components/sections/brand-lines";
import { getDrops, getProducts, getTestimonials } from "@/lib/data";
import { getSiteInfo } from "@/lib/site-info";

export default async function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [products, drops, testimonials] = await Promise.all([
    getProducts(),
    getDrops(),
    getTestimonials(),
  ]);

  const info = await getSiteInfo();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: info.name,
    description: info.description,
    url: siteUrl,
    telephone: info.phoneIntl,
    email: info.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kota Tasikmalaya",
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
    priceRange: "$$",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape "<" agar nilai dari Pengaturan Situs (CMS) tidak bisa menutup
          // tag <script> lebih awal — pola wajib dari panduan JSON-LD Next.
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* §3.1.1 Hero — media asli */}
      <Hero quickProducts={products.slice(0, 3)} />

      {/* §3.1.2 About — media + overlay */}
      <AboutImmersive />

      {/* Lini spesialisasi brand RPMX */}
      <BrandLines variant="compact" />

      {/* §3.1.3 Latest drops — editorial asimetris */}
      <DropsRow drops={drops} />

      {/* §3.1.4 Season sale */}
      <SaleGrid products={products} />

      {/* Layanan konveksi inti RPMX */}
      <Services />

      {/* §3.1.5 Why RPMX — staggered ghost */}
      <WhyStaggered />

      {/* §3.1.6 Categories masonry */}
      <Categories />

      {/* §3.1.7 Grails */}
      <Grails products={products} />

      {/* §3.1.9 New arrivals tabs */}
      <NewArrivalsTabs
        products={products}
        tabs={[
          { slug: "jersey", title: "Jersey" },
          { slug: "jaket", title: "Jaket" },
          { slug: "kaos", title: "Kaos" },
        ]}
      />

      {/* Alur produksi */}
      <Process />

      {/* §3.1.10 Social wall */}
      <SocialWall testimonials={testimonials} />

      {/* §3.1.8 Collection CTA */}
      <CollectionCta />

      {/* §3.1.12 Stores */}
      <Stores />
    </>
  );
}

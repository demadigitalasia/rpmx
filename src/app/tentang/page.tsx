import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Advantages } from "@/components/sections/advantages";
import { BrandLines } from "@/components/sections/brand-lines";
import { Cta } from "@/components/sections/cta";
import { Process } from "@/components/sections/process";
import { SectionHeading } from "@/components/section-heading";
import { getSiteInfo } from "@/lib/site-info";

export const metadata: Metadata = {
  title: "Tentang RPMX",
  description:
    "Kenali RPMX, produsen pakaian custom dengan empat lini spesialisasi: TRUE NORTH, POLARIS, OVERDRIVE, dan RPMX LIMITLESS.",
};



export default async function TentangPage() {
  const info = await getSiteInfo();
  const contactItems = [
    {
      icon: Phone,
      label: "Telepon / WhatsApp",
      value: info.phone,
      href: `tel:${info.phoneIntl}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: info.email,
      href: `mailto:${info.email}`,
    },
    {
      icon: MapPin,
      label: "Alamat Workshop",
      value: info.address,
      href: info.mapsUrl,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            as="h1"
            prefix="custom apparel"
            word="manufacturer"
            description="RPMX mengembangkan jersey custom dan sportswear untuk extreme sports, tim, serta komunitas."
          />

          <div className="mx-auto mt-10 max-w-3xl space-y-5 text-base leading-relaxed text-raw-muted">
            <p>
              RPMX merupakan brand apparel yang berfokus pada jersey custom, extreme sports, kualitas
              material, kreativitas desain, dan ketepatan proses produksi.
              Cakupan produksinya meliputi casual apparel, printed apparel,
              custom outerwear, hingga sportswear.
            </p>
            <p>
              Sebagai induk brand, RPMX menaungi empat lini dengan spesialisasi
              dan identitas masing-masing. Lini tersebut saling melengkapi dalam
              satu ekosistem pengembangan dan produksi untuk individu,
              komunitas, organisasi, dan clothing brand.
            </p>
          </div>
        </div>
      </section>

      <BrandLines />

      <section className="border-t border-raw-line py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            prefix="arah"
            word="RPMX"
            description="Kami terus mengembangkan kemampuan manufaktur apparel dan lini brand yang menjawab kebutuhan pasar."
          />
          <div className="mt-10 grid gap-px border border-raw-line bg-raw-line md:grid-cols-[0.8fr_1.2fr]">
            <article className="bg-raw p-6 sm:p-8">
              <p className="font-raw text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Our Vision
              </p>
              <h3 className="mt-4 font-raw text-xl font-bold uppercase tracking-tight text-raw-ink">
                Visi
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-raw-muted">
                Menjadi produsen custom apparel yang inovatif dan terpercaya,
                dengan solusi pakaian berkualitas dan lini brand yang memenuhi
                kebutuhan pasar apparel secara luas.
              </p>
            </article>
            <article className="bg-raw p-6 sm:p-8">
              <p className="font-raw text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Our Mission
              </p>
              <h3 className="mt-4 font-raw text-xl font-bold uppercase tracking-tight text-raw-ink">
                Misi
              </h3>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-raw-muted">
                <li>01. Menghadirkan apparel custom dengan standar material dan produksi yang baik.</li>
                <li>02. Mengembangkan desain dan teknik produksi mengikuti perkembangan industri.</li>
                <li>03. Memberikan fleksibilitas personalisasi sesuai kebutuhan dan identitas pelanggan.</li>
                <li>04. Membangun lini brand dengan spesialisasi dan karakter yang kuat.</li>
                <li>05. Menjadi mitra produksi bagi individu, komunitas, organisasi, dan clothing brand.</li>
              </ol>
            </article>
          </div>
        </div>
      </section>

      <Advantages />
      <Process />

      <section className="border-t border-raw-line bg-raw py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            prefix="kunjungi"
            word="Kami"
            description="Hubungi tim RPMX untuk informasi produk dan kebutuhan jersey custom."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group border border-raw-line bg-raw-surface p-6 transition-colors hover:border-accent/40"
              >
                <span className="flex h-11 w-11 items-center justify-center bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-mono text-xs font-semibold uppercase tracking-widest text-raw-muted">
                  {item.label}
                </h3>
                <p className="mt-2 break-all text-sm leading-relaxed text-raw-ink">
                  {item.value}
                </p>
              </a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href={info.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent px-6 py-3.5 text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Chat Langsung via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}

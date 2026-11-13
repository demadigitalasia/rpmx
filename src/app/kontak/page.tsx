import type { Metadata } from "next";
import { connection } from "next/server";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHeading } from "@/components/section-heading";
import { getServices } from "@/lib/data";
import { getSiteInfo } from "@/lib/site-info";

export const metadata: Metadata = {
  title: "Kontak & Minta Penawaran",
  description:
    "Hubungi RPMX untuk permintaan penawaran jersey custom, jaket custom, baju custom, dan produksi massal. Telepon/WA 0851-8085-1428.",
};

// Halaman dinamis: membaca query ?service= untuk pre-select layanan.
export const instant = false;

export default async function KontakPage({
  searchParams,
}: PageProps<"/kontak">) {
  await connection(); // halaman dinamis (membaca query service)
  const info = await getSiteInfo();
  const params = await searchParams;
  const prefill = typeof params.service === "string" ? params.service : "";
  const services = await getServices();

  return (
    <section className="relative overflow-hidden pb-28 pt-16 lg:pb-32 lg:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          prefix="hubungi"
          word="Kami"
          description="Isi formulir di bawah — tim kami akan menghubungi Anda dengan estimasi harga dan waktu pengerjaan. Tanpa komitmen."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Info kontak */}
          <div className="space-y-4 lg:col-span-2">
            <a
              href={`tel:${info.phoneIntl}`}
              className="block border border-raw-line bg-raw-surface p-6 transition-colors hover:border-accent/40"
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-raw-muted">
                Telepon / WhatsApp
              </p>
              <p className="mt-2 font-display text-xl font-semibold text-accent">
                {info.phone}
              </p>
            </a>
            <a
              href={`mailto:${info.email}`}
              className="block border border-raw-line bg-raw-surface p-6 transition-colors hover:border-accent/40"
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-raw-muted">
                Email
              </p>
              <p className="mt-2 break-all text-sm font-medium text-raw-ink">
                {info.email}
              </p>
            </a>
            <a
              href={info.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-raw-line bg-raw-surface p-6 transition-colors hover:border-accent/40"
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-raw-muted">
                Alamat Workshop
              </p>
              <p className="mt-2 text-sm leading-relaxed text-raw-ink">
                {info.address}
              </p>
            </a>
            <p className="px-2 text-xs leading-relaxed text-raw-muted">
              Butuh balasan cepat? Kirim pesan WhatsApp dengan detail produk,
              jumlah, dan target waktu Anda.
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <InquiryForm
              waUrl={info.whatsappUrl}
              services={services.map((s) => ({ slug: s.slug, title: s.title }))}
              initialService={
                services.some((s) => s.slug === prefill) ? prefill : undefined
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Metadata, Viewport } from "next";
import { Azeret_Mono, Source_Serif_4 } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { OfferPopup } from "@/components/offer-popup";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getSiteInfo } from "@/lib/site-info";
import "./globals.css";

/**
 * RAWLINE design spec §1.2:
 * - Azeret Mono = font untuk SEMUA teks (display sampai label)
 * - Source Serif 4 italic = aksen prefiks heading komposit saja
 */
const azeretMono = Azeret_Mono({
  variable: "--font-azeret",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif-accent",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** F1: metadata global dari Pengaturan Situs (fallback ke nilai kode). */
export async function generateMetadata(): Promise<Metadata> {
  const info = await getSiteInfo();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${info.name} — ${info.tagline} | Tasikmalaya`,
      template: `%s | ${info.name}`,
    },
    description: info.description,
    keywords: info.keywords,
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: info.name,
      title: `${info.name} — ${info.tagline}`,
      description: info.description,
      url: siteUrl,
      ...(info.ogImageUrl ? { images: [{ url: info.ogImageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${info.name} — ${info.tagline}`,
      description: info.description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const info = await getSiteInfo();

  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${azeretMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-raw text-raw-ink font-raw">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CartDrawer waNumber={info.phoneIntl} />
        <OfferPopup />
        <WhatsAppFloat href={info.whatsappUrl} />
      </body>
    </html>
  );
}

import { getSiteSettings } from "@/lib/data";
import { site } from "@/lib/site";

/**
 * F1 (ADMIN_CMS_REPORT): info situs yang sadar-pengaturan — nilai dari tabel
 * `site_settings` (diatur di /admin) dengan fallback ke konstanta `site` (kode).
 * Semua konsumen server (metadata, footer, kontak, WA) memakai resolver ini;
 * komponen client menerima nilai sebagai props dari induk server-nya.
 */

export type SiteInfo = {
  name: string;
  tagline: string;
  description: string;
  keywords: string[];
  phone: string;
  phoneIntl: string;
  email: string;
  address: string;
  addressShort: string;
  mapsUrl: string;
  whatsappUrl: string;
  ogImageUrl: string;
  socials: { label: string; href: string }[];
};

const DEFAULT_KEYWORDS = [
  "custom apparel manufacturer",
  "konveksi tasikmalaya",
  "jersey custom",
  "jaket custom",
  "kaos custom",
  "TRUE NORTH apparel",
  "POLARIS apparel",
  "OVERDRIVE jacket",
  "RPMX LIMITLESS sportswear",
  "jersey futsal",
  "sublimasi",
  "bordir",
  "produksi massal",
  "RPMX",
];

export async function getSiteInfo(): Promise<SiteInfo> {
  const s = await getSiteSettings();

  const phone = s.contactPhone || site.phone;
  const digits = phone.replace(/[^0-9]/g, "");
  const phoneIntl = digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits.startsWith("62")
      ? digits
      : `62${digits}`;
  const email = s.contactEmail || site.email;
  const name = s.siteName || site.name;
  const address = s.contactAddress || site.address;
  const mapsUrl =
    s.contactMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const whatsappUrl = `https://wa.me/${phoneIntl}?text=${encodeURIComponent(
    `Halo ${name}, saya ingin bertanya tentang layanan custom.`,
  )}`;

  const keywords = s.siteKeywords
    ? s.siteKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : DEFAULT_KEYWORDS;

  const socials = [
    { label: "X", href: s.socialX || "https://x.com" },
    { label: "Facebook", href: s.socialFacebook || "https://facebook.com" },
    { label: "Instagram", href: s.socialInstagram || "https://instagram.com" },
    { label: "TikTok", href: s.socialTikTok || "" },
  ].filter((social) => social.href.length > 0);

  return {
    name,
    tagline: s.siteTagline || site.tagline,
    description: s.siteDescription || site.description,
    keywords,
    phone,
    phoneIntl,
    email,
    address,
    addressShort: s.contactAddressShort || site.addressShort,
    mapsUrl,
    whatsappUrl,
    ogImageUrl: s.ogImageUrl ?? "",
    socials,
  };
}

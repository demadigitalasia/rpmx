export const site = {
  name: "RPMX",
  tagline: "Extreme Sports & Custom Jersey",
  description:
    "RPMX adalah brand apparel yang berfokus pada jersey custom, extreme sports, dan sportswear, dengan empat lini spesialisasi untuk berbagai kebutuhan apparel.",
  phone: "0851-8085-1428",
  phoneIntl: "+6285180851428",
  whatsappUrl:
    "https://wa.me/6285180851428?text=" +
    encodeURIComponent("Halo RPMX, saya ingin bertanya tentang layanan custom."),
  email: "renaldimaulanarahmanputra@email.com",
  addressShort: "Kota Tasikmalaya",
  address:
    "Kota Tasikmalaya",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Kp. Gununggede RT/RW 01/08 Kel. Gununggede Kec. Kawalu Kota Tasikmalaya",
    ),
} as const;

export const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Layanan" },
  { href: "/galeri", label: "Galeri" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
] as const;

export const inquiryStatuses = [
  "new",
  "contacted",
  "quoted",
  "done",
  "closed",
] as const;

export type InquiryStatus = (typeof inquiryStatuses)[number];

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  new: "Baru",
  contacted: "Dihubungi",
  quoted: "Penawaran Terkirim",
  done: "Selesai",
  closed: "Ditutup",
};

/** Mata uang tampilan. Konversi USD murni tampilan — data & pesanan tetap IDR. */
export type Currency = "IDR" | "USD";

/** Kurs statis USD untuk konversi tampilan (TASK B — tidak menyentuh data DB). */
export const USD_RATE = 15800;

/** Format harga ala RAWLINE: "Rp 185.000" atau "$ 12". */
export function formatPrice(value: number, currency: Currency = "IDR"): string {
  if (currency === "USD") {
    return "$ " + Math.round(value / USD_RATE).toLocaleString("en-US");
  }
  return "Rp " + value.toLocaleString("id-ID");
}

/** Format rupiah — pesan WhatsApp checkout & konteks non-toko tetap IDR. */
export function formatIDR(value: number): string {
  return formatPrice(value, "IDR");
}

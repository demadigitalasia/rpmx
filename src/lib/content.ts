import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Factory,
  Layers,
  MessageSquare,
  Package,
  PenTool,
  Scissors,
  Shirt,
  Truck,
  Users,
  Wind,
  Zap,
} from "lucide-react";
import type { GalleryItemRow, ServiceRow } from "@/db/schema";

/* ---------------------------------- Ikon ---------------------------------- */

export const serviceIcons: Record<string, LucideIcon> = {
  Shirt,
  Wind,
  Scissors,
  Factory,
  Package,
  Users,
  Zap,
  BadgeCheck,
  Layers,
  PenTool,
  MessageSquare,
  Truck,
};

export function getServiceIcon(name: string): LucideIcon {
  return serviceIcons[name] ?? Shirt;
}

/* ------------------------------ Keunggulan ------------------------------- */

export type Advantage = {
  title: string;
  description: string;
  icon: string;
};

export const advantages: Advantage[] = [
  {
    title: "Empat Lini Spesialis",
    description:
      "TRUE NORTH, POLARIS, OVERDRIVE, dan RPMX LIMITLESS memiliki fokus produk dan karakter masing-masing.",
    icon: "BadgeCheck",
  },
  {
    title: "Pengembangan Desain",
    description:
      "Desain dan personalisasi disesuaikan dengan kebutuhan serta identitas pelanggan.",
    icon: "PenTool",
  },
  {
    title: "Pilihan Material",
    description:
      "Material dipilih sesuai karakter produk, kenyamanan, dan kebutuhan pemakaian.",
    icon: "Layers",
  },
  {
    title: "Produksi Terpadu",
    description:
      "Satu ekosistem produksi melayani individu, komunitas, organisasi, dan clothing brand.",
    icon: "Factory",
  },
];

/* --------------------------------- Layanan -------------------------------- */

export const fallbackServices: ServiceRow[] = [
  {
    id: 1,
    slug: "jersey-custom",
    title: "Jersey Custom",
    description:
      "Pembuatan jersey bola, futsal, basket, voli, dan olahraga lainnya dengan pilihan bahan sublimasi dan printing berkualitas tinggi.",
    tags: ["Sublimasi", "Full Print", "Bordir"],
    icon: "Shirt",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    slug: "jaket-custom",
    title: "Jaket Custom",
    description:
      "Produksi jaket kasual, hoodie, hingga jaket olahraga dengan desain bebas. Cocok untuk komunitas, organisasi, dan corporate.",
    tags: ["Hoodie", "Varsity", "Windbreaker"],
    icon: "Wind",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    slug: "baju-custom",
    title: "Baju Custom",
    description:
      "Konveksi kaos, polo shirt, kemeja, dan baju kasual sesuai kebutuhan Anda. Minimal order fleksibel untuk berbagai skala.",
    tags: ["Kaos", "Polo", "Kemeja"],
    icon: "Scissors",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    slug: "produksi-massal",
    title: "Produksi Massal",
    description:
      "Layanan produksi dalam jumlah besar untuk kebutuhan corporate, event, sekolah, maupun reseller dengan harga kompetitif.",
    tags: ["Grosir", "Corporate", "Event"],
    icon: "Package",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 5,
    slug: "jersey-komunitas",
    title: "Jersey Komunitas",
    description:
      "Khusus untuk komunitas dan tim olahraga, kami menyediakan paket lengkap dari desain hingga pengiriman ke seluruh Indonesia.",
    tags: ["Tim", "Komunitas", "Kompetisi"],
    icon: "Users",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 6,
    slug: "produksi-cepat",
    title: "Produksi Cepat",
    description:
      "Tersedia layanan ekspres untuk kebutuhan mendesak. Kami berkomitmen menjaga kualitas meski dalam waktu singkat.",
    tags: ["Ekspres", "On-Time", "Terjamin"],
    icon: "Zap",
    sortOrder: 6,
    isActive: true,
  },
];

/* ---------------------------- Proses Produksi ----------------------------- */

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  icon: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Konsultasi & Brief",
    description:
      "Ceritakan kebutuhan Anda — jenis produk, jumlah, dan target waktu. Tim kami bantu memilih bahan dan estimasi biaya.",
    icon: "MessageSquare",
  },
  {
    step: "02",
    title: "Desain",
    description:
      "Tim desainer kami mewujudkan ide dan konsep Anda menjadi mockup desain yang siap diproduksi.",
    icon: "PenTool",
  },
  {
    step: "03",
    title: "Produksi",
    description:
      "Produksi dikerjakan konveksi profesional dengan mesin modern dan material pilihan.",
    icon: "Factory",
  },
  {
    step: "04",
    title: "Quality Control",
    description:
      "Setiap produk diperiksa satu per satu sebelum dikemas untuk memastikan kualitas terjaga.",
    icon: "BadgeCheck",
  },
  {
    step: "05",
    title: "Pengiriman",
    description:
      "Pesanan dikemas rapi dan dikirim dengan aman ke seluruh Indonesia sesuai jadwal yang disepakati.",
    icon: "Truck",
  },
];

/* ---------------------------------- Galeri -------------------------------- */

export const fallbackGallery: GalleryItemRow[] = [
  { id: 1, title: "Jersey Futsal Custom", category: "jersey", imageUrl: null, sortOrder: 1, isActive: true },
  { id: 2, title: "Jersey Bola Kompetisi", category: "jersey", imageUrl: null, sortOrder: 2, isActive: true },
  { id: 3, title: "Hoodie Komunitas", category: "jaket", imageUrl: null, sortOrder: 3, isActive: true },
  { id: 4, title: "Varsity Jacket", category: "jaket", imageUrl: null, sortOrder: 4, isActive: true },
  { id: 5, title: "Kaos Corporate", category: "kaos", imageUrl: null, sortOrder: 5, isActive: true },
  { id: 6, title: "Polo Shirt Custom", category: "polo", imageUrl: null, sortOrder: 6, isActive: true },
  { id: 7, title: "Kemeja Custom", category: "kemeja", imageUrl: null, sortOrder: 7, isActive: true },
  { id: 8, title: "Jersey Basket Custom", category: "jersey", imageUrl: null, sortOrder: 8, isActive: true },
];

export const galleryCategoryLabels: Record<string, string> = {
  jersey: "Jersey",
  jaket: "Jaket / Hoodie",
  kaos: "Kaos",
  polo: "Polo",
  kemeja: "Kemeja",
  merch: "Merch / Event",
};

/* --------------------------------- Marquee -------------------------------- */

export const marqueeTags = [
  "Sublimasi",
  "Full Print",
  "Bordir",
  "Hoodie",
  "Varsity",
  "Windbreaker",
  "Kaos",
  "Polo",
  "Kemeja",
  "Grosir",
  "Corporate",
  "Event",
  "Ekspres",
  "On-Time",
  "Terjamin",
  "Kirim Se-Indonesia",
];

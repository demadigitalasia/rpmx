export type BrandLine = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  description: string;
  productFocus: string[];
};

export const brandLines: BrandLine[] = [
  {
    slug: "true-north",
    name: "TRUE NORTH",
    tagline: "Casual Jersey & Lifestyle Apparel",
    summary:
      "Jersey kasual dan apparel berbahan jersey yang memadukan karakter sporty dengan gaya sehari-hari.",
    description:
      "TRUE NORTH berfokus pada jersey kasual dan apparel berbahan jersey untuk gaya hidup, komunitas, dan penggunaan sehari-hari. Desainnya fleksibel dan dapat disesuaikan dengan identitas pelanggan.",
    productFocus: [
      "Custom Casual Jersey",
      "Lifestyle Jersey",
      "Community Jersey",
      "Custom Jersey Printing",
      "Casual Apparel berbahan jersey",
    ],
  },
  {
    slug: "polaris",
    name: "POLARIS",
    tagline: "Cotton & Printed Apparel",
    summary:
      "Apparel cotton dan cetak custom untuk clothing brand, komunitas, merchandise, maupun kebutuhan personal.",
    description:
      "POLARIS berfokus pada pakaian berbahan cotton combed dengan pilihan material dan teknik sablon. Lini ini mengutamakan kenyamanan bahan serta hasil cetak untuk berbagai kebutuhan apparel custom.",
    productFocus: [
      "Cotton Combed 20s",
      "Cotton Combed 24s",
      "Custom T-Shirt",
      "Oversize T-Shirt",
      "Custom Printed Apparel",
      "Plastisol Printing",
      "Rubber Printing",
      "Teknik sablon lainnya",
    ],
  },
  {
    slug: "overdrive",
    name: "OVERDRIVE",
    tagline: "Custom Outerwear & Technical Jacket",
    summary:
      "Jaket custom yang sporty dan fungsional untuk riding, aktivitas outdoor, komunitas, dan penggunaan harian.",
    description:
      "OVERDRIVE berfokus pada jaket custom dengan karakter sporty, fungsional, dan dinamis. Desain, material, dan personalisasi dapat disesuaikan dengan kebutuhan aktivitas maupun identitas komunitas.",
    productFocus: [
      "Custom Riding Jacket",
      "Windbreaker Jacket",
      "Custom Printing Jacket",
      "Community Jacket",
      "Outdoor Jacket",
      "Custom Technical Outerwear",
    ],
  },
  {
    slug: "rpmx-limitless",
    name: "RPMX LIMITLESS",
    tagline: "Custom Sportswear & Performance Jersey",
    summary:
      "Jersey olahraga dan sportswear custom untuk tim, komunitas, serta kebutuhan kompetisi.",
    description:
      "RPMX LIMITLESS mengembangkan sportswear dengan mempertimbangkan desain, identitas tim, dan kebutuhan aktivitas olahraga. Lini ini melayani berbagai cabang olahraga, komunitas, dan kebutuhan kompetisi.",
    productFocus: [
      "Custom Sports Jersey",
      "Racing Jersey",
      "Cycling Jersey",
      "Running Jersey",
      "Team Jersey",
      "Community Sportswear",
      "Custom Sports Apparel",
    ],
  },
];

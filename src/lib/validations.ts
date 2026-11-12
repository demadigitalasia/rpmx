import { z } from "zod";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s().]+$/;

export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama terlalu panjang"),
  phone: z
    .string()
    .trim()
    .min(7, "Nomor telepon/WhatsApp tidak valid")
    .max(25, "Nomor telepon terlalu panjang")
    .regex(phonePattern, "Nomor hanya boleh berisi angka, spasi, + - ( )"),
  email: z
    .string()
    .trim()
    .max(120, "Email terlalu panjang")
    .regex(emailPattern, "Format email tidak valid")
    .optional()
    .or(z.literal("")),
  serviceSlug: z.string().trim().max(60).optional().or(z.literal("")),
  quantity: z.string().trim().max(40).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Ceritakan kebutuhan Anda minimal 10 karakter")
    .max(2000, "Pesan terlalu panjang (maks. 2000 karakter)"),
  // Honeypot anti-spam: manusia tidak mengisi (valuenya kosong);
  // bila terisi, API membalas ok tanpa menyimpan.
  website: z.string().max(200).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/** N2: langganan newsletter — email + honeypot "website" untuk bot. */
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Email tidak valid")
    .max(120, "Email terlalu panjang")
    .regex(emailPattern, "Format email tidak valid"),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

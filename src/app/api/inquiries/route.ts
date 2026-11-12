import { NextResponse } from "next/server";
import { inquiries } from "@/db/schema";
import { getDb } from "@/db";
import { fieldErrors, inquirySchema } from "@/lib/validations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Permintaan tidak valid." },
      { status: 400 },
    );
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Periksa kembali isian formulir.",
        errors: fieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  // Honeypot terisi → bot. Balas sukses palsu tanpa menyimpan apa pun.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Layanan formulir sedang tidak tersedia. Silakan hubungi kami langsung via WhatsApp atau telepon.",
      },
      { status: 503 },
    );
  }

  try {
    await db.insert(inquiries).values({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      serviceSlug: parsed.data.serviceSlug || null,
      quantity: parsed.data.quantity || null,
      message: parsed.data.message,
    });
  } catch (error) {
    console.error("[inquiries] gagal menyimpan:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Gagal menyimpan permintaan Anda. Silakan coba lagi atau hubungi kami via WhatsApp.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

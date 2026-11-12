import { NextResponse } from "next/server";
import { newsletterSubscribers } from "@/db/schema";
import { getDb } from "@/db";
import { newsletterSchema } from "@/lib/validations";

/**
 * N2 (ADMIN_CMS_REPORT): langganan newsletter — email tersimpan sungguhan di
 * `newsletter_subscribers`. Honeypot "website" → balas sukses palsu tanpa
 * menyimpan. Email duplikat tetap ok:true (tanpa kebocoran info kebotan).
 */
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

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Format email tidak valid." },
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
          "Layanan formulir sedang tidak tersedia. Silakan hubungi kami langsung via WhatsApp.",
      },
      { status: 503 },
    );
  }

  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email: parsed.data.email.toLowerCase(), source: "footer" })
      .onConflictDoNothing({ target: newsletterSubscribers.email });
  } catch (error) {
    console.error("[newsletter] gagal menyimpan:", error);
    return NextResponse.json(
      { ok: false, message: "Gagal menyimpan. Silakan coba lagi nanti." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

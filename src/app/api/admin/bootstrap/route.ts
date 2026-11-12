import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { getDb } from "@/db";
import { seedContent } from "@/db/seed-content";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin";

/**
 * Bootstrap konten (N1/ADMIN_CMS_REPORT): mengisi tabel konten kosong dari
 * katalog fallback — dipakai saat volume/DB baru (deploy pertama di server baru).
 * Guard: cookie admin. fresh=1 → timpa paksa (HATI-HATI: menimpa hasil edit admin).
 * POST /api/admin/bootstrap            → isi tabel kosong saja
 * POST /api/admin/bootstrap?fresh=1    → timpa semua tabel konten
 */
export async function POST(request: Request): Promise<Response> {
  const expected = process.env.ADMIN_PASSWORD;
  const store = await cookies();
  const authed =
    !!expected && store.get(ADMIN_COOKIE)?.value === adminToken(expected);
  if (!authed) return new Response("Tidak diizinkan.", { status: 401 });

  const db = getDb();
  if (!db) return new Response("Database tidak tersedia.", { status: 503 });

  const fresh = new URL(request.url).searchParams.get("fresh") === "1";
  const filled = await seedContent(db, { fresh });

  // Route Handler: updateTag TIDAK boleh (khusus Server Action) — pakai
  // revalidateTag dengan profile yang sama dengan cacheLife datanya.
  revalidateTag("services", "minutes");
  revalidateTag("gallery", "minutes");
  revalidateTag("testimonials", "minutes");
  revalidateTag("products", "minutes");
  revalidateTag("drops", "minutes");
  revalidatePath("/admin");

  return Response.json({ ok: true, fresh, filled });
}

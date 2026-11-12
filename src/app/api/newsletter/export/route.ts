import { desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin";

/**
 * N2: ekspor pelanggan newsletter sebagai CSV — hanya untuk admin (cek cookie).
 * GET /api/newsletter/export
 */
export async function GET(): Promise<Response> {
  const expected = process.env.ADMIN_PASSWORD;
  const store = await cookies();
  const authed =
    !!expected && store.get(ADMIN_COOKIE)?.value === adminToken(expected);
  if (!authed) {
    return new Response("Tidak diizinkan.", { status: 401 });
  }

  const db = getDb();
  if (!db) return new Response("Database tidak tersedia.", { status: 503 });

  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt));

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const lines = [
    "email,source,created_at",
    ...rows.map((r) =>
      [escape(r.email), escape(r.source), escape(r.createdAt.toISOString())].join(","),
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="rpmx-newsletter.csv"',
    },
  });
}

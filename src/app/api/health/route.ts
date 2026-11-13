import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/db";

/** Health endpoint untuk uptime monitor: app selalu "ok" bila serve;
 *  status DB dilaporkan di body (bukan gate — app memang dirancang
 *  hidup dengan fallback saat DB mati). robots.txt jadi healthcheck container. */
export async function GET() {
  await connection(); // runtime per-request (cacheComponents)

  const db = getDb();
  let dbStatus = "down";
  if (db) {
    try {
      await db.execute(sql`select 1`);
      dbStatus = "up";
    } catch {
      // DB gagal — app tetap serve fallback konten
    }
  }

  return NextResponse.json({ status: "ok", db: dbStatus });
}

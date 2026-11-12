import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: postgres.Sql | undefined;

/**
 * Client DB yang dibuat lazily: build/deploy tanpa DATABASE_URL tetap jalan
 * (halaman publik memakai fallback konten statis), sedangkan runtime
 * dengan DATABASE_URL akan terhubung ke PostgreSQL.
 */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  client ??= postgres(url, { max: 10, idle_timeout: 20 });
  return drizzle(client, { schema });
}

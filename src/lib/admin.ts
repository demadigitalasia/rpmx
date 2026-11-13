import { createHash } from "crypto";

export const ADMIN_COOKIE = "rpmx_admin";

export function adminToken(password: string): string {
  return createHash("sha256").update(`rpmx-admin:${password}`).digest("hex");
}

/* Rate limit login (audit P1-2) — in-memory, cukup untuk deployment single-container.
   5 password gagal dari satu IP → tolak 15 menit. Reset saat container restart. */
const LOGIN_MAX_FAILURES = 5;
const LOGIN_BLOCK_MS = 15 * 60 * 1000;
const failedLogins = new Map<string, { count: number; blockedUntil: number }>();

/** Menit tersisa bila IP sedang diblokir, 0 bila tidak. */
export function loginBlockMinutes(ip: string): number {
  const entry = failedLogins.get(ip);
  if (!entry || entry.blockedUntil <= Date.now()) return 0;
  return Math.max(1, Math.ceil((entry.blockedUntil - Date.now()) / 60000));
}

export function recordLoginFailure(ip: string): void {
  const entry = failedLogins.get(ip) ?? { count: 0, blockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= LOGIN_MAX_FAILURES) {
    entry.blockedUntil = Date.now() + LOGIN_BLOCK_MS;
    entry.count = 0;
  }
  failedLogins.set(ip, entry);
  // Jaga map tetap kecil: buang entri yang tidak lagi memblokir.
  if (failedLogins.size > 1000) {
    const now = Date.now();
    for (const [key, value] of failedLogins) {
      if (value.blockedUntil <= now) failedLogins.delete(key);
    }
  }
}

export function clearLoginFailures(ip: string): void {
  failedLogins.delete(ip);
}

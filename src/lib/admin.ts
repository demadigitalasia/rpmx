import { createHash } from "crypto";

export const ADMIN_COOKIE = "rpmx_admin";

export function adminToken(password: string): string {
  return createHash("sha256").update(`rpmx-admin:${password}`).digest("hex");
}

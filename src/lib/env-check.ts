/**
 * Env-guard produksi (CODEX_COMMANDS TASK E / ADMIN_AUDIT_REPORT #H2):
 * password admin lemah di produksi = gagal cepat dengan pesan jelas,
 * sebelum login punya kesempatan dibobol brute force. Mode dev tidak
 * terpengaruh (password contoh admin123 tetap dipakai di lokal).
 */
const WEAK_PASSWORDS = new Set(["admin123", "changeme"]);

function passwordProblem(password: string | undefined): string | null {
  if (!password) {
    return "ADMIN_PASSWORD belum diset — login admin mati total.";
  }
  if (WEAK_PASSWORDS.has(password) || password.length < 8) {
    return "ADMIN_PASSWORD terlalu lemah — pakai minimal 8 karakter yang tidak mudah ditebak (bukan admin123/changeme).";
  }
  return null;
}

/** Pesan masalah password di produksi, atau null bila aman/masih dev. */
export function adminPasswordProblem(): string | null {
  if (process.env.NODE_ENV !== "production") return null;
  return passwordProblem(process.env.ADMIN_PASSWORD);
}

/** Dipanggil di server action: lempar error jelas bila env produksi bermasalah. */
export function validateProdEnv(): void {
  const problem = adminPasswordProblem();
  if (problem) {
    throw new Error(`[env] ${problem}`);
  }
}

import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Memuat .env.local / .env ke process.env (variabel yang sudah ada tidak
 * ditimpa). Dipakai skrip Node/tsx di luar Next.js yang tidak otomatis
 * membaca file env Next.
 */
export function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    let content;
    try {
      content = readFileSync(join(process.cwd(), file), "utf8");
    } catch {
      continue;
    }
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^["'](.*)["']$/, "$1");
      }
    }
  }
}

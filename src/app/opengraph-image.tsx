import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "RPMX — Konveksi & Brand Jersey Custom";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoDataUri = await readFile(
    join(process.cwd(), "public", "rpmx-logo.png"),
  )
    .then((buf) => `data:image/png;base64,${buf.toString("base64")}`)
    .catch(() => null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      >
        {logoDataUri ? (
          <img
            src={logoDataUri}
            width={720}
            height={169}
            alt="RPMX"
          />
        ) : (
          <div style={{ fontSize: 110, fontWeight: 800, color: "#f4f4f5" }}>
            RPMX
          </div>
        )}
        <div
          style={{
            marginTop: 34,
            fontSize: 34,
            color: "#a1a1aa",
            display: "flex",
          }}
        >
          Konveksi &amp; Brand Jersey Custom
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 26,
            color: "#71717a",
            display: "flex",
          }}
        >
          Jersey · Jaket · Kaos · Produksi Massal — Tasikmalaya
        </div>
        <div
          style={{
            marginTop: 40,
            width: 220,
            height: 10,
            backgroundColor: "#e83030",
            borderRadius: 999,
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}

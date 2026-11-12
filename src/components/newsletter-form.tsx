"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * N2 (ADMIN_CMS_REPORT): form newsletter yang benar-benar menyimpan email ke
 * `newsletter_subscribers` via /api/newsletter (sebelumnya hanya tampilan).
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), website: "" }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean }
        | null;
      if (res.ok && data?.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="mt-4 font-raw text-sm font-bold uppercase tracking-[0.14em] text-accent">
        Terdaftar — sampai jumpa di drop berikutnya.
      </p>
    );
  }

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <div className="flex items-end gap-3">
        <label className="sr-only" htmlFor="footer-email">
          Email
        </label>
        <input
          id="footer-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="EMAIL ANDA"
          aria-describedby="footer-email-note"
          className="input-underline w-full py-2 text-sm"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="font-raw pb-2 text-sm font-bold uppercase tracking-[0.14em] text-raw-ink transition-colors hover:text-accent disabled:opacity-50"
        >
          {status === "sending" ? "Mengirim…" : "Send"}
        </button>
      </div>
      {status === "error" && (
        <p
          role="alert"
          className="mt-2 font-raw text-xs uppercase tracking-[0.14em] text-accent"
        >
          Gagal mendaftar — coba lagi, atau hubungi kami via WhatsApp.
        </p>
      )}
      <span id="footer-email-note" className="sr-only">
        Email Anda disimpan untuk kabar drop dan penawaran RPMX.
      </span>
    </form>
  );
}

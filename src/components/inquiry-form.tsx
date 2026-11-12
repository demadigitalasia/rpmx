"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, MessageCircle, Send } from "lucide-react";
import { site } from "@/lib/site";

type ServiceOption = { slug: string; title: string };

type FormState = {
  name: string;
  phone: string;
  email: string;
  serviceSlug: string;
  quantity: string;
  message: string;
  website: string; // honeypot
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  serviceSlug: "",
  quantity: "",
  message: "",
  website: "",
};

const inputClass =
  "w-full border border-raw-line bg-raw px-4 py-3 font-raw text-sm text-raw-ink placeholder:text-raw-muted/60 outline-none transition focus:border-accent";

export function InquiryForm({
  waUrl,
  services,
  initialService,
}: {
  /** URL WhatsApp dari Pengaturan Situs (dilempar halaman kontak). */
  waUrl?: string;
  services: ServiceOption[];
  initialService?: string;
}) {
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    serviceSlug: initialService ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const set = (key: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [key]: event.target.value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrors({});
    setErrorMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; errors?: Record<string, string>; message?: string }
        | null;

      if (res.ok && data?.ok) {
        setStatus("success");
        return;
      }

      if (data?.errors) setErrors(data.errors);
      setErrorMessage(
        data?.message ?? "Periksa kembali isian formulir, lalu coba lagi.",
      );
      setStatus("error");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Terjadi kesalahan jaringan. Silakan coba lagi atau hubungi kami via WhatsApp.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center border border-accent/30 bg-raw-surface p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-accent" />
        <h3 className="mt-5 font-display text-2xl font-semibold">
          Permintaan Terkirim!
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-raw-muted">
          Terima kasih, <span className="text-raw-ink">{form.name}</span>.
          Permintaan penawaran Anda sudah kami terima dan akan segera kami
          tindak lanjuti.
        </p>
        <a
          href={waUrl ?? site.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-accent mt-6 px-5 py-3 text-sm"
        >
          <MessageCircle className="h-4 w-4" />
          Ingin lebih cepat? Chat WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border border-raw-line bg-raw-surface p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-raw-ink">
            Nama <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Nama Anda"
            value={form.name}
            onChange={set("name")}
            className={inputClass}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-raw-ink">
            No. WhatsApp / Telepon <span className="text-accent">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            maxLength={25}
            autoComplete="tel"
            placeholder="08xx xxxx xxxx"
            value={form.phone}
            onChange={set("phone")}
            className={inputClass}
          />
          {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-raw-ink">
            Email <span className="text-raw-muted">(opsional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={120}
            autoComplete="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={set("email")}
            className={inputClass}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="serviceSlug" className="mb-1.5 block text-sm font-medium text-raw-ink">
            Jenis Layanan
          </label>
          <select
            id="serviceSlug"
            name="serviceSlug"
            value={form.serviceSlug}
            onChange={set("serviceSlug")}
            className={inputClass}
          >
            <option value="">— Pilih layanan —</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="quantity" className="mb-1.5 block text-sm font-medium text-raw-ink">
            Perkiraan Jumlah <span className="text-raw-muted">(opsional)</span>
          </label>
          <input
            id="quantity"
            name="quantity"
            type="text"
            maxLength={40}
            placeholder="mis. 12 pcs, 1 tim (18 orang), 500 pcs"
            value={form.quantity}
            onChange={set("quantity")}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-raw-ink">
            Detail Kebutuhan <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            maxLength={2000}
            placeholder="Ceritakan produk yang Anda butuhkan: jenis, desain/warna, bahan, target waktu, dll."
            value={form.message}
            onChange={set("message")}
            className={`${inputClass} resize-y`}
          />
          {errors.message && (
            <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>
          )}
        </div>

        {/* Honeypot anti-spam — tersembunyi dari manusia */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={set("website")}
          />
        </div>
      </div>

      {status === "error" && errorMessage && (
        <p className="mt-5 border border-red-500/30 bg-red-500/10 px-4 py-3 font-raw text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-accent mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Mengirim…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Kirim Permintaan Penawaran
          </>
        )}
      </button>
      <p className="mt-3 text-xs text-raw-muted">
        Data Anda hanya digunakan untuk keperluan penawaran dan tidak dibagikan
        ke pihak lain.
      </p>
    </form>
  );
}

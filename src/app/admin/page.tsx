import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import {
  CheckCircle2,
  LockKeyhole,
  LogOut,
  MessageCircle,
  Plus,
} from "lucide-react";
import {
  updateStatusAction,
  logoutAction,
  loginAction,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
  toggleProductFlag,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialActive,
  toggleDrop,
  updateDropImageUrl,
  siteSettingsAction,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryItemActive,
} from "./actions";
import { getDb } from "@/db";
import {
  drops,
  galleryItems,
  inquiries,
  newsletterSubscribers,
  productCategories,
  products,
  services,
  testimonials,
} from "@/db/schema";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin";
import { adminPasswordProblem } from "@/lib/env-check";
import { getSiteSettings } from "@/lib/data";
import { getSiteInfo } from "@/lib/site-info";
import { formatIDR } from "@/lib/site";
import {
  inquiryStatusLabels,
  inquiryStatuses,
  type InquiryStatus,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin — RPMX",
  robots: { index: false, follow: false },
};

// Halaman admin memakai cookies() — render blocking saat request, bukan prerender.
export const instant = false;

const statusStyles: Record<InquiryStatus, string> = {
  new: "bg-accent/15 text-accent border-accent/40",
  contacted: "bg-sky-500/15 text-sky-300 border-sky-500/40",
  quoted: "bg-violet-500/15 text-violet-300 border-violet-500/40",
  done: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  closed: "bg-raw-muted/15 text-raw-muted border-raw-muted/40",
};

const inputClass =
  "w-full border border-raw-line bg-raw px-4 py-3 font-raw text-sm text-raw-ink outline-none transition focus:border-accent";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export default async function AdminPage({
  searchParams,
}: PageProps<"/admin">) {
  const params = await searchParams;
  const loginError = params.error === "1";
  const one = (v: unknown) => (typeof v === "string" ? v : "");
  const perr = one(params.perr);
  const pok = one(params.pok);
  const editId = Number(one(params.edit)) || null;
  const teditId = Number(one(params.tedit)) || null;
  const seditId = Number(one(params.sedit)) || null;
  const geditId = Number(one(params.gedit)) || null;
  const showNewForm = one(params.new) === "1";
  const showServiceForm = one(params.snew) === "1";
  const showGalleryForm = one(params.gnew) === "1";
  const store = await cookies();
  const expected = process.env.ADMIN_PASSWORD;
  const authed =
    !!expected && store.get(ADMIN_COOKIE)?.value === adminToken(expected);

  // Env-guard produksi (TASK E): password lemah/absen → kunci dashboard dgn pesan jelas.
  const passwordProblem = adminPasswordProblem();
  if (passwordProblem) {
    return (
      <Notice
        title="Admin dikunci"
        description={`${passwordProblem} Perbaiki variabel di server produksi, lalu restart aplikasi. (Mode dev tidak terpengaruh.)`}
      />
    );
  }

  if (!expected) {
    return (
      <Notice
        title="Admin belum dikonfigurasi"
        description="Set variabel ADMIN_PASSWORD di file .env.local (dev) atau .env (produksi), lalu restart server."
      />
    );
  }

  if (!authed) {
    return (
      <section className="flex min-h-screen items-center pt-[72px]">
        <div className="mx-auto w-full max-w-md px-4 py-16">
          <div className="border border-raw-line bg-raw-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center bg-accent/10 text-accent">
              <LockKeyhole className="h-6 w-6" />
            </span>
            <h1 className="mt-5 font-raw text-2xl font-bold uppercase tracking-tight text-raw-ink">
              Login Admin RPMX
            </h1>
            <form action={loginAction} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block font-raw text-xs font-bold uppercase tracking-[0.14em] text-raw-muted"
                >
                  Password Admin
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  autoComplete="current-password"
                  className={inputClass}
                />
              </div>
              {loginError && (
                <p
                  role="alert"
                  className="border border-accent bg-accent/10 px-4 py-3 font-raw text-xs font-bold uppercase tracking-[0.14em] text-accent"
                >
                  Password salah — coba lagi
                </p>
              )}
              <button type="submit" className="btn-accent w-full px-5 py-3.5 text-sm">
                Masuk
              </button>
            </form>
          </div>
          <p className="mt-4 text-center font-raw text-[10px] uppercase tracking-[0.2em] text-raw-muted">
            FIG. ADMIN — internal use only
          </p>
        </div>
      </section>
    );
  }

  const db = getDb();
  if (!db) {
    return (
      <Notice
        title="Database belum terhubung"
        description="Set DATABASE_URL pada environment, lalu jalankan migrasi dan seed."
      />
    );
  }

  let rows: (typeof inquiries.$inferSelect)[] = [];
  try {
    rows = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt))
      .limit(200);
  } catch {
    return (
      <Notice
        title="Gagal membaca database"
        description="Pastikan PostgreSQL berjalan dan skema sudah dimigrasikan."
      />
    );
  }

  // TASK C: katalog untuk section PRODUK (termasuk produk nonaktif agar bisa dipulihkan)
  // TASK D: testimoni & drops | F1: pengaturan | F2: layanan | F3: galeri | N2: newsletter
  let productRows: (typeof products.$inferSelect)[] = [];
  let categoryRows: (typeof productCategories.$inferSelect)[] = [];
  let testimonialRows: (typeof testimonials.$inferSelect)[] = [];
  let dropRows: (typeof drops.$inferSelect)[] = [];
  let serviceRows: (typeof services.$inferSelect)[] = [];
  let galleryRows: (typeof galleryItems.$inferSelect)[] = [];
  let subscriberRows: (typeof newsletterSubscribers.$inferSelect)[] = [];
  let catalogError = false;
  try {
    productRows = await db
      .select()
      .from(products)
      .orderBy(asc(products.sortOrder));
    categoryRows = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.isActive, true))
      .orderBy(asc(productCategories.sortOrder));
    testimonialRows = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.sortOrder));
    dropRows = await db.select().from(drops).orderBy(asc(drops.sortOrder));
    serviceRows = await db
      .select()
      .from(services)
      .orderBy(asc(services.sortOrder));
    galleryRows = await db
      .select()
      .from(galleryItems)
      .orderBy(asc(galleryItems.sortOrder));
    subscriberRows = await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt));
  } catch {
    catalogError = true;
  }
  // F1: pengaturan situs (cached & error-safe — fallback nilai kode)
  const settings = await getSiteSettings();
  const info = await getSiteInfo();

  const newCount = rows.filter((r) => r.status === "new").length;

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-[104px] sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-raw text-xs font-bold uppercase tracking-[0.25em] text-accent">
            Admin RPMX
          </p>
          <h1 className="mt-2 font-raw text-3xl font-bold uppercase tracking-tight text-raw-ink">
            Permintaan Penawaran
          </h1>
          <p className="mt-1 font-raw text-xs uppercase tracking-[0.14em] text-raw-muted tabular-nums">
            {rows.length} inquiry total · {newCount} belum ditindaklanjuti
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="btn-boxed btn-boxed-hover inline-flex items-center gap-2 px-4 py-2.5 text-xs"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </form>
      </div>

      {/* Feedback aksi produk (TASK C) — error/sukses via query param */}
      {(perr || pok) && (
        <p
          role="status"
          className={`mt-6 border px-4 py-3 font-raw text-xs font-bold uppercase tracking-[0.14em] ${
            perr
              ? "border-accent bg-accent/10 text-accent"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {perr || pok}
        </p>
      )}

      {/* ——— Section PRODUK (TASK C): kelola katalog tanpa SQL ——— */}
      <section
        id="produk"
        className="mt-10 border border-raw-line bg-raw-surface p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-raw text-xl font-bold uppercase tracking-tight text-raw-ink">
              Katalog Produk
            </h2>
            <p className="mt-1 font-raw text-xs uppercase tracking-[0.14em] text-raw-muted tabular-nums">
              {productRows.length} produk ·{" "}
              {productRows.filter((p) => p.isActive).length} aktif
            </p>
          </div>
          <Link
            href={showNewForm ? "/admin#produk" : "/admin?new=1#produk"}
            className="btn-boxed btn-boxed-hover inline-flex items-center gap-2 px-4 py-2.5 text-xs"
          >
            <Plus className="h-4 w-4" />
            {showNewForm ? "Tutup Form" : "Tambah Produk"}
          </Link>
        </div>

        {catalogError ? (
          <p className="mt-4 border border-accent/40 bg-accent/10 px-4 py-3 font-raw text-xs uppercase tracking-[0.14em] text-accent">
            Gagal memuat katalog — cek koneksi database.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {showNewForm && (
              <ProductForm
                action={createProduct}
                categories={categoryRows}
                submitLabel="Tambah Produk"
              />
            )}
            {productRows.map((p) => (
              <ProductRowItem
                key={p.id}
                product={p}
                editing={editId === p.id}
                categoryRows={categoryRows}
              />
            ))}
          </div>
        )}
      </section>

      {/* ——— Section TESTIMONI (TASK D): mengontrol Social Wall beranda ——— */}
      <section
        id="testimoni"
        className="mt-6 border border-raw-line bg-raw-surface p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-raw text-xl font-bold uppercase tracking-tight text-raw-ink">
              Testimoni
            </h2>
            <p className="mt-1 font-raw text-xs uppercase tracking-[0.14em] text-raw-muted tabular-nums">
              {testimonialRows.length} testimoni ·{" "}
              {testimonialRows.filter((t) => t.isActive).length} tampil di Social
              Wall
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {testimonialRows.map((t) => (
            <TestimonialRowItem
              key={t.id}
              testimonial={t}
              editing={teditId === t.id}
            />
          ))}
        </div>
      </section>

      {/* ——— Section DROPS (TASK D): halaman /drops ——— */}
      <section
        id="drops"
        className="mt-6 border border-raw-line bg-raw-surface p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-raw text-xl font-bold uppercase tracking-tight text-raw-ink">
              Drops
            </h2>
            <p className="mt-1 font-raw text-xs uppercase tracking-[0.14em] text-raw-muted tabular-nums">
              {dropRows.length} drop · {dropRows.filter((d) => d.isActive).length}{" "}
              aktif
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {dropRows.map((d) => (
            <DropRowItem key={d.id} drop={d} />
          ))}
        </div>
      </section>

      {/* ——— Section LAYANAN (F2): halaman /layanan + beranda ——— */}
      <section
        id="layanan"
        className="mt-6 border border-raw-line bg-raw-surface p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-raw text-xl font-bold uppercase tracking-tight text-raw-ink">
              Layanan
            </h2>
            <p className="mt-1 font-raw text-xs uppercase tracking-[0.14em] text-raw-muted tabular-nums">
              {serviceRows.length} layanan ·{" "}
              {serviceRows.filter((s) => s.isActive).length} aktif
            </p>
          </div>
          <Link
            href={showServiceForm ? "/admin#layanan" : "/admin?snew=1#layanan"}
            className="btn-boxed btn-boxed-hover inline-flex items-center gap-2 px-4 py-2.5 text-xs"
          >
            <Plus className="h-4 w-4" />
            {showServiceForm ? "Tutup Form" : "Tambah Layanan"}
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {showServiceForm && (
            <ServiceForm action={createService} submitLabel="Tambah Layanan" />
          )}
          {serviceRows.map((s) => (
            <ServiceRowItem key={s.id} service={s} editing={seditId === s.id} />
          ))}
        </div>
      </section>

      {/* ——— Section GALERI (F3): halaman /galeri ——— */}
      <section
        id="galeri"
        className="mt-6 border border-raw-line bg-raw-surface p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-raw text-xl font-bold uppercase tracking-tight text-raw-ink">
              Galeri
            </h2>
            <p className="mt-1 font-raw text-xs uppercase tracking-[0.14em] text-raw-muted tabular-nums">
              {galleryRows.length} item ·{" "}
              {galleryRows.filter((g) => g.isActive).length} aktif
            </p>
          </div>
          <Link
            href={showGalleryForm ? "/admin#galeri" : "/admin?gnew=1#galeri"}
            className="btn-boxed btn-boxed-hover inline-flex items-center gap-2 px-4 py-2.5 text-xs"
          >
            <Plus className="h-4 w-4" />
            {showGalleryForm ? "Tutup Form" : "Tambah Item"}
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {showGalleryForm && (
            <GalleryForm action={createGalleryItem} submitLabel="Tambah Item" />
          )}
          {galleryRows.map((g) => (
            <GalleryRowItem
              key={g.id}
              item={g}
              editing={geditId === g.id}
            />
          ))}
        </div>
      </section>

      {/* ——— Section NEWSLETTER (N2): pelanggan email ——— */}
      <section
        id="newsletter"
        className="mt-6 border border-raw-line bg-raw-surface p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-raw text-xl font-bold uppercase tracking-tight text-raw-ink">
              Newsletter
            </h2>
            <p className="mt-1 font-raw text-xs uppercase tracking-[0.14em] text-raw-muted tabular-nums">
              {subscriberRows.length} pelanggan terdaftar
            </p>
          </div>
          {subscriberRows.length > 0 && (
            <a
              href="/api/newsletter/export"
              className="btn-boxed btn-boxed-hover px-4 py-2.5 text-xs"
            >
              Unduh CSV
            </a>
          )}
        </div>
        {subscriberRows.length === 0 ? (
          <p className="mt-4 border border-dashed border-raw-line p-8 text-center font-raw text-xs uppercase tracking-[0.14em] text-raw-muted">
            Belum ada pelanggan — form di footer menyimpan email ke sini.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-raw-line border border-raw-line bg-raw">
            {subscriberRows.slice(0, 100).map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <span className="truncate font-raw text-sm text-raw-ink">
                  {r.email}
                </span>
                <span className="shrink-0 font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted tabular-nums">
                  {dateFormatter.format(r.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ——— Section PENGATURAN SITUS & SEO (F1) ——— */}
      <section
        id="pengaturan"
        className="mt-6 border border-raw-line bg-raw-surface p-6"
      >
        <div>
          <h2 className="font-raw text-xl font-bold uppercase tracking-tight text-raw-ink">
            Pengaturan Situs &amp; SEO
          </h2>
          <p className="mt-1 font-raw text-xs uppercase tracking-[0.14em] text-raw-muted">
            Identitas, kontak, sosmed, meta situs — dipakai footer, kontak,
            WhatsApp, dan Google.
          </p>
        </div>
        <form
          action={siteSettingsAction}
          className="mt-4 grid gap-4 border border-raw-line bg-raw p-5 sm:grid-cols-2"
        >
          <Field label="Nama Situs">
            <input
              name="siteName"
              defaultValue={info.name}
              className={inputClass}
            />
          </Field>
          <Field label="Tagline">
            <input
              name="siteTagline"
              defaultValue={info.tagline}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field
              label="Deskripsi Situs (meta description)"
              hint="±150–160 karakter, tampil di hasil pencarian Google"
            >
              <textarea
                name="siteDescription"
                rows={2}
                defaultValue={info.description}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Keywords (pisah koma)">
              <textarea
                name="siteKeywords"
                rows={2}
                defaultValue={info.keywords.join(", ")}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Telepon / WhatsApp" hint="mis. 0851-8085-1428">
            <input
              name="contactPhone"
              defaultValue={info.phone}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              name="contactEmail"
              type="email"
              defaultValue={info.email}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Alamat Lengkap">
              <textarea
                name="contactAddress"
                rows={2}
                defaultValue={info.address}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Alamat Singkat (footer)">
            <input
              name="contactAddressShort"
              defaultValue={info.addressShort}
              className={inputClass}
            />
          </Field>
          <Field label="URL Google Maps (opsional)">
            <input
              name="contactMapsUrl"
              defaultValue={settings.contactMapsUrl ?? ""}
              placeholder="https://maps.google.com/…"
              className={inputClass}
            />
          </Field>
          <div className="border-t border-raw-line pt-4 sm:col-span-2">
            <p className="font-raw text-[11px] font-bold uppercase tracking-[0.2em] text-raw-muted">
              Sosial Media (kosongkan yang tidak aktif)
            </p>
          </div>
          <Field label="X / Twitter">
            <input
              name="socialX"
              defaultValue={settings.socialX ?? ""}
              placeholder="https://x.com/rpmx"
              className={inputClass}
            />
          </Field>
          <Field label="Instagram">
            <input
              name="socialInstagram"
              defaultValue={settings.socialInstagram ?? ""}
              placeholder="https://instagram.com/rpmx"
              className={inputClass}
            />
          </Field>
          <Field label="Facebook">
            <input
              name="socialFacebook"
              defaultValue={settings.socialFacebook ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="TikTok">
            <input
              name="socialTikTok"
              defaultValue={settings.socialTikTok ?? ""}
              className={inputClass}
            />
          </Field>
          <div className="border-t border-raw-line pt-4 sm:col-span-2">
            <p className="font-raw text-[11px] font-bold uppercase tracking-[0.2em] text-raw-muted">
              SEO &amp; Berbagi
            </p>
          </div>
          <div className="sm:col-span-2">
            <Field
              label="OG Image URL"
              hint="gambar saat link dibagikan ke WA/IG/FB (kosong = bawaan)"
            >
              <input
                name="ogImageUrl"
                defaultValue={settings.ogImageUrl ?? ""}
                placeholder="/media/og-rpmx.jpg"
                className={inputClass}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-accent px-6 py-3 text-sm">
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </section>

      {rows.length === 0 ? (
        <div className="mt-10 border border-dashed border-raw-line p-12 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-raw-muted" />
          <p className="mt-4 font-raw text-sm uppercase tracking-[0.14em] text-raw-muted">
            Belum ada permintaan penawaran yang masuk.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {rows.map((row) => {
            const status = (
              inquiryStatuses as readonly string[]
            ).includes(row.status)
              ? (row.status as InquiryStatus)
              : "new";
            return (
              <article
                key={row.id}
                className="border border-raw-line bg-raw-surface p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-raw text-lg font-bold uppercase tracking-tight text-raw-ink">
                        {row.name}
                      </h2>
                      <span
                        className={`border px-2.5 py-0.5 font-raw text-[10px] font-bold uppercase tracking-[0.14em] ${statusStyles[status]}`}
                      >
                        {inquiryStatusLabels[status]}
                      </span>
                    </div>
                    <p className="mt-1 font-raw text-xs text-raw-muted tabular-nums">
                      #{row.id} · {dateFormatter.format(row.createdAt)}
                    </p>
                  </div>
                  <form action={updateStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={row.id} />
                    <select
                      key={status}
                      name="status"
                      defaultValue={status}
                      aria-label={`Ubah status inquiry #${row.id}`}
                      className="border border-raw-line bg-raw px-3 py-2 font-raw text-xs uppercase text-raw-ink outline-none focus:border-accent [&>option]:bg-raw"
                    >
                      {inquiryStatuses.map((s) => (
                        <option key={s} value={s}>
                          {inquiryStatusLabels[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="btn-accent px-3 py-2 text-xs"
                    >
                      Simpan
                    </button>
                  </form>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="font-raw text-[10px] uppercase tracking-[0.18em] text-raw-muted">
                      Kontak
                    </dt>
                    <dd className="mt-1 flex flex-col">
                      <a
                        href={`tel:${row.phone.replace(/^0/, "+62")}`}
                        className="font-raw text-sm text-raw-ink transition-colors hover:text-accent"
                      >
                        {row.phone}
                      </a>
                      {row.email && (
                        <a
                          href={`mailto:${row.email}`}
                          className="break-all font-raw text-xs text-raw-muted transition-colors hover:text-accent"
                        >
                          {row.email}
                        </a>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-raw text-[10px] uppercase tracking-[0.18em] text-raw-muted">
                      Layanan
                    </dt>
                    <dd className="mt-1 font-raw text-sm uppercase text-raw-ink">
                      {row.serviceSlug ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-raw text-[10px] uppercase tracking-[0.18em] text-raw-muted">
                      Jumlah
                    </dt>
                    <dd className="mt-1 font-raw text-sm text-raw-ink">
                      {row.quantity ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-raw text-[10px] uppercase tracking-[0.18em] text-raw-muted">
                      Tindak Lanjut
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`https://wa.me/${row.phone.replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-raw text-xs font-bold uppercase tracking-wide text-emerald-400 transition-colors hover:text-emerald-300"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Chat via WA
                      </a>
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 whitespace-pre-line border-t border-raw-line pt-4 font-raw text-sm leading-relaxed text-raw-ink/85">
                  {row.message}
                </p>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-10 text-center font-raw text-[10px] uppercase tracking-[0.2em] text-raw-muted">
        Butuh bantuan? Hubungi {info.phone}
      </p>
    </div>
  );
}

function Notice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-32 text-center">
      <LockKeyhole className="mx-auto h-10 w-10 text-raw-muted" />
      <h1 className="mt-5 font-raw text-2xl font-bold uppercase tracking-tight text-raw-ink">
        {title}
      </h1>
      <p className="mt-3 font-raw text-sm leading-relaxed text-raw-muted">
        {description}
      </p>
    </div>
  );
}

/* ——— TASK C: komponen section PRODUK ——— */

type ProductRow = (typeof products.$inferSelect);
type CategoryRow = (typeof productCategories.$inferSelect);

function ProductRowItem({
  product,
  editing,
  categoryRows,
}: {
  product: ProductRow;
  editing: boolean;
  categoryRows: CategoryRow[];
}) {
  return (
    <article
      className={`border p-4 ${
        product.isActive
          ? "border-raw-line bg-raw"
          : "border-dashed border-raw-line bg-raw opacity-70"
      }`}
    >
      <div className="flex flex-wrap items-center gap-4">
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-14 w-14 shrink-0 object-cover"
          />
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-raw-line font-raw text-lg font-bold uppercase text-raw-muted">
            {product.title.charAt(0)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-raw text-sm font-bold uppercase tracking-tight text-raw-ink">
              {product.title}
            </p>
            {!product.isActive && (
              <span className="border border-raw-muted/40 bg-raw-muted/10 px-2 py-0.5 font-raw text-[10px] font-bold uppercase tracking-[0.14em] text-raw-muted">
                Nonaktif
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted">
            /{product.slug} · {product.categorySlug} · {product.audience}
          </p>
        </div>

        <div className="text-right">
          <p className="font-raw text-sm font-bold text-raw-ink tabular-nums">
            {formatIDR(product.price)}
          </p>
          {product.comparePrice && (
            <p className="font-raw text-[10px] text-raw-muted line-through tabular-nums">
              {formatIDR(product.comparePrice)}
            </p>
          )}
        </div>

        <form action={toggleProductFlag}>
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="flag" value="new" />
          <button
            type="submit"
            aria-label={
              product.isNew
                ? `Matikan tanda NEW untuk ${product.title}`
                : `Tandai NEW untuk ${product.title}`
            }
            className={`border px-2.5 py-1.5 font-raw text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
              product.isNew
                ? "border-accent bg-accent/15 text-accent"
                : "border-raw-line text-raw-muted hover:border-accent hover:text-accent"
            }`}
          >
            New
          </button>
        </form>
        <form action={toggleProductFlag}>
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="flag" value="sale" />
          <button
            type="submit"
            aria-label={
              product.isOnSale
                ? `Matikan tanda SALE untuk ${product.title}`
                : `Tandai SALE untuk ${product.title}`
            }
            className={`border px-2.5 py-1.5 font-raw text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
              product.isOnSale
                ? "border-accent bg-accent/15 text-accent"
                : "border-raw-line text-raw-muted hover:border-accent hover:text-accent"
            }`}
          >
            Sale
          </button>
        </form>

        <Link
          href={editing ? "/admin#produk" : `/admin?edit=${product.id}#produk`}
          className="btn-boxed btn-boxed-hover px-3 py-2 text-xs"
        >
          {editing ? "Batal" : "Edit"}
        </Link>

        {product.isActive ? (
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              className="border border-accent/40 px-3 py-2 font-raw text-xs font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent/10"
            >
              Hapus
            </button>
          </form>
        ) : (
          <form action={toggleProductActive}>
            <input type="hidden" name="id" value={product.id} />
            <button type="submit" className="btn-accent px-3 py-2 text-xs">
              Pulihkan
            </button>
          </form>
        )}
      </div>

      {editing && (
        <ProductForm
          action={updateProduct}
          categories={categoryRows}
          product={product}
          submitLabel="Simpan Perubahan"
        />
      )}
    </article>
  );
}

function ProductForm({
  action,
  categories,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: CategoryRow[];
  product?: ProductRow;
  submitLabel: string;
}) {
  return (
    <form
      action={action}
      className="grid gap-4 border border-raw-line bg-raw p-5 sm:grid-cols-2"
    >
      {product && <input type="hidden" name="id" value={product.id} />}
      <Field label="Judul Produk">
        <input
          name="title"
          required
          defaultValue={product?.title}
          className={inputClass}
        />
      </Field>
      {product && (
        <Field
          label="Slug (URL)"
          hint="hati-hati: mengubah slug = mengubah URL produk"
        >
          <input
            name="slug"
            required
            defaultValue={product.slug}
            className={inputClass}
          />
        </Field>
      )}
      <Field label="Harga (IDR)" hint="angka saja, mis. 185000">
        <input
          name="price"
          required
          inputMode="numeric"
          placeholder="185000"
          defaultValue={product?.price ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="Harga Sebelum Diskon (opsional)">
        <input
          name="comparePrice"
          inputMode="numeric"
          placeholder="235000"
          defaultValue={product?.comparePrice ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="Kategori">
        <select
          name="categorySlug"
          required
          defaultValue={product?.categorySlug ?? ""}
          className={`${inputClass} [&>option]:bg-raw`}
        >
          <option value="">— pilih —</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Pesananan">
        <select
          name="audience"
          defaultValue={product?.audience ?? "tim"}
          className={`${inputClass} [&>option]:bg-raw`}
        >
          <option value="tim">Tim</option>
          <option value="individu">Individu</option>
        </select>
      </Field>
      <Field label="Ukuran (pisah koma)">
        <input
          name="sizes"
          defaultValue={
            product ? product.sizes.join(", ") : "S, M, L, XL, XXL"
          }
          className={inputClass}
        />
      </Field>
      <Field label="Foto URL (pisah koma)" hint="foto ke-2 = hover swap">
        <input
          name="images"
          defaultValue={product?.images.join(", ")}
          placeholder="/media/product/slug-1.jpg, /media/product/slug-2.jpg"
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Deskripsi">
          <textarea
            name="description"
            rows={3}
            defaultValue={product?.description}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Material & Perawatan (opsional)">
          <textarea
            name="materialCare"
            rows={2}
            defaultValue={product?.materialCare ?? ""}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="flex flex-wrap gap-6 sm:col-span-2">
        <Check
          label="Produk Baru (NEW)"
          name="isNew"
          defaultChecked={product?.isNew}
        />
        <Check
          label="Sedang Diskon (SALE)"
          name="isOnSale"
          defaultChecked={product?.isOnSale}
        />
        <Check
          label="Aktif di katalog"
          name="isActive"
          defaultChecked={product ? product.isActive : true}
        />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-accent px-6 py-3 text-sm">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-raw text-xs font-bold uppercase tracking-[0.14em] text-raw-muted">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted/70">
          {hint}
        </span>
      )}
    </label>
  );
}

function Check({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 font-raw text-xs font-bold uppercase tracking-[0.14em] text-raw-ink">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[#E83030]"
      />
      {label}
    </label>
  );
}

/* ——— TASK D: komponen section TESTIMONI & DROPS ——— */

type TestimonialRow = (typeof testimonials.$inferSelect);
type DropRow = (typeof drops.$inferSelect);

function TestimonialRowItem({
  testimonial: t,
  editing,
}: {
  testimonial: TestimonialRow;
  editing: boolean;
}) {
  return (
    <article
      className={`border p-4 ${
        t.isActive
          ? "border-raw-line bg-raw"
          : "border-dashed border-raw-line bg-raw opacity-70"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-raw text-sm font-bold uppercase tracking-tight text-raw-ink">
              {t.name}
            </p>
            <span className="font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted">
              {t.role}
            </span>
            {!t.isActive && (
              <span className="border border-raw-muted/40 bg-raw-muted/10 px-2 py-0.5 font-raw text-[10px] font-bold uppercase tracking-[0.14em] text-raw-muted">
                Nonaktif
              </span>
            )}
          </div>
          <p className="mt-1.5 font-raw text-xs leading-relaxed text-raw-ink/75">
            “{t.content}”
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={
              editing ? "/admin#testimoni" : `/admin?tedit=${t.id}#testimoni`
            }
            className="btn-boxed btn-boxed-hover px-3 py-2 text-xs"
          >
            {editing ? "Batal" : "Edit"}
          </Link>
          {t.isActive ? (
            <form action={deleteTestimonial}>
              <input type="hidden" name="id" value={t.id} />
              <button
                type="submit"
                className="border border-accent/40 px-3 py-2 font-raw text-xs font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent/10"
              >
                Hapus
              </button>
            </form>
          ) : (
            <form action={toggleTestimonialActive}>
              <input type="hidden" name="id" value={t.id} />
              <button type="submit" className="btn-accent px-3 py-2 text-xs">
                Pulihkan
              </button>
            </form>
          )}
        </div>
      </div>

      {editing && (
        <form
          action={updateTestimonial}
          className="mt-4 grid gap-4 border-t border-raw-line pt-5 sm:grid-cols-2"
        >
          <input type="hidden" name="id" value={t.id} />
          <Field label="Nama">
            <input
              name="name"
              required
              defaultValue={t.name}
              className={inputClass}
            />
          </Field>
          <Field label="Role / Jabatan">
            <input
              name="role"
              required
              defaultValue={t.role}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Isi Testimoni">
              <textarea
                name="content"
                rows={3}
                required
                defaultValue={t.content}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Check
              label="Tampilkan di Social Wall"
              name="isActive"
              defaultChecked={t.isActive}
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-accent px-6 py-3 text-sm">
              Simpan Testimoni
            </button>
          </div>
        </form>
      )}
    </article>
  );
}

function DropRowItem({ drop: d }: { drop: DropRow }) {
  return (
    <article
      className={`border p-4 ${
        d.isActive
          ? "border-raw-line bg-raw"
          : "border-dashed border-raw-line bg-raw opacity-70"
      }`}
    >
      <div className="flex flex-wrap items-center gap-4">
        {d.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={d.imageUrl}
            alt={d.title}
            className="h-14 w-24 shrink-0 object-cover"
          />
        ) : (
          <span className="flex h-14 w-24 shrink-0 items-center justify-center border border-raw-line font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted">
            Tanpa Foto
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-raw text-sm font-bold uppercase tracking-tight text-raw-ink">
              {d.title}
            </p>
            {!d.isActive && (
              <span className="border border-raw-muted/40 bg-raw-muted/10 px-2 py-0.5 font-raw text-[10px] font-bold uppercase tracking-[0.14em] text-raw-muted">
                Nonaktif
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted">
            /{d.slug}
          </p>
        </div>
        <form action={toggleDrop}>
          <input type="hidden" name="id" value={d.id} />
          <button
            type="submit"
            className={
              d.isActive
                ? "border border-accent/40 px-3 py-2 font-raw text-xs font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent/10"
                : "btn-accent px-3 py-2 text-xs"
            }
          >
            {d.isActive ? "Nonaktifkan" : "Aktifkan"}
          </button>
        </form>
      </div>

      <form
        action={updateDropImageUrl}
        className="mt-3 flex flex-wrap items-end gap-2 border-t border-raw-line pt-3"
      >
        <input type="hidden" name="id" value={d.id} />
        <label className="min-w-0 flex-1">
          <span className="mb-1.5 block font-raw text-xs font-bold uppercase tracking-[0.14em] text-raw-muted">
            URL Foto (kosongkan untuk tanpa foto)
          </span>
          <input
            name="imageUrl"
            defaultValue={d.imageUrl ?? ""}
            placeholder="/media/drop-garuda-streetwear.jpg"
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          className="btn-boxed btn-boxed-hover px-4 py-3 text-xs"
        >
          Simpan Foto
        </button>
      </form>
    </article>
  );
}

/* ——— F2/F3: komponen section LAYANAN & GALERI ——— */

type ServiceRow = (typeof services.$inferSelect);
type GalleryItemRow = (typeof galleryItems.$inferSelect);

function ServiceRowItem({
  service: s,
  editing,
}: {
  service: ServiceRow;
  editing: boolean;
}) {
  return (
    <article
      className={`border p-4 ${
        s.isActive
          ? "border-raw-line bg-raw"
          : "border-dashed border-raw-line bg-raw opacity-70"
      }`}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-raw text-sm font-bold uppercase tracking-tight text-raw-ink">
              {s.title}
            </p>
            {!s.isActive && (
              <span className="border border-raw-muted/40 bg-raw-muted/10 px-2 py-0.5 font-raw text-[10px] font-bold uppercase tracking-[0.14em] text-raw-muted">
                Nonaktif
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted">
            /{s.slug} · ikon {s.icon}
            {s.tags.length > 0 ? ` · ${s.tags.join(" / ")}` : ""}
          </p>
          <p className="mt-1.5 line-clamp-2 font-raw text-xs leading-relaxed text-raw-ink/75">
            {s.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={editing ? "/admin#layanan" : `/admin?sedit=${s.id}#layanan`}
            className="btn-boxed btn-boxed-hover px-3 py-2 text-xs"
          >
            {editing ? "Batal" : "Edit"}
          </Link>
          {s.isActive ? (
            <form action={deleteService}>
              <input type="hidden" name="id" value={s.id} />
              <button
                type="submit"
                className="border border-accent/40 px-3 py-2 font-raw text-xs font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent/10"
              >
                Hapus
              </button>
            </form>
          ) : (
            <form action={toggleServiceActive}>
              <input type="hidden" name="id" value={s.id} />
              <button type="submit" className="btn-accent px-3 py-2 text-xs">
                Pulihkan
              </button>
            </form>
          )}
        </div>
      </div>

      {editing && (
        <ServiceForm action={updateService} service={s} submitLabel="Simpan Layanan" />
      )}
    </article>
  );
}

function ServiceForm({
  action,
  service,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  service?: ServiceRow;
  submitLabel: string;
}) {
  return (
    <form
      action={action}
      className="grid gap-4 border border-raw-line bg-raw p-5 sm:grid-cols-2"
    >
      {service && <input type="hidden" name="id" value={service.id} />}
      <Field label="Judul Layanan">
        <input
          name="title"
          required
          defaultValue={service?.title}
          className={inputClass}
        />
      </Field>
      <Field
        label="Ikon"
        hint="nama ikon lucide: Shirt, Wind, Scissors, Package, Users, Zap"
      >
        <input
          name="icon"
          defaultValue={service?.icon ?? "Shirt"}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Deskripsi">
          <textarea
            name="description"
            rows={3}
            required
            defaultValue={service?.description}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Tag (pisah koma)">
        <input
          name="tags"
          defaultValue={service?.tags.join(", ")}
          placeholder="Sublimasi, Bordir, Tim"
          className={inputClass}
        />
      </Field>
      <div className="flex items-end pb-1">
        <Check
          label="Tampilkan di situs"
          name="isActive"
          defaultChecked={service ? service.isActive : true}
        />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-accent px-6 py-3 text-sm">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function GalleryRowItem({
  item: g,
  editing,
}: {
  item: GalleryItemRow;
  editing: boolean;
}) {
  return (
    <article
      className={`border p-4 ${
        g.isActive
          ? "border-raw-line bg-raw"
          : "border-dashed border-raw-line bg-raw opacity-70"
      }`}
    >
      <div className="flex flex-wrap items-center gap-4">
        {g.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={g.imageUrl}
            alt={g.title}
            className="h-14 w-20 shrink-0 object-cover"
          />
        ) : (
          <span className="flex h-14 w-20 shrink-0 items-center justify-center border border-raw-line font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted">
            Tanpa Foto
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-raw text-sm font-bold uppercase tracking-tight text-raw-ink">
              {g.title}
            </p>
            <span className="border border-raw-line px-2 py-0.5 font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted">
              {g.category}
            </span>
            {!g.isActive && (
              <span className="border border-raw-muted/40 bg-raw-muted/10 px-2 py-0.5 font-raw text-[10px] font-bold uppercase tracking-[0.14em] text-raw-muted">
                Nonaktif
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate font-raw text-[10px] uppercase tracking-[0.14em] text-raw-muted">
            urutan {g.sortOrder}
            {g.imageUrl ? "" : " · tanpa foto"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={editing ? "/admin#galeri" : `/admin?gedit=${g.id}#galeri`}
            className="btn-boxed btn-boxed-hover px-3 py-2 text-xs"
          >
            {editing ? "Batal" : "Edit"}
          </Link>
          {g.isActive ? (
            <form action={deleteGalleryItem}>
              <input type="hidden" name="id" value={g.id} />
              <button
                type="submit"
                className="border border-accent/40 px-3 py-2 font-raw text-xs font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent/10"
              >
                Hapus
              </button>
            </form>
          ) : (
            <form action={toggleGalleryItemActive}>
              <input type="hidden" name="id" value={g.id} />
              <button type="submit" className="btn-accent px-3 py-2 text-xs">
                Pulihkan
              </button>
            </form>
          )}
        </div>
      </div>

      {editing && (
        <GalleryForm action={updateGalleryItem} item={g} submitLabel="Simpan Item" />
      )}
    </article>
  );
}

function GalleryForm({
  action,
  item,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  item?: GalleryItemRow;
  submitLabel: string;
}) {
  return (
    <form
      action={action}
      className="grid gap-4 border border-raw-line bg-raw p-5 sm:grid-cols-2"
    >
      {item && <input type="hidden" name="id" value={item.id} />}
      <Field label="Judul Item">
        <input
          name="title"
          required
          defaultValue={item?.title}
          className={inputClass}
        />
      </Field>
      <Field label="Kategori" hint="mis. jersey, jaket, kaos, workshop">
        <input
          name="category"
          required
          defaultValue={item?.category}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="URL Foto">
          <input
            name="imageUrl"
            defaultValue={item?.imageUrl ?? ""}
            placeholder="/media/cat-jersey.jpg"
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-6">
        <Check
          label="Tampilkan di galeri"
          name="isActive"
          defaultChecked={item ? item.isActive : true}
        />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-accent px-6 py-3 text-sm">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

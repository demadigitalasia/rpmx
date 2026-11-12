"use server";

import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { getDb } from "@/db";
import {
  drops,
  galleryItems,
  inquiries,
  productCategories,
  products,
  services,
  siteSettings,
  testimonials,
} from "@/db/schema";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin";
import { validateProdEnv } from "@/lib/env-check";
import { inquiryStatuses } from "@/lib/site";

async function isAuthenticated(): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken(expected);
}

export async function loginAction(formData: FormData): Promise<void> {
  validateProdEnv(); // gagal cepat di produksi bila ADMIN_PASSWORD lemah/absen (TASK E)
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    redirect("/admin?error=1");
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, adminToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function updateStatusAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(id) || id <= 0) return;
  if (!inquiryStatuses.includes(status as never)) return;

  const db = getDb();
  if (!db) return;

  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
  // Tanpa ini UI dashboard tetap menampilkan status lama setelah Simpan
  // (terukur saat uji 12 Nov: DB berubah, halaman tidak).
  revalidatePath("/admin");
}

/* ——— TASK C: editor produk (semua auth-guarded, cache "products" di-revalidate) ——— */

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** "185.000" / "185000" → 185000 (rupiah diketik bebas titik/koma). */
function toRupiah(raw: FormDataEntryValue | null): number {
  return Number(String(raw ?? "").replace(/[^0-9]/g, ""));
}

function parseCsv(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function productError(message: string, editId?: number): never {
  const q = new URLSearchParams({ perr: message });
  if (editId) q.set("edit", String(editId));
  redirect(`/admin?${q.toString()}#produk`);
}

function productOk(message: string): never {
  const q = new URLSearchParams({ pok: message });
  redirect(`/admin?${q.toString()}#produk`);
}

async function validateProductInput(input: {
  title: string;
  price: number;
  comparePrice: number | null;
  categorySlug: string;
  slug: string;
  currentId?: number;
}): Promise<string | null> {
  if (input.title.length < 3) return "Judul minimal 3 karakter.";
  if (!Number.isInteger(input.price) || input.price <= 0)
    return "Harga harus angka bulat lebih dari 0.";
  if (input.comparePrice !== null && input.comparePrice <= input.price)
    return "Harga sebelum diskon harus lebih besar dari harga.";
  const db = getDb();
  if (!db) return "Database belum terhubung.";
  const cats = await db
    .select({ slug: productCategories.slug })
    .from(productCategories)
    .where(eq(productCategories.isActive, true));
  if (!cats.some((c) => c.slug === input.categorySlug))
    return "Kategori tidak dikenal.";
  const dup = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, input.slug))
    .limit(1);
  if (dup.length > 0 && dup[0].id !== input.currentId)
    return "Slug sudah dipakai produk lain — ubah judul atau slug.";
  return null;
}

export async function createProduct(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");

  const title = String(formData.get("title") ?? "").trim();
  const price = toRupiah(formData.get("price"));
  const compareRaw = toRupiah(formData.get("comparePrice"));
  const comparePrice = compareRaw > 0 ? compareRaw : null;
  const categorySlug = String(formData.get("categorySlug") ?? "");
  const audience = String(formData.get("audience") ?? "tim") === "individu" ? "individu" : "tim";
  const sizes = parseCsv(formData.get("sizes"));
  const images = parseCsv(formData.get("images"));
  const description = String(formData.get("description") ?? "").trim();
  const materialCare = String(formData.get("materialCare") ?? "").trim() || null;
  const isNew = formData.get("isNew") === "on";
  const isOnSale = formData.get("isOnSale") === "on";
  const isActive = formData.get("isActive") === "on";

  const db = getDb();
  if (!db) productError("Database belum terhubung.");

  const slug = slugifyTitle(title);
  const problem = await validateProductInput({
    title,
    price,
    comparePrice,
    categorySlug,
    slug,
  });
  if (problem) productError(problem);

  try {
    const [{ maxSort }] = await db
      .select({ maxSort: sql<number>`coalesce(max(${products.sortOrder}), 0)` })
      .from(products);
    await db.insert(products).values({
      slug,
      title,
      description,
      price,
      comparePrice,
      categorySlug,
      audience,
      sizes: sizes.length > 0 ? sizes : ["ALL SIZE"],
      materialCare,
      images,
      isNew,
      isOnSale,
      sortOrder: Number(maxSort) + 1,
      isActive,
    });
  } catch {
    productError("Gagal menyimpan produk (database).");
  }
  updateTag("products");
  revalidatePath("/admin");
  productOk(`Produk "${title}" ditambahkan.`);
}

export async function updateProduct(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) productError("ID produk tidak valid.");
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugifyTitle(String(formData.get("slug") ?? ""));
  const price = toRupiah(formData.get("price"));
  const compareRaw = toRupiah(formData.get("comparePrice"));
  const comparePrice = compareRaw > 0 ? compareRaw : null;
  const categorySlug = String(formData.get("categorySlug") ?? "");
  const audience = String(formData.get("audience") ?? "tim") === "individu" ? "individu" : "tim";
  const sizes = parseCsv(formData.get("sizes"));
  const images = parseCsv(formData.get("images"));
  const description = String(formData.get("description") ?? "").trim();
  const materialCare = String(formData.get("materialCare") ?? "").trim() || null;
  const isNew = formData.get("isNew") === "on";
  const isOnSale = formData.get("isOnSale") === "on";
  const isActive = formData.get("isActive") === "on";

  const db = getDb();
  if (!db) productError("Database belum terhubung.", id);

  const problem = await validateProductInput({
    title,
    price,
    comparePrice,
    categorySlug,
    slug,
    currentId: id,
  });
  if (problem) productError(problem, id);

  try {
    await db
      .update(products)
      .set({
        title,
        slug,
        description,
        price,
        comparePrice,
        categorySlug,
        audience,
        sizes: sizes.length > 0 ? sizes : ["ALL SIZE"],
        materialCare,
        images,
        isNew,
        isOnSale,
        isActive,
      })
      .where(eq(products.id, id));
  } catch {
    productError("Gagal menyimpan perubahan (database).", id);
  }
  updateTag("products");
  revalidatePath("/admin");
  productOk(`Perubahan "${title}" tersimpan.`);
}

/** Hapus = sembunyikan dari katalog (isActive=false) — data tetap ada, bisa dipulihkan. */
export async function deleteProduct(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;

  const db = getDb();
  if (!db) return;
  await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  updateTag("products");
  revalidatePath("/admin");
  productOk("Produk disembunyikan dari katalog (nonaktif).");
}

export async function toggleProductActive(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;

  const db = getDb();
  if (!db) return;
  const [row] = await db
    .select({ isActive: products.isActive })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  if (!row) return;
  await db
    .update(products)
    .set({ isActive: !row.isActive })
    .where(eq(products.id, id));
  updateTag("products");
  revalidatePath("/admin");
  productOk(row.isActive ? "Produk diaktifkan kembali." : "Produk dinonaktifkan.");
}

export async function toggleProductFlag(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  const flag = String(formData.get("flag") ?? "");
  if (!Number.isInteger(id) || id <= 0) return;
  if (flag !== "new" && flag !== "sale") return;

  const db = getDb();
  if (!db) return;
  const [row] = await db
    .select({ isNew: products.isNew, isOnSale: products.isOnSale })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  if (!row) return;
  await db
    .update(products)
    .set(flag === "new" ? { isNew: !row.isNew } : { isOnSale: !row.isOnSale })
    .where(eq(products.id, id));
  updateTag("products");
  revalidatePath("/admin");
}

/* ——— TASK D: editor testimoni & drop (auth-guarded, updateTag per cache tag) ——— */

function testimonialError(message: string, id?: number): never {
  const q = new URLSearchParams({ perr: message });
  if (id) q.set("tedit", String(id));
  redirect(`/admin?${q.toString()}#testimoni`);
}

function contentOk(message: string, anchor: string): never {
  const q = new URLSearchParams({ pok: message });
  redirect(`/admin?${q.toString()}#${anchor}`);
}

export async function updateTestimonial(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0)
    testimonialError("ID testimoni tidak valid.");
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  if (name.length < 2) testimonialError("Nama minimal 2 karakter.", id);
  if (role.length < 2) testimonialError("Role/jabatan minimal 2 karakter.", id);
  if (content.length < 10)
    testimonialError("Isi testimoni minimal 10 karakter.", id);

  const db = getDb();
  if (!db) testimonialError("Database belum terhubung.", id);

  try {
    await db
      .update(testimonials)
      .set({ name, role, content, isActive })
      .where(eq(testimonials.id, id));
  } catch {
    testimonialError("Gagal menyimpan testimoni (database).", id);
  }
  updateTag("testimonials");
  revalidatePath("/admin");
  contentOk(`Testimoni "${name}" tersimpan.`, "testimoni");
}

/** Hapus = sembunyikan dari Social Wall (isActive=false) — bisa dipulihkan lewat form. */
export async function deleteTestimonial(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;

  const db = getDb();
  if (!db) return;
  await db
    .update(testimonials)
    .set({ isActive: false })
    .where(eq(testimonials.id, id));
  updateTag("testimonials");
  revalidatePath("/admin");
  contentOk("Testimoni disembunyikan dari Social Wall (nonaktif).", "testimoni");
}

export async function toggleTestimonialActive(
  formData: FormData,
): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;

  const db = getDb();
  if (!db) return;
  const [row] = await db
    .select({ isActive: testimonials.isActive, name: testimonials.name })
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);
  if (!row) return;
  await db
    .update(testimonials)
    .set({ isActive: !row.isActive })
    .where(eq(testimonials.id, id));
  updateTag("testimonials");
  revalidatePath("/admin");
  contentOk(
    row.isActive
      ? `Testimoni "${row.name}" ditampilkan kembali.`
      : `Testimoni "${row.name}" dinonaktifkan.`,
    "testimoni",
  );
}

export async function toggleDrop(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;

  const db = getDb();
  if (!db) return;
  const [row] = await db
    .select({ isActive: drops.isActive, title: drops.title })
    .from(drops)
    .where(eq(drops.id, id))
    .limit(1);
  if (!row) return;
  await db
    .update(drops)
    .set({ isActive: !row.isActive })
    .where(eq(drops.id, id));
  updateTag("drops");
  revalidatePath("/admin");
  contentOk(
    row.isActive
      ? `Drop "${row.title}" ditampilkan kembali.`
      : `Drop "${row.title}" dinonaktifkan.`,
    "drops",
  );
}

export async function updateDropImageUrl(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  const imageUrlRaw = String(formData.get("imageUrl") ?? "").trim();
  const imageUrl = imageUrlRaw.length > 0 ? imageUrlRaw : null;

  if (imageUrl && !/^(\/|https?:\/\/)/.test(imageUrl)) {
    const q = new URLSearchParams({
      perr: "URL foto harus path (/media/…) atau https://…",
    });
    redirect(`/admin?${q.toString()}#drops`);
  }

  const db = getDb();
  if (!db) return;
  await db
    .update(drops)
    .set({ imageUrl })
    .where(eq(drops.id, id));
  updateTag("drops");
  revalidatePath("/admin");
  contentOk("URL foto drop tersimpan.", "drops");
}

/* ——— F1: Pengaturan Situs + SEO (ADMIN_CMS_REPORT) ——— */

const SETTINGS_KEYS = [
  "siteName",
  "siteTagline",
  "siteDescription",
  "siteKeywords",
  "contactPhone",
  "contactEmail",
  "contactAddress",
  "contactAddressShort",
  "contactMapsUrl",
  "ogImageUrl",
  "socialX",
  "socialFacebook",
  "socialInstagram",
  "socialTikTok",
] as const;

export async function siteSettingsAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");

  const db = getDb();
  if (!db) {
    const q = new URLSearchParams({ perr: "Database belum terhubung." });
    redirect(`/admin?${q.toString()}#pengaturan`);
  }

  const values: { key: string; value: string; updatedAt: Date }[] = [];
  for (const key of SETTINGS_KEYS) {
    const value = String(formData.get(key) ?? "").trim();
    if (
      (key === "contactEmail" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ||
      (key === "contactPhone" && value && value.replace(/[^0-9]/g, "").length < 8) ||
      ((key === "ogImageUrl" ||
        key === "contactMapsUrl" ||
        key.startsWith("social")) &&
        value &&
        !/^(\/|https?:\/\/)/.test(value))
    ) {
      const q = new URLSearchParams({
        perr: `Nilai "${key}" tidak valid (email/telepon/URL).`,
      });
      redirect(`/admin?${q.toString()}#pengaturan`);
    }
    values.push({ key, value, updatedAt: new Date() });
  }

  try {
    for (const row of values) {
      await db
        .insert(siteSettings)
        .values(row)
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: row.value, updatedAt: row.updatedAt },
        });
    }
  } catch {
    const q = new URLSearchParams({
      perr: "Gagal menyimpan pengaturan (database).",
    });
    redirect(`/admin?${q.toString()}#pengaturan`);
  }
  updateTag("settings");
  revalidatePath("/admin");
  contentOk("Pengaturan situs tersimpan.", "pengaturan");
}

/* ——— F2: editor layanan (tabel services sudah DB-driven) ——— */

export async function createService(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim() || "Shirt";
  const tags = parseCsv(formData.get("tags"));
  const isActive = formData.get("isActive") === "on";

  if (title.length < 3 || description.length < 10) {
    const q = new URLSearchParams({
      perr: "Judul minimal 3 karakter & deskripsi minimal 10 karakter.",
    });
    redirect(`/admin?${q.toString()}#layanan`);
  }
  const db = getDb();
  if (!db) {
    const q = new URLSearchParams({ perr: "Database belum terhubung." });
    redirect(`/admin?${q.toString()}#layanan`);
  }
  const slug = slugifyTitle(title);
  const dup = await db
    .select({ id: services.id })
    .from(services)
    .where(eq(services.slug, slug))
    .limit(1);
  if (dup.length > 0) {
    const q = new URLSearchParams({
      perr: "Slug layanan sudah dipakai — ubah judul.",
    });
    redirect(`/admin?${q.toString()}#layanan`);
  }
  try {
    const [{ maxSort }] = await db
      .select({ maxSort: sql<number>`coalesce(max(${services.sortOrder}), 0)` })
      .from(services);
    await db.insert(services).values({
      slug,
      title,
      description,
      tags,
      icon,
      sortOrder: Number(maxSort) + 1,
      isActive,
    });
  } catch {
    const q = new URLSearchParams({ perr: "Gagal menyimpan layanan (database)." });
    redirect(`/admin?${q.toString()}#layanan`);
  }
  updateTag("services");
  revalidatePath("/admin");
  contentOk(`Layanan "${title}" ditambahkan.`, "layanan");
}

export async function updateService(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim() || "Shirt";
  const tags = parseCsv(formData.get("tags"));
  const isActive = formData.get("isActive") === "on";

  if (title.length < 3 || description.length < 10) {
    const q = new URLSearchParams({
      perr: "Judul minimal 3 karakter & deskripsi minimal 10 karakter.",
    });
    redirect(`/admin?${q.toString()}#layanan`);
  }
  const db = getDb();
  if (!db) return;
  try {
    await db
      .update(services)
      .set({ title, description, tags, icon, isActive })
      .where(eq(services.id, id));
  } catch {
    const q = new URLSearchParams({ perr: "Gagal menyimpan layanan (database)." });
    redirect(`/admin?${q.toString()}#layanan`);
  }
  updateTag("services");
  revalidatePath("/admin");
  contentOk(`Layanan "${title}" tersimpan.`, "layanan");
}

export async function deleteService(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  const db = getDb();
  if (!db) return;
  await db.update(services).set({ isActive: false }).where(eq(services.id, id));
  updateTag("services");
  revalidatePath("/admin");
  contentOk("Layanan disembunyikan (nonaktif).", "layanan");
}

export async function toggleServiceActive(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  const db = getDb();
  if (!db) return;
  const [row] = await db
    .select({ isActive: services.isActive, title: services.title })
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  if (!row) return;
  await db
    .update(services)
    .set({ isActive: !row.isActive })
    .where(eq(services.id, id));
  updateTag("services");
  revalidatePath("/admin");
  contentOk(
    row.isActive ? `Layanan "${row.title}" dinonaktifkan.` : `Layanan "${row.title}" ditampilkan kembali.`,
    "layanan",
  );
}

/* ——— F3: editor galeri ——— */

function validateGalleryUrl(raw: string): string | null {
  if (raw && !/^(\/|https?:\/\/)/.test(raw)) {
    return "URL foto harus path (/media/…) atau https://…";
  }
  return null;
}

export async function createGalleryItem(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim().toLowerCase();
  const imageUrlRaw = String(formData.get("imageUrl") ?? "").trim();
  const imageUrl = imageUrlRaw.length > 0 ? imageUrlRaw : null;
  const isActive = formData.get("isActive") === "on";

  if (title.length < 3 || category.length < 2) {
    const q = new URLSearchParams({
      perr: "Judul minimal 3 karakter & kategori minimal 2 karakter.",
    });
    redirect(`/admin?${q.toString()}#galeri`);
  }
  const urlProblem = validateGalleryUrl(imageUrl ?? "");
  if (urlProblem) {
    const q = new URLSearchParams({ perr: urlProblem });
    redirect(`/admin?${q.toString()}#galeri`);
  }
  const db = getDb();
  if (!db) {
    const q = new URLSearchParams({ perr: "Database belum terhubung." });
    redirect(`/admin?${q.toString()}#galeri`);
  }
  try {
    const [{ maxSort }] = await db
      .select({ maxSort: sql<number>`coalesce(max(${galleryItems.sortOrder}), 0)` })
      .from(galleryItems);
    await db.insert(galleryItems).values({
      title,
      category,
      imageUrl,
      sortOrder: Number(maxSort) + 1,
      isActive,
    });
  } catch {
    const q = new URLSearchParams({ perr: "Gagal menyimpan galeri (database)." });
    redirect(`/admin?${q.toString()}#galeri`);
  }
  updateTag("gallery");
  revalidatePath("/admin");
  contentOk(`Galeri "${title}" ditambahkan.`, "galeri");
}

export async function updateGalleryItem(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim().toLowerCase();
  const imageUrlRaw = String(formData.get("imageUrl") ?? "").trim();
  const imageUrl = imageUrlRaw.length > 0 ? imageUrlRaw : null;
  const isActive = formData.get("isActive") === "on";

  if (title.length < 3 || category.length < 2) {
    const q = new URLSearchParams({
      perr: "Judul minimal 3 karakter & kategori minimal 2 karakter.",
    });
    redirect(`/admin?${q.toString()}#galeri`);
  }
  const urlProblem = validateGalleryUrl(imageUrl ?? "");
  if (urlProblem) {
    const q = new URLSearchParams({ perr: urlProblem });
    redirect(`/admin?${q.toString()}#galeri`);
  }
  const db = getDb();
  if (!db) return;
  try {
    await db
      .update(galleryItems)
      .set({ title, category, imageUrl, isActive })
      .where(eq(galleryItems.id, id));
  } catch {
    const q = new URLSearchParams({ perr: "Gagal menyimpan galeri (database)." });
    redirect(`/admin?${q.toString()}#galeri`);
  }
  updateTag("gallery");
  revalidatePath("/admin");
  contentOk(`Galeri "${title}" tersimpan.`, "galeri");
}

export async function deleteGalleryItem(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  const db = getDb();
  if (!db) return;
  await db
    .update(galleryItems)
    .set({ isActive: false })
    .where(eq(galleryItems.id, id));
  updateTag("gallery");
  revalidatePath("/admin");
  contentOk("Item galeri disembunyikan (nonaktif).", "galeri");
}

export async function toggleGalleryItemActive(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  const db = getDb();
  if (!db) return;
  const [row] = await db
    .select({ isActive: galleryItems.isActive, title: galleryItems.title })
    .from(galleryItems)
    .where(eq(galleryItems.id, id))
    .limit(1);
  if (!row) return;
  await db
    .update(galleryItems)
    .set({ isActive: !row.isActive })
    .where(eq(galleryItems.id, id));
  updateTag("gallery");
  revalidatePath("/admin");
  contentOk(
    row.isActive
      ? `Galeri "${row.title}" dinonaktifkan.`
      : `Galeri "${row.title}" ditampilkan kembali.`,
    "galeri",
  );
}

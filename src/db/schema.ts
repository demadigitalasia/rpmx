import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array().notNull().default([]),
  icon: text("icon").notNull().default("Shirt"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(false),
});

export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  price: integer("price").notNull(), // rupiah
  comparePrice: integer("compare_price"), // harga sebelum diskon, nullable
  categorySlug: text("category_slug").notNull(),
  audience: text("audience").notNull().default("tim"), // tim | individu
  sizes: text("sizes").array().notNull().default([]),
  materialCare: text("material_care"),
  images: text("images").array().notNull().default([]),
  isNew: boolean("is_new").notNull().default(false),
  isOnSale: boolean("is_on_sale").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const drops = pgTable("drops", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  story: text("story"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const dropProducts = pgTable("drop_products", {
  id: serial("id").primaryKey(),
  dropSlug: text("drop_slug").notNull(),
  productSlug: text("product_slug").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  serviceSlug: text("service_slug"),
  quantity: text("quantity"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Pengaturan situs (F1): identitas, SEO, kontak, sosmed — key-value, 1 baris per kunci. */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Pelanggan newsletter (N2): aset email marketing yang benar-benar tersimpan. */
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("footer"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ServiceRow = typeof services.$inferSelect;
export type GalleryItemRow = typeof galleryItems.$inferSelect;
export type TestimonialRow = typeof testimonials.$inferSelect;
export type InquiryRow = typeof inquiries.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
export type ProductCategoryRow = typeof productCategories.$inferSelect;
export type DropRow = typeof drops.$inferSelect;
export type SiteSettingRow = typeof siteSettings.$inferSelect;
export type NewsletterSubscriberRow = typeof newsletterSubscribers.$inferSelect;

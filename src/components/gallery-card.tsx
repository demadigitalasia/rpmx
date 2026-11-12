import Image from "next/image";
import type { GalleryItemRow } from "@/db/schema";
import { galleryCategoryLabels } from "@/lib/content";

export function GalleryCard({ item }: { item: GalleryItemRow }) {
  const categoryLabel = galleryCategoryLabels[item.category] ?? item.category;
  const initial = item.title.charAt(0).toUpperCase();

  return (
    <figure className="group relative aspect-[4/5] overflow-hidden border border-raw-line">
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 media-fallback transition-transform duration-500 group-hover:scale-105">
          <span className="absolute inset-0 flex items-center justify-center font-raw text-[7rem] font-bold uppercase text-raw-ink/15">
            {initial}
          </span>
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 media-scrim p-5">
        <span className="inline-block bg-accent px-2.5 py-0.5 font-raw text-[10px] font-bold uppercase tracking-[0.14em] text-raw-ink">
          {categoryLabel}
        </span>
        <p className="mt-2 font-raw text-base font-bold uppercase tracking-tight text-raw-ink">
          {item.title}
        </p>
      </figcaption>
    </figure>
  );
}

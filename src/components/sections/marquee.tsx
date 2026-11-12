import { marqueeTags } from "@/lib/content";

export function Marquee() {
  const items = [...marqueeTags, ...marqueeTags];
  return (
    <div className="overflow-hidden border-y border-raw-line bg-raw-surface/40 py-4">
      <div className="flex w-max animate-marquee items-center gap-8 pr-8">
        {items.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="flex items-center gap-8 font-raw text-xs font-medium uppercase tracking-[0.2em] text-raw-muted"
          >
            {tag}
            <span className="text-accent">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

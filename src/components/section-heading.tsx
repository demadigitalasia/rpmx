import { Reveal } from "@/components/reveal";

type SectionHeadingProps = {
  /** Prefiks serif italic, lowercase (mis. "latest", "black friday", "kenapa") */
  prefix?: string;
  /** Kata utama mono bold uppercase, merah (mis. "DROPS", "SALE", "RPMX") */
  word: string;
  /** Teks pendukung di kanan heading (mis. "VIEW ALL") — opsional */
  action?: { label: string; href: string };
  description?: string;
  align?: "left" | "center";
  /** Level heading — halaman top-level memakai h1 */
  as?: "h1" | "h2";
};

/**
 * Heading komposit RAWLINE (spec §2.2):
 * <prefiks serif italic> <KATA mono bold uppercase merah>, 48px.
 */
export function SectionHeading({
  prefix,
  word,
  action,
  description,
  align = "left",
  as = "h2",
}: SectionHeadingProps) {
  const Tag = as;

  return (
    <Reveal>
      <div
        className={
          align === "center"
            ? "mx-auto max-w-3xl text-center"
            : "flex flex-wrap items-end justify-between gap-4"
        }
      >
        <Tag className="font-raw text-[clamp(2rem,5vw,3rem)] leading-none tracking-[-0.04em]">
          {prefix && (
            <span className="font-serif-italic mr-1 lowercase text-raw-ink">
              {prefix}{" "}
            </span>
          )}
          <span className="heading-word">{word}</span>
        </Tag>
        {action && (
          <a
            href={action.href}
            className="group inline-flex items-center gap-1.5 font-raw text-xs font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:text-raw-ink"
          >
            {action.label}
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </a>
        )}
      </div>
      {description && (
        <p
          className={`mt-4 max-w-2xl text-sm leading-relaxed text-raw-muted ${
            align === "center" ? "mx-auto text-center" : ""
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}

import Link from "next/link";
import { ACCENT_STYLES, type CategoryMeta } from "@/lib/categories";
import { ArrowRightIcon } from "./icons";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  accent?: CategoryMeta["accent"];
  ctaLabel?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  accent = "coral",
  ctaLabel = "ดูทั้งหมด",
}: Props) {
  const a = ACCENT_STYLES[accent];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-between border-b border-ink-100/70 pb-4">
      <div className="flex items-center gap-3 min-w-0">
        {eyebrow && (
          <span className={`chip ${a.chip} shrink-0`}>
            <span className={`h-1.5 w-1.5 rounded-full ${a.fill}`} />
            {eyebrow}
          </span>
        )}
        <h2 className="truncate text-xl font-extrabold leading-[1.4] py-1 text-ink-900 md:text-2xl">
          {title}
        </h2>
        {description && (
          <span className="hidden lg:inline truncate text-sm text-ink-500">
            — {description}
          </span>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-coral-500"
        >
          {ctaLabel}
          <ArrowRightIcon
            width={14}
            height={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}

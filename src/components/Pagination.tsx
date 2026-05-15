import Link from "next/link";
import { ArrowRightIcon } from "./icons";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

function buildHref(basePath: string, page: number) {
  const root = basePath.replace(/\/$/, "");
  if (page <= 1) return root || "/";
  return `${root}/page/${page}`;
}

function getPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  const window = 1;
  const start = Math.max(2, current - window);
  const end = Math.min(total - 1, current + window);
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;
  const pages = getPageList(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex flex-wrap items-center justify-center gap-2"
    >
      {hasPrev ? (
        <Link
          href={buildHref(basePath, currentPage - 1)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-ink-100 bg-paper px-4 text-sm font-semibold text-ink-700 hover:border-ink-300 transition-colors"
        >
          <ArrowRightIcon
            width={14}
            height={14}
            className="rotate-180"
          />
          ก่อนหน้า
        </Link>
      ) : (
        <span
          aria-disabled
          className="inline-flex h-10 items-center gap-2 rounded-full border border-ink-100/60 bg-paper/60 px-4 text-sm font-semibold text-ink-300"
        >
          <ArrowRightIcon
            width={14}
            height={14}
            className="rotate-180"
          />
          ก่อนหน้า
        </span>
      )}

      <ul className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <li
              key={`ellipsis-${i}`}
              className="px-2 text-sm text-ink-300"
              aria-hidden
            >
              …
            </li>
          ) : p === currentPage ? (
            <li key={p}>
              <span
                aria-current="page"
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-ink-900 px-3 text-sm font-bold text-cream shadow-pop"
              >
                {p}
              </span>
            </li>
          ) : (
            <li key={p}>
              <Link
                href={buildHref(basePath, p)}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-ink-100 bg-paper px-3 text-sm font-semibold text-ink-700 hover:border-coral-300 hover:text-coral-500 transition-colors"
              >
                {p}
              </Link>
            </li>
          ),
        )}
      </ul>

      {hasNext ? (
        <Link
          href={buildHref(basePath, currentPage + 1)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-ink-100 bg-paper px-4 text-sm font-semibold text-ink-700 hover:border-ink-300 transition-colors"
        >
          ถัดไป
          <ArrowRightIcon width={14} height={14} />
        </Link>
      ) : (
        <span
          aria-disabled
          className="inline-flex h-10 items-center gap-2 rounded-full border border-ink-100/60 bg-paper/60 px-4 text-sm font-semibold text-ink-300"
        >
          ถัดไป
          <ArrowRightIcon width={14} height={14} />
        </span>
      )}
    </nav>
  );
}

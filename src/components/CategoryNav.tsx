"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, type CategoryMeta } from "@/lib/categories";

function isActive(pathname: string, slug: string) {
  if (pathname === `/${slug}`) return true;
  if (pathname.startsWith(`/${slug}/page/`)) return true;
  return false;
}

function accentBg(accent: CategoryMeta["accent"]) {
  if (accent === "coral") return "bg-coral-200";
  if (accent === "teal") return "bg-teal-200";
  return "bg-butter-200";
}

export function CategoryNav() {
  const pathname = usePathname() || "";
  return (
    <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
      {CATEGORIES.map((cat) => {
        const active = isActive(pathname, cat.slug);
        return (
          <Link
            key={cat.key}
            href={`/${cat.slug}`}
            aria-current={active ? "page" : undefined}
            className={`group relative px-3 py-2 text-sm font-semibold transition-colors ${
              active
                ? "text-ink-900"
                : "text-ink-700 hover:text-ink-900"
            }`}
          >
            <span className="relative z-10">{cat.label}</span>
            <span
              className={`absolute inset-x-2 bottom-1 h-1.5 rounded-full transition-opacity ${accentBg(
                cat.accent,
              )} ${
                active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, ACCENT_STYLES } from "@/lib/categories";
import { MenuIcon, CloseIcon, SearchIcon, ArrowRightIcon } from "./icons";
import { Logo } from "./Logo";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const panel = (
    <div
      className={`md:hidden fixed inset-0 z-[100] transition-opacity duration-200 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-cream shadow-pop overflow-y-auto"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms ease-out",
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100/70">
          <Logo className="h-9 w-auto" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-100 bg-paper text-ink-700"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <div className="p-5">
          <label className="flex items-center gap-2 rounded-full border border-ink-100 bg-paper px-4 py-2.5">
            <SearchIcon width={16} height={16} className="text-ink-500" />
            <input
              type="search"
              placeholder="ค้นหาบทความ..."
              className="flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
            />
          </label>

          <nav className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-300">
              หมวดหมู่
            </p>
            <ul className="mt-3 space-y-1">
              {CATEGORIES.map((c) => {
                const a = ACCENT_STYLES[c.accent];
                const active =
                  pathname === `/${c.slug}` ||
                  pathname.startsWith(`/${c.slug}/page/`);
                return (
                  <li key={c.key}>
                    <Link
                      href={`/${c.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${
                        active
                          ? "bg-paper border border-ink-100"
                          : "hover:bg-paper"
                      }`}
                    >
                      <span
                        className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ${a.fill}`}
                      >
                        <span className="absolute inset-1 rounded-full border-2 border-white/80" />
                        <span
                          className={`absolute inset-2 rounded-full ${
                            active ? "bg-ink-900" : "bg-white"
                          }`}
                        />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block text-base font-bold ${
                            active ? "text-coral-500" : "text-ink-900"
                          }`}
                        >
                          {c.label}
                        </span>
                        <span className="block text-xs text-ink-500">
                          {c.thaiLabel}
                        </span>
                      </span>
                      <ArrowRightIcon
                        width={16}
                        height={16}
                        className={
                          active
                            ? "text-coral-500"
                            : "text-ink-300 group-hover:text-ink-700"
                        }
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href="/news"
            className="mt-8 flex h-12 items-center justify-center gap-2 rounded-full bg-ink-900 text-cream font-semibold"
          >
            ข่าวล่าสุด
            <ArrowRightIcon width={16} height={16} />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-100 bg-paper text-ink-700 md:hidden"
      >
        <MenuIcon width={20} height={20} />
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  );
}

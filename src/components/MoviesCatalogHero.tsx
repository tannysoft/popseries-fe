import Image from "next/image";
import Link from "next/link";
import type { NormalizedPost } from "@/lib/api";
import { ArrowRightIcon } from "./icons";

const dateFmt = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

type Props = {
  hero: NormalizedPost;
  supporting: NormalizedPost[]; // poster strip beside hero
};

export function MoviesCatalogHero({ hero, supporting }: Props) {
  return (
    <div className="grid gap-5 lg:grid-cols-[2fr_1fr] lg:items-stretch">
      {/* Cinematic hero */}
      <Link
        href={`/${hero.slug}`}
        className="group relative block overflow-hidden rounded-[2rem] bg-ink-900 shadow-pop lg:h-full"
      >
        <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[480px]">
          {hero.image ? (
            <Image
              src={hero.image.url}
              alt={hero.image.alt || hero.title}
              fill
              priority
              sizes="(min-width: 1024px) 880px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 gradient-mesh" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/55 to-ink-900/0" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/60 via-ink-900/10 to-transparent" />

          {/* Top meta */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-cream/80">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/10 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-coral-300 animate-pulse" />
              Now showing
            </span>
          </div>

          {/* Body */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-cream/70">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-300 px-2.5 py-1 text-ink-900">
                Featured
              </span>
              <span>ดราม่า</span>
              <span className="h-1 w-1 rounded-full bg-cream/40" />
              <span>คอมเมดี้</span>
              <span className="h-1 w-1 rounded-full bg-cream/40" />
              <span>{dateFmt.format(new Date(hero.date))}</span>
            </div>
            <h2 className="mt-3 line-clamp-2 text-balance text-3xl font-extrabold leading-tight text-cream md:text-5xl">
              {hero.title}
            </h2>
            <p className="mt-3 line-clamp-2 max-w-2xl text-pretty text-sm leading-relaxed text-cream/70 md:text-base">
              {hero.excerpt}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex h-11 items-center gap-2 rounded-full bg-coral-300 text-ink-900 px-5 text-sm font-semibold transition-transform group-hover:-translate-y-0.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7L8 5Z" />
                </svg>
                ดูตัวอย่าง
              </span>
              <span className="inline-flex h-11 items-center gap-2 rounded-full border border-cream/30 text-cream px-5 text-sm font-semibold backdrop-blur transition-colors group-hover:bg-cream/10">
                อ่านรายละเอียด
                <ArrowRightIcon width={14} height={14} />
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Side rail: poster strip */}
      <div className="rounded-[2rem] bg-ink-900 lg:h-full overflow-hidden shadow-pop">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-cream/60">
            Now in cinema
          </span>
          <span className="text-[11px] font-semibold text-cream/40">
            {supporting.length} เรื่อง
          </span>
        </div>
        <ul className="flex flex-col">
          {supporting.map((m) => (
            <li key={m.id}>
              <Link
                href={`/${m.slug}`}
                className="group flex items-stretch gap-3 border-t border-cream/10 hover:bg-cream/5 transition-colors"
              >
                <div className="relative aspect-[3/4] w-20 sm:w-24 shrink-0 overflow-hidden bg-ink-700">
                  {m.image ? (
                    <Image
                      src={m.image.url}
                      alt={m.image.alt || m.title}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 gradient-mesh" />
                  )}
                </div>
                <div className="min-w-0 flex-1 py-3 pr-4">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-coral-300">
                    <span className="h-1 w-1 rounded-full bg-coral-300" />
                    Movie
                  </span>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-cream group-hover:text-coral-300">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-cream/50">
                    {dateFmt.format(new Date(m.date))}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

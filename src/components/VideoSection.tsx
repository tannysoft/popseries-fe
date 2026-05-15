import Image from "next/image";
import Link from "next/link";
import type { NormalizedPost } from "@/lib/api";
import { SectionHeader } from "./SectionHeader";

type Props = { posts: NormalizedPost[] };

function PlayBadge({ size = 56 }: { size?: number }) {
  return (
    <span
      className="absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <span
        className="flex items-center justify-center rounded-full bg-cream/95 text-ink-900 shadow-pop transition-transform duration-300 group-hover:scale-110"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.4}
          height={size * 0.4}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 5v14l11-7L8 5Z" />
        </svg>
      </span>
    </span>
  );
}

function formatDuration(i: number) {
  const minutes = 3 + ((i * 7) % 12);
  const seconds = (i * 17) % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function VideoSection({ posts }: Props) {
  if (posts.length < 4) return null;
  const [hero, ...rest] = posts.slice(0, 6);
  return (
    <section className="mt-24 bg-ink-900 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-coral-300 blur-3xl opacity-30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 bottom-0 h-72 w-72 rounded-full bg-teal-300 blur-3xl opacity-25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-1/3 h-56 w-56 rounded-full bg-butter-300 blur-3xl opacity-20"
      />
      <div className="container-pop relative py-16">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream/10 pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="chip bg-coral-300 text-ink-900">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-900" />
              Video
            </span>
            <h2 className="truncate text-xl font-extrabold leading-[1.4] py-1 text-cream md:text-2xl">
              วิดีโอ &amp; คลิป
            </h2>
            <span className="hidden lg:inline truncate text-sm text-cream/60">
              — รวมคลิปสัมภาษณ์ ตัวอย่าง และเบื้องหลังที่คุณไม่ควรพลาด
            </span>
          </div>
          <Link
            href="#"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-cream/70 hover:text-coral-300"
          >
            ดูทั้งหมด
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Hero video */}
          <Link
            href={`/${hero.slug}`}
            className="group relative block overflow-hidden rounded-[2rem]"
          >
            <div className="relative aspect-[16/10] bg-ink-700">
              {hero.image && (
                <Image
                  src={hero.image.url}
                  alt={hero.image.alt || hero.title}
                  fill
                  sizes="(min-width: 1024px) 760px, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-ink-900/30" />
              <PlayBadge size={84} />
              <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-ink-900/70 px-3 py-1 text-xs font-semibold text-cream backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-coral-300 animate-pulse" />
                Featured · {formatDuration(0)}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h3 className="line-clamp-2 text-balance text-2xl font-extrabold leading-snug text-cream md:text-3xl">
                  {hero.title}
                </h3>
                <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-cream/70">
                  {hero.excerpt}
                </p>
              </div>
            </div>
          </Link>

          {/* Side video list */}
          <ul className="flex flex-col gap-3">
            {rest.map((p, i) => (
              <li key={p.id}>
                <Link
                  href={`/${p.slug}`}
                  className="group flex items-stretch gap-3 overflow-hidden rounded-2xl bg-cream/5 hover:bg-cream/10 transition-colors"
                >
                  <div className="relative aspect-video w-32 sm:w-36 shrink-0 overflow-hidden bg-ink-700">
                    {p.image && (
                      <Image
                        src={p.image.url}
                        alt={p.image.alt || p.title}
                        fill
                        sizes="144px"
                        className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <PlayBadge size={32} />
                    <span className="absolute bottom-1 right-1 rounded-md bg-ink-900/80 px-1.5 py-0.5 text-[10px] font-semibold text-cream">
                      {formatDuration(i + 1)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 py-2 pr-3">
                    <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-cream group-hover:text-coral-300">
                      {p.title}
                    </h4>
                    <p className="mt-1 text-xs text-cream/50">
                      {new Intl.DateTimeFormat("th-TH", {
                        day: "numeric",
                        month: "short",
                      }).format(new Date(p.date))}{" "}
                      · {((p.id % 90) + 12)}K views
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

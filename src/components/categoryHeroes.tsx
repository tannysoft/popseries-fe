import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NormalizedPost } from "@/lib/api";
import { resolveReview } from "@/lib/review";

const dateFmt = new Intl.DateTimeFormat("th-TH", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFmt = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/* ====================================================================== */
/* News — Above-the-fold newspaper                                         */
/* ====================================================================== */

export function NewsHero({ post }: { post: NormalizedPost }) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group block overflow-hidden rounded-[2rem] border border-ink-100/70 bg-paper shadow-pop"
    >
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[460px] bg-ink-100">
          {post.image ? (
            <Image
              src={post.image.url}
              alt={post.image.alt || post.title}
              fill
              priority
              sizes="(min-width: 1024px) 800px, 100vw"
              className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 gradient-mesh" />
          )}
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-coral-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cream shadow-pop">
            <span className="h-1.5 w-1.5 rounded-full bg-cream animate-pulse" />
            Breaking
          </div>
        </div>

        <div className="relative flex flex-col p-6 md:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-1 bg-gradient-to-r from-coral-300 via-butter-300 to-teal-300 opacity-80 rounded-full"
          />
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
            <span>{dateFmt.format(new Date(post.date))}</span>
            <span>News · ฉบับล่าสุด</span>
          </div>

          <h2 className="mt-6 line-clamp-4 text-balance text-2xl font-extrabold leading-[1.15] text-ink-900 md:text-3xl lg:text-4xl">
            {post.title}
          </h2>

          <p className="mt-5 line-clamp-4 text-pretty text-sm leading-relaxed text-ink-500 md:text-base">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-8 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-ink-500">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-coral-100 text-coral-500 font-bold">
                {post.authorName.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="text-ink-300 text-[10px] uppercase tracking-widest font-semibold">
                  Reporter
                </p>
                <p className="font-semibold text-ink-900">{post.authorName}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-coral-500 group-hover:gap-3 transition-all">
              อ่านต่อ
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m13 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ====================================================================== */
/* Review — Critic showcase                                                */
/* ====================================================================== */

function StarRating({ score }: { score: number }) {
  const filled = Math.round(score / 2); // 0–5
  return (
    <div className="flex items-center gap-0.5" aria-label={`${score}/10`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={i < filled ? "#F2A48C" : "rgba(242,164,140,0.25)"}
          aria-hidden
        >
          <path d="M12 17.3 6.18 21l1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.82 4.73L17.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewHero({ post }: { post: NormalizedPost }) {
  const review = post.review ? resolveReview(post.review) : null;
  const breakdown = review
    ? [
        { label: "เรื่องราว", value: review.story },
        { label: "การแสดง", value: review.acting },
        { label: "งานสร้าง", value: review.production },
      ]
    : [];

  return (
    <Link
      href={`/${post.slug}`}
      className="group block overflow-hidden rounded-[2rem] bg-paper shadow-pop border border-ink-100/70"
    >
      <div className="grid lg:grid-cols-[1fr_1fr]">
        <div className="relative aspect-square lg:aspect-auto lg:min-h-[480px] bg-ink-100">
          {post.image ? (
            <Image
              src={post.image.url}
              alt={post.image.alt || post.title}
              fill
              priority
              sizes="(min-width: 1024px) 660px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 gradient-mesh" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent" />
          <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-ink-900/80 backdrop-blur px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cream">
            ทีมงาน Pop ลงคะแนนแล้ว
          </span>
        </div>

        <div className="relative flex flex-col gap-5 p-6 md:p-10 bg-gradient-to-br from-teal-50 via-cream to-butter-50">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
            <span>Critic&apos;s verdict</span>
            <span>Issue · {shortDateFmt.format(new Date(post.date))}</span>
          </div>

          {/* Score panel — only when an editor has scored this review */}
          {review && (
            <div className="flex items-end gap-4">
              <span className="text-7xl font-extrabold leading-none bg-gradient-to-br from-coral-400 via-coral-300 to-butter-300 bg-clip-text text-transparent tabular-nums md:text-8xl">
                {review.score.toFixed(1)}
              </span>
              <div className="pb-2">
                <StarRating score={review.score} />
                <p className="mt-1 text-xs font-semibold text-ink-500">
                  จาก 10 คะแนนเต็ม
                </p>
              </div>
            </div>
          )}

          <h2 className="line-clamp-3 text-balance text-xl font-extrabold leading-tight text-ink-900 md:text-2xl lg:text-3xl">
            {post.title}
          </h2>

          <p className="line-clamp-3 text-pretty text-sm leading-relaxed text-ink-500">
            {post.excerpt}
          </p>

          {/* Breakdown bars */}
          {breakdown.length > 0 && (
            <ul className="space-y-2.5">
              {breakdown.map((b) => (
                <li key={b.label} className="flex items-center gap-3 text-xs">
                  <span className="w-16 shrink-0 font-semibold text-ink-700">
                    {b.label}
                  </span>
                  <span className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                    <span
                      className="block h-full bg-gradient-to-r from-coral-300 via-butter-300 to-teal-400"
                      style={{ width: `${(b.value / 10) * 100}%` }}
                    />
                  </span>
                  <span className="w-9 text-right font-bold text-ink-900 tabular-nums">
                    {b.value.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-500 group-hover:gap-3 transition-all mt-auto">
            อ่านรีวิวเต็ม
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ====================================================================== */
/* Scoop — Tabloid cover                                                   */
/* ====================================================================== */

export function ScoopHero({ post }: { post: NormalizedPost }) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group relative block overflow-hidden rounded-[2rem] border border-butter-200/70 bg-gradient-to-br from-butter-50 via-cream to-coral-50 shadow-pop"
    >
      {/* Decorative tabloid blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-coral-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-butter-200/50 blur-3xl"
      />

      <div className="relative grid items-center gap-6 p-5 md:gap-10 md:p-8 lg:grid-cols-[1.05fr_1fr] lg:p-10">
        {/* Clear photo clipping — taped, tilted, NO dark overlay */}
        <div className="relative mx-auto w-full max-w-xl -rotate-1 rounded-2xl bg-paper p-3 shadow-pop ring-1 ring-ink-100/70 transition-transform duration-500 group-hover:rotate-0">
          <span
            aria-hidden
            className="absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 -rotate-3 rounded-[3px] bg-butter-200/80 shadow-sm"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-100">
            {post.image ? (
              <Image
                src={post.image.url}
                alt={post.image.alt || post.title}
                fill
                priority
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 gradient-mesh" />
            )}
            {/* Small corner stamp — does not cover the photo */}
            <span className="absolute right-3 top-3 -rotate-6 inline-flex flex-col items-center justify-center rounded-xl border-2 border-coral-300 bg-coral-500/95 px-3 py-1.5 text-center text-cream shadow-pop">
              <span className="text-[9px] font-bold uppercase tracking-[0.22em]">
                Exclusive
              </span>
              <span className="-mt-0.5 text-base font-extrabold leading-none">
                Inside
              </span>
            </span>
          </div>
        </div>

        {/* Headline panel — on paper, fully readable */}
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cream">
              <span className="h-1.5 w-1.5 rounded-full bg-cream animate-pulse" />
              Pop Scoop · ฉบับพิเศษ
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              {shortDateFmt.format(new Date(post.date))}
            </span>
          </div>

          <h2 className="mt-4 line-clamp-4 text-balance text-3xl font-extrabold leading-[1.08] text-ink-900 md:text-4xl lg:text-5xl">
            {post.title}
          </h2>

          <p className="mt-4 line-clamp-3 text-pretty text-base leading-relaxed text-ink-500 md:text-lg">
            {post.excerpt}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {["เรื่องราว", "ดราม่า", "เบื้องหลัง"].map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-full bg-paper px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-ink-700 ring-1 ring-ink-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream transition-transform group-hover:-translate-y-0.5">
            อ่านสกู๊ปเต็ม
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ====================================================================== */
/* Series — Cinematic billboard                                            */
/* ====================================================================== */

export function SeriesHero({ post }: { post: NormalizedPost }) {
  const series = post.series;
  const year = series?.year ?? new Date(post.date).getFullYear();
  // Build the metadata strip from whatever the editor filled in.
  const metaItems: React.ReactNode[] = [];
  if (series?.episodes) {
    metaItems.push(
      <>
        <span className="text-cream">{series.episodes}</span> ตอน
      </>,
    );
  }
  if (year) metaItems.push(<>{year}</>);
  if (series?.genres?.length) metaItems.push(<>{series.genres.join(" · ")}</>);
  if (series?.platforms?.length)
    metaItems.push(<>{series.platforms.join(" · ")}</>);

  return (
    <Link
      href={`/${post.slug}`}
      className="group relative block overflow-hidden rounded-[2rem] bg-ink-900 shadow-pop"
    >
      <div className="relative aspect-[16/10] md:aspect-[16/8]">
        {post.image ? (
          <Image
            src={post.image.url}
            alt={post.image.alt || post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 gradient-mesh" />
        )}

        {/* Letterbox-ish gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/15 to-transparent" />

        {/* Top status bar */}
        <div className="absolute top-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-coral-300/95 text-ink-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] shadow-pop">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-900 animate-pulse" />
            Now streaming
          </span>
          {series?.formats?.length ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/70">
              <span className="inline-block h-2 w-2 rounded-full bg-coral-300" />
              {series.formats.join(" · ")}
            </span>
          ) : null}
        </div>

        {/* Title block bottom-left */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:max-w-3xl">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.22em] text-coral-300">
            ★ Featured series
          </span>
          <h2 className="mt-3 line-clamp-2 text-balance text-3xl font-extrabold leading-[1.05] text-cream md:text-5xl lg:text-6xl">
            {post.title}
          </h2>
          <p className="mt-3 hidden md:block line-clamp-2 max-w-2xl text-pretty text-base leading-relaxed text-cream/70">
            {post.excerpt}
          </p>

          {/* Metadata strip — only the fields the editor provided */}
          {metaItems.length > 0 && (
            <ul className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-cream/70">
              {metaItems.map((item, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <li
                      aria-hidden
                      className="h-1 w-1 rounded-full bg-cream/40"
                    />
                  )}
                  <li>{item}</li>
                </Fragment>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
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
              เริ่มดูตอนแรก
            </span>
            <span className="inline-flex h-11 items-center gap-2 rounded-full border border-cream/30 text-cream px-5 text-sm font-semibold backdrop-blur transition-colors group-hover:bg-cream/10">
              อ่านเรื่องย่อ
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m13 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

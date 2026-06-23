import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { MoviesCatalogHero } from "@/components/MoviesCatalogHero";
import {
  NewsHero,
  ReviewHero,
  ScoopHero,
  SeriesHero,
} from "@/components/categoryHeroes";
import { Pagination } from "@/components/Pagination";
import { ACCENT_STYLES, type CategoryMeta } from "@/lib/categories";
import type { NormalizedPost } from "@/lib/api";

type Props = {
  category: CategoryMeta;
  posts: NormalizedPost[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

const dateFmt = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
});

const fullDateFmt = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function fakeScore(id: number) {
  // deterministic 7.0 – 9.7
  return (((id * 7) % 28) + 70) / 10;
}

function fakeViews(id: number) {
  return ((id * 13) % 90) + 5;
}

export function CategoryView({
  category,
  posts,
  currentPage,
  totalPages,
  totalCount,
}: Props) {
  const accent = ACCENT_STYLES[category.accent];
  const isFirstPage = currentPage === 1;
  const hero = isFirstPage ? posts[0] : null;
  const rest = isFirstPage ? posts.slice(1) : posts;

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className={`absolute inset-0 ${
            category.accent === "coral"
              ? "bg-gradient-to-br from-coral-100 via-cream to-butter-50"
              : category.accent === "teal"
              ? "bg-gradient-to-br from-teal-100 via-cream to-coral-50"
              : "bg-gradient-to-br from-butter-100 via-cream to-teal-50"
          }`}
        />
        <div className="absolute inset-0 grid-noise opacity-40" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-coral-200/40 blur-3xl float-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl float-slow"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="container-pop relative pt-14 pb-12">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-ink-500">
            <span className={`chip ${accent.chip}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${accent.fill}`} />
              Category
            </span>
            <span>·</span>
            <span>{totalCount.toLocaleString("th-TH")} เรื่อง</span>
            {totalPages > 1 && (
              <>
                <span>·</span>
                <span>
                  หน้า {currentPage} / {totalPages}
                </span>
              </>
            )}
          </div>
          <h1 className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-balance text-4xl font-extrabold leading-tight text-ink-900 md:text-6xl">
            <span>{category.thaiLabel}</span>
            <span className="text-xl font-semibold text-ink-500 md:text-2xl">
              {category.label}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-500 md:text-lg">
            {category.tagline}
          </p>
        </div>
      </section>

      <section className="container-pop">
        <CategoryLayout category={category} hero={hero} posts={rest} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/${category.slug}`}
        />
      </section>
    </>
  );
}

function CategoryLayout({
  category,
  hero,
  posts,
}: {
  category: CategoryMeta;
  hero: NormalizedPost | null;
  posts: NormalizedPost[];
}) {
  if (!hero && posts.length === 0) {
    return (
      <p className="text-center text-ink-500 py-20">
        ยังไม่มีบทความในหมวดนี้
      </p>
    );
  }

  switch (category.key) {
    case "news":
      return <NewsLayout hero={hero} posts={posts} />;
    case "review":
      return <ReviewLayout hero={hero} posts={posts} />;
    case "scoop":
      return <ScoopLayout hero={hero} posts={posts} />;
    case "movies":
      return <MoviesLayout hero={hero} posts={posts} />;
    case "star":
      return <StarLayout hero={hero} posts={posts} />;
    case "series":
    default:
      return <SeriesLayout hero={hero} posts={posts} />;
  }
}

/* ------------------------------------------------------------------ */
/* Shared section heading                                              */
/* ------------------------------------------------------------------ */

function SectionLabel({
  eyebrow,
  title,
  meta,
  accent = "coral",
}: {
  eyebrow: string;
  title: string;
  meta?: string;
  accent?: "coral" | "teal" | "butter";
}) {
  const a = ACCENT_STYLES[accent];
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink-100/70 pb-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`chip ${a.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${a.fill}`} />
          {eyebrow}
        </span>
        <h2 className="text-lg font-extrabold text-ink-900 md:text-xl leading-[1.4] py-1">
          {title}
        </h2>
      </div>
      {meta && (
        <span className="text-xs font-semibold uppercase tracking-widest text-ink-300">
          {meta}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* News — daily brief: feature + editor pick row + headlines + grid    */
/* ------------------------------------------------------------------ */

function NewsLayout({
  hero,
  posts,
}: {
  hero: NormalizedPost | null;
  posts: NormalizedPost[];
}) {
  const editorsPick = posts.slice(0, 3);
  const headlines = posts.slice(3, 9);
  const remaining = posts.slice(9);
  return (
    <>
      {hero && (
        <div className="mb-14">
          <NewsHero post={hero} />
        </div>
      )}

      {editorsPick.length > 0 && (
        <div className="mb-16">
          <SectionLabel
            eyebrow="Editor's pick"
            title="คัดมาให้แล้ววันนี้"
            meta="3 เรื่องที่ไม่ควรพลาด"
            accent="coral"
          />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {editorsPick.map((p) => (
              <ArticleCard key={p.id} post={p} variant="default" />
            ))}
          </div>
        </div>
      )}

      {headlines.length > 0 && (
        <div className="mb-16">
          <SectionLabel
            eyebrow="Headlines"
            title="พาดหัวข่าวสั้น"
            meta="อ่านได้รวดเดียว"
            accent="teal"
          />
          <ol className="mt-6 grid gap-x-10 gap-y-1 sm:grid-cols-2">
            {headlines.map((p, i) => (
              <li
                key={p.id}
                className="flex gap-4 py-4 border-b border-ink-100/60"
              >
                <span className="shrink-0 text-2xl font-extrabold text-coral-300 tabular-nums leading-none w-9 pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link
                  href={`/${p.slug}`}
                  className="group flex flex-1 items-center gap-4 min-w-0"
                >
                  <div className="relative h-16 w-20 sm:h-[72px] sm:w-24 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                    {p.image ? (
                      <Image
                        src={p.image.url}
                        alt={p.image.alt || p.title}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 gradient-mesh" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-balance text-base font-semibold leading-snug text-ink-900 group-hover:text-coral-500 transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-ink-500">
                      {fullDateFmt.format(new Date(p.date))}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      {remaining.length > 0 && (
        <div>
          <SectionLabel
            eyebrow="Latest"
            title="ข่าวล่าสุด"
            meta={`${remaining.length} เรื่อง`}
            accent="butter"
          />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {remaining.map((p) => (
              <ArticleCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Review — critic magazine with star scores                           */
/* ------------------------------------------------------------------ */

function ScorePill({ score }: { score: number }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-sm font-bold text-ink-900 shadow-pop"
      title={`คะแนน ${score.toFixed(1)} / 10`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="#F2A48C"
        aria-hidden
      >
        <path d="M12 17.3 6.18 21l1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.82 4.73L17.82 21z" />
      </svg>
      {score.toFixed(1)}
      <span className="text-[10px] font-semibold text-ink-300">/10</span>
    </span>
  );
}

function ReviewLayout({
  hero,
  posts,
}: {
  hero: NormalizedPost | null;
  posts: NormalizedPost[];
}) {
  const featured = posts.slice(0, 4);
  const quickTakes = posts.slice(4);

  return (
    <>
      {hero && (
        <div className="mb-14">
          <ReviewHero post={hero} />
        </div>
      )}

      {featured.length > 0 && (
        <div className="mb-16">
          <SectionLabel
            eyebrow="Featured reviews"
            title="รีวิวเจาะลึก"
            meta="ทีมงานให้คะแนน"
            accent="teal"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {featured.map((p) => {
              const score = fakeScore(p.id);
              return (
                <Link
                  key={p.id}
                  href={`/${p.slug}`}
                  className="group relative grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] items-stretch gap-4 sm:gap-5 rounded-[1.5rem] border border-ink-100/60 bg-paper p-3 sm:p-4 hover:border-teal-200 hover:bg-teal-50/40 transition-colors"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink-100">
                    {p.image ? (
                      <Image
                        src={p.image.url}
                        alt={p.image.alt || p.title}
                        fill
                        sizes="180px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 gradient-mesh" />
                    )}
                    <span className="absolute bottom-2 left-2">
                      <ScorePill score={score} />
                    </span>
                  </div>
                  <div className="min-w-0 self-center">
                    <span className="chip bg-teal-100 text-teal-500">
                      Review
                    </span>
                    <h3 className="mt-2 line-clamp-2 text-balance text-base font-bold leading-snug text-ink-900 group-hover:text-teal-500 md:text-lg">
                      {p.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-ink-500 sm:text-sm">
                      {p.excerpt}
                    </p>
                    <div
                      className="mt-3 h-1 w-full rounded-full bg-ink-100 overflow-hidden"
                      aria-hidden
                    >
                      <span
                        className="block h-full bg-gradient-to-r from-coral-300 via-butter-300 to-teal-400"
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-ink-300">
                      {dateFmt.format(new Date(p.date))}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {quickTakes.length > 0 && (
        <div>
          <SectionLabel
            eyebrow="Quick takes"
            title="รีวิวสั้น"
            meta={`${quickTakes.length} เรื่อง`}
            accent="butter"
          />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickTakes.map((p) => (
              <ArticleCard key={p.id} post={p} variant="default" />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Scoop — gossip pinboard: clear-image scrapbook clippings             */
/* ------------------------------------------------------------------ */

const CLIP_ROTATIONS = [
  "-rotate-[1.4deg]",
  "rotate-[1.1deg]",
  "-rotate-[0.7deg]",
  "rotate-[1.5deg]",
  "-rotate-[1.2deg]",
  "rotate-[0.6deg]",
];

const CLIP_TAPE = ["bg-butter-200/70", "bg-coral-200/70", "bg-teal-200/60"];

/** Scrapbook clipping — full, clear image with a paper caption below. */
function ScoopClip({
  post,
  index,
  number,
  aspect = "aspect-[4/3]",
}: {
  post: NormalizedPost;
  index: number;
  number?: number;
  aspect?: string;
}) {
  const rot = CLIP_ROTATIONS[index % CLIP_ROTATIONS.length];
  const tape = CLIP_TAPE[index % CLIP_TAPE.length];

  return (
    <Link
      href={`/${post.slug}`}
      className={`group relative block rounded-[1.25rem] bg-paper p-2.5 shadow-pop ring-1 ring-ink-100/70 transition-transform duration-300 ${rot} hover:rotate-0 hover:-translate-y-1`}
    >
      {/* Tape strip */}
      <span
        aria-hidden
        className={`absolute -top-2.5 left-1/2 h-5 w-24 -translate-x-1/2 -rotate-3 rounded-[3px] ${tape} shadow-sm`}
      />

      {/* Clear, full image — no dark overlay */}
      <div className={`relative ${aspect} overflow-hidden rounded-[0.85rem] bg-ink-100`}>
        {post.image ? (
          <Image
            src={post.image.url}
            alt={post.image.alt || post.title}
            fill
            sizes="(min-width: 1024px) 460px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 gradient-mesh" />
        )}
        {typeof number === "number" && (
          <span className="absolute left-2.5 top-2.5 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-coral-500 px-2 text-sm font-extrabold text-cream tabular-nums shadow-pop">
            {String(number).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Caption */}
      <div className="px-1.5 pb-1 pt-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-butter-500">
          <span className="h-1.5 w-1.5 rounded-full bg-coral-300" />
          Scoop
          <span className="text-ink-300">·</span>
          <span className="text-ink-300 normal-case tracking-normal">
            {fullDateFmt.format(new Date(post.date))}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-balance text-base font-extrabold leading-snug text-ink-900 group-hover:text-coral-500 md:text-lg">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

function ScoopLayout({
  hero,
  posts,
}: {
  hero: NormalizedPost | null;
  posts: NormalizedPost[];
}) {
  const featured = posts.slice(0, 3);
  const wall = posts.slice(3);

  return (
    <>
      {hero && (
        <div className="mb-12">
          <ScoopHero post={hero} />
        </div>
      )}

      {featured.length > 0 && (
        <div className="mb-16">
          <SectionLabel
            eyebrow="Hot exclusives"
            title="เม้าท์ร้อนประจำสัปดาห์"
            meta="อ่านก่อนใคร"
            accent="butter"
          />
          <div className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <ScoopClip key={p.id} post={p} index={i} number={i + 1} />
            ))}
          </div>
        </div>
      )}

      {wall.length > 0 && (
        <div>
          <SectionLabel
            eyebrow="Scoop wall"
            title="สกู๊ปทั้งหมด"
            accent="coral"
          />
          <div className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {wall.map((p, i) => (
              <ScoopClip key={p.id} post={p} index={i + 3} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Series — TV-guide style                                             */
/* ------------------------------------------------------------------ */

function SeriesLayout({
  hero,
  posts,
}: {
  hero: NormalizedPost | null;
  posts: NormalizedPost[];
}) {
  const nowStreaming = posts.slice(0, 5);
  const topTen = posts.slice(5, 13);
  const remaining = posts.slice(13);

  return (
    <>
      {hero && (
        <div className="mb-14">
          <SeriesHero post={hero} />
        </div>
      )}

      {nowStreaming.length > 0 && (
        <div className="mb-16">
          <SectionLabel
            eyebrow="Now streaming"
            title="กำลังออนแอร์"
            meta="เริ่มดูได้เลย"
            accent="coral"
          />
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {nowStreaming.map((p) => (
              <ArticleCard key={p.id} post={p} variant="poster" />
            ))}
          </div>
        </div>
      )}

      {topTen.length > 0 && (
        <div className="mb-16">
          <SectionLabel
            eyebrow="Top picks"
            title="ซีรีส์ฮิตสัปดาห์นี้"
            meta="จัดอันดับโดยทีมงาน"
            accent="teal"
          />
          <ol className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {topTen.map((p, i) => (
              <li
                key={p.id}
                className="flex items-stretch gap-4 rounded-2xl border border-ink-100/60 bg-paper p-3 hover:border-teal-200 hover:bg-teal-50/40 transition-colors"
              >
                <span
                  className="shrink-0 text-5xl md:text-6xl font-extrabold leading-none tabular-nums bg-gradient-to-br from-coral-300 to-teal-400 bg-clip-text text-transparent"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link
                  href={`/${p.slug}`}
                  className="group flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="relative aspect-[3/4] w-14 sm:w-16 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                    {p.image ? (
                      <Image
                        src={p.image.url}
                        alt={p.image.alt || p.title}
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 gradient-mesh" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink-900 group-hover:text-coral-500 md:text-base">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-xs text-ink-500">
                      {fakeViews(p.id)}K คนกำลังดู
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      {remaining.length > 0 && (
        <div>
          <SectionLabel
            eyebrow="Browse all"
            title="ทุกซีรีส์"
            meta={`${remaining.length} เรื่อง`}
            accent="butter"
          />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {remaining.map((p) => (
              <ArticleCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Movies — cinema catalog (existing component)                        */
/* ------------------------------------------------------------------ */

function MoviesLayout({
  hero,
  posts,
}: {
  hero: NormalizedPost | null;
  posts: NormalizedPost[];
}) {
  const sideRail = posts.slice(0, 4);
  const remaining = posts.slice(4);

  return (
    <>
      {hero && (
        <div className="mb-12">
          <MoviesCatalogHero hero={hero} supporting={sideRail} />
        </div>
      )}
      <SectionLabel
        eyebrow="Cinema wall"
        title="ผลงานหนังในคลัง"
        meta={`${remaining.length} เรื่อง`}
        accent="coral"
      />
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {remaining.map((p) => (
          <ArticleCard key={p.id} post={p} variant="poster" />
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Star — spotlight + portrait bento                                   */
/* ------------------------------------------------------------------ */

function StarLayout({
  hero,
  posts,
}: {
  hero: NormalizedPost | null;
  posts: NormalizedPost[];
}) {
  const supporting = posts.slice(0, 8);
  const remaining = posts.slice(8);

  return (
    <>
      {/* Spotlight hero — big star profile */}
      {hero && (
        <div className="mb-14 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-coral-200/70 via-butter-100 to-teal-100 shadow-pop">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-coral-300/50 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-teal-300/40 blur-3xl"
          />
          <div className="relative grid gap-6 p-6 md:grid-cols-[auto_1fr] md:gap-10 md:p-10 lg:items-center">
            <Link
              href={`/${hero.slug}`}
              className="group relative mx-auto block h-48 w-48 sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-80 lg:w-80 overflow-hidden rounded-full ring-8 ring-paper/70 shadow-pop"
            >
              {hero.image ? (
                <Image
                  src={hero.image.url}
                  alt={hero.image.alt || hero.title}
                  fill
                  priority
                  sizes="320px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 gradient-mesh" />
              )}
            </Link>
            <div>
              <span className="chip bg-paper text-ink-900">
                <span className="h-1.5 w-1.5 rounded-full bg-coral-300 animate-pulse" />
                Spotlight
              </span>
              <h2 className="mt-3 line-clamp-2 text-balance text-3xl font-extrabold leading-tight text-ink-900 md:text-5xl">
                {hero.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-pretty text-base text-ink-700 md:text-lg">
                {hero.excerpt}
              </p>
              <Link
                href={`/${hero.slug}`}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream hover:bg-ink-700 transition-colors"
              >
                อ่านโปรไฟล์
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
              </Link>
            </div>
          </div>
        </div>
      )}

      {supporting.length > 0 && (
        <div className="mb-16">
          <SectionLabel
            eyebrow="K-Pop royalty"
            title="ไอคอนที่ห้ามพลาด"
            meta="ตัวจริงเสียงจริง"
            accent="coral"
          />
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-10">
            {supporting.map((p) => (
              <ArticleCard key={p.id} post={p} variant="portrait" />
            ))}
          </div>
        </div>
      )}

      {remaining.length > 0 && (
        <div>
          <SectionLabel
            eyebrow="All stars"
            title="ศิลปินทั้งหมด"
            meta={`${remaining.length} คน`}
            accent="teal"
          />
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10">
            {remaining.map((p) => (
              <ArticleCard key={p.id} post={p} variant="portrait" />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

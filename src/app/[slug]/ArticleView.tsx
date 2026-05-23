import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { FloatingShareBar } from "@/components/FloatingShareBar";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ReviewDetails } from "@/components/ReviewDetails";
import { ShareBar } from "@/components/ShareBar";
import {
  getMostViewedPosts,
  getPosts,
  type NormalizedPost,
} from "@/lib/api";
import { ACCENT_STYLES } from "@/lib/categories";

const dateFmt = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function estimateReadingTime(html: string) {
  const text = html.replace(/<[^>]*>/g, "").trim();
  const thaiChars = text.replace(/[\s\p{P}]/gu, "").length;
  // 320 thai characters/min is a comfortable Thai reading rate
  const minutes = Math.max(1, Math.round(thaiChars / 320));
  return minutes;
}

export async function ArticleView({ post }: { post: NormalizedPost }) {
  const [related, mostViewed] = await Promise.all([
    post.category
      ? getPosts({
          perPage: 4,
          categoryId: post.category.id,
          exclude: [post.id],
        }).then((p) => p.slice(0, 3))
      : Promise.resolve([] as NormalizedPost[]),
    getMostViewedPosts({ limit: 6, exclude: [post.id] }).then((p) =>
      p.slice(0, 5),
    ),
  ]);

  const accent = post.category
    ? ACCENT_STYLES[post.category.accent]
    : ACCENT_STYLES.coral;

  const minutes = estimateReadingTime(post.contentHtml);
  const accentBgClass =
    post.category?.accent === "coral"
      ? "from-coral-100 via-cream to-butter-50"
      : post.category?.accent === "teal"
      ? "from-teal-100 via-cream to-coral-50"
      : "from-butter-100 via-cream to-teal-50";

  return (
    <article className="pb-20">
      <ReadingProgress />

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-br ${accentBgClass}`}
        />
        <div className="absolute inset-0 grid-noise opacity-40" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-coral-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl"
        />

        <div className="container-pop relative pt-12 pb-10 md:pt-16">
          <nav className="text-xs font-semibold uppercase tracking-widest text-ink-500">
            <Link href="/" className="hover:text-ink-900">
              หน้าแรก
            </Link>
            <span className="mx-2 text-ink-300">/</span>
            {post.category ? (
              <Link
                href={`/${post.category.slug}`}
                className="hover:text-ink-900"
              >
                {post.category.label}
              </Link>
            ) : (
              <span>บทความ</span>
            )}
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {post.category && (
              <span className={`chip ${accent.chip}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${accent.fill}`} />
                {post.category.label}
              </span>
            )}
            <span className="text-xs font-medium text-ink-500">
              {dateFmt.format(new Date(post.date))}
            </span>
            <span className="h-1 w-1 rounded-full bg-ink-300" aria-hidden />
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" />
              </svg>
              อ่าน {minutes} นาที
            </span>
          </div>

          <h1 className="mt-5 text-balance text-2xl font-extrabold leading-[1.15] text-ink-900 md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-pretty text-base leading-relaxed text-ink-500 md:text-lg">
              {post.excerpt}
            </p>
          )}

          <div className="mt-7 flex items-center gap-3">
            {post.authorAvatar ? (
              <Image
                src={post.authorAvatar}
                alt={post.authorName}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-paper shadow-sm"
              />
            ) : (
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-coral-200 text-coral-500 font-bold ring-2 ring-paper">
                {post.authorName.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="text-sm">
              <p className="text-ink-500">เขียนโดย</p>
              {post.authorSlug ? (
                <Link
                  href={`/author/${post.authorSlug}`}
                  className="font-semibold text-ink-900 hover:text-coral-500 transition-colors"
                >
                  {post.authorName}
                </Link>
              ) : (
                <p className="font-semibold text-ink-900">{post.authorName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Featured image overflows into next section */}
        {post.image && (
          <div className="container-pop relative">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-ink-100 shadow-pop">
              <Image
                src={post.image.url}
                alt={post.image.alt || post.title}
                fill
                priority
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </header>

      {/* Body */}
      <section className="container-pop mt-12">
        <div className="relative lg:grid lg:grid-cols-[64px_minmax(0,1fr)_340px] lg:gap-10 xl:grid-cols-[64px_minmax(0,1fr)_360px] xl:gap-14">
          {/* Floating share rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <FloatingShareBar title={post.title} />
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0">
            {post.category?.key === "review" && (
              <ReviewDetails postId={post.id} />
            )}
            <div
              className="prose-pop prose-pop-drop"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-300">
                  Tags
                </span>
                {post.tags.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tag/${t.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-coral-100 hover:text-coral-500 transition-colors"
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile share */}
            <div className="mt-8 lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-300 mb-3">
                แชร์บทความนี้
              </p>
              <ShareBar title={post.title} />
            </div>
          </div>

          {/* Sticky TOC / meta */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              {mostViewed.length > 0 && (
                <div className="rounded-2xl border border-ink-100/70 bg-paper p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-300">
                      อ่านมากที่สุด
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-coral-500">
                      Most viewed
                    </span>
                  </div>
                  <ol className="mt-4 space-y-4">
                    {mostViewed.map((p, i) => (
                      <li key={p.id} className="group flex items-start gap-3">
                        <span className="shrink-0 w-6 text-xl font-extrabold leading-none text-coral-200 group-hover:text-coral-500 transition-colors">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Link
                          href={`/${p.slug}`}
                          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-100"
                        >
                          {p.image ? (
                            <Image
                              src={p.image.url}
                              alt={p.image.alt || p.title}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <span className="absolute inset-0 gradient-mesh" />
                          )}
                        </Link>
                        <div className="min-w-0 flex-1">
                          {p.category && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-ink-300">
                              {p.category.label}
                            </span>
                          )}
                          <Link
                            href={`/${p.slug}`}
                            className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-ink-900 group-hover:text-coral-500 transition-colors"
                          >
                            {p.title}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              <div className="rounded-2xl border border-ink-100/70 bg-paper p-5">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-300">
                  ในบทความนี้
                </h4>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-ink-500">หมวด</dt>
                    <dd className="font-semibold text-ink-900">
                      {post.category?.label || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-ink-500">เผยแพร่</dt>
                    <dd className="font-semibold text-ink-900">
                      {dateFmt.format(new Date(post.date))}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-ink-500">เวลาอ่าน</dt>
                    <dd className="font-semibold text-ink-900">
                      {minutes} นาที
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-pop mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink-100/70 pb-4">
            <h2 className="text-2xl font-extrabold text-ink-900 md:text-3xl">
              อ่านต่อในหมวด{" "}
              <span className="text-coral-500">
                {post.category?.thaiLabel}
              </span>
            </h2>
            {post.category && (
              <Link
                href={`/${post.category.slug}`}
                className="text-sm font-semibold text-ink-700 hover:text-coral-500"
              >
                ดูทั้งหมด →
              </Link>
            )}
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ArticleCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeader } from "@/components/SectionHeader";
import {
  getPosts,
  getPopularTags,
  getSliderPosts,
  getMostViewedPosts,
} from "@/lib/api";
import { CATEGORIES, ACCENT_STYLES, type CategoryMeta } from "@/lib/categories";
import { KeywordsSection } from "@/components/KeywordsSection";
import { VideoSection } from "@/components/VideoSection";
import { HeroSlider } from "@/components/HeroSlider";

export const revalidate = 600;

async function loadHomeData() {
  const [latest, popularTags, slider, mostViewed, ...byCategory] =
    await Promise.all([
      getPosts({ perPage: 14 }),
      getPopularTags(22),
      getSliderPosts(),
      getMostViewedPosts({ limit: 6, range: "last7days" }),
      ...CATEGORIES.map((c) => getPosts({ perPage: 5, categoryId: c.id })),
    ]);
  const sections = CATEGORIES.map((c, i) => ({ category: c, posts: byCategory[i] }));
  return { latest, sections, popularTags, slider, mostViewed };
}

export default async function Home() {
  const { latest, sections, popularTags, slider, mostViewed } =
    await loadHomeData();
  // Editor-curated slides take over when set; otherwise fall back to latest.
  const heroSlides = slider.length ? slider : latest.slice(0, 5);
  const rest = latest.slice(5);
  const sidebar = rest.slice(0, 4);
  // Real "most read" from WordPress Popular Posts; fall back to latest when WPP
  // has no data. Drop any post already featured in the hero to avoid repeats.
  const heroIds = new Set(heroSlides.map((p) => p.id));
  const trending = (mostViewed.length ? mostViewed : rest.slice(4, 9))
    .filter((p) => !heroIds.has(p.id))
    .slice(0, 5);
  const videoPool = latest.slice(0, 7);

  const findSection = (key: CategoryMeta["key"]) =>
    sections.find((s) => s.category.key === key);

  const news = findSection("news");
  const review = findSection("review");
  const scoop = findSection("scoop");
  const series = findSection("series");
  const movies = findSection("movies");
  const star = findSection("star");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" aria-hidden />
        <div className="absolute inset-0 grid-noise opacity-40" aria-hidden />
        <div className="container-pop relative pt-8 pb-12 md:pt-12 md:pb-20">
          {heroSlides.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-stretch">
              <HeroSlider posts={heroSlides} />
              <div className="flex flex-col rounded-[2rem] border border-ink-100/70 bg-paper/80 backdrop-blur p-5 md:p-6 lg:h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-ink-900">อ่านต่อ</h3>
                  <Link
                    href="/news"
                    className="text-xs font-semibold text-coral-500 hover:text-coral-400"
                  >
                    ทั้งหมด →
                  </Link>
                </div>
                <ul className="mt-2 flex flex-col lg:flex-1 lg:justify-between">
                  {sidebar.map((p) => (
                    <li key={p.id}>
                      <ArticleCard post={p} variant="list" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Category nav strip */}
      <section className="container-pop -mt-8 relative">
        <div className="rounded-[2rem] border border-ink-100/70 bg-paper/95 backdrop-blur p-2 shadow-pop">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1">
            {CATEGORIES.map((c) => (
              <CategoryTile key={c.key} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="container-pop mt-16">
          <SectionHeader
            eyebrow="Trending"
            title="กำลังเป็นที่พูดถึง"
            description="อ่านมากที่สุดในรอบสัปดาห์"
            accent="teal"
          />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {trending.map((p, i) => (
              <div key={p.id} className="relative">
                <span className="absolute -left-2 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-cream font-bold text-sm shadow-pop">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ArticleCard post={p} variant="compact" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* News — magazine layout (big + 3 small in row) */}
      {news?.posts.length ? (
        <section className="container-pop mt-20">
          <SectionHeader
            eyebrow={news.category.label}
            title={news.category.thaiLabel}
            description={news.category.tagline}
            href={`/${news.category.slug}`}
            accent={news.category.accent}
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-stretch">
            <ArticleCard post={news.posts[0]} variant="feature" />
            <ul className="flex flex-col rounded-[2rem] border border-ink-100/70 bg-paper/60 px-5 lg:h-full lg:justify-between">
              {news.posts.slice(1, 5).map((p) => (
                <li key={p.id}>
                  <ArticleCard post={p} variant="list" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Series — equal 3-up grid */}
      {series?.posts.length ? (
        <section className="bg-paper/60 border-y border-ink-100/60 mt-20">
          <div className="container-pop py-14">
            <SectionHeader
              eyebrow={series.category.label}
              title={series.category.thaiLabel}
              description={series.category.tagline}
              href={`/${series.category.slug}`}
              accent={series.category.accent}
            />
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {series.posts.slice(0, 3).map((p) => (
                <ArticleCard key={p.id} post={p} variant="default" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Video Section — dark themed */}
      {videoPool.length >= 4 && <VideoSection posts={videoPool} />}

      {/* Reviews — horizontal split rows */}
      {review?.posts.length ? (
        <section className="container-pop mt-20">
          <SectionHeader
            eyebrow={review.category.label}
            title={review.category.thaiLabel}
            description={review.category.tagline}
            href={`/${review.category.slug}`}
            accent={review.category.accent}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {review.posts.slice(0, 4).map((p) => (
              <ArticleCard key={p.id} post={p} variant="split" />
            ))}
          </div>
        </section>
      ) : null}

      {/* Movies — portrait posters scroll */}
      {movies?.posts.length ? (
        <section className="mt-20">
          <div className="container-pop">
            <SectionHeader
              eyebrow={movies.category.label}
              title={movies.category.thaiLabel}
              description={movies.category.tagline}
              href={`/${movies.category.slug}`}
              accent={movies.category.accent}
            />
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {movies.posts.slice(0, 5).map((p) => (
                <ArticleCard key={p.id} post={p} variant="poster" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Scoop — overlay cards */}
      {scoop?.posts.length ? (
        <section className="container-pop mt-20">
          <SectionHeader
            eyebrow={scoop.category.label}
            title={scoop.category.thaiLabel}
            description={scoop.category.tagline}
            href={`/${scoop.category.slug}`}
            accent={scoop.category.accent}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {scoop.posts.slice(0, 2).map((p) => (
              <ArticleCard key={p.id} post={p} variant="overlay" />
            ))}
          </div>
        </section>
      ) : null}

      {/* Star — portrait circular */}
      {star?.posts.length ? (
        <section className="container-pop mt-20">
          <SectionHeader
            eyebrow={star.category.label}
            title={star.category.thaiLabel}
            description={star.category.tagline}
            href={`/${star.category.slug}`}
            accent={star.category.accent}
          />
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10">
            {star.posts.slice(0, 5).map((p) => (
              <ArticleCard key={p.id} post={p} variant="portrait" />
            ))}
          </div>
        </section>
      ) : null}

      <KeywordsSection tags={popularTags} />
    </>
  );
}

function CategoryTile({ category }: { category: CategoryMeta }) {
  const a = ACCENT_STYLES[category.accent];
  return (
    <Link
      href={`/${category.slug}`}
      className="group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 hover:border-ink-100 hover:bg-cream/60 transition-colors"
    >
      <span className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${a.fill}`}>
        <span className="absolute inset-1 rounded-full border-2 border-white/80" />
        <span className="absolute inset-2.5 rounded-full bg-white" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold uppercase tracking-wide text-ink-900">
          {category.label}
        </span>
        <span className="block text-xs text-ink-500">{category.thaiLabel}</span>
      </span>
    </Link>
  );
}

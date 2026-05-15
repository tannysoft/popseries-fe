import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { getTagBySlug, getPosts, getPopularTags } from "@/lib/api";

export const revalidate = 600;

type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return {};
  return {
    title: `#${tag.name}`,
    description: `บทความและเนื้อหาที่เกี่ยวข้องกับ ${tag.name} บน Pop Series`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const [posts, relatedTags] = await Promise.all([
    getPosts({ perPage: 18, tagId: tag.id }),
    getPopularTags(12),
  ]);
  const otherTags = relatedTags.filter((t) => t.id !== tag.id).slice(0, 10);
  const [hero, ...rest] = posts;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" aria-hidden />
        <div className="absolute inset-0 grid-noise opacity-40" aria-hidden />
        <div className="container-pop relative pt-14 pb-12">
          <nav className="text-xs font-semibold uppercase tracking-widest text-ink-500">
            <Link href="/" className="hover:text-ink-900">
              หน้าแรก
            </Link>
            <span className="mx-2 text-ink-300">/</span>
            <span>Tag</span>
          </nav>
          <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight text-ink-900 md:text-6xl lg:text-7xl">
            <span className="text-coral-400">#</span>
            {tag.name}
          </h1>
          <p className="mt-3 text-ink-500">
            พบ <span className="font-semibold text-ink-900">{tag.count}</span> บทความที่เกี่ยวข้อง
          </p>
        </div>
      </section>

      <section className="container-pop">
        {posts.length === 0 ? (
          <p className="text-center text-ink-500 py-20">ยังไม่มีบทความสำหรับแท็กนี้</p>
        ) : (
          <>
            {hero && (
              <div className="mb-12">
                <ArticleCard post={hero} variant="feature" priority />
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((p) => (
                  <ArticleCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {otherTags.length > 0 && (
        <section className="container-pop mt-20">
          <h3 className="text-2xl font-extrabold text-ink-900">แท็กยอดฮิตอื่น ๆ</h3>
          <ul className="mt-6 flex flex-wrap gap-2">
            {otherTags.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/tag/${t.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-paper border border-ink-100/70 px-4 py-2 text-sm font-medium text-ink-700 hover:border-coral-200 hover:bg-coral-50 hover:text-coral-500 transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-coral-300" />
                  {t.name}
                  <span className="text-xs opacity-60">{t.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

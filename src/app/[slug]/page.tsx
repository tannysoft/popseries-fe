import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORY_BY_SLUG } from "@/lib/categories";
import { getPostBySlug } from "@/lib/api";
import { ArticleSkeleton, CategorySkeleton } from "@/components/Skeleton";
import { CategoryView } from "./CategoryView";
import { ArticleView } from "./ArticleView";
import { loadCategoryPage } from "./loadCategory";

export const revalidate = 600;

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_BY_SLUG.get(slug);
  if (cat) {
    return {
      title: `${cat.label} — ${cat.thaiLabel}`,
      description: cat.tagline,
    };
  }
  const post = await getPostBySlug(slug);
  if (!post) return {};

  // Prefer Yoast SEO output when available, falling back to derived values.
  const seo = post.seo;
  const title = seo?.title || post.title;
  const description = seo?.description || post.excerpt;
  const ogImages = seo?.og_image?.length
    ? seo.og_image.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
      }))
    : post.image
    ? [{ url: post.image.url }]
    : [];
  const twitterCards = ["summary", "summary_large_image", "player", "app"];
  const twitterCard = (
    twitterCards.includes(seo?.twitter_card ?? "")
      ? seo?.twitter_card
      : "summary_large_image"
  ) as "summary" | "summary_large_image" | "player" | "app";

  return {
    title,
    description,
    alternates: seo?.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      images: ogImages,
      type: "article",
      publishedTime: seo?.article_published_time,
      modifiedTime: seo?.article_modified_time,
    },
    twitter: {
      card: twitterCard,
      title: seo?.twitter_title || seo?.og_title || title,
      description: seo?.twitter_description || seo?.og_description || description,
      images: seo?.twitter_image
        ? [seo.twitter_image]
        : ogImages.map((i) => i.url),
    },
  };
}

async function CategoryContent({ slug }: { slug: string }) {
  const data = await loadCategoryPage(slug, undefined);
  if (!data) notFound();
  return <CategoryView {...data} />;
}

async function ArticleContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return <ArticleView post={post} />;
}

export default async function SlugPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  // Categories use fixed, known slugs — anything else is treated as an article.
  if (CATEGORY_BY_SLUG.has(slug)) {
    return (
      <Suspense fallback={<CategorySkeleton slug={slug} />}>
        <CategoryContent slug={slug} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleContent slug={slug} />
    </Suspense>
  );
}

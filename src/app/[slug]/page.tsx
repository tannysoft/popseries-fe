import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORY_BY_SLUG } from "@/lib/categories";
import { getPostBySlug } from "@/lib/api";
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
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image.url] : [],
      type: "article",
    },
  };
}

export default async function SlugPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const categoryData = await loadCategoryPage(slug, undefined);
  if (categoryData) {
    return <CategoryView {...categoryData} />;
  }

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return <ArticleView post={post} />;
}

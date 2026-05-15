import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORY_BY_SLUG } from "@/lib/categories";
import { CategoryView } from "../../CategoryView";
import { loadCategoryPage } from "../../loadCategory";

export const revalidate = 600;

type Params = { slug: string; page: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, page } = await params;
  const cat = CATEGORY_BY_SLUG.get(slug);
  if (!cat) return {};
  return {
    title: `${cat.label} — ${cat.thaiLabel} · หน้า ${page}`,
    description: cat.tagline,
  };
}

export default async function CategoryPaginatedPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, page } = await params;
  const data = await loadCategoryPage(slug, page);
  if (!data) notFound();
  return <CategoryView {...data} />;
}

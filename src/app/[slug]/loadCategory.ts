import { notFound, redirect } from "next/navigation";
import { CATEGORY_BY_SLUG, type CategoryMeta } from "@/lib/categories";
import { getPostsPaged } from "@/lib/api";
import type { NormalizedPost } from "@/lib/api";

export const PAGE_SIZE = 18;
export const DEFAULT_FIRST_PAGE_TOTAL = 19; // 1 hero + 18 grid

// Per-category overrides for the first page only. Subsequent pages use PAGE_SIZE.
const FIRST_PAGE_OVERRIDES: Partial<Record<CategoryMeta["key"], number>> = {
  movies: 20, // 1 hero + 4 side rail + 15 poster grid
  review: 20, // 1 hero + 4 featured + 15 quick takes
  scoop: 18, // 1 hero + 5 bento + 12 grid
  series: 20, // 1 hero + 5 streaming + 8 top picks + 6 browse
};

function firstPageTotalFor(cat: CategoryMeta) {
  return FIRST_PAGE_OVERRIDES[cat.key] ?? DEFAULT_FIRST_PAGE_TOTAL;
}

export type CategoryPageData = {
  category: CategoryMeta;
  posts: NormalizedPost[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

export async function loadCategoryPage(
  slug: string,
  pageInput: string | undefined,
): Promise<CategoryPageData | null> {
  const cat = CATEGORY_BY_SLUG.get(slug);
  if (!cat) return null;

  const parsedPage = Number(pageInput);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  // /:slug/page/1 → /:slug (canonical)
  if (pageInput && requestedPage === 1) {
    redirect(`/${cat.slug}`);
  }

  const firstPageTotal = firstPageTotalFor(cat);
  const isFirstPage = requestedPage === 1;
  const perPage = isFirstPage ? firstPageTotal : PAGE_SIZE;
  const { posts, total, totalPages } = await getPostsPaged({
    categoryId: cat.id,
    perPage,
    page: requestedPage,
  });

  if (!posts.length && requestedPage > 1) notFound();

  let computedTotalPages = 1;
  if (total > firstPageTotal) {
    computedTotalPages = 1 + Math.ceil((total - firstPageTotal) / PAGE_SIZE);
  }
  const finalTotalPages = total > 0 ? computedTotalPages : totalPages;

  if (requestedPage > finalTotalPages) notFound();

  return {
    category: cat,
    posts,
    currentPage: requestedPage,
    totalPages: finalTotalPages,
    totalCount: total,
  };
}

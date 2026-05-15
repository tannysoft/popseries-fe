import { notFound, redirect } from "next/navigation";
import {
  getAuthorBySlug,
  getPostsPaged,
  type NormalizedAuthor,
  type NormalizedPost,
} from "@/lib/api";

export const PAGE_SIZE = 18;
export const FIRST_PAGE_TOTAL = 19;

export type AuthorPageData = {
  author: NormalizedAuthor;
  posts: NormalizedPost[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

export async function loadAuthorPage(
  slug: string,
  pageInput: string | undefined,
): Promise<AuthorPageData | null> {
  const author = await getAuthorBySlug(slug);
  if (!author) return null;

  const parsed = Number(pageInput);
  const requestedPage =
    Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;

  if (pageInput && requestedPage === 1) {
    redirect(`/author/${author.slug}`);
  }

  const isFirstPage = requestedPage === 1;
  const perPage = isFirstPage ? FIRST_PAGE_TOTAL : PAGE_SIZE;
  const { posts, total } = await getPostsPaged({
    authorId: author.id,
    perPage,
    page: requestedPage,
  });

  if (!posts.length && requestedPage > 1) notFound();

  let totalPages = 1;
  if (total > FIRST_PAGE_TOTAL) {
    totalPages = 1 + Math.ceil((total - FIRST_PAGE_TOTAL) / PAGE_SIZE);
  }
  if (requestedPage > totalPages && totalPages >= 1) notFound();

  return {
    author,
    posts,
    currentPage: requestedPage,
    totalPages,
    totalCount: total,
  };
}

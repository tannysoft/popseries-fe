import { CATEGORY_BY_ID, type CategoryMeta } from "./categories";

const API_BASE = "https://www.popseries.co/wp-json/wp/v2";
const WPP_BASE = "https://www.popseries.co/wp-json/wordpress-popular-posts/v1";
const REVALIDATE_SECONDS = 60 * 10;

type WPRendered = { rendered: string };

type WPMediaSize = {
  source_url: string;
  width: number;
  height: number;
};

export type WPMedia = {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, WPMediaSize>;
  };
};

export type WPTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
};

export type WPAuthor = {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  avatar_urls?: Record<string, string>;
};

export type WPPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  link: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: WPAuthor[];
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
};

export type NormalizedPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  date: string;
  authorName: string;
  authorSlug?: string;
  authorAvatar?: string;
  image: { url: string; alt: string; width?: number; height?: number } | null;
  category: CategoryMeta | undefined;
  tags: WPTerm[];
  originalLink: string;
};

type FetchOpts = {
  perPage?: number;
  page?: number;
  offset?: number;
  exclude?: number[];
  search?: string;
  tagId?: number;
  authorId?: number;
  signal?: AbortSignal;
};

export type NormalizedAuthor = {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatarUrl: string;
};

export async function getAuthorBySlug(
  slug: string,
): Promise<NormalizedAuthor | null> {
  const q = buildQuery({ slug });
  const users = await wp<WPAuthor[]>(`/users?${q}`);
  if (!users.length) return null;
  const u = users[0];
  return {
    id: u.id,
    name: decodeEntities(u.name),
    slug: u.slug || "",
    description: decodeEntities(u.description || ""),
    avatarUrl:
      u.avatar_urls?.["96"] ||
      u.avatar_urls?.["48"] ||
      Object.values(u.avatar_urls || {})[0] ||
      "",
  };
}

function buildQuery(params: Record<string, string | number | undefined | (string | number)[]>) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      if (v.length) usp.set(k, v.join(","));
    } else {
      usp.set(k, String(v));
    }
  }
  return usp.toString();
}

async function wp<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { Accept: "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    throw new Error(`WP fetch failed: ${res.status} ${path}`);
  }
  return (await res.json()) as T;
}

async function wpWithHeaders<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T; total: number; totalPages: number }> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { Accept: "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    throw new Error(`WP fetch failed: ${res.status} ${path}`);
  }
  const total = Number(res.headers.get("X-WP-Total") || 0);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") || 1);
  const data = (await res.json()) as T;
  return { data, total, totalPages };
}

function pickImage(post: WPPost): NormalizedPost["image"] {
  const fm = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!fm) return null;
  const sizes = fm.media_details?.sizes;
  // Prefer the original full-size upload so Next/Image can downscale it crisply
  // for any display size. Only fall back to the largest named rendition when the
  // original URL is unavailable.
  const fallback =
    sizes?.full ||
    sizes?.["2048x2048"] ||
    sizes?.["1536x1536"] ||
    sizes?.large ||
    sizes?.medium_large ||
    sizes?.medium ||
    null;
  return {
    url: fm.source_url || fallback?.source_url || "",
    alt: fm.alt_text || "",
    width: fm.media_details?.width || fallback?.width,
    height: fm.media_details?.height || fallback?.height,
  };
}

function pickTags(post: WPPost): WPTerm[] {
  const groups = post._embedded?.["wp:term"] || [];
  const all = groups.flat();
  return all.filter((t) => t.taxonomy === "post_tag").slice(0, 5);
}

function decodeEntities(s: string) {
  return s
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8230;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string) {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).trim();
}

export function normalizePost(p: WPPost): NormalizedPost {
  const author = p._embedded?.author?.[0];
  return {
    id: p.id,
    slug: p.slug,
    title: decodeEntities(stripTags(p.title.rendered)),
    excerpt: stripTags(p.excerpt.rendered).slice(0, 220),
    contentHtml: p.content.rendered,
    date: p.date,
    authorName: author?.name || "Pop Series",
    authorSlug: author?.slug,
    authorAvatar: author?.avatar_urls?.["96"] || author?.avatar_urls?.["48"],
    image: pickImage(p),
    category: p.categories.map((id) => CATEGORY_BY_ID.get(id)).find(Boolean),
    tags: pickTags(p),
    originalLink: p.link,
  };
}

export async function getPosts(opts: FetchOpts & { categoryId?: number } = {}) {
  const q = buildQuery({
    per_page: opts.perPage ?? 10,
    page: opts.page ?? 1,
    _embed: 1,
    categories: opts.categoryId,
    tags: opts.tagId,
    author: opts.authorId,
    exclude: opts.exclude,
    search: opts.search,
  });
  const posts = await wp<WPPost[]>(`/posts?${q}`, { signal: opts.signal });
  return posts.map(normalizePost);
}

export async function getPostsPaged(
  opts: FetchOpts & { categoryId?: number } = {},
): Promise<{ posts: NormalizedPost[]; total: number; totalPages: number }> {
  // When an explicit offset is given, WordPress ignores `page`; omit it so the
  // two don't conflict. Otherwise fall back to page-based pagination.
  const q = buildQuery({
    per_page: opts.perPage ?? 18,
    page: opts.offset === undefined ? opts.page ?? 1 : undefined,
    offset: opts.offset,
    _embed: 1,
    categories: opts.categoryId,
    tags: opts.tagId,
    author: opts.authorId,
    exclude: opts.exclude,
    search: opts.search,
  });
  const { data, total, totalPages } = await wpWithHeaders<WPPost[]>(
    `/posts?${q}`,
    { signal: opts.signal },
  );
  return { posts: data.map(normalizePost), total, totalPages };
}

export async function getTagBySlug(slug: string): Promise<PopularTag | null> {
  const q = buildQuery({ slug });
  const tags = await wp<PopularTag[]>(`/tags?${q}`);
  if (!tags.length) return null;
  const t = tags[0];
  return { ...t, name: decodeEntities(t.name) };
}

export type PopularTag = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export async function getPopularTags(limit = 18): Promise<PopularTag[]> {
  const q = buildQuery({ per_page: limit, orderby: "count", order: "desc" });
  const tags = await wp<PopularTag[]>(`/tags?${q}`);
  return tags.map((t) => ({
    id: t.id,
    name: decodeEntities(t.name),
    slug: t.slug,
    count: t.count,
  }));
}

type WppRange = "last24hours" | "last7days" | "last30days" | "all";

export async function getMostViewedPosts(
  opts: { limit?: number; exclude?: number[]; range?: WppRange } = {},
): Promise<NormalizedPost[]> {
  const { limit = 5, exclude, range = "last7days" } = opts;
  const q = buildQuery({
    limit,
    range,
    _embed: 1,
    exclude: exclude?.join(","),
  });
  try {
    const res = await fetch(`${WPP_BASE}/popular-posts?${q}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const posts = (await res.json()) as WPPost[];
    return posts.map(normalizePost);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<NormalizedPost | null> {
  const q = buildQuery({ slug, _embed: 1 });
  const posts = await wp<WPPost[]>(`/posts?${q}`);
  if (!posts.length) return null;
  return normalizePost(posts[0]);
}

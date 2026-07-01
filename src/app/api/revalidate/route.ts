import { revalidateTag, revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

// On-demand cache invalidation webhook. The WordPress plugin calls this when
// content changes (post saved, slider / On Air curated) so the site doesn't
// wait out the 10-minute ISR window.
//
// Auth: shared secret in the `x-revalidate-secret` header (or `?secret=`),
// matched against the REVALIDATE_SECRET env var.
//
// Body (JSON, all optional):
//   { "tags": ["wp:posts"], "paths": ["/", "/series"] }
// With no tags/paths, the master "wp" tag is cleared (everything).

export const dynamic = "force-dynamic"; // Never cache the webhook itself.

type Payload = { tags?: string[]; paths?: string[] };

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json(
      { revalidated: false, error: "REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    request.nextUrl.searchParams.get("secret");
  if (provided !== secret) {
    return Response.json(
      { revalidated: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  let body: Payload = {};
  try {
    body = (await request.json()) as Payload;
  } catch {
    // Empty/invalid body → fall back to clearing everything below.
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t) => typeof t === "string" && t.length > 0)
    : [];
  const paths = Array.isArray(body.paths)
    ? body.paths.filter((p) => typeof p === "string" && p.startsWith("/"))
    : [];

  // Default to the master tag when nothing specific is requested.
  const finalTags = tags.length || paths.length ? tags : ["wp"];

  // "max" = stale-while-revalidate: serve cached content, refresh in the
  // background on the next visit. Recommended for webhook-driven revalidation.
  for (const tag of finalTags) revalidateTag(tag, "max");
  for (const path of paths) revalidatePath(path);

  return Response.json({
    revalidated: true,
    tags: finalTags,
    paths,
    now: Date.now(),
  });
}

import Image from "next/image";
import Link from "next/link";
import type { NormalizedPost } from "@/lib/api";
import { ACCENT_STYLES } from "@/lib/categories";

const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(iso: string) {
  try {
    return dateFormatter.format(new Date(iso));
  } catch {
    return "";
  }
}

type Variant =
  | "feature"
  | "default"
  | "compact"
  | "list"
  | "poster"
  | "overlay"
  | "overlay-sm"
  | "split"
  | "portrait";

type Props = {
  post: NormalizedPost;
  variant?: Variant;
  priority?: boolean;
  showAuthor?: boolean;
};

export function ArticleCard({
  post,
  variant = "default",
  priority,
  showAuthor = true,
}: Props) {
  const cat = post.category;
  const accent = cat ? ACCENT_STYLES[cat.accent] : ACCENT_STYLES.coral;
  const href = `/${post.slug}`;

  if (variant === "feature") {
    return (
      <Link href={href} className="group relative block overflow-hidden rounded-[2rem] bg-ink-900 shadow-pop lg:h-full">
        <div className="relative aspect-[16/11] md:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[440px]">
          {post.image ? (
            <Image
              src={post.image.url}
              alt={post.image.alt || post.title}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 760px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 gradient-mesh" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            {cat && (
              <span className={`chip ${accent.chip}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${accent.fill}`} />
                {cat.label}
              </span>
            )}
            <h2 className="mt-3 line-clamp-2 text-balance text-2xl font-extrabold leading-snug text-cream md:text-4xl">
              {post.title}
            </h2>
            <p className="mt-3 hidden md:block line-clamp-2 max-w-2xl text-pretty text-sm leading-relaxed text-cream/80">
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs font-medium text-cream/70">
              <span>{formatDate(post.date)}</span>
              <span className="h-1 w-1 rounded-full bg-cream/50" />
              <span>โดย {post.authorName}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link href={href} className="group flex gap-4 py-4 border-b border-ink-100/70 last:border-b-0">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-ink-100">
          {post.image ? (
            <Image
              src={post.image.url}
              alt={post.image.alt || post.title}
              fill
              sizes="120px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 gradient-mesh" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          {cat && <span className={`chip ${accent.chip}`}>{cat.label}</span>}
          <h3 className="mt-1 line-clamp-2 text-balance text-sm font-semibold leading-snug text-ink-900 group-hover:text-coral-500 md:text-base">
            {post.title}
          </h3>
          <p className="mt-1 text-xs text-ink-500">{formatDate(post.date)}</p>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={href} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-100">
          {post.image ? (
            <Image
              src={post.image.url}
              alt={post.image.alt || post.title}
              fill
              sizes="(min-width: 1024px) 280px, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 gradient-mesh" />
          )}
        </div>
        <div className="mt-3">
          {cat && <span className={`chip ${accent.chip}`}>{cat.label}</span>}
          <h3 className="mt-2 line-clamp-2 text-balance text-base font-semibold leading-snug text-ink-900 group-hover:text-coral-500">
            {post.title}
          </h3>
          <p className="mt-1 text-xs text-ink-500">{formatDate(post.date)}</p>
        </div>
      </Link>
    );
  }

  if (variant === "poster") {
    return (
      <Link href={href} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-ink-100 shadow-pop">
          {post.image ? (
            <Image
              src={post.image.url}
              alt={post.image.alt || post.title}
              fill
              sizes="(min-width: 1024px) 260px, 45vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="absolute inset-0 gradient-mesh" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent" />
          {cat && (
            <span className={`absolute top-3 left-3 chip ${accent.chip} bg-paper/95`}>
              <span className={`h-1.5 w-1.5 rounded-full ${accent.fill}`} />
              {cat.label}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="line-clamp-3 text-balance text-base font-bold leading-snug text-cream">
              {post.title}
            </h3>
            <p className="mt-1.5 text-[11px] font-medium text-cream/70">
              {formatDate(post.date)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "overlay-sm") {
    return (
      <Link
        href={href}
        className="group relative block h-full overflow-hidden rounded-[1.25rem] bg-ink-900"
      >
        <div className="relative h-full min-h-[200px]">
          {post.image ? (
            <Image
              src={post.image.url}
              alt={post.image.alt || post.title}
              fill
              sizes="(min-width: 1024px) 320px, 50vw"
              className="object-cover opacity-90 transition-all duration-500 group-hover:opacity-95 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 gradient-mesh" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/40 to-ink-900/0" />
          {cat && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-butter-200 text-ink-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
              <span className="h-1 w-1 rounded-full bg-coral-500" />
              {cat.label}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
            <h3 className="line-clamp-2 text-balance text-sm font-bold leading-snug text-cream sm:text-base">
              {post.title}
            </h3>
            <p className="mt-1.5 text-[10px] font-medium text-cream/60">
              {formatDate(post.date)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "overlay") {
    return (
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-[1.5rem] bg-ink-900"
      >
        <div className="relative aspect-[5/4]">
          {post.image ? (
            <Image
              src={post.image.url}
              alt={post.image.alt || post.title}
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover opacity-80 transition-all duration-500 group-hover:opacity-95 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 gradient-mesh" />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900/40 via-ink-900/60 to-ink-900/90" />
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              {cat && (
                <span className="chip bg-butter-200 text-ink-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-butter-400" />
                  {cat.label}
                </span>
              )}
              <span className="text-xs uppercase tracking-widest font-semibold text-cream/60">
                Inside story
              </span>
            </div>
            <div>
              <h3 className="line-clamp-2 text-balance text-xl font-extrabold leading-tight text-cream md:text-2xl">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-cream/70">
                {post.excerpt}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-butter-200">
                อ่านต่อ
                <span className="h-px w-6 bg-butter-200 transition-all group-hover:w-10" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "split") {
    return (
      <Link
        href={href}
        className="group grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] items-center gap-4 sm:gap-6 rounded-[1.5rem] border border-ink-100/60 bg-paper p-3 sm:p-4 hover:border-coral-200 hover:bg-coral-50/40 transition-colors"
      >
        <div className="relative h-full aspect-square overflow-hidden rounded-2xl bg-ink-100">
          {post.image ? (
            <Image
              src={post.image.url}
              alt={post.image.alt || post.title}
              fill
              sizes="180px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 gradient-mesh" />
          )}
        </div>
        <div className="min-w-0">
          {cat && (
            <span className={`chip ${accent.chip}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${accent.fill}`} />
              {cat.label}
            </span>
          )}
          <h3 className="mt-2 line-clamp-2 text-balance text-base font-bold leading-snug text-ink-900 group-hover:text-coral-500 md:text-lg">
            {post.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-ink-500 sm:text-sm">
            {post.excerpt}
          </p>
          <p className="mt-2 text-xs text-ink-300">{formatDate(post.date)}</p>
        </div>
      </Link>
    );
  }

  if (variant === "portrait") {
    return (
      <Link href={href} className="group flex flex-col items-center text-center">
        <div className="relative h-32 w-32 sm:h-36 sm:w-36 overflow-hidden rounded-full bg-ink-100 ring-4 ring-paper shadow-pop">
          {post.image ? (
            <Image
              src={post.image.url}
              alt={post.image.alt || post.title}
              fill
              sizes="144px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 gradient-mesh" />
          )}
        </div>
        {cat && (
          <span className={`mt-3 chip ${accent.chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${accent.fill}`} />
            {cat.label}
          </span>
        )}
        <h3 className="mt-2 line-clamp-2 text-balance text-sm font-bold leading-snug text-ink-900 group-hover:text-coral-500 md:text-base">
          {post.title}
        </h3>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.5rem] border border-ink-100/60 bg-paper transition-all hover:-translate-y-1 hover:shadow-pop">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        {post.image ? (
          <Image
            src={post.image.url}
            alt={post.image.alt || post.title}
            fill
            sizes="(min-width: 1024px) 400px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 gradient-mesh" />
        )}
        {cat && (
          <span className={`absolute left-3 top-3 chip ${accent.chip} bg-paper/95 backdrop-blur`}>
            <span className={`h-1.5 w-1.5 rounded-full ${accent.fill}`} />
            {cat.label}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-balance text-lg font-semibold leading-snug text-ink-900 group-hover:text-coral-500">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-pretty text-sm leading-relaxed text-ink-500">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs font-medium text-ink-300">
          <span>{formatDate(post.date)}</span>
          {showAuthor && (
            <>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span>โดย {post.authorName}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

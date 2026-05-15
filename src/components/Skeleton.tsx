import type { CSSProperties } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
};

export function Skeleton({ className = "", style }: Props) {
  return (
    <span
      aria-hidden
      className={`skeleton block ${className}`}
      style={style}
    />
  );
}

export function ArticleCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "feature" | "list" | "compact" | "poster";
}) {
  if (variant === "feature") {
    return (
      <div className="rounded-[2rem] overflow-hidden">
        <Skeleton className="aspect-[16/10] rounded-[2rem]" />
      </div>
    );
  }
  if (variant === "list") {
    return (
      <div className="flex items-center gap-4 py-4 border-b border-ink-100/70 last:border-b-0">
        <Skeleton className="h-20 w-28 shrink-0 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
    );
  }
  if (variant === "compact") {
    return (
      <div>
        <Skeleton className="aspect-[4/3] rounded-2xl" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      </div>
    );
  }
  if (variant === "poster") {
    return (
      <div className="space-y-3">
        <Skeleton className="aspect-[3/4] rounded-3xl" />
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-4 w-full rounded" />
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-ink-100/60 bg-paper">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" aria-hidden />
        <div className="container-pop relative pt-14 pb-12 space-y-4">
          <Skeleton className="h-4 w-40 rounded-full" />
          <Skeleton className="h-14 w-72 rounded-2xl" />
          <Skeleton className="h-5 w-96 rounded-full" />
        </div>
      </section>
      <section className="container-pop space-y-12">
        <ArticleCardSkeleton variant="feature" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </>
  );
}

export function ArticleSkeleton() {
  return (
    <article className="pb-20">
      <header className="relative">
        <div className="absolute inset-0 gradient-mesh" aria-hidden />
        <div className="container-pop relative pt-12 pb-10 md:pt-16 space-y-5">
          <Skeleton className="h-3 w-32 rounded-full" />
          <Skeleton className="h-8 w-3/4 rounded-xl" />
          <Skeleton className="h-8 w-1/2 rounded-xl" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-5/6 rounded" />
          </div>
          <div className="flex items-center gap-3 pt-3">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>
          </div>
        </div>
        <div className="container-pop relative">
          <Skeleton className="aspect-[16/9] rounded-[2rem]" />
        </div>
      </header>
      <section className="container-pop mt-12">
        <div className="lg:grid lg:grid-cols-[64px_minmax(0,1fr)_280px] lg:gap-12 xl:gap-16">
          <div className="hidden lg:block space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-11 rounded-full" />
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-4 w-full rounded"
                style={{ width: `${85 + (i % 3) * 5}%` }}
              />
            ))}
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    </article>
  );
}

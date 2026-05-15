import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import type { AuthorPageData } from "./loadAuthor";

export function AuthorView({
  author,
  posts,
  currentPage,
  totalPages,
  totalCount,
}: AuthorPageData) {
  const isFirstPage = currentPage === 1;
  const hero = isFirstPage ? posts[0] : null;
  const rest = isFirstPage ? posts.slice(1) : posts;

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-coral-100 via-cream to-teal-50"
        />
        <div className="absolute inset-0 grid-noise opacity-40" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-coral-200/40 blur-3xl float-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl float-slow"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="container-pop relative pt-14 pb-12">
          <nav className="text-xs font-semibold uppercase tracking-widest text-ink-500">
            <Link href="/" className="hover:text-ink-900">
              หน้าแรก
            </Link>
            <span className="mx-2 text-ink-300">/</span>
            <span>Author</span>
          </nav>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-full bg-coral-200 ring-4 ring-paper shadow-pop">
              {author.avatarUrl ? (
                <Image
                  src={author.avatarUrl}
                  alt={author.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-coral-500">
                  {author.name.slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <span className="chip bg-coral-100 text-coral-500">
                <span className="h-1.5 w-1.5 rounded-full bg-coral-300" />
                Author
              </span>
              <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight text-ink-900 md:text-5xl">
                {author.name}
              </h1>
              <p className="mt-2 text-sm text-ink-500 md:text-base">
                <span className="font-semibold text-ink-900">
                  {totalCount.toLocaleString("th-TH")}
                </span>{" "}
                บทความ
                {totalPages > 1 && (
                  <>
                    <span className="mx-2 text-ink-300">·</span>
                    หน้า {currentPage} / {totalPages}
                  </>
                )}
              </p>
              {author.description && (
                <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-ink-500 md:text-base">
                  {author.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-pop">
        {hero && (
          <div className="mb-12">
            <ArticleCard post={hero} variant="feature" priority />
          </div>
        )}
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((p) => (
              <ArticleCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          !hero && (
            <p className="text-center text-ink-500 py-20">
              ยังไม่มีบทความจากผู้เขียนคนนี้
            </p>
          )
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/author/${author.slug}`}
        />
      </section>
    </>
  );
}

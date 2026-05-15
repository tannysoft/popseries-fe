"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NormalizedPost } from "@/lib/api";
import { ACCENT_STYLES } from "@/lib/categories";
import { ArrowRightIcon } from "./icons";

const dateFmt = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const AUTOPLAY_MS = 6000;

type Props = {
  posts: NormalizedPost[];
};

export function HeroSlider({ posts }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Touch / swipe support
  const dragState = useRef<{
    startX: number;
    deltaX: number;
    width: number;
    dragging: boolean;
  } | null>(null);

  const go = useCallback(
    (next: number) => {
      const length = posts.length;
      if (length === 0) return;
      setActive(((next % length) + length) % length);
    },
    [posts.length],
  );

  useEffect(() => {
    if (paused || posts.length < 2) return;
    timerRef.current = window.setTimeout(() => {
      go(active + 1);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [active, paused, posts.length, go]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (posts.length < 2) return;
    const track = trackRef.current;
    if (!track) return;
    setPaused(true);
    track.setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      deltaX: 0,
      width: track.clientWidth,
      dragging: true,
    };
    track.style.transition = "none";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    const track = trackRef.current;
    if (!state || !state.dragging || !track) return;
    state.deltaX = e.clientX - state.startX;
    const offsetPct = -active * 100 + (state.deltaX / state.width) * 100;
    track.style.transform = `translate3d(${offsetPct}%, 0, 0)`;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    const track = trackRef.current;
    if (!state || !state.dragging || !track) return;
    state.dragging = false;
    track.releasePointerCapture(e.pointerId);
    track.style.transition = "";
    const threshold = state.width * 0.15;
    if (state.deltaX > threshold) {
      go(active - 1);
    } else if (state.deltaX < -threshold) {
      go(active + 1);
    } else {
      // snap back
      track.style.transform = `translate3d(${-active * 100}%, 0, 0)`;
    }
    dragState.current = null;
    setTimeout(() => setPaused(false), 800);
  };

  if (!posts.length) return null;

  return (
    <div
      className="group relative overflow-hidden rounded-[2rem] bg-ink-900 shadow-pop lg:h-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[16/11] md:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[440px] overflow-hidden">
        <div
          ref={trackRef}
          className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] touch-pan-y"
          style={{ transform: `translate3d(${-active * 100}%, 0, 0)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {posts.map((post, i) => {
            const cat = post.category;
            const accent = cat
              ? ACCENT_STYLES[cat.accent]
              : ACCENT_STYLES.coral;
            return (
              <div
                key={post.id}
                className="relative shrink-0 grow-0 basis-full"
                aria-hidden={i !== active}
              >
                <Link
                  href={`/${post.slug}`}
                  tabIndex={i === active ? 0 : -1}
                  className="block h-full w-full"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <div className="relative h-full w-full">
                    {post.image ? (
                      <Image
                        src={post.image.url}
                        alt={post.image.alt || post.title}
                        fill
                        priority={i === 0}
                        sizes="(min-width: 1024px) 800px, 100vw"
                        draggable={false}
                        className="object-cover pointer-events-none"
                      />
                    ) : (
                      <div className="absolute inset-0 gradient-mesh" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      {cat && (
                        <span className={`chip ${accent.chip}`}>
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${accent.fill}`}
                          />
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
                        <span>{dateFmt.format(new Date(post.date))}</span>
                        <span className="h-1 w-1 rounded-full bg-cream/50" />
                        <span>โดย {post.authorName}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        {posts.length > 1 && (
          <>
            <button
              type="button"
              aria-label="ก่อนหน้า"
              onClick={(e) => {
                e.preventDefault();
                go(active - 1);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream/85 text-ink-900 opacity-0 group-hover:opacity-100 backdrop-blur transition-opacity hover:bg-cream"
            >
              <ArrowRightIcon
                width={18}
                height={18}
                className="rotate-180"
              />
            </button>
            <button
              type="button"
              aria-label="ถัดไป"
              onClick={(e) => {
                e.preventDefault();
                go(active + 1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream/85 text-ink-900 opacity-0 group-hover:opacity-100 backdrop-blur transition-opacity hover:bg-cream"
            >
              <ArrowRightIcon width={18} height={18} />
            </button>

            {/* Dots */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              {posts.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`สไลด์ที่ ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(i);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active
                      ? "w-8 bg-cream"
                      : "w-1.5 bg-cream/40 hover:bg-cream/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

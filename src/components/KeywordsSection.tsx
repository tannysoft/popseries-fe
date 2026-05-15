import Link from "next/link";
import { SectionHeader } from "./SectionHeader";
import type { PopularTag } from "@/lib/api";

type Accent = {
  bg: string;
  text: string;
  dot: string;
};

const PASTEL_ACCENTS: Accent[] = [
  { bg: "#FDE2E7", text: "#C2466A", dot: "#F5A3B5" }, // pink
  { bg: "#FBE1D5", text: "#A4471E", dot: "#F2A48C" }, // coral
  { bg: "#FDE6D5", text: "#9C5520", dot: "#F1B078" }, // peach
  { bg: "#FBF0C8", text: "#8A6A14", dot: "#F1D182" }, // butter
  { bg: "#ECF3C8", text: "#5E7A1B", dot: "#C5D480" }, // lime
  { bg: "#D8F0E0", text: "#2D7A4B", dot: "#88C8A0" }, // mint
  { bg: "#D2EFE5", text: "#2F7368", dot: "#7DB7AA" }, // teal
  { bg: "#D8EEF8", text: "#1E5F87", dot: "#8CC4E6" }, // sky
  { bg: "#E0E3F5", text: "#3A4192", dot: "#A8B0E4" }, // periwinkle
  { bg: "#ECE5FA", text: "#5B3FA0", dot: "#B9A1F0" }, // lavender
  { bg: "#F5DDF1", text: "#8E2F84", dot: "#DCA5D4" }, // orchid
  { bg: "#F8E2EC", text: "#A03660", dot: "#E5A2BD" }, // rose
];

function sizeForCount(count: number, max: number) {
  const ratio = max > 0 ? count / max : 0;
  if (ratio > 0.85) return "text-xl md:text-2xl px-5 py-2.5";
  if (ratio > 0.6) return "text-lg md:text-xl px-4 py-2";
  if (ratio > 0.35) return "text-base md:text-lg px-4 py-1.5";
  return "text-sm md:text-base px-3 py-1.5";
}

// Simple deterministic hash so each tag keeps the same colour between renders
function pickAccent(tag: PopularTag, fallbackIndex: number): Accent {
  const seed =
    [...tag.slug].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) +
    fallbackIndex;
  return PASTEL_ACCENTS[seed % PASTEL_ACCENTS.length];
}

type Props = { tags: PopularTag[] };

export function KeywordsSection({ tags }: Props) {
  if (!tags.length) return null;
  const max = tags[0].count;
  return (
    <section className="container-pop mt-24">
      <SectionHeader
        eyebrow="Keywords"
        title="คีย์เวิร์ดยอดฮิต"
        description="หัวข้อและซีรีส์ที่ผู้อ่านค้นหามากที่สุดตอนนี้"
        accent="butter"
      />
      <div className="mt-8 relative overflow-hidden rounded-[2rem] border border-ink-100/70 bg-paper px-6 py-10 md:px-10 md:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-coral-100 blur-3xl opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-teal-100 blur-3xl opacity-60"
        />
        <ul className="relative flex flex-wrap justify-center gap-2.5 md:gap-3">
          {tags.map((tag, i) => {
            const accent = pickAccent(tag, i);
            return (
              <li key={tag.id}>
                <Link
                  href={`/tag/${tag.slug}`}
                  className={`group inline-flex items-center gap-2 rounded-full font-medium transition-transform hover:-translate-y-0.5 ${sizeForCount(
                    tag.count,
                    max,
                  )}`}
                  style={{
                    backgroundColor: accent.bg,
                    color: accent.text,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-150"
                    style={{ backgroundColor: accent.dot }}
                  />
                  <span>{tag.name}</span>
                  <span className="text-xs font-normal opacity-60">
                    {tag.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

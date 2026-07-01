import type { ReviewData } from "./api";

// Resolves an editor's review (from the Pop Series Review meta box) into the
// values the UI renders: subscores fall back to a deterministic offset of the
// overall score when the editor left them blank, and the verdict is derived
// from the overall score.

export type ResolvedReview = {
  score: number;
  story: number;
  acting: number;
  production: number;
  music: number;
  pros: string[];
  cons: string[];
  verdict: { label: string; desc: string };
};

const VERDICTS = [
  { min: 9, label: "Pop Pick", desc: "ต้องดู! ทีมงานยกให้เป็นของเด็ดประจำสัปดาห์" },
  { min: 8, label: "ควรดู", desc: "คุณภาพดีเยี่ยม คนที่ชอบแนวนี้ไม่ผิดหวัง" },
  { min: 7, label: "น่าสนับสนุน", desc: "มีจุดน่าสนใจ ดูได้สบายๆ ไม่เสียดายเวลา" },
  { min: 0, label: "ดูในวันว่าง", desc: "พอผ่านได้ ถ้ามีเวลาเหลือลองเปิดดู" },
];

const clamp = (n: number) => Math.max(0, Math.min(10, n));

export function resolveReview(review: ReviewData): ResolvedReview {
  const score = clamp(review.score);
  const s = review.subscores;
  return {
    score,
    story: s?.story ?? clamp(score + 0.4),
    acting: s?.acting ?? clamp(score - 0.3),
    production: s?.production ?? clamp(score + 0.1),
    music: s?.music ?? clamp(score - 0.6),
    pros: review.pros ?? [],
    cons: review.cons ?? [],
    verdict:
      VERDICTS.find((v) => score >= v.min) ?? VERDICTS[VERDICTS.length - 1],
  };
}

export type CategoryKey =
  | "news"
  | "review"
  | "scoop"
  | "series"
  | "movies"
  | "star";

export type CategoryMeta = {
  key: CategoryKey;
  id: number;
  slug: string;
  label: string;
  thaiLabel: string;
  tagline: string;
  accent: "coral" | "teal" | "butter";
};

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "news",
    id: 1,
    slug: "news",
    label: "News",
    thaiLabel: "ข่าวสาร",
    tagline: "ข่าวล่าสุดจากวงการบันเทิงเกาหลีและทั่วเอเชีย",
    accent: "coral",
  },
  {
    key: "review",
    id: 75,
    slug: "review",
    label: "Reviews",
    thaiLabel: "รีวิว",
    tagline: "รีวิวซีรีส์ หนัง และคอนเสิร์ตแบบเจาะลึก",
    accent: "teal",
  },
  {
    key: "scoop",
    id: 4509,
    slug: "scoop",
    label: "Scoop",
    thaiLabel: "สกู๊ป",
    tagline: "สกู๊ปพิเศษ เบื้องหลัง และเรื่องราวที่คุณไม่เคยรู้",
    accent: "butter",
  },
  {
    key: "series",
    id: 4,
    slug: "series",
    label: "Series",
    thaiLabel: "ซีรีส์",
    tagline: "ทุกซีรีส์ที่กำลังมาแรง รวบรวมไว้ที่นี่",
    accent: "coral",
  },
  {
    key: "movies",
    id: 5,
    slug: "movies",
    label: "Movies",
    thaiLabel: "หนัง",
    tagline: "หนังเข้าฉายใหม่ คลาสสิก และทุกเรื่องน่าดู",
    accent: "teal",
  },
  {
    key: "star",
    id: 6,
    slug: "star",
    label: "Star",
    thaiLabel: "ศิลปิน",
    tagline: "โปรไฟล์ศิลปิน ไอดอล และดาราที่คุณรัก",
    accent: "butter",
  },
];

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));
export const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function pickPrimaryCategory(ids: number[]): CategoryMeta | undefined {
  for (const id of ids) {
    const meta = CATEGORY_BY_ID.get(id);
    if (meta) return meta;
  }
  return undefined;
}

export const ACCENT_STYLES = {
  coral: {
    chip: "bg-coral-100 text-coral-500",
    border: "border-coral-200",
    fill: "bg-coral-300",
    fillSoft: "bg-coral-50",
    text: "text-coral-500",
    ring: "ring-coral-200",
  },
  teal: {
    chip: "bg-teal-100 text-teal-500",
    border: "border-teal-200",
    fill: "bg-teal-300",
    fillSoft: "bg-teal-50",
    text: "text-teal-500",
    ring: "ring-teal-200",
  },
  butter: {
    chip: "bg-butter-100 text-butter-500",
    border: "border-butter-200",
    fill: "bg-butter-300",
    fillSoft: "bg-butter-50",
    text: "text-butter-500",
    ring: "ring-butter-200",
  },
} as const;

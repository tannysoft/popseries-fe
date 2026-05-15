"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "pop:font-scale";
const STEPS = [0.9, 1, 1.1, 1.2] as const;
type Step = (typeof STEPS)[number];

function applyScale(scale: Step) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--font-scale", String(scale));
}

export function FontSizeToggle() {
  const [scale, setScale] = useState<Step>(1);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? Number(raw) : 1;
    const candidate = STEPS.find((s) => Math.abs(s - parsed) < 0.001) ?? 1;
    setScale(candidate);
    applyScale(candidate);
  }, []);

  const update = (next: Step) => {
    setScale(next);
    applyScale(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* ignore */
    }
  };

  const idx = STEPS.indexOf(scale);
  const canShrink = idx > 0;
  const canGrow = idx < STEPS.length - 1;

  return (
    <div
      className="hidden md:inline-flex items-center rounded-full border border-ink-100 bg-paper p-0.5"
      role="group"
      aria-label="ขนาดตัวหนังสือ"
    >
      <button
        type="button"
        aria-label="ลดขนาดตัวหนังสือ"
        disabled={!canShrink}
        onClick={() => canShrink && update(STEPS[idx - 1])}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-700 disabled:text-ink-300 disabled:cursor-not-allowed hover:bg-cream transition-colors"
      >
        <span className="text-xs font-bold leading-none">A−</span>
      </button>
      <span
        className="text-[10px] font-semibold uppercase tracking-widest text-ink-300 px-1 tabular-nums"
        aria-live="polite"
      >
        {Math.round(scale * 100)}%
      </span>
      <button
        type="button"
        aria-label="เพิ่มขนาดตัวหนังสือ"
        disabled={!canGrow}
        onClick={() => canGrow && update(STEPS[idx + 1])}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-700 disabled:text-ink-300 disabled:cursor-not-allowed hover:bg-cream transition-colors"
      >
        <span className="text-base font-bold leading-none">A+</span>
      </button>
    </div>
  );
}

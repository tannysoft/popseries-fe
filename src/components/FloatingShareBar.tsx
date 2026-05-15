"use client";

import {
  FacebookIcon,
  XIcon,
  LineIcon,
  LinkIcon,
} from "./icons";

type Props = {
  title: string;
};

const btn =
  "group inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-100 bg-paper text-ink-700 shadow-pop transition-all hover:-translate-y-0.5 hover:border-ink-300";

export function FloatingShareBar({ title }: Props) {
  const onShare = (network: "facebook" | "x" | "line") => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const enc = encodeURIComponent(url);
    const encT = encodeURIComponent(title);
    const sites: Record<typeof network, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
      x: `https://twitter.com/intent/tweet?url=${enc}&text=${encT}`,
      line: `https://line.me/R/msg/text/?${encT}%20${enc}`,
    };
    window.open(sites[network], "_blank", "noopener,noreferrer,width=600,height=520");
  };

  const onCopy = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="hidden xl:block writing-vertical text-[10px] uppercase tracking-[0.3em] font-semibold text-ink-300 mb-2 [writing-mode:vertical-rl]">
        Share story
      </span>
      <button
        type="button"
        aria-label="Share on Facebook"
        title="Facebook"
        className={btn}
        onClick={() => onShare("facebook")}
      >
        <FacebookIcon width={18} height={18} />
      </button>
      <button
        type="button"
        aria-label="Share on X"
        title="X"
        className={btn}
        onClick={() => onShare("x")}
      >
        <XIcon width={16} height={16} />
      </button>
      <button
        type="button"
        aria-label="Share on LINE"
        title="LINE"
        className={btn}
        onClick={() => onShare("line")}
      >
        <LineIcon width={18} height={18} />
      </button>
      <button
        type="button"
        aria-label="Copy link"
        title="Copy link"
        className={btn}
        onClick={onCopy}
      >
        <LinkIcon width={16} height={16} />
      </button>
    </div>
  );
}

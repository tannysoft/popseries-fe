"use client";

import {
  FacebookIcon,
  XIcon,
  LineIcon,
  LinkIcon,
} from "./icons";

type Props = {
  title: string;
  className?: string;
};

const buttonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-100 bg-cream text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900";

export function ShareBar({ title, className }: Props) {
  const onShare = (network: "facebook" | "x" | "line") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
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
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
      <button
        type="button"
        aria-label="Share on Facebook"
        title="Facebook"
        className={buttonClass}
        onClick={() => onShare("facebook")}
      >
        <FacebookIcon width={18} height={18} />
      </button>
      <button
        type="button"
        aria-label="Share on X"
        title="X"
        className={buttonClass}
        onClick={() => onShare("x")}
      >
        <XIcon width={16} height={16} />
      </button>
      <button
        type="button"
        aria-label="Share on LINE"
        title="LINE"
        className={buttonClass}
        onClick={() => onShare("line")}
      >
        <LineIcon width={18} height={18} />
      </button>
      <button
        type="button"
        aria-label="Copy link"
        title="Copy link"
        className={buttonClass}
        onClick={onCopy}
      >
        <LinkIcon width={16} height={16} />
      </button>
    </div>
  );
}

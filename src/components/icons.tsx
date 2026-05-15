import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
} as const;

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13.5 21.95V14h2.7l.4-3.13h-3.1V8.87c0-.9.25-1.51 1.55-1.51h1.66V4.56a22 22 0 0 0-2.42-.12c-2.39 0-4.03 1.46-4.03 4.15v2.28H7.55V14h2.71v7.95h3.24Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.8c-3.15 0-3.5.01-4.74.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.26.82s-.62.75-.82 1.26c-.15.39-.33.97-.38 2.04-.06 1.24-.07 1.6-.07 4.74s.01 3.5.07 4.74c.05 1.07.23 1.65.38 2.04.2.51.44.88.82 1.26s.75.62 1.26.82c.39.15.97.33 2.04.38 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.26-.82s.62-.75.82-1.26c.15-.39.33-.97.38-2.04.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.05-1.07-.23-1.65-.38-2.04a3.4 3.4 0 0 0-.82-1.26 3.4 3.4 0 0 0-1.26-.82c-.39-.15-.97-.33-2.04-.38-1.24-.06-1.6-.07-4.74-.07Zm0 3.07a4.97 4.97 0 1 1 0 9.94 4.97 4.97 0 0 1 0-9.94Zm0 1.8a3.17 3.17 0 1 0 0 6.34 3.17 3.17 0 0 0 0-6.34Zm5.17-2.16a1.16 1.16 0 1 1 0 2.32 1.16 1.16 0 0 1 0-2.32Z" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16.95 2h-3v13.55a2.55 2.55 0 1 1-2.55-2.55c.18 0 .36.02.53.06v-3.07a5.6 5.6 0 1 0 5.6 5.6V8.45a7.5 7.5 0 0 0 4.3 1.36V6.74c-2.6 0-4.83-2.13-4.88-4.74Z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M17.53 3H20l-6.43 7.35L21.18 21h-5.93l-4.65-6.08L5.27 21H2.8l6.88-7.86L2.4 3h6.07l4.2 5.55L17.53 3Zm-2.08 16.43h1.64L8.62 4.48H6.86l8.59 14.95Z" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21.58 7.2a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.43A2.51 2.51 0 0 0 2.42 7.2 26.16 26.16 0 0 0 2 12a26.16 26.16 0 0 0 .42 4.8 2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.43a2.51 2.51 0 0 0 1.77-1.77A26.16 26.16 0 0 0 22 12a26.16 26.16 0 0 0-.42-4.8ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

export function LineIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.2c5.52 0 10 3.63 10 8.1 0 1.62-.6 3.13-1.65 4.43-1.34 1.7-3.43 3.6-7.4 5.85-.3.17-.7-.06-.66-.4l.16-1.7c.02-.22-.16-.4-.38-.4-4.92-.16-8.07-3.41-8.07-7.78 0-4.47 4.48-8.1 10-8.1Zm-4.05 6.06H6.62a.2.2 0 0 0-.2.2v4.04c0 .11.09.2.2.2h2.78a.2.2 0 0 0 .2-.2v-.7a.2.2 0 0 0-.2-.2H7.5a.16.16 0 0 1-.16-.17V9.46a.2.2 0 0 0-.2-.2H6.62Zm9.93 0h-2.78a.2.2 0 0 0-.2.2v4.04c0 .11.09.2.2.2h2.78a.2.2 0 0 0 .2-.2v-.7a.2.2 0 0 0-.2-.2h-1.88a.16.16 0 0 1-.16-.17v-.41c0-.09.07-.17.16-.17h1.88a.2.2 0 0 0 .2-.2v-.7a.2.2 0 0 0-.2-.2h-1.88a.16.16 0 0 1-.16-.17v-.41c0-.1.07-.18.16-.18h1.88a.2.2 0 0 0 .2-.2v-.7a.2.2 0 0 0-.2-.2Zm-5.42 0h-.7a.2.2 0 0 0-.2.2v4.04c0 .11.09.2.2.2h.7a.2.2 0 0 0 .2-.2V9.46a.2.2 0 0 0-.2-.2Zm.92 0a.2.2 0 0 0-.07.4l.07.02h.34c.05 0 .1.02.13.07l1.85 2.5a.2.2 0 0 0 .16.08h.7a.2.2 0 0 0 .2-.2V9.46a.2.2 0 0 0-.2-.2h-.7a.2.2 0 0 0-.2.2v2.39l-1.85-2.5a.2.2 0 0 0-.16-.09h-.27Z" />
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

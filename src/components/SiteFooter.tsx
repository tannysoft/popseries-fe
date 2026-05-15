import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { Logo } from "./Logo";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "./icons";

const SOCIALS = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
  { label: "X", href: "#", Icon: XIcon },
  { label: "YouTube", href: "#", Icon: YouTubeIcon },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink-100/70 bg-paper/60">
      <div className="container-pop py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="h-12 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
            รวมข่าวสารและคอนเทนต์วงการบันเทิงเกาหลี ทั้งซีรีส์ หนัง ศิลปิน K-POP
            ที่กำลังมาแรง — อัปเดตทุกวันโดยทีมงาน Pop Series
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-300">
            หมวดหมู่
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.key}>
                <Link
                  href={`/${c.slug}`}
                  className="text-ink-700 hover:text-coral-500 transition-colors"
                >
                  {c.label} <span className="text-ink-300">— {c.thaiLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-300">
            ติดตามเรา
          </h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-100 bg-paper text-ink-700 hover:border-coral-200 hover:bg-coral-50 hover:text-coral-500 transition-colors"
              >
                <Icon width={18} height={18} />
              </a>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-300">
            © {new Date().getFullYear()} Pop Series. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

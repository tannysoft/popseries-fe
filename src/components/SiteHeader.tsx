import Link from "next/link";
import { Logo } from "./Logo";
import { CategoryNav } from "./CategoryNav";
import { MobileMenu } from "./MobileMenu";
import { FontSizeToggle } from "./FontSizeToggle";
import { SearchIcon, ArrowRightIcon } from "./icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md border-b border-ink-100/60">
      <div className="container-pop flex items-center gap-6 py-4">
        <Link href="/" className="shrink-0" aria-label="Pop Series home">
          <Logo className="h-10 w-auto" />
        </Link>

        <CategoryNav />

        <div className="ml-auto flex items-center gap-2">
          <FontSizeToggle />
          <button
            type="button"
            aria-label="Search"
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-100 bg-paper text-ink-700 hover:border-ink-300 transition-colors"
          >
            <SearchIcon width={18} height={18} />
          </button>
          <Link
            href="/news"
            className="hidden sm:inline-flex h-10 items-center gap-2 rounded-full bg-ink-900 text-cream px-4 text-sm font-semibold hover:bg-ink-700 transition-colors"
          >
            ข่าวล่าสุด
            <ArrowRightIcon width={14} height={14} />
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { CATEGORIES, ACCENT_STYLES } from "@/lib/categories";
import { ArrowRightIcon, SearchIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section
      data-no-footer-gap
      className="relative overflow-hidden flex-1 flex flex-col"
    >
      <div className="absolute inset-0 gradient-mesh" aria-hidden />
      <div className="absolute inset-0 grid-noise opacity-40" aria-hidden />

      <div className="container-pop relative flex-1 flex flex-col justify-center py-16">
        {/* Big animated 404 */}
        <div className="flex items-end justify-center gap-2 md:gap-6">
          <span className="circle-bounce" style={{ animationDelay: "0s" }}>
            <svg viewBox="0 0 96 96" className="h-24 w-24 md:h-44 md:w-44">
              <circle cx="48" cy="48" r="40" fill="#F2A48C" />
              <circle cx="48" cy="48" r="30" fill="none" stroke="#fff" strokeWidth="4" />
              <circle cx="48" cy="48" r="20" fill="none" stroke="#fff" strokeWidth="4" />
              <circle cx="48" cy="48" r="10" fill="#fff" />
              <text
                x="48"
                y="62"
                textAnchor="middle"
                fontSize="42"
                fontWeight="800"
                fill="#2B2F3A"
                fontFamily="aktiv-grotesk-thai, sans-serif"
              >
                4
              </text>
            </svg>
          </span>
          <span className="circle-bounce" style={{ animationDelay: "0.15s" }}>
            <svg viewBox="0 0 96 96" className="h-24 w-24 md:h-44 md:w-44">
              <circle cx="48" cy="48" r="40" fill="#7DB7AA" />
              <circle cx="48" cy="48" r="30" fill="none" stroke="#fff" strokeWidth="4" />
              <circle cx="48" cy="48" r="20" fill="none" stroke="#fff" strokeWidth="4" />
              <circle cx="48" cy="48" r="10" fill="#fff" />
              <text
                x="48"
                y="62"
                textAnchor="middle"
                fontSize="42"
                fontWeight="800"
                fill="#2B2F3A"
                fontFamily="aktiv-grotesk-thai, sans-serif"
              >
                0
              </text>
            </svg>
          </span>
          <span className="circle-bounce" style={{ animationDelay: "0.3s" }}>
            <svg viewBox="0 0 96 96" className="h-24 w-24 md:h-44 md:w-44">
              <circle cx="48" cy="48" r="40" fill="#F1D182" />
              <circle cx="48" cy="48" r="30" fill="none" stroke="#fff" strokeWidth="4" />
              <circle cx="48" cy="48" r="20" fill="none" stroke="#fff" strokeWidth="4" />
              <circle cx="48" cy="48" r="10" fill="#fff" />
              <text
                x="48"
                y="62"
                textAnchor="middle"
                fontSize="42"
                fontWeight="800"
                fill="#2B2F3A"
                fontFamily="aktiv-grotesk-thai, sans-serif"
              >
                4
              </text>
            </svg>
          </span>
        </div>

        <div className="mt-10 text-center max-w-2xl mx-auto">
          <span className="chip bg-coral-100 text-coral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-coral-300" />
            ไม่พบหน้านี้
          </span>
          <h1 className="mt-4 text-balance text-3xl font-extrabold text-ink-900 md:text-5xl">
            ดูเหมือนซีรีส์ตอนนี้จะ <span className="text-coral-500">หายไป</span>
          </h1>
          <p className="mt-4 text-pretty text-ink-500 md:text-lg">
            เพจที่คุณกำลังตามหาอาจถูกย้าย ลบ หรือพิมพ์ URL ผิดพลาด — ไม่เป็นไร
            มีคอนเทนต์อีกเพียบรอให้คุณค้นพบ
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink-900 text-cream px-6 text-sm font-semibold hover:bg-ink-700 hover:-translate-y-0.5 transition-all"
            >
              กลับไปหน้าแรก
              <ArrowRightIcon
                width={14}
                height={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/news"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-ink-100 bg-paper text-ink-700 px-6 text-sm font-semibold hover:border-ink-300 hover:-translate-y-0.5 transition-all"
            >
              <SearchIcon width={16} height={16} />
              อ่านข่าวล่าสุด
            </Link>
          </div>
        </div>

        {/* Category suggestions */}
        <div className="mt-16">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-300">
            หรือสำรวจหมวดอื่น
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {CATEGORIES.map((c) => {
              const a = ACCENT_STYLES[c.accent];
              return (
                <Link
                  key={c.key}
                  href={`/${c.slug}`}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-ink-100/60 bg-paper/80 backdrop-blur px-3 py-4 hover:border-ink-300 hover:-translate-y-1 hover:shadow-pop transition-all"
                >
                  <span
                    className={`relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ${a.fill}`}
                  >
                    <span className="absolute inset-1 rounded-full border-2 border-white/80" />
                    <span className="absolute inset-3 rounded-full bg-white" />
                  </span>
                  <span className="text-sm font-bold text-ink-900">
                    {c.label}
                  </span>
                  <span className="text-xs text-ink-500">{c.thaiLabel}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

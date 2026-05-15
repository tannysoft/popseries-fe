function fakeScore(id: number) {
  return (((id * 7) % 28) + 70) / 10;
}

function StarRow({ score }: { score: number }) {
  // 0–5 stars, half-step
  const stars = Math.round(score / 2 * 2) / 2; // round to .5
  return (
    <div className="flex items-center gap-0.5" aria-label={`${score}/10`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const full = i + 1 <= stars;
        const half = !full && i + 0.5 <= stars;
        return (
          <svg
            key={i}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <defs>
              <linearGradient id={`half-${i}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="50%" stopColor="#F2A48C" />
                <stop offset="50%" stopColor="rgba(242,164,140,0.25)" />
              </linearGradient>
            </defs>
            <path
              d="M12 17.3 6.18 21l1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.82 4.73L17.82 21z"
              fill={
                full
                  ? "#F2A48C"
                  : half
                  ? `url(#half-${i})`
                  : "rgba(242,164,140,0.25)"
              }
            />
          </svg>
        );
      })}
    </div>
  );
}

const VERDICTS = [
  { min: 9, label: "Pop Pick", desc: "ต้องดู! ทีมงานยกให้เป็นของเด็ดประจำสัปดาห์" },
  { min: 8, label: "ควรดู", desc: "คุณภาพดีเยี่ยม คนที่ชอบแนวนี้ไม่ผิดหวัง" },
  { min: 7, label: "น่าสนับสนุน", desc: "มีจุดน่าสนใจ ดูได้สบายๆ ไม่เสียดายเวลา" },
  { min: 0, label: "ดูในวันว่าง", desc: "พอผ่านได้ ถ้ามีเวลาเหลือลองเปิดดู" },
];

function pickVerdict(score: number) {
  return VERDICTS.find((v) => score >= v.min) ?? VERDICTS[VERDICTS.length - 1];
}

type Props = {
  postId: number;
};

export function ReviewDetails({ postId }: Props) {
  const score = fakeScore(postId);
  const verdict = pickVerdict(score);
  const breakdown = [
    { label: "เรื่องราว", value: Math.min(10, score + 0.4) },
    { label: "การแสดง", value: Math.max(0, score - 0.3) },
    { label: "งานสร้าง", value: Math.min(10, score + 0.1) },
    { label: "เพลงประกอบ", value: Math.max(0, score - 0.6) },
  ];

  const pros = [
    "บทคมและพล็อตชวนติดตามทุกตอน",
    "การแสดงของตัวเอกเข้าถึงอารมณ์",
    "งานภาพและการกำกับศิลป์โดดเด่น",
  ];
  const cons = [
    "ช่วงต้นเรื่องเดินช้ากว่าที่คาด",
    "พล็อตย่อยบางจุดยังคลี่คลายไม่เต็มที่",
  ];

  return (
    <section className="not-prose mb-10 overflow-hidden rounded-[2rem] border border-ink-100 bg-paper shadow-pop">
      {/* Header band — stronger gradient so it pops off the cream page bg */}
      <div className="relative grid items-center gap-4 border-b border-ink-100 bg-gradient-to-r from-coral-200 via-butter-200 to-teal-200 px-6 py-6 md:grid-cols-[auto_1fr_auto] md:gap-8 md:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.55),transparent_60%)]"
        />
        <div className="relative flex items-end gap-4">
          <span className="text-5xl md:text-6xl font-extrabold leading-none bg-gradient-to-br from-coral-500 via-coral-400 to-butter-500 bg-clip-text text-transparent tabular-nums drop-shadow-sm">
            {score.toFixed(1)}
          </span>
          <div className="pb-1.5">
            <StarRow score={score} />
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-ink-700">
              จาก 10 คะแนนเต็ม
            </p>
          </div>
        </div>
        <div className="relative md:border-l md:border-ink-900/15 md:pl-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-700">
            Pop Series Verdict
          </p>
          <p className="mt-1 text-2xl font-extrabold leading-tight text-ink-900 md:text-3xl">
            {verdict.label}
          </p>
          <p className="mt-1 text-sm text-ink-700/80">{verdict.desc}</p>
        </div>
        <span className="relative inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-cream shadow-pop self-start md:self-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-coral-300 animate-pulse" />
          ทีมงานให้คะแนน
        </span>
      </div>

      {/* Breakdown + Pros/Cons */}
      <div className="grid gap-8 px-6 py-7 md:grid-cols-[1.1fr_1fr] md:px-8">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-300">
            คะแนนรายหัวข้อ
          </h4>
          <ul className="mt-4 space-y-3">
            {breakdown.map((b) => (
              <li key={b.label} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 font-semibold text-ink-700">
                  {b.label}
                </span>
                <span
                  className="flex-1 h-2 rounded-full bg-ink-100 overflow-hidden"
                  aria-hidden
                >
                  <span
                    className="block h-full bg-gradient-to-r from-coral-300 via-butter-300 to-teal-400"
                    style={{ width: `${(b.value / 10) * 100}%` }}
                  />
                </span>
                <span className="w-10 text-right font-bold text-ink-900 tabular-nums">
                  {b.value.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1 md:gap-4">
          <div className="rounded-2xl border-2 border-teal-200 bg-teal-100/70 p-4">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-teal-500">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              จุดเด่น
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
              {pros.map((p) => (
                <li key={p} className="flex gap-2">
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-400"
                    aria-hidden
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-coral-200 bg-coral-100/70 p-4">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-coral-500">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              จุดที่ยังขาด
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
              {cons.map((c) => (
                <li key={c} className="flex gap-2">
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-coral-400"
                    aria-hidden
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

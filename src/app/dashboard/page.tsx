import { FloatingNav } from "@/components/FloatingNav";
import { getTallies, listVotes } from "@/server/store";
import { NEUTRAL_THEME as T } from "./themes";
import { VotesList } from "./VotesList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const [tallies, votes] = await Promise.all([getTallies(), listVotes(200)]);
  const boyPct = tallies.total > 0 ? Math.round((tallies.boy / tallies.total) * 100) : 50;

  return (
    <div
      className="relative h-dvh w-full overflow-hidden"
      style={{ background: T.surface, color: T.ink }}
    >
      <div
        className="mx-auto grid h-full max-w-5xl grid-rows-[auto_auto_1fr] gap-4 px-4 pt-5 sm:gap-6 sm:px-6 sm:pt-7 md:px-10"
        style={{
          paddingInlineStart: "calc(env(safe-area-inset-left, 0px) + 1rem)",
          paddingInlineEnd: "calc(env(safe-area-inset-right, 0px) + 1rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 88px)",
        }}
      >
        <header>
          <h1
            className="text-[clamp(24px,5vw,44px)] font-extrabold tracking-tight"
            style={{ fontFamily: "'Reem Kufi', Cairo, serif" }}
          >
            لوحة الأصوات
          </h1>
          <p className="mt-1 text-[12.5px] sm:text-[13px]" style={{ color: T.inkSoft }}>
            {tallies.total} صوت — {tallies.boy} ولد · {tallies.girl} بنت
          </p>
        </header>

        <section
          aria-label="نسبة الأصوات"
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4"
        >
          <Counter label="ولد" value={tallies.boy} accent={T.boyAccent} />
          <Bar boyPct={boyPct} />
          <Counter label="بنت" value={tallies.girl} accent={T.girlAccent} align="end" />
        </section>

        <section className="min-h-0 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
          <VotesList votes={votes} theme={T} />
        </section>
      </div>
      <FloatingNav />
    </div>
  );
}

function Counter({
  label,
  value,
  accent,
  align,
}: {
  label: string;
  value: number;
  accent: string;
  align?: "end";
}) {
  return (
    <div className={align === "end" ? "text-left" : "text-right"}>
      <div
        className="font-extrabold leading-none"
        style={{ color: accent, fontSize: "clamp(36px, 6vw, 64px)" }}
      >
        {value}
      </div>
      <div
        className="mt-1 text-[10.5px] uppercase tracking-[0.3em] sm:text-[12px]"
        style={{ color: T.inkSoft }}
      >
        {label}
      </div>
    </div>
  );
}

function Bar({ boyPct }: { boyPct: number }) {
  return (
    <div
      className="relative h-3 w-full overflow-hidden rounded-full sm:h-4"
      style={{ background: "oklch(0% 0 0 / 0.06)" }}
    >
      <div
        className="absolute inset-y-0"
        style={{
          left: 0,
          width: `${boyPct}%`,
          background: T.boyAccent,
          transition: "width 700ms ease",
        }}
      />
      <div
        className="absolute inset-y-0"
        style={{
          right: 0,
          width: `${100 - boyPct}%`,
          background: T.girlAccent,
          transition: "width 700ms ease",
        }}
      />
    </div>
  );
}

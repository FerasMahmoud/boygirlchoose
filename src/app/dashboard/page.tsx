import { redirect } from "next/navigation";
import { FloatingNav } from "@/components/FloatingNav";
import { Critters } from "@/components/vote/Critters";
import { getIpHash } from "@/server/ip";
import { getMyVote, getTallies, listVotes } from "@/server/store";
import { DASH_THEMES, type DashTheme } from "./themes";
import { VotesList } from "./VotesList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const ipHash = await getIpHash();
  const mine = await getMyVote(ipHash);
  if (!mine) redirect("/");

  const [tallies, votes] = await Promise.all([getTallies(), listVotes(200)]);
  const t = DASH_THEMES[mine.choice];
  const myLabel = mine.choice === "girl" ? "بنت" : "ولد";
  const pct = tallies.total > 0 ? Math.round((tallies.boy / tallies.total) * 100) : 50;

  return (
    <div
      className="relative h-dvh w-full overflow-hidden"
      style={{ background: t.surface, color: t.ink }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <Critters kind={t.critter} color={t.critterColor} count={5} seed={mine.id * 13 + 3} />
      </div>

      <div
        className="relative z-10 mx-auto grid h-full max-w-5xl grid-rows-[auto_auto_1fr] gap-4 px-4 pt-5 sm:gap-6 sm:px-6 sm:pt-7 md:px-10"
        style={{
          paddingInlineStart: "calc(env(safe-area-inset-left, 0px) + 1rem)",
          paddingInlineEnd: "calc(env(safe-area-inset-right, 0px) + 1rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 88px)",
        }}
      >
        <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h1
              className="text-[clamp(24px,5vw,44px)] font-extrabold tracking-tight"
              style={{ fontFamily: "'Reem Kufi', Cairo, serif" }}
            >
              لوحة الأصوات
            </h1>
            <p className="mt-1 text-[12.5px] sm:text-[13px]" style={{ color: t.inkSoft }}>
              {tallies.total} صوت — {tallies.boy} ولد · {tallies.girl} بنت
            </p>
          </div>
          <span
            className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
            style={{ background: t.pillBg, color: t.pillFg, fontFamily: "Cairo, system-ui" }}
          >
            صوتُك: {myLabel}
          </span>
        </header>

        <section
          aria-label="نسبة الأصوات"
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4"
        >
          <Counter
            label="ولد"
            value={tallies.boy}
            accent={mine.choice === "boy" ? t.accent : t.inkSoft}
            mine={mine.choice === "boy"}
          />
          <Bar boyPct={pct} theme={t} myChoice={mine.choice} />
          <Counter
            label="بنت"
            value={tallies.girl}
            accent={mine.choice === "girl" ? t.accent : t.inkSoft}
            mine={mine.choice === "girl"}
            align="end"
          />
        </section>

        <section className="min-h-0 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
          <VotesList votes={votes} mine={mine} theme={t} />
        </section>
      </div>
      <FloatingNav showDashboard={true} theme={mine.choice} />
    </div>
  );
}

function Counter({
  label,
  value,
  accent,
  mine,
  align,
}: {
  label: string;
  value: number;
  accent: string;
  mine: boolean;
  align?: "end";
}) {
  return (
    <div className={align === "end" ? "text-left" : "text-right"}>
      <div
        className="font-extrabold leading-none transition-[font-size]"
        style={{
          color: accent,
          fontSize: mine ? "clamp(40px, 7vw, 76px)" : "clamp(24px, 4.5vw, 44px)",
          opacity: mine ? 1 : 0.6,
        }}
      >
        {value}
      </div>
      <div
        className="mt-1 text-[10.5px] uppercase tracking-[0.3em] sm:text-[12px]"
        style={{ opacity: mine ? 1 : 0.55 }}
      >
        {label}
      </div>
    </div>
  );
}

function Bar({
  boyPct,
  theme,
  myChoice,
}: {
  boyPct: number;
  theme: DashTheme;
  myChoice: "boy" | "girl";
}) {
  const myWidth = myChoice === "boy" ? boyPct : 100 - boyPct;
  const otherWidth = 100 - myWidth;
  return (
    <div
      className="relative h-3 w-full overflow-hidden rounded-full sm:h-4"
      style={{ background: "oklch(0% 0 0 / 0.06)" }}
    >
      <div
        className="absolute inset-y-0"
        style={{
          [myChoice === "boy" ? "left" : "right"]: 0,
          width: `${myWidth}%`,
          background: theme.accent,
          transition: "width 700ms ease",
        }}
      />
      <div
        className="absolute inset-y-0"
        style={{
          [myChoice === "boy" ? "right" : "left"]: 0,
          width: `${otherWidth}%`,
          background:
            myChoice === "boy" ? "oklch(50% 0.14 5 / 0.35)" : "oklch(42% 0.14 240 / 0.35)",
          transition: "width 700ms ease",
        }}
      />
    </div>
  );
}

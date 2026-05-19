import { redirect } from "next/navigation";
import { FloatingNav } from "@/components/FloatingNav";
import { Critters } from "@/components/vote/Critters";
import { getIpHash } from "@/server/ip";
import { getMyVote, getTallies, listVotes } from "@/server/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Theme = {
  surface: string;
  surfaceSoft: string;
  ink: string;
  inkSoft: string;
  accent: string;
  border: string;
  critter: "rabbit" | "bear";
  critterColor: string;
  pillBg: string;
  pillFg: string;
  chipMine: string;
  chipOther: string;
  cardBg: string;
};

const THEMES: Record<"girl" | "boy", Theme> = {
  girl: {
    surface: "oklch(96% 0.03 5)",
    surfaceSoft: "oklch(98% 0.018 5)",
    ink: "oklch(22% 0.07 5)",
    inkSoft: "oklch(40% 0.06 5)",
    accent: "oklch(50% 0.14 5)",
    border: "oklch(50% 0.14 5 / 0.16)",
    critter: "rabbit",
    critterColor: "oklch(50% 0.14 5)",
    pillBg: "oklch(50% 0.14 5)",
    pillFg: "white",
    chipMine: "oklch(50% 0.14 5 / 0.16)",
    chipOther: "oklch(42% 0.14 240 / 0.10)",
    cardBg: "white",
  },
  boy: {
    surface: "oklch(95% 0.03 232)",
    surfaceSoft: "oklch(98% 0.018 232)",
    ink: "oklch(20% 0.07 240)",
    inkSoft: "oklch(38% 0.06 240)",
    accent: "oklch(42% 0.14 240)",
    border: "oklch(42% 0.14 240 / 0.18)",
    critter: "bear",
    critterColor: "oklch(42% 0.14 240)",
    pillBg: "oklch(42% 0.14 240)",
    pillFg: "white",
    chipMine: "oklch(42% 0.14 240 / 0.16)",
    chipOther: "oklch(50% 0.14 5 / 0.10)",
    cardBg: "white",
  },
};

export default async function DashboardPage() {
  const ipHash = await getIpHash();
  const mine = await getMyVote(ipHash);
  if (!mine) redirect("/");

  const [tallies, votes] = await Promise.all([getTallies(), listVotes(200)]);
  const t = THEMES[mine.choice];
  const myLabel = mine.choice === "girl" ? "بنت" : "ولد";
  const pct = tallies.total > 0 ? Math.round((tallies.boy / tallies.total) * 100) : 50;

  return (
    <div
      className="relative h-dvh w-full overflow-hidden"
      style={{ background: t.surface, color: t.ink }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <Critters kind={t.critter} color={t.critterColor} count={6} seed={mine.id * 13 + 3} />
      </div>

      <div className="relative z-10 grid h-full grid-rows-[auto_auto_1fr] gap-6 px-6 pt-8 pb-24 md:px-10">
        <header className="flex items-baseline justify-between gap-6">
          <div>
            <h1
              className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight"
              style={{ fontFamily: "'Reem Kufi', Cairo, serif" }}
            >
              لوحة الأصوات
            </h1>
            <p className="mt-1 text-[13px]" style={{ color: t.inkSoft }}>
              {tallies.total} صوت — {tallies.boy} ولد · {tallies.girl} بنت
            </p>
          </div>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
            style={{ background: t.pillBg, color: t.pillFg, fontFamily: "Cairo, system-ui" }}
          >
            صوتُك: {myLabel}
          </span>
        </header>

        <section
          aria-label="نسبة الأصوات"
          className="grid grid-cols-[auto_1fr_auto] items-center gap-4"
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

        <section
          className="min-h-0 overflow-y-auto rounded-2xl border"
          style={{ borderColor: t.border, background: t.cardBg }}
        >
          <table className="w-full border-collapse text-right text-[13.5px]">
            <thead
              className="sticky top-0 text-[11.5px] uppercase tracking-[0.18em]"
              style={{ background: t.cardBg, color: t.inkSoft }}
            >
              <tr>
                <th className="px-5 py-3 font-medium">اسم المصوِّت</th>
                <th className="px-5 py-3 font-medium">اختار</th>
                <th className="px-5 py-3 font-medium">اقتراح اسم المولود</th>
                <th className="px-5 py-3 font-medium">آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {votes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center" style={{ color: t.inkSoft }}>
                    لا أصوات بعد. كن أوّل المصوّتين.
                  </td>
                </tr>
              ) : (
                votes.map((v) => {
                  const isMe = v.id === mine.id;
                  const sameSide = v.choice === mine.choice;
                  return (
                    <tr key={v.id} className="border-t" style={{ borderColor: t.border }}>
                      <td className="px-5 py-3 font-medium">
                        {v.name}
                        {isMe ? (
                          <span
                            className="mr-2 inline-flex items-center rounded-full px-2 py-0.5 align-middle text-[11px]"
                            style={{
                              background: t.pillBg,
                              color: t.pillFg,
                              fontFamily: "Cairo, system-ui",
                            }}
                          >
                            أنت
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[12px]"
                          style={{
                            background: sameSide ? t.chipMine : t.chipOther,
                            color: sameSide ? t.accent : t.inkSoft,
                          }}
                        >
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              background:
                                v.choice === "boy" ? "oklch(42% 0.14 240)" : "oklch(50% 0.14 5)",
                            }}
                          />
                          {v.choice === "boy" ? "ولد" : "بنت"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {v.babyName ? (
                          <span style={{ color: t.ink, fontWeight: 500 }}>{v.babyName}</span>
                        ) : (
                          <span style={{ color: t.inkSoft, opacity: 0.5 }}>—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 font-mono text-[12px]" style={{ color: t.inkSoft }}>
                        {new Date(v.updatedAt).toLocaleString("ar", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
          fontSize: mine ? "clamp(48px, 6.5vw, 76px)" : "clamp(28px, 4vw, 44px)",
          opacity: mine ? 1 : 0.6,
        }}
      >
        {value}
      </div>
      <div
        className="mt-1 text-[12px] uppercase tracking-[0.3em]"
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
  theme: Theme;
  myChoice: "boy" | "girl";
}) {
  const myWidth = myChoice === "boy" ? boyPct : 100 - boyPct;
  const otherWidth = 100 - myWidth;
  return (
    <div
      className="relative h-4 w-full overflow-hidden rounded-full"
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

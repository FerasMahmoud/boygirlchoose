import { FloatingNav } from "@/components/FloatingNav";
import { listVotes, getTallies } from "@/server/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const [tallies, votes] = await Promise.all([getTallies(), listVotes(200)]);
  const pct = tallies.total > 0 ? Math.round((tallies.boy / tallies.total) * 100) : 50;

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-paper text-ink">
      <div className="grid h-full grid-rows-[auto_auto_1fr] gap-6 px-6 pt-8 pb-24 md:px-10">
        <header className="flex items-baseline justify-between gap-6">
          <div>
            <h1
              className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight"
              style={{ fontFamily: "'Reem Kufi', Cairo, serif" }}
            >
              لوحة الأصوات
            </h1>
            <p className="mt-1 text-[13px] text-ink/55">
              {tallies.total} صوت — {tallies.boy} ولد · {tallies.girl} بنت
            </p>
          </div>
          <span
            lang="en"
            className="hidden font-mono text-[11px] uppercase tracking-[0.32em] text-ink/45 md:inline"
          >
            BOY · GIRL · TALLY
          </span>
        </header>

        <section
          aria-label="نسبة الأصوات"
          className="grid grid-cols-[auto_1fr_auto] items-center gap-4"
        >
          <Counter label="ولد" value={tallies.boy} accent="oklch(58% 0.07 165)" />
          <Bar boyPct={pct} />
          <Counter label="بنت" value={tallies.girl} accent="oklch(62% 0.09 35)" align="end" />
        </section>

        <section className="min-h-0 overflow-y-auto rounded-2xl border border-black/10 bg-white">
          <table className="w-full border-collapse text-right text-[13.5px]">
            <thead className="sticky top-0 bg-white text-[11.5px] uppercase tracking-[0.18em] text-ink/50">
              <tr>
                <th className="px-5 py-3 font-medium">اسم المصوِّت</th>
                <th className="px-5 py-3 font-medium">اختار</th>
                <th className="px-5 py-3 font-medium">آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {votes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-ink/50">
                    لا أصوات بعد. كن أوّل المصوّتين.
                  </td>
                </tr>
              ) : (
                votes.map((v) => (
                  <tr key={v.id} className="border-t border-black/5">
                    <td className="px-5 py-3 font-medium">{v.name}</td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[12px]"
                        style={{
                          background:
                            v.choice === "boy"
                              ? "oklch(58% 0.07 165 / 0.12)"
                              : "oklch(62% 0.09 35 / 0.12)",
                          color: v.choice === "boy" ? "oklch(40% 0.07 165)" : "oklch(40% 0.09 35)",
                        }}
                      >
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background:
                              v.choice === "boy" ? "oklch(58% 0.07 165)" : "oklch(62% 0.09 35)",
                          }}
                        />
                        {v.choice === "boy" ? "ولد" : "بنت"}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-[12px] text-ink/55">
                      {new Date(v.updatedAt).toLocaleString("ar", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
        className="text-[clamp(36px,5vw,56px)] font-extrabold leading-none"
        style={{ color: accent }}
      >
        {value}
      </div>
      <div className="mt-1 text-[12px] uppercase tracking-[0.3em] text-ink/55">{label}</div>
    </div>
  );
}

function Bar({ boyPct }: { boyPct: number }) {
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-black/5">
      <div
        className="absolute inset-y-0 right-0 transition-[width] duration-700"
        style={{ width: `${100 - boyPct}%`, background: "oklch(62% 0.09 35)" }}
      />
      <div
        className="absolute inset-y-0 left-0 transition-[width] duration-700"
        style={{ width: `${boyPct}%`, background: "oklch(58% 0.07 165)" }}
      />
    </div>
  );
}

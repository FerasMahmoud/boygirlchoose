import type { Vote } from "@/server/schema";
import type { DashTheme } from "./themes";

export function VotesList({ votes, theme }: { votes: Vote[]; theme: DashTheme }) {
  if (votes.length === 0)
    return (
      <div
        className="rounded-2xl border px-5 py-10 text-center"
        style={{ borderColor: theme.border, background: theme.cardBg, color: theme.inkSoft }}
      >
        لا أصوات بعد. كن أوّل المصوّتين.
      </div>
    );

  return (
    <>
      <ul className="flex flex-col gap-2.5 md:hidden" aria-label="قائمة الأصوات">
        {votes.map((v) => (
          <VoteCard key={v.id} v={v} theme={theme} />
        ))}
      </ul>

      <div
        className="hidden min-h-0 overflow-y-auto rounded-2xl border md:block"
        style={{ borderColor: theme.border, background: theme.cardBg }}
      >
        <table className="w-full border-collapse text-right text-[13.5px]">
          <thead
            className="sticky top-0 text-[11.5px] uppercase tracking-[0.18em]"
            style={{ background: theme.cardBg, color: theme.inkSoft }}
          >
            <tr>
              <th className="px-5 py-3 font-medium">اسم المصوِّت</th>
              <th className="px-5 py-3 font-medium">اختار</th>
              <th className="px-5 py-3 font-medium">اقتراح اسم المولود</th>
              <th className="px-5 py-3 font-medium">الوقت</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((v) => (
              <VoteRow key={v.id} v={v} theme={theme} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function VoteCard({ v, theme }: { v: Vote; theme: DashTheme }) {
  return (
    <li
      className="rounded-xl border px-3.5 py-3"
      style={{ borderColor: theme.border, background: theme.cardBg }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="block truncate font-semibold" style={{ color: theme.ink }}>
            {v.name}
          </span>
          {v.babyName ? (
            <div className="mt-1 text-[12.5px]" style={{ color: theme.inkSoft }}>
              اقترح: <span style={{ color: theme.ink, fontWeight: 500 }}>{v.babyName}</span>
            </div>
          ) : null}
        </div>
        <ChoiceChip choice={v.choice} theme={theme} />
      </div>
      <div className="mt-2 font-mono text-[11px]" style={{ color: theme.inkSoft, opacity: 0.8 }}>
        {new Date(v.updatedAt).toLocaleString("ar", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </div>
    </li>
  );
}

function VoteRow({ v, theme }: { v: Vote; theme: DashTheme }) {
  return (
    <tr className="border-t" style={{ borderColor: theme.border }}>
      <td className="px-5 py-3 font-medium">{v.name}</td>
      <td className="px-5 py-3">
        <ChoiceChip choice={v.choice} theme={theme} />
      </td>
      <td className="px-5 py-3">
        {v.babyName ? (
          <span style={{ color: theme.ink, fontWeight: 500 }}>{v.babyName}</span>
        ) : (
          <span style={{ color: theme.inkSoft, opacity: 0.5 }}>—</span>
        )}
      </td>
      <td className="px-5 py-3 font-mono text-[12px]" style={{ color: theme.inkSoft }}>
        {new Date(v.updatedAt).toLocaleString("ar", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </td>
    </tr>
  );
}

function ChoiceChip({ choice, theme }: { choice: "boy" | "girl"; theme: DashTheme }) {
  const accent = choice === "boy" ? theme.boyAccent : theme.girlAccent;
  const bg = choice === "boy" ? theme.chipBoy : theme.chipGirl;
  return (
    <span
      className="inline-flex shrink-0 items-center gap-2 rounded-full px-2.5 py-0.5 text-[12px]"
      style={{ background: bg, color: accent }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
      {choice === "boy" ? "ولد" : "بنت"}
    </span>
  );
}

import type { Vote } from "@/server/schema";
import type { DashTheme } from "./themes";

const GIRL_DOT = "oklch(50% 0.14 5)";
const BOY_DOT = "oklch(42% 0.14 240)";

export function VotesList({ votes, mine, theme }: { votes: Vote[]; mine: Vote; theme: DashTheme }) {
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
          <VoteCard key={v.id} v={v} mine={mine} theme={theme} />
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
              <th className="px-5 py-3 font-medium">آخر تحديث</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((v) => (
              <VoteRow key={v.id} v={v} mine={mine} theme={theme} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function VoteCard({ v, mine, theme }: { v: Vote; mine: Vote; theme: DashTheme }) {
  const isMe = v.id === mine.id;
  const sameSide = v.choice === mine.choice;
  return (
    <li
      className="rounded-xl border px-3.5 py-3"
      style={{ borderColor: theme.border, background: theme.cardBg }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold" style={{ color: theme.ink }}>
              {v.name}
            </span>
            {isMe ? (
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
                style={{ background: theme.pillBg, color: theme.pillFg }}
              >
                أنت
              </span>
            ) : null}
          </div>
          {v.babyName ? (
            <div className="mt-1 text-[12.5px]" style={{ color: theme.inkSoft }}>
              اقترح: <span style={{ color: theme.ink, fontWeight: 500 }}>{v.babyName}</span>
            </div>
          ) : null}
        </div>
        <ChoiceChip choice={v.choice} sameSide={sameSide} theme={theme} />
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

function VoteRow({ v, mine, theme }: { v: Vote; mine: Vote; theme: DashTheme }) {
  const isMe = v.id === mine.id;
  const sameSide = v.choice === mine.choice;
  return (
    <tr className="border-t" style={{ borderColor: theme.border }}>
      <td className="px-5 py-3 font-medium">
        {v.name}
        {isMe ? (
          <span
            className="mr-2 inline-flex items-center rounded-full px-2 py-0.5 align-middle text-[11px]"
            style={{ background: theme.pillBg, color: theme.pillFg }}
          >
            أنت
          </span>
        ) : null}
      </td>
      <td className="px-5 py-3">
        <ChoiceChip choice={v.choice} sameSide={sameSide} theme={theme} />
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

function ChoiceChip({
  choice,
  sameSide,
  theme,
}: {
  choice: "boy" | "girl";
  sameSide: boolean;
  theme: DashTheme;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-2 rounded-full px-2.5 py-0.5 text-[12px]"
      style={{
        background: sameSide ? theme.chipMine : theme.chipOther,
        color: sameSide ? theme.accent : theme.inkSoft,
      }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: choice === "boy" ? BOY_DOT : GIRL_DOT }}
      />
      {choice === "boy" ? "ولد" : "بنت"}
    </span>
  );
}

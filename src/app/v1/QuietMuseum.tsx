"use client";

import { useState } from "react";
import { VoteSheet } from "@/components/VoteSheet";

const TERRA = "oklch(62% 0.09 35)";
const SAGE = "oklch(58% 0.07 165)";

export function QuietMuseum() {
  const [pick, setPick] = useState<"boy" | "girl" | null>(null);

  return (
    <section className="grid h-dvh w-full grid-cols-2" style={{ fontFamily: "Cairo, system-ui" }}>
      <Panel
        label="بِنت"
        roman="01"
        accent={TERRA}
        onPick={() => setPick("girl")}
        ariaLabel="اختر بنت"
      />
      <div className="pointer-events-none absolute inset-y-12 left-1/2 w-px -translate-x-1/2 bg-ink/15" />
      <Panel
        label="وَلَد"
        roman="02"
        accent={SAGE}
        onPick={() => setPick("boy")}
        ariaLabel="اختر ولد"
      />

      <header className="pointer-events-none absolute inset-x-0 top-6 flex items-center justify-between px-6 text-[12.5px] tracking-[0.18em] text-ink/60">
        <span>BOY OR GIRL · ولد أم بنت</span>
        <span lang="en" className="font-mono">
          MMXXVI
        </span>
      </header>

      <footer className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center">
        <p className="text-[12.5px] text-ink/55">— صوتٌ واحد لكل جهاز —</p>
      </footer>

      <VoteSheet
        open={pick !== null}
        choice={pick}
        accent={pick === "girl" ? TERRA : SAGE}
        label={pick === "girl" ? "بنت" : "ولد"}
        onClose={() => setPick(null)}
      />
    </section>
  );
}

function Panel({
  label,
  roman,
  accent,
  onPick,
  ariaLabel,
}: {
  label: string;
  roman: string;
  accent: string;
  onPick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onPick}
      className="group relative isolate flex h-full w-full items-center justify-center overflow-hidden bg-paper text-ink outline-none transition-colors focus-visible:bg-ink/[0.04]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(60% 60% at 50% 60%, ${accent}26 0%, transparent 70%)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-12 mx-auto h-px w-10 transition-colors duration-500 group-hover:w-16"
        style={{ background: accent }}
      />
      <span className="absolute top-10 text-[11px] tracking-[0.3em] text-ink/45 font-mono">
        {roman}
      </span>
      <span
        className="select-none text-[clamp(80px,16vw,220px)] font-extrabold leading-none tracking-tight transition-[letter-spacing,transform] duration-700 group-hover:tracking-[-0.01em]"
        style={{ fontFamily: "'Reem Kufi', 'Amiri', serif" }}
      >
        {label}
      </span>
      <span className="absolute bottom-14 text-[12.5px] uppercase tracking-[0.35em] text-ink/55 transition-colors duration-500 group-hover:text-ink">
        اضغط للاختيار
      </span>
    </button>
  );
}

"use client";

import { useState } from "react";
import { VoteSheet } from "@/components/VoteSheet";
import { Critters } from "./Critters";

const PINK_BG = "oklch(93% 0.045 5)";
const PINK_ACCENT = "oklch(50% 0.14 5)";
const PINK_INK = "oklch(28% 0.09 5)";

const BLUE_BG = "oklch(90% 0.045 232)";
const BLUE_ACCENT = "oklch(42% 0.14 240)";
const BLUE_INK = "oklch(24% 0.09 240)";

export function GenerativeCalm() {
  const [pick, setPick] = useState<"boy" | "girl" | null>(null);

  return (
    <section
      className="relative grid h-dvh w-full grid-rows-2"
      style={{ fontFamily: "Cairo, system-ui" }}
    >
      <Half
        background={PINK_BG}
        critterKind="rabbit"
        critterColor={PINK_ACCENT}
        accent={PINK_ACCENT}
        ink={PINK_INK}
        labelArabic="بِنت"
        labelLatin="GIRL"
        onPick={() => setPick("girl")}
        ariaLabel="اختر بنت"
        align="top"
        seed={7}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
        style={{ background: "oklch(30% 0.05 250 / 0.18)" }}
      />
      <Half
        background={BLUE_BG}
        critterKind="bear"
        critterColor={BLUE_ACCENT}
        accent={BLUE_ACCENT}
        ink={BLUE_INK}
        labelArabic="وَلَد"
        labelLatin="BOY"
        onPick={() => setPick("boy")}
        ariaLabel="اختر ولد"
        align="bottom"
        seed={19}
      />
      <VoteSheet
        open={pick !== null}
        choice={pick}
        accent={pick === "girl" ? PINK_ACCENT : BLUE_ACCENT}
        label={pick === "girl" ? "بنت" : "ولد"}
        onClose={() => setPick(null)}
      />
    </section>
  );
}

function Half({
  background,
  critterKind,
  critterColor,
  accent,
  ink,
  labelArabic,
  labelLatin,
  onPick,
  ariaLabel,
  align,
  seed,
}: {
  background: string;
  critterKind: "rabbit" | "bear";
  critterColor: string;
  accent: string;
  ink: string;
  labelArabic: string;
  labelLatin: string;
  onPick: () => void;
  ariaLabel: string;
  align: "top" | "bottom";
  seed: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onClick={onPick}
      className="relative isolate overflow-hidden text-left outline-none"
      style={{ background, color: ink }}
    >
      <Critters kind={critterKind} color={critterColor} count={11} seed={seed} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(70% 70% at 50% ${align === "top" ? "75%" : "25%"}, ${accent}14 0%, transparent 65%)`,
          opacity: hover ? 1 : 0.7,
        }}
      />
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div
          className="grid place-items-center text-center transition-[letter-spacing,transform] duration-700"
          style={{
            letterSpacing: hover ? "0.04em" : "0em",
            transform: hover ? "scale(1.02)" : "scale(1)",
          }}
        >
          <span
            className="block select-none font-extrabold leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]"
            style={{
              fontSize: "clamp(96px, 15vw, 220px)",
              fontFamily: "Cairo, system-ui",
            }}
          >
            {labelArabic}
          </span>
          <span
            lang="en"
            className="mt-4 block font-mono text-[11px] uppercase opacity-60"
            style={{ letterSpacing: "0.5em", color: accent }}
          >
            {labelLatin}
          </span>
        </div>
      </div>
      <span
        className="absolute z-10 text-[12.5px] uppercase tracking-[0.32em] opacity-65"
        style={{
          [align === "top" ? "top" : "bottom"]: "20px",
          insetInlineEnd: "24px",
          color: accent,
        }}
      >
        اضغط للاختيار
      </span>
    </button>
  );
}

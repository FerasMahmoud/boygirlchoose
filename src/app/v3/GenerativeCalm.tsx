"use client";

import { useEffect, useRef, useState } from "react";
import { VoteSheet } from "@/components/VoteSheet";
import { ParticleField } from "./ParticleField";

const TOP_BG = "oklch(78% 0.06 95)";
const TOP_DOT = "oklch(45% 0.09 155)";
const BOT_BG = "oklch(28% 0.04 250)";
const BOT_DOT = "oklch(78% 0.13 65)";

export function GenerativeCalm() {
  const [pick, setPick] = useState<"boy" | "girl" | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  return (
    <section
      className="relative grid h-dvh w-full grid-rows-2"
      style={{ fontFamily: "Cairo, system-ui" }}
    >
      <Half
        background={TOP_BG}
        dotColor={TOP_DOT}
        labelArabic="بِنت"
        labelLatin="GIRL"
        textColor="oklch(22% 0.04 80)"
        reduced={reduced}
        onPick={() => setPick("girl")}
        ariaLabel="اختر بنت"
        align="top"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/30"
        style={{ mixBlendMode: "overlay" }}
      />
      <Half
        background={BOT_BG}
        dotColor={BOT_DOT}
        labelArabic="وَلَد"
        labelLatin="BOY"
        textColor="oklch(94% 0.02 95)"
        reduced={reduced}
        onPick={() => setPick("boy")}
        ariaLabel="اختر ولد"
        align="bottom"
      />
      <VoteSheet
        open={pick !== null}
        choice={pick}
        accent={pick === "girl" ? TOP_DOT : BOT_DOT}
        label={pick === "girl" ? "بنت" : "ولد"}
        onClose={() => setPick(null)}
      />
    </section>
  );
}

function Half({
  background,
  dotColor,
  labelArabic,
  labelLatin,
  textColor,
  reduced,
  onPick,
  ariaLabel,
  align,
}: {
  background: string;
  dotColor: string;
  labelArabic: string;
  labelLatin: string;
  textColor: string;
  reduced: boolean;
  onPick: () => void;
  ariaLabel: string;
  align: "top" | "bottom";
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);

  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onClick={onPick}
      className="relative isolate overflow-hidden text-left outline-none"
      style={{ background, color: textColor }}
    >
      {reduced ? null : <ParticleField host={ref} color={dotColor} hover={hover} />}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(80% 80% at 50% ${align === "top" ? "80%" : "20%"}, ${dotColor}1A 0%, transparent 65%)`,
        }}
      />
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div
          className="grid place-items-center text-center transition-[letter-spacing,transform] duration-700"
          style={{ letterSpacing: hover ? "0.04em" : "0em" }}
        >
          <span
            className="block select-none font-extrabold leading-none"
            style={{ fontSize: "clamp(90px, 14vw, 200px)", fontFamily: "Cairo, system-ui" }}
          >
            {labelArabic}
          </span>
          <span
            lang="en"
            className="mt-4 block font-mono text-[11px] uppercase opacity-70"
            style={{ letterSpacing: "0.5em" }}
          >
            {labelLatin}
          </span>
        </div>
      </div>
      <span
        className="absolute z-10 text-[12.5px] uppercase tracking-[0.32em] opacity-70"
        style={{
          [align === "top" ? "top" : "bottom"]: "20px",
          insetInlineEnd: "24px",
        }}
      >
        اضغط للاختيار
      </span>
    </button>
  );
}

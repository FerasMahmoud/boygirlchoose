"use client";

import { useState } from "react";
import { VoteSheet } from "@/components/VoteSheet";

const OX = "oklch(38% 0.13 25)";
const INK_BLUE = "oklch(38% 0.09 235)";

export function KineticManuscript() {
  const [pick, setPick] = useState<"boy" | "girl" | null>(null);
  const [hover, setHover] = useState<"girl" | "boy" | null>(null);

  return (
    <section className="relative h-dvh w-full" style={{ fontFamily: "Tajawal, system-ui" }}>
      <div
        className="absolute inset-0"
        style={{
          background: "oklch(94% 0.02 60)",
          clipPath: "polygon(0 0, 100% 0, calc(50% + 8vw) 100%, 0 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background: "oklch(91% 0.025 250)",
          clipPath: "polygon(calc(50% + 8vw) 100%, 100% 0, 100% 100%)",
        }}
        aria-hidden
      />

      <Half
        side="girl"
        label="بنت"
        accent={OX}
        roman="i"
        active={hover === "girl"}
        dim={hover === "boy"}
        onEnter={() => setHover("girl")}
        onLeave={() => setHover(null)}
        onPick={() => setPick("girl")}
        style={{
          clipPath: "polygon(0 0, 100% 0, calc(50% + 8vw) 100%, 0 100%)",
        }}
        align="right"
      />
      <Half
        side="boy"
        label="ولد"
        accent={INK_BLUE}
        roman="ii"
        active={hover === "boy"}
        dim={hover === "girl"}
        onEnter={() => setHover("boy")}
        onLeave={() => setHover(null)}
        onPick={() => setPick("boy")}
        style={{
          clipPath: "polygon(calc(50% + 8vw) 100%, 100% 0, 100% 100%)",
        }}
        align="left"
      />

      <header className="pointer-events-none absolute inset-x-0 top-6 z-10 flex items-center justify-between px-6 text-[11.5px] uppercase tracking-[0.32em] text-ink/55">
        <span>Manuscript · مخطوطة</span>
        <span lang="en">2026</span>
      </header>

      <VoteSheet
        open={pick !== null}
        choice={pick}
        accent={pick === "girl" ? OX : INK_BLUE}
        label={pick === "girl" ? "بنت" : "ولد"}
        onClose={() => setPick(null)}
      />
    </section>
  );
}

function Half({
  side,
  label,
  accent,
  roman,
  active,
  dim,
  onEnter,
  onLeave,
  onPick,
  style,
  align,
}: {
  side: "girl" | "boy";
  label: string;
  accent: string;
  roman: string;
  active: boolean;
  dim: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onPick: () => void;
  style: React.CSSProperties;
  align: "right" | "left";
}) {
  return (
    <button
      type="button"
      aria-label={`اختر ${label}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onPick}
      className="group absolute inset-0 grid place-items-center overflow-hidden text-ink outline-none"
      style={style}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute select-none whitespace-nowrap font-black leading-none transition-[transform,opacity,letter-spacing] duration-700 ease-[cubic-bezier(.2,.9,.1,1)]"
        style={{
          fontSize: "min(46vw, 540px)",
          color: accent,
          opacity: dim ? 0.18 : active ? 0.96 : 0.55,
          fontFamily: "'Reem Kufi', 'Amiri', serif",
          letterSpacing: active ? "-0.04em" : "-0.02em",
          transform: active
            ? "translate3d(0,0,0) scale(1)"
            : align === "right"
              ? "translate3d(-6vw, 0, 0) scale(1.02)"
              : "translate3d(6vw, 0, 0) scale(1.02)",
          filter: dim ? "blur(3px)" : "none",
          [align === "right" ? "right" : "left"]: "-8vw",
        }}
      >
        {label}
      </span>

      <span
        className="absolute z-10 select-none text-center transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0.7, color: accent }}
      >
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.4em] opacity-80">
          {roman}
        </span>
        <span className="mt-3 block text-[13px] tracking-[0.32em] uppercase text-ink/70">
          اضغط للاختيار
        </span>
      </span>
    </button>
  );
}

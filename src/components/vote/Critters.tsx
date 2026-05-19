"use client";

type Kind = "rabbit" | "bear";

const RABBIT = (
  <g
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M34 38 C30 24 30 12 36 6 C42 12 42 26 40 38" />
    <path d="M52 38 C56 24 56 12 50 6 C44 12 44 26 46 38" />
    <ellipse cx="43" cy="50" rx="14" ry="13" />
    <circle cx="38" cy="50" r="1.4" fill="currentColor" />
    <circle cx="48" cy="50" r="1.4" fill="currentColor" />
    <path d="M43 55 v2" />
    <path d="M28 64 C22 70 22 82 32 86 C40 90 50 90 58 86 C66 82 66 70 60 64" />
    <circle cx="64" cy="78" r="3" />
    <path d="M34 86 c-2 2 -2 4 1 4" />
    <path d="M56 86 c2 2 2 4 -1 4" />
  </g>
);

const BEAR = (
  <g
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="28" cy="24" r="7" />
    <circle cx="60" cy="24" r="7" />
    <circle cx="28" cy="24" r="3" />
    <circle cx="60" cy="24" r="3" />
    <ellipse cx="44" cy="36" rx="16" ry="14" />
    <ellipse cx="44" cy="40" rx="7" ry="5" />
    <circle cx="38" cy="34" r="1.6" fill="currentColor" />
    <circle cx="50" cy="34" r="1.6" fill="currentColor" />
    <path d="M44 38 v2" strokeWidth="2.6" />
    <path d="M28 52 C20 60 20 78 30 84 C38 88 50 88 58 84 C68 78 68 60 60 52" />
    <ellipse cx="44" cy="70" rx="9" ry="10" />
    <path d="M22 60 c-4 4 -4 10 0 14" />
    <path d="M66 60 c4 4 4 10 0 14" />
    <path d="M36 50 l8 -3 l8 3 l-8 3 z" />
  </g>
);

type Item = { x: number; y: number; size: number; rot: number; opacity: number; delay: number };

const RNG = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

function layout(seed: number, count: number): Item[] {
  const r = RNG(seed);
  return Array.from({ length: count }, () => ({
    x: 6 + r() * 88,
    y: 8 + r() * 84,
    size: 64 + r() * 80,
    rot: (r() - 0.5) * 24,
    opacity: 0.14 + r() * 0.14,
    delay: r() * 6,
  }));
}

export function Critters({
  kind,
  color,
  count = 9,
  seed = 7,
}: {
  kind: Kind;
  color: string;
  count?: number;
  seed?: number;
}) {
  const items = layout(seed, count);
  const glyph = kind === "rabbit" ? RABBIT : BEAR;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ color }}
    >
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${it.x}%`,
            top: `${it.y}%`,
            transform: "translate(-50%, -50%)",
            opacity: it.opacity,
            translate: "0 0",
            animation: `critter-bob 9s ease-in-out ${it.delay}s infinite alternate`,
          }}
        >
          <svg
            viewBox="0 0 86 96"
            style={{
              display: "block",
              width: `${it.size}px`,
              height: `${(it.size * 96) / 86}px`,
              transform: `rotate(${it.rot}deg)`,
            }}
          >
            {glyph}
          </svg>
        </span>
      ))}
      <style>{`
        @keyframes critter-bob {
          0%   { translate: 0 0; }
          100% { translate: 0 -8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="critter-bob"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

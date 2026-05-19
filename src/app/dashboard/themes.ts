export type DashTheme = {
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

export const DASH_THEMES: Record<"girl" | "boy", DashTheme> = {
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

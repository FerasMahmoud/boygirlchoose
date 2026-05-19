export type DashTheme = {
  surface: string;
  ink: string;
  inkSoft: string;
  boyAccent: string;
  girlAccent: string;
  border: string;
  cardBg: string;
  chipBoy: string;
  chipGirl: string;
};

export const NEUTRAL_THEME: DashTheme = {
  surface: "oklch(97% 0.008 85)",
  ink: "oklch(18% 0.015 80)",
  inkSoft: "oklch(45% 0.012 80)",
  boyAccent: "oklch(42% 0.14 240)",
  girlAccent: "oklch(50% 0.14 5)",
  border: "oklch(20% 0.01 80 / 0.10)",
  cardBg: "white",
  chipBoy: "oklch(42% 0.14 240 / 0.12)",
  chipGirl: "oklch(50% 0.14 5 / 0.12)",
};

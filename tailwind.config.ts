import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui"],
        display: ["var(--font-display)", "serif"],
        ar: ["var(--font-ar)", "system-ui"],
        arDisplay: ["var(--font-ar-display)", "serif"],
      },
      colors: {
        paper: "oklch(97% 0.008 85)",
        ink: "oklch(18% 0.015 80)",
        ash: "oklch(70% 0.01 80)",
        terra: "oklch(62% 0.09 35)",
        sage: "oklch(58% 0.07 165)",
        oxblood: "oklch(38% 0.13 25)",
        inkblue: "oklch(38% 0.09 235)",
        linen: "oklch(94% 0.02 60)",
        butter: "oklch(78% 0.06 95)",
        plum: "oklch(28% 0.04 250)",
        ochre: "oklch(72% 0.11 65)",
        mossDeep: "oklch(55% 0.08 155)",
      },
    },
  },
  plugins: [],
} satisfies Config;

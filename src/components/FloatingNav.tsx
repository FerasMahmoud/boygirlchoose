"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Theme = "neutral" | "girl" | "boy";

const TONES: Record<Theme, { pill: string; active: string }> = {
  neutral: { pill: "bg-white/85 border-black/10", active: "bg-ink text-paper" },
  girl: {
    pill: "border-[color:oklch(50%_0.14_5_/_0.18)] bg-white/90",
    active: "bg-[oklch(50%_0.14_5)] text-white",
  },
  boy: {
    pill: "border-[color:oklch(42%_0.14_240_/_0.22)] bg-white/90",
    active: "bg-[oklch(42%_0.14_240)] text-white",
  },
};

export function FloatingNav({
  showDashboard,
  theme = "neutral",
}: {
  showDashboard: boolean;
  theme?: Theme;
}) {
  const path = usePathname();
  const tone = TONES[theme];
  const links: { href: string; label: string }[] = [{ href: "/", label: "التصويت" }];
  if (showDashboard) links.push({ href: "/dashboard", label: "اللوحة" });

  return (
    <nav
      aria-label="التنقّل"
      className={[
        "fixed left-1/2 z-50 -translate-x-1/2 rounded-full border px-1.5 py-1.5 shadow-[0_8px_24px_-12px_rgba(20,18,15,0.25)] backdrop-blur",
        tone.pill,
      ].join(" ")}
      style={{
        fontFamily: "Cairo, system-ui",
        bottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <ul className="flex items-center gap-1">
        {links.map((l) => {
          const active = path === l.href;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                prefetch
                aria-current={active ? "page" : undefined}
                className={[
                  "inline-flex h-11 min-w-[88px] items-center justify-center rounded-full px-4 text-[13.5px] font-medium transition-colors active:scale-[0.98]",
                  active ? tone.active : "text-ink/80 hover:bg-black/5",
                ].join(" ")}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

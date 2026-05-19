"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "التصويت" },
  { href: "/dashboard", label: "اللوحة" },
];

export function FloatingNav() {
  const path = usePathname();
  return (
    <nav
      aria-label="التنقّل"
      className="fixed left-1/2 z-50 -translate-x-1/2 rounded-full border border-black/10 bg-white/90 px-1.5 py-1.5 shadow-[0_8px_24px_-12px_rgba(20,18,15,0.25)] backdrop-blur"
      style={{
        fontFamily: "Cairo, system-ui",
        bottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <ul className="flex items-center gap-1">
        {LINKS.map((l) => {
          const active = path === l.href;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                prefetch
                aria-current={active ? "page" : undefined}
                className={[
                  "inline-flex h-11 min-w-[88px] items-center justify-center rounded-full px-4 text-[13.5px] font-medium transition-colors active:scale-[0.98]",
                  active ? "bg-ink text-paper" : "text-ink/80 hover:bg-black/5",
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

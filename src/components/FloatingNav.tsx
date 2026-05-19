"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/v1", label: "النسخة ١" },
  { href: "/v2", label: "النسخة ٢" },
  { href: "/v3", label: "النسخة ٣" },
  { href: "/dashboard", label: "اللوحة" },
];

export function FloatingNav() {
  const path = usePathname();
  return (
    <nav
      aria-label="التنقّل"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-black/10 bg-white/85 px-2 py-1.5 shadow-[0_8px_24px_-12px_rgba(20,18,15,0.25)] backdrop-blur"
      style={{ fontFamily: "Cairo, system-ui" }}
    >
      <ul className="flex items-center gap-1">
        {links.map((l) => {
          const active = path === l.href;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "inline-flex h-9 items-center rounded-full px-3 text-[13px] transition-colors",
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

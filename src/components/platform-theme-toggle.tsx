"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";

const INLINE_THEME_PATHS = ["/", "/blog", "/dashboard"];

export function PlatformThemeToggle() {
  const pathname = usePathname() || "/";
  const hidden = INLINE_THEME_PATHS.some((path) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`)
  );

  if (hidden) return null;

  return (
    <div className="fixed right-4 top-4 z-[90] sm:right-6 sm:top-6">
      <ThemeToggle />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

const LIGHT_THEME_COLOR = "#fff8f7";
const DARK_THEME_COLOR = "#0F1113";

function setMetaContent(name: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }

  meta.content = content;
}

export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;

    const isDark = resolvedTheme === "dark";

    setMetaContent("theme-color", isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
    setMetaContent("color-scheme", isDark ? "dark light" : "light dark");
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";

    const appleStatusBar = document.querySelector<HTMLMetaElement>(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (appleStatusBar) {
      appleStatusBar.content = isDark ? "black-translucent" : "default";
    }
  }, [resolvedTheme]);

  return null;
}

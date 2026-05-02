"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && resolvedTheme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
            aria-label="Changer le thème"
            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
            ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
            )}
        </button>
    );
}

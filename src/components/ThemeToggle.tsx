"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        if (storedTheme) {
            setTheme(storedTheme);
            applyTheme(storedTheme);
        } else {
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initial = isDark ? "dark" : "light";
            setTheme(initial);
            applyTheme(initial);
        }
    }, []);

    const applyTheme = (newTheme: "light" | "dark") => {
        const root = window.document.documentElement;
        root.classList.toggle("dark", newTheme === "dark");
    };

    const toggleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
        applyTheme(nextTheme);
    };

    if (!mounted) {
        return <div className="w-10 h-10 border rounded-lg bg-background" />;
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border bg-background hover:bg-muted transition-colors duration-150 w-10 h-10 flex items-center justify-center relative group"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                {theme === "light" ? (
                    <Sun className="w-5 h-5 text-foreground" />
                ) : (
                    <Moon className="w-5 h-5 text-foreground" />
                )}
            </div>

            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none capitalize">
                {theme} Mode
            </span>
        </button>
    );
}

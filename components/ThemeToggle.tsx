"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "tessera-theme";

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialTheme: Theme = saved === "light" ? "light" : "dark";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn-secondary text-sm"
      aria-label="Toggle light and dark mode"
    >
      {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
    </button>
  );
}

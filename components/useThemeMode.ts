"use client";

import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

function resolveTheme(): ThemeMode {
  if (typeof document === "undefined") {
    return "dark";
  }
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function useThemeMode() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setThemeMode(resolveTheme());

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return themeMode;
}

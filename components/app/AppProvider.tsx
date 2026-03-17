"use client";

import { defaultPosture } from "@/lib/product-mock";
import type { PostureConfig, SystemMode } from "@/lib/product-types";
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type AppContextValue = {
  mode: SystemMode;
  setMode: (mode: SystemMode) => void;
  posture: PostureConfig;
  setPosture: (posture: PostureConfig) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SystemMode>("Advisory");
  const [posture, setPosture] = useState<PostureConfig>(defaultPosture);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const value = useMemo(
    () => ({ mode, setMode, posture, setPosture, sidebarCollapsed, setSidebarCollapsed }),
    [mode, posture, sidebarCollapsed]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return context;
}

"use client";

import { getAppData } from "@/lib/mock-data";
import type {
  AppDataBundle,
  CopilotMessage,
  DecisionCycle,
  PostureConfig,
  SystemMode
} from "@/lib/app-types";
import type { MockSession } from "@/lib/mock-auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";

type AppContextValue = {
  data: AppDataBundle;
  session: MockSession;
  mode: SystemMode;
  setMode: (mode: SystemMode) => void;
  posture: PostureConfig;
  setPosture: (posture: PostureConfig) => void;
  cycles: DecisionCycle[];
  setCycles: Dispatch<SetStateAction<DecisionCycle[]>>;
  copilotMessages: CopilotMessage[];
  setCopilotMessages: Dispatch<SetStateAction<CopilotMessage[]>>;
  posturePanelOpen: boolean;
  setPosturePanelOpen: (open: boolean) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotWidth: number;
  setCopilotWidth: (width: number) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);
const COPILOT_WIDTH_STORAGE_KEY = "tessera_copilot_width";
const COPILOT_WIDTH_MIN = 320;
const COPILOT_WIDTH_MAX = 560;
const COPILOT_WIDTH_DEFAULT = 380;

function clampCopilotWidth(width: number) {
  return Math.min(COPILOT_WIDTH_MAX, Math.max(COPILOT_WIDTH_MIN, width));
}

export function AppProvider({ children, session }: { children: ReactNode; session: MockSession }) {
  const data = useMemo(() => getAppData(session), [session]);
  const [mode, setMode] = useState<SystemMode>("Advisory");
  const [posture, setPosture] = useState<PostureConfig>(data.posture);
  const [cycles, setCycles] = useState<DecisionCycle[]>(data.cycles);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>(data.copilotMessages);
  const [posturePanelOpen, setPosturePanelOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotWidth, setCopilotWidthState] = useState<number>(() => {
    if (typeof window === "undefined") {
      return COPILOT_WIDTH_DEFAULT;
    }
    const savedValue = window.localStorage.getItem(COPILOT_WIDTH_STORAGE_KEY);
    const parsedValue = Number(savedValue);
    return Number.isFinite(parsedValue) ? clampCopilotWidth(parsedValue) : COPILOT_WIDTH_DEFAULT;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const setCopilotWidth = useCallback((width: number) => {
    setCopilotWidthState(clampCopilotWidth(width));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(COPILOT_WIDTH_STORAGE_KEY, String(clampCopilotWidth(copilotWidth)));
  }, [copilotWidth]);

  const value = useMemo(
    () => ({
      data,
      session,
      mode,
      setMode,
      posture,
      setPosture,
      cycles,
      setCycles,
      copilotMessages,
      setCopilotMessages,
      posturePanelOpen,
      setPosturePanelOpen,
      copilotOpen,
      setCopilotOpen,
      copilotWidth,
      setCopilotWidth,
      sidebarCollapsed,
      setSidebarCollapsed
    }),
    [
      data,
      session,
      mode,
      posture,
      cycles,
      copilotMessages,
      posturePanelOpen,
      copilotOpen,
      copilotWidth,
      setCopilotWidth,
      sidebarCollapsed
    ]
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

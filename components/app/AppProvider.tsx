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
import { createContext, useContext, useMemo, useState } from "react";
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
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children, session }: { children: ReactNode; session: MockSession }) {
  const data = useMemo(() => getAppData(session), [session]);
  const [mode, setMode] = useState<SystemMode>("Advisory");
  const [posture, setPosture] = useState<PostureConfig>(data.posture);
  const [cycles, setCycles] = useState<DecisionCycle[]>(data.cycles);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>(data.copilotMessages);
  const [posturePanelOpen, setPosturePanelOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

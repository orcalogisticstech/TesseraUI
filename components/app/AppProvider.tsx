"use client";

import { getAppData } from "@/lib/mock-data";
import type {
  AdoptedPlanHistoryEntry,
  AppTheme,
  AppDataBundle,
  CopilotDraftAttachment,
  CopilotMessage,
  DecisionCycle,
  HeartbeatPlan,
  HeartbeatRunSummary,
  HeartbeatRunDetails,
  PostureConfig,
  SystemMode,
  WorkspaceTabId
} from "@/lib/app-types";
import type { MockSession } from "@/lib/mock-auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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
  copilotDraftAttachments: CopilotDraftAttachment[];
  setCopilotDraftAttachments: Dispatch<SetStateAction<CopilotDraftAttachment[]>>;
  posturePanelOpen: boolean;
  setPosturePanelOpen: (open: boolean) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotWidth: number;
  setCopilotWidth: (width: number) => void;
  openTabs: WorkspaceTabId[];
  activeTab: WorkspaceTabId;
  openTab: (tabId: WorkspaceTabId) => void;
  focusTab: (tabId: WorkspaceTabId) => void;
  closeTab: (tabId: WorkspaceTabId) => void;
  runTabDetails: Record<
    string,
    {
      summary: HeartbeatRunSummary;
      details: HeartbeatRunDetails | null;
      loading: boolean;
      error: string | null;
    }
  >;
  openRunTab: (run: HeartbeatRunSummary) => void;
  activeHeartbeatPlans: HeartbeatPlan[] | null;
  clearActiveHeartbeatPlans: () => void;
  triggerNextHeartbeat: () => void;
  adoptedPlansHistory: AdoptedPlanHistoryEntry[];
  addAdoptedPlanToHistory: (plan: HeartbeatPlan) => void;
  heartbeatRemaining: number;
  heartbeatCycleCount: number;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
};

const AppContext = createContext<AppContextValue | null>(null);
const COPILOT_WIDTH_STORAGE_KEY = "tessera_copilot_width";
const APP_THEME_STORAGE_KEY = "tessera_app_theme";
const COPILOT_WIDTH_MIN = 500;
const COPILOT_WIDTH_MAX = 620;
const COPILOT_WIDTH_DEFAULT = 560;
const HEARTBEAT_SECONDS = 15 * 60;
const HEARTBEAT_INITIAL_SECONDS = 60;

function clampCopilotWidth(width: number) {
  return Math.min(COPILOT_WIDTH_MAX, Math.max(COPILOT_WIDTH_MIN, width));
}

export function AppProvider({
  children,
  session,
  initialHeartbeatPlanSets
}: {
  children: ReactNode;
  session: MockSession;
  initialHeartbeatPlanSets: HeartbeatPlan[][];
}) {
  const data = useMemo(() => getAppData(session), [session]);
  const [mode, setMode] = useState<SystemMode>("Advisory");
  const [posture, setPosture] = useState<PostureConfig>(data.posture);
  const [cycles, setCycles] = useState<DecisionCycle[]>(data.cycles);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>(data.copilotMessages);
  const [copilotDraftAttachments, setCopilotDraftAttachments] = useState<CopilotDraftAttachment[]>([]);
  const [posturePanelOpen, setPosturePanelOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotWidth, setCopilotWidthState] = useState<number>(COPILOT_WIDTH_DEFAULT);
  const [openTabs, setOpenTabs] = useState<WorkspaceTabId[]>(["decision-feed", "history", "layout"]);
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>("decision-feed");
  const [runTabDetails, setRunTabDetails] = useState<
    Record<
      string,
      {
        summary: HeartbeatRunSummary;
        details: HeartbeatRunDetails | null;
        loading: boolean;
        error: string | null;
      }
    >
  >({});
  const [activeHeartbeatPlans, setActiveHeartbeatPlans] = useState<HeartbeatPlan[] | null>(null);
  const [adoptedPlansHistory, setAdoptedPlansHistory] = useState<AdoptedPlanHistoryEntry[]>([]);
  const [heartbeatRemaining, setHeartbeatRemaining] = useState(HEARTBEAT_INITIAL_SECONDS);
  const [heartbeatCycleCount, setHeartbeatCycleCount] = useState(0);
  const [theme, setTheme] = useState<AppTheme>("dark");
  const nextHeartbeatPlanSetIndexRef = useRef(0);
  const activeHeartbeatPlansRef = useRef<HeartbeatPlan[] | null>(null);
  const runDetailsCacheRef = useRef<Record<string, HeartbeatRunDetails>>({});
  const inflightRunDetailsRef = useRef<Record<string, Promise<HeartbeatRunDetails> | undefined>>({});
  const setCopilotWidth = useCallback((width: number) => {
    setCopilotWidthState(clampCopilotWidth(width));
  }, []);
  const focusTab = useCallback((tabId: WorkspaceTabId) => {
    setActiveTab(tabId);
    setOpenTabs((current) => (current.includes(tabId) ? current : [...current, tabId]));
  }, []);
  const openTab = useCallback(
    (tabId: WorkspaceTabId) => {
      focusTab(tabId);
    },
    [focusTab]
  );
  const getRunCacheKey = useCallback((run: HeartbeatRunSummary) => `${run.requestId}:${run.tradeoffLabel}`, []);
  const fetchRunDetails = useCallback(
    async (run: HeartbeatRunSummary) => {
      const cacheKey = getRunCacheKey(run);
      const cached = runDetailsCacheRef.current[cacheKey];
      if (cached) {
        return cached;
      }

      const inflight = inflightRunDetailsRef.current[cacheKey];
      if (inflight) {
        return inflight;
      }

      const promise = (async () => {
        const query = new URLSearchParams({
          requestId: run.requestId,
          tradeoffLabel: run.tradeoffLabel,
          page: "0",
          pageSize: "100"
        });
        const response = await fetch(`/api/heartbeat-run-details?${query.toString()}`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const details = (await response.json()) as HeartbeatRunDetails;
        runDetailsCacheRef.current[cacheKey] = details;
        delete inflightRunDetailsRef.current[cacheKey];
        return details;
      })().catch((error) => {
        delete inflightRunDetailsRef.current[cacheKey];
        throw error;
      });

      inflightRunDetailsRef.current[cacheKey] = promise;
      return promise;
    },
    [getRunCacheKey]
  );
  const loadRunDetails = useCallback(
    async (run: HeartbeatRunSummary, tabId: WorkspaceTabId) => {
      try {
        const details = await fetchRunDetails(run);
        setRunTabDetails((current) => {
          const existing = current[tabId];
          if (!existing) {
            return current;
          }
          return {
            ...current,
            [tabId]: {
              ...existing,
              details,
              loading: false,
              error: null
            }
          };
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load run details.";
        setRunTabDetails((current) => {
          const existing = current[tabId];
          if (!existing) {
            return current;
          }
          return {
            ...current,
            [tabId]: {
              ...existing,
              loading: false,
              error: message
            }
          };
        });
      }
    },
    [fetchRunDetails]
  );
  const openRunTab = useCallback(
    (run: HeartbeatRunSummary) => {
      const tabId: WorkspaceTabId = `run:${run.runId}`;
      let shouldFetch = false;
      const cached = runDetailsCacheRef.current[getRunCacheKey(run)] ?? null;

      setRunTabDetails((current) => {
        const existing = current[tabId];
        if (existing) {
          shouldFetch = existing.details === null && !existing.loading;
          return {
            ...current,
            [tabId]: {
              ...existing,
              summary: run
            }
          };
        }
        shouldFetch = true;
        return {
          ...current,
          [tabId]: {
            summary: run,
            details: cached,
            loading: cached === null,
            error: null
          }
        };
      });
      focusTab(tabId);
      if (shouldFetch || cached === null) {
        void loadRunDetails(run, tabId);
      }
    },
    [focusTab, getRunCacheKey, loadRunDetails]
  );
  const closeTab = useCallback((tabId: WorkspaceTabId) => {
    if (tabId === "decision-feed" || tabId === "history" || tabId === "layout") {
      return;
    }

    setOpenTabs((current) => {
      if (!current.includes(tabId)) {
        return current;
      }
      const nextTabs = current.filter((tab) => tab !== tabId);
      setActiveTab((currentActive) => (currentActive === tabId ? nextTabs[nextTabs.length - 1] ?? "decision-feed" : currentActive));
      return nextTabs;
    });

    if (tabId.startsWith("run:")) {
      setRunTabDetails((current) => {
        const next = { ...current };
        delete next[tabId];
        return next;
      });
    }
  }, []);
  const clearActiveHeartbeatPlans = useCallback(() => {
    setActiveHeartbeatPlans(null);
  }, []);
  const triggerNextHeartbeat = useCallback(() => {
    if (activeHeartbeatPlansRef.current === null) {
      const totalPlanSets = initialHeartbeatPlanSets.length;
      if (totalPlanSets > 0) {
        const normalizedIndex = nextHeartbeatPlanSetIndexRef.current % totalPlanSets;
        setActiveHeartbeatPlans(initialHeartbeatPlanSets[normalizedIndex]);
        nextHeartbeatPlanSetIndexRef.current = (normalizedIndex + 1) % totalPlanSets;
      }
    }

    setHeartbeatCycleCount((count) => count + 1);
    setHeartbeatRemaining(HEARTBEAT_SECONDS);
  }, [initialHeartbeatPlanSets]);

  const addAdoptedPlanToHistory = useCallback((plan: HeartbeatPlan) => {
    setAdoptedPlansHistory((current) => [
      {
        id: `adopted-${Date.now()}`,
        adoptedAt: new Date().toISOString(),
        plan
      },
      ...current
    ]);
  }, []);

  useEffect(() => {
    activeHeartbeatPlansRef.current = activeHeartbeatPlans;
  }, [activeHeartbeatPlans]);

  useEffect(() => {
    if (!activeHeartbeatPlans) {
      return;
    }

    for (const plan of activeHeartbeatPlans) {
      const cacheKey = getRunCacheKey(plan.run);
      if (runDetailsCacheRef.current[cacheKey] || inflightRunDetailsRef.current[cacheKey]) {
        continue;
      }
      void fetchRunDetails(plan.run);
    }
  }, [activeHeartbeatPlans, fetchRunDetails, getRunCacheKey]);

  useEffect(() => {
    const savedValue = window.localStorage.getItem(COPILOT_WIDTH_STORAGE_KEY);
    const parsedValue = Number(savedValue);
    if (Number.isFinite(parsedValue)) {
      setCopilotWidthState(clampCopilotWidth(parsedValue));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(COPILOT_WIDTH_STORAGE_KEY, String(clampCopilotWidth(copilotWidth)));
  }, [copilotWidth]);

  useEffect(() => {
    window.localStorage.setItem(APP_THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeartbeatRemaining((current) => {
        if (current === 0) {
          triggerNextHeartbeat();
          return current;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [triggerNextHeartbeat]);

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
      copilotDraftAttachments,
      setCopilotDraftAttachments,
      posturePanelOpen,
      setPosturePanelOpen,
      copilotOpen,
      setCopilotOpen,
      copilotWidth,
      setCopilotWidth,
      openTabs,
      activeTab,
      openTab,
      focusTab,
      closeTab,
      runTabDetails,
      openRunTab,
      activeHeartbeatPlans,
      clearActiveHeartbeatPlans,
      triggerNextHeartbeat,
      adoptedPlansHistory,
      addAdoptedPlanToHistory,
      heartbeatRemaining,
      heartbeatCycleCount,
      theme,
      setTheme
    }),
    [
      data,
      session,
      mode,
      posture,
      cycles,
      copilotMessages,
      copilotDraftAttachments,
      posturePanelOpen,
      copilotOpen,
      copilotWidth,
      setCopilotWidth,
      openTabs,
      activeTab,
      openTab,
      focusTab,
      closeTab,
      runTabDetails,
      openRunTab,
      activeHeartbeatPlans,
      clearActiveHeartbeatPlans,
      triggerNextHeartbeat,
      adoptedPlansHistory,
      addAdoptedPlanToHistory,
      heartbeatRemaining,
      heartbeatCycleCount,
      theme,
      setTheme
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

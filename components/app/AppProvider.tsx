"use client";

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
  KpiSnapshot,
  PostureConfig,
  SystemMode,
  WorkspaceTabId
} from "@/lib/app-types";
import type { BackendJobConfig } from "@/lib/tesserapick-normalizers";
import type { MockSession } from "@/lib/mock-auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";

type AppContextValue = {
  data: AppDataBundle;
  session: MockSession;
  backendJobConfig: BackendJobConfig;
  activeJobIds: string[];
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
  layoutOverlayTabDetails: Record<
    string,
    {
      summary: HeartbeatRunSummary;
      details: HeartbeatRunDetails | null;
      loading: boolean;
      error: string | null;
      selectedBatchIds: string[];
      selectionInitialized: boolean;
    }
  >;
  openLayoutOverlayTab: (run: HeartbeatRunSummary) => void;
  setLayoutOverlayTabSelectedBatchIds: (tabId: WorkspaceTabId, batchIds: string[]) => void;
  activeHeartbeatPlans: HeartbeatPlan[] | null;
  clearActiveHeartbeatPlans: () => void;
  triggerNextHeartbeat: (options?: TriggerHeartbeatOptions) => Promise<void>;
  heartbeatLoading: boolean;
  heartbeatError: string | null;
  adoptedPlansHistory: AdoptedPlanHistoryEntry[];
  addAdoptedPlanToHistory: (plan: HeartbeatPlan) => Promise<void>;
  heartbeatRemaining: number;
  heartbeatCycleCount: number;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
};

export type TriggerHeartbeatOptions = {
  jobConfig?: BackendJobConfig;
  floorState?: {
    blockedLocations: Array<{ locationId: string; reason: string }>;
    blockedZones: Array<{ zoneId: string; reason: string }>;
  };
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
  initialData,
  initialHeartbeatPlanSets,
  initialAdoptedPlansHistory,
  initialJobConfig,
  initialActiveJobIds
}: {
  children: ReactNode;
  session: MockSession;
  initialData: AppDataBundle;
  initialHeartbeatPlanSets: HeartbeatPlan[][];
  initialAdoptedPlansHistory: AdoptedPlanHistoryEntry[];
  initialJobConfig: BackendJobConfig;
  initialActiveJobIds: string[];
}) {
  const [data, setData] = useState<AppDataBundle>(initialData);
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
  const [layoutOverlayTabDetails, setLayoutOverlayTabDetails] = useState<
    Record<
      string,
      {
        summary: HeartbeatRunSummary;
        details: HeartbeatRunDetails | null;
        loading: boolean;
        error: string | null;
        selectedBatchIds: string[];
        selectionInitialized: boolean;
      }
    >
  >({});
  const [activeHeartbeatPlans, setActiveHeartbeatPlans] = useState<HeartbeatPlan[] | null>(null);
  const [heartbeatLoading, setHeartbeatLoading] = useState(false);
  const [heartbeatError, setHeartbeatError] = useState<string | null>(null);
  const [adoptedPlansHistory, setAdoptedPlansHistory] = useState<AdoptedPlanHistoryEntry[]>(initialAdoptedPlansHistory);
  const [heartbeatRemaining, setHeartbeatRemaining] = useState(HEARTBEAT_INITIAL_SECONDS);
  const [heartbeatCycleCount, setHeartbeatCycleCount] = useState(0);
  const [theme, setTheme] = useState<AppTheme>("dark");
  const nextHeartbeatPlanSetIndexRef = useRef(0);
  const activeHeartbeatPlansRef = useRef<HeartbeatPlan[] | null>(null);
  const heartbeatInFlightRef = useRef(false);
  const autoHeartbeatRequestedRef = useRef(false);
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
          runId: run.runId,
          requestId: run.requestId,
          tradeoffLabel: run.tradeoffLabel,
          page: "0",
          pageSize: "100"
        });
        const response = await fetch(`/api/heartbeat-run-details?${query.toString()}`);
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? `Request failed with status ${response.status}`);
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
  const loadLayoutOverlayDetails = useCallback(
    async (run: HeartbeatRunSummary, tabId: WorkspaceTabId) => {
      try {
        const details = await fetchRunDetails(run);
        setLayoutOverlayTabDetails((current) => {
          const existing = current[tabId];
          if (!existing) {
            return current;
          }
          const validSelected = existing.selectedBatchIds.filter((batchId) => details.batches.some((batch) => batch.batchId === batchId));
          const shouldInitializeSelection = !existing.selectionInitialized;
          return {
            ...current,
            [tabId]: {
              ...existing,
              details,
              loading: false,
              error: null,
              selectedBatchIds: shouldInitializeSelection ? details.batches.map((batch) => batch.batchId) : validSelected,
              selectionInitialized: true
            }
          };
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load run details.";
        setLayoutOverlayTabDetails((current) => {
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
  const openLayoutOverlayTab = useCallback(
    (run: HeartbeatRunSummary) => {
      const tabId: WorkspaceTabId = `layout-overlay:${run.runId}`;
      let shouldFetch = false;
      const cached = runDetailsCacheRef.current[getRunCacheKey(run)] ?? null;

      setLayoutOverlayTabDetails((current) => {
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
            error: null,
            selectedBatchIds: cached ? cached.batches.map((batch) => batch.batchId) : [],
            selectionInitialized: cached !== null
          }
        };
      });

      focusTab(tabId);
      if (shouldFetch || cached === null) {
        void loadLayoutOverlayDetails(run, tabId);
      }
    },
    [focusTab, getRunCacheKey, loadLayoutOverlayDetails]
  );
  const setLayoutOverlayTabSelectedBatchIds = useCallback((tabId: WorkspaceTabId, batchIds: string[]) => {
    setLayoutOverlayTabDetails((current) => {
      const existing = current[tabId];
      if (!existing) {
        return current;
      }

      return {
        ...current,
        [tabId]: {
          ...existing,
          selectedBatchIds: [...batchIds],
          selectionInitialized: true
        }
      };
    });
  }, []);
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
    if (tabId.startsWith("layout-overlay:")) {
      setLayoutOverlayTabDetails((current) => {
        const next = { ...current };
        delete next[tabId];
        return next;
      });
    }
  }, []);
  const clearActiveHeartbeatPlans = useCallback(() => {
    setActiveHeartbeatPlans(null);
  }, []);
  const triggerNextHeartbeat = useCallback(
    async (options?: TriggerHeartbeatOptions) => {
      if (activeHeartbeatPlansRef.current !== null || heartbeatInFlightRef.current) {
        return;
      }

      heartbeatInFlightRef.current = true;
      setHeartbeatLoading(true);
      setHeartbeatError(null);
      try {
        if (options?.floorState) {
          const floorResponse = await fetch("/api/floor-state", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              tenant_id: "demo",
              facility_id: "ATL1",
              job_ids: initialActiveJobIds,
              blocked_locations: options.floorState.blockedLocations.map((item) => ({
                location_id: item.locationId,
                reason: item.reason
              })),
              blocked_zones: options.floorState.blockedZones.map((item) => ({
                zone_id: item.zoneId,
                reason: item.reason
              }))
            })
          });
          if (!floorResponse.ok) {
            throw new Error(`Floor-state update failed with status ${floorResponse.status}`);
          }
        }

        const heartbeatResponse = await fetch("/api/heartbeat-runs", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            tenant_id: "demo",
            facility_id: "ATL1",
            workflow: "heartbeat",
            mode: mode === "Closed-Loop" ? "closed_loop" : "advisory",
            job_config: options?.jobConfig ?? initialJobConfig,
            release_selector: initialActiveJobIds.length > 0 ? { job_ids: initialActiveJobIds, task_ids: [], include_inactive: false } : undefined,
            requested_by: {
              actor_type: "ops_ui",
              actor_id: session.userEmail
            }
          })
        });
        if (!heartbeatResponse.ok) {
          const body = (await heartbeatResponse.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? `Heartbeat request failed with status ${heartbeatResponse.status}`);
        }
        const result = (await heartbeatResponse.json()) as { plans: HeartbeatPlan[] };
        if (result.plans.length === 0) {
          throw new Error("Heartbeat completed without optimizer plans.");
        }
        setActiveHeartbeatPlans(result.plans);
        setHeartbeatCycleCount((count) => count + 1);
        setHeartbeatRemaining(HEARTBEAT_SECONDS);
      } catch (error) {
        setHeartbeatError(error instanceof Error ? error.message : "Unable to trigger heartbeat.");
        setHeartbeatRemaining(HEARTBEAT_SECONDS);
      } finally {
        heartbeatInFlightRef.current = false;
        setHeartbeatLoading(false);
      }
    },
    [initialActiveJobIds, initialJobConfig, mode, session.userEmail]
  );

  const addAdoptedPlanToHistory = useCallback(
    async (plan: HeartbeatPlan) => {
      const response = await fetch("/api/adoptions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tenant_id: "demo",
          facility_id: "ATL1",
          plan: {
            id: plan.id,
            label: plan.label,
            is_tess_choice: plan.isTessChoice,
            summary: plan.summary,
            metrics: {
              late_orders: plan.metrics.lateOrders,
              selected_tasks: plan.metrics.selectedTasks,
              max_zone_load: plan.metrics.maxZoneLoad,
              zone_crossings: plan.metrics.zoneCrossings,
              priority_alignment: plan.metrics.priorityAlignment,
              throughput_picks_per_hour: plan.metrics.throughputPicksPerHour
            },
            run: {
              run_id: plan.run.runId,
              request_id: plan.run.requestId,
              request_label: plan.run.requestLabel,
              workflow: plan.run.workflow,
              mode: plan.run.mode,
              status: plan.run.status,
              timestamp: plan.run.timestamp,
              computation_time: plan.run.computationTime,
              solution_id: plan.run.solutionId,
              tradeoff_label: plan.run.tradeoffLabel
            }
          },
          adopted_by: {
            actor_type: "ops_ui",
            actor_id: session.userEmail
          }
        })
      });
      if (!response.ok) {
        throw new Error(`Adoption failed with status ${response.status}`);
      }
      const body = (await response.json()) as { entry: AdoptedPlanHistoryEntry; kpi: KpiSnapshot };
      setAdoptedPlansHistory((current) => [body.entry, ...current]);
      setData((current) => ({
        ...current,
        kpi: body.kpi
      }));
    },
    [session.userEmail]
  );

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
      setHeartbeatRemaining((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (heartbeatRemaining > 0) {
      autoHeartbeatRequestedRef.current = false;
      return;
    }

    if (activeHeartbeatPlans !== null || autoHeartbeatRequestedRef.current) {
      return;
    }

    autoHeartbeatRequestedRef.current = true;
    void triggerNextHeartbeat();
  }, [activeHeartbeatPlans, heartbeatRemaining, triggerNextHeartbeat]);

  const value = useMemo(
    () => ({
      data,
      session,
      backendJobConfig: initialJobConfig,
      activeJobIds: initialActiveJobIds,
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
      layoutOverlayTabDetails,
      openLayoutOverlayTab,
      setLayoutOverlayTabSelectedBatchIds,
      activeHeartbeatPlans,
      clearActiveHeartbeatPlans,
      triggerNextHeartbeat,
      heartbeatLoading,
      heartbeatError,
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
      initialJobConfig,
      initialActiveJobIds,
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
      layoutOverlayTabDetails,
      openLayoutOverlayTab,
      setLayoutOverlayTabSelectedBatchIds,
      activeHeartbeatPlans,
      clearActiveHeartbeatPlans,
      triggerNextHeartbeat,
      heartbeatLoading,
      heartbeatError,
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

"use client";

import { DecisionFeedView } from "@/components/app/DecisionFeedView";
import { HistoryView } from "@/components/app/HistoryView";
import { LayoutView } from "@/components/app/LayoutView";
import { RunDetailsView } from "@/components/app/RunDetailsView";
import { SettingsView } from "@/components/app/SettingsView";
import { useAppState } from "@/components/app/AppProvider";
import type { WorkspaceTabId } from "@/lib/app-types";

const pinnedTabs: WorkspaceTabId[] = ["decision-feed", "history", "layout"];

const tabMeta: Record<WorkspaceTabId, { label: string }> = {
  "decision-feed": { label: "Command" },
  history: { label: "History" },
  layout: { label: "Layout" },
  settings: { label: "Settings" }
};

function renderTabBody(tabId: WorkspaceTabId) {
  if (tabId === "decision-feed") {
    return <DecisionFeedView />;
  }
  if (tabId === "history") {
    return <HistoryView />;
  }
  if (tabId === "layout") {
    return <LayoutView />;
  }
  if (tabId === "settings") {
    return <SettingsView />;
  }
  return null;
}

const strategyLabelMap: Record<string, string> = {
  primary: "Tess's Choice",
  minimize_travel: "Minimize Travel",
  zero_late_risk: "Zero Late Risk",
  balance_zones: "Balance Zones",
  maximize_throughput: "Throughput Push"
};

function truncateLabel(label: string, maxLength: number) {
  if (label.length <= maxLength) {
    return label;
  }
  return `${label.slice(0, maxLength - 1)}…`;
}

function getTabLabel(tabId: WorkspaceTabId, runTabDetails: Record<string, { runId: string; postureName: string; tradeoffLabel: string }>) {
  if (tabId in tabMeta) {
    return tabMeta[tabId as keyof typeof tabMeta].label;
  }

  const run = runTabDetails[tabId];
  if (!run) {
    return "Run";
  }
  const strategy = strategyLabelMap[run.tradeoffLabel] ?? run.tradeoffLabel.replace(/_/g, " ");
  return truncateLabel(`${run.runId} - ${strategy}`, 34);
}

export function WorkspaceTabBar() {
  const { openTabs, activeTab, focusTab, closeTab, runTabDetails } = useAppState();

  return (
    <section
      className="border-b"
      style={{
        borderColor: "var(--tessera-border)",
        background: "var(--tessera-bg-surface)"
      }}
    >
      <div className="px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {openTabs.map((tabId) => {
            const active = tabId === activeTab;
            const pinned = pinnedTabs.includes(tabId);
            return (
              <div
                key={tabId}
                className="inline-flex items-center gap-2 border px-3 py-2"
                style={{
                  borderColor: active ? "var(--tessera-accent-signal)" : "var(--tessera-border)",
                  background: active ? "color-mix(in srgb, var(--tessera-accent-signal) 14%, transparent)" : "transparent"
                }}
              >
                <button
                  type="button"
                  className="text-sm"
                  style={{ color: active ? "var(--tessera-text-primary)" : "var(--tessera-text-secondary)" }}
                    onClick={() => focusTab(tabId)}
                  >
                    {getTabLabel(tabId, runTabDetails)}
                  </button>
                {!pinned ? (
                  <button
                    type="button"
                    className="px-1 text-xs"
                    style={{ color: "var(--tessera-text-secondary)" }}
                    onClick={() => closeTab(tabId)}
                    aria-label={`Close ${getTabLabel(tabId, runTabDetails)} tab`}
                    title={`Close ${getTabLabel(tabId, runTabDetails)}`}
                  >
                    x
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WorkspaceTabContent() {
  const { activeTab, runTabDetails } = useAppState();

  const runTab = activeTab.startsWith("run:") ? runTabDetails[activeTab] : null;

  return (
    <main className="px-4 pb-4 pt-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8">
      <section key={activeTab}>{runTab ? <RunDetailsView run={runTab} /> : renderTabBody(activeTab)}</section>
    </main>
  );
}

"use client";

import { formatTradeoffLabel } from "@/lib/heartbeat-recordings-shared";
import type { FlattenedBatchRow, HeartbeatRunDetails, HeartbeatRunSummary } from "@/lib/app-types";
import { useEffect, useState } from "react";

type RunDetailsViewProps = {
  runTab: {
    summary: HeartbeatRunSummary;
    details: HeartbeatRunDetails | null;
    loading: boolean;
    error: string | null;
  };
};

const UNSELECTED_TASKS_PAGE_SIZE = 100;
type BatchSortKey =
  | "batchId"
  | "priorityRank"
  | "priorityScore"
  | "cartTypeId"
  | "waveId"
  | "routeDistance"
  | "routeDuration"
  | "routeCrossings"
  | "sequenceIndex"
  | "taskId"
  | "orderId"
  | "locationId"
  | "stopZoneId";

type BatchSortState = {
  key: BatchSortKey;
  direction: "asc" | "desc";
} | null;

const batchColumnDefs: Array<{
  key?: BatchSortKey;
  label: string;
  render: (row: FlattenedBatchRow) => string;
}> = [
  { key: "batchId", label: "Batch", render: (row) => row.batchId },
  { key: "priorityRank", label: "Rank", render: (row) => String(row.priorityRank) },
  { key: "priorityScore", label: "Priority Score", render: (row) => row.priorityScore.toFixed(2) },
  { key: "cartTypeId", label: "Cart Type", render: (row) => row.cartTypeId },
  { key: "waveId", label: "Wave", render: (row) => row.waveId },
  { label: "Zones", render: (row) => row.zones.join(", ") },
  { key: "routeDistance", label: "Route Distance", render: (row) => row.routeDistance.toFixed(1) },
  { key: "routeDuration", label: "Route Duration", render: (row) => formatSeconds(row.routeDuration) },
  { key: "routeCrossings", label: "Route Crossings", render: (row) => String(row.routeCrossings) },
  { key: "sequenceIndex", label: "Sequence", render: (row) => (row.sequenceIndex === null ? "" : String(row.sequenceIndex)) },
  { key: "taskId", label: "Task", render: (row) => row.taskId },
  { key: "orderId", label: "Order", render: (row) => row.orderId },
  { key: "locationId", label: "Location", render: (row) => row.locationId },
  { key: "stopZoneId", label: "Stop Zone", render: (row) => row.stopZoneId }
];

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}m ${seconds}s`;
}

function formatRunStatus(status: HeartbeatRunDetails["status"]) {
  if (status === "completed") {
    return "Completed";
  }
  if (status === "failed") {
    return "Failed";
  }
  return "Partial";
}

function formatWorkflow(workflow: HeartbeatRunDetails["workflow"]) {
  return workflow === "replan" ? "Replan" : "Heartbeat";
}

function formatIsoTimestamp(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });
}

function compareBatchRows(left: FlattenedBatchRow, right: FlattenedBatchRow, sortState: BatchSortState) {
  if (!sortState) {
    return 0;
  }

  const multiplier = sortState.direction === "asc" ? 1 : -1;
  const leftValue = left[sortState.key];
  const rightValue = right[sortState.key];

  if (typeof leftValue === "number" || typeof rightValue === "number") {
    const normalizedLeft = typeof leftValue === "number" ? leftValue : Number.NEGATIVE_INFINITY;
    const normalizedRight = typeof rightValue === "number" ? rightValue : Number.NEGATIVE_INFINITY;
    return (normalizedLeft - normalizedRight) * multiplier;
  }

  return String(leftValue).localeCompare(String(rightValue)) * multiplier;
}

function getSortLabel(columnKey: BatchSortKey, sortState: BatchSortState) {
  if (!sortState || sortState.key !== columnKey) {
    return "";
  }
  return sortState.direction === "asc" ? " ↑" : " ↓";
}

function renderSummaryHeader(run: HeartbeatRunSummary) {
  return (
    <section className="app-card p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl uppercase tracking-[-0.01em]">Solution Run</h1>
        <span className="border px-3 py-1 text-xs" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
          {formatRunStatus(run.status).toUpperCase()}
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Run ID</p>
          <p className="mt-1 font-code text-sm">{run.runId}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Request</p>
          <p className="mt-1 text-sm">{run.requestLabel}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Strategy</p>
          <p className="mt-1 text-sm">{formatTradeoffLabel(run.tradeoffLabel)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Solve Time</p>
          <p className="mt-1 text-sm">{run.computationTime.toFixed(1)}s</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Workflow</p>
          <p className="mt-1 text-sm">{formatWorkflow(run.workflow)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Recorded At</p>
          <p className="mt-1 text-sm">{formatIsoTimestamp(run.timestamp)}</p>
        </div>
      </div>
    </section>
  );
}

export function RunDetailsView({ runTab }: RunDetailsViewProps) {
  const [taskPage, setTaskPage] = useState(0);
  const [taskPageRows, setTaskPageRows] = useState(runTab.details?.unselectedTasks ?? []);
  const [taskPageLoading, setTaskPageLoading] = useState(false);
  const [taskPageError, setTaskPageError] = useState<string | null>(null);
  const [batchSearch, setBatchSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [cartTypeFilter, setCartTypeFilter] = useState("all");
  const [waveFilter, setWaveFilter] = useState("all");
  const [batchSort, setBatchSort] = useState<BatchSortState>(null);

  useEffect(() => {
    setTaskPage(0);
    setTaskPageRows(runTab.details?.unselectedTasks ?? []);
    setTaskPageError(null);
    setTaskPageLoading(false);
    setBatchSearch("");
    setZoneFilter("all");
    setCartTypeFilter("all");
    setWaveFilter("all");
    setBatchSort(null);
  }, [runTab.summary.requestId, runTab.summary.tradeoffLabel]);

  useEffect(() => {
    let cancelled = false;

    const run = runTab.details;
    if (!run) {
      setTaskPageLoading(false);
      return () => {
        cancelled = true;
      };
    }

    const loadTaskPage = async () => {
      if (taskPage === run.unselectedTaskPage) {
        setTaskPageRows(run.unselectedTasks);
        setTaskPageError(null);
        setTaskPageLoading(false);
        return;
      }

      setTaskPageLoading(true);
      setTaskPageError(null);

      try {
        const query = new URLSearchParams({
          requestId: run.requestId,
          tradeoffLabel: run.tradeoffLabel,
          page: String(taskPage),
          pageSize: String(run.unselectedTaskPageSize)
        });
        const response = await fetch(`/api/heartbeat-run-details?${query.toString()}`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const details = (await response.json()) as HeartbeatRunDetails;
        if (!cancelled) {
          setTaskPageRows(details.unselectedTasks);
          setTaskPageLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setTaskPageError(error instanceof Error ? error.message : "Unable to load unselected tasks.");
          setTaskPageLoading(false);
        }
      }
    };

    void loadTaskPage();

    return () => {
      cancelled = true;
    };
  }, [runTab.details, taskPage]);

  if (runTab.loading && runTab.details === null) {
    return (
      <div className="mx-auto w-full max-w-[1120px] space-y-4">
        {renderSummaryHeader(runTab.summary)}
        <section className="app-card p-4 md:p-6" style={{ color: "var(--tessera-text-secondary)" }}>
          Loading recorded request and solution details...
        </section>
      </div>
    );
  }

  if (runTab.error && runTab.details === null) {
    return (
      <div className="mx-auto w-full max-w-[1120px] space-y-4">
        {renderSummaryHeader(runTab.summary)}
        <section className="app-card p-4 md:p-6" style={{ color: "var(--tessera-danger)" }}>
          {runTab.error}
        </section>
      </div>
    );
  }

  if (!runTab.details) {
    return null;
  }

  const run = runTab.details;
  const zoneOptions = Array.from(new Set(run.flattenedBatchRows.map((row) => row.stopZoneId).filter(Boolean))).sort((left, right) => left.localeCompare(right));
  const cartTypeOptions = Array.from(new Set(run.flattenedBatchRows.map((row) => row.cartTypeId).filter(Boolean))).sort((left, right) =>
    left.localeCompare(right)
  );
  const waveOptions = Array.from(new Set(run.flattenedBatchRows.map((row) => row.waveId).filter(Boolean))).sort((left, right) => left.localeCompare(right));
  const normalizedBatchSearch = batchSearch.trim().toLowerCase();
  const visibleBatchRows = [...run.flattenedBatchRows]
    .filter((row) => {
      if (zoneFilter !== "all" && row.stopZoneId !== zoneFilter) {
        return false;
      }
      if (cartTypeFilter !== "all" && row.cartTypeId !== cartTypeFilter) {
        return false;
      }
      if (waveFilter !== "all" && row.waveId !== waveFilter) {
        return false;
      }
      if (!normalizedBatchSearch) {
        return true;
      }
      return [row.batchId, row.taskId, row.orderId].some((value) => value.toLowerCase().includes(normalizedBatchSearch));
    })
    .sort((left, right) => compareBatchRows(left, right, batchSort));
  const filtersActive = normalizedBatchSearch.length > 0 || zoneFilter !== "all" || cartTypeFilter !== "all" || waveFilter !== "all" || batchSort !== null;
  const totalPages = Math.max(1, Math.ceil(run.unselectedTaskCount / run.unselectedTaskPageSize));
  const startIndex = taskPage * run.unselectedTaskPageSize;

  const toggleBatchSort = (key: BatchSortKey) => {
    setBatchSort((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1120px] space-y-4">
      {renderSummaryHeader(run)}

      <section className="app-card p-4 md:p-6">
        <h2 className="font-display text-lg uppercase tracking-[-0.01em]">Request Context</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Request ID</p>
            <p className="mt-1 font-code text-sm">{run.requestContext.requestId}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Response ID</p>
            <p className="mt-1 font-code text-sm">{run.requestContext.responseId}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Job ID</p>
            <p className="mt-1 font-code text-sm">{run.requestContext.jobId}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Facility</p>
            <p className="mt-1 text-sm">{run.requestContext.facilityId}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Requested At</p>
            <p className="mt-1 text-sm">{formatIsoTimestamp(run.requestContext.requestTimestamp)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Response At</p>
            <p className="mt-1 text-sm">{formatIsoTimestamp(run.requestContext.responseTimestamp)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Candidate Tasks</p>
            <p className="mt-1 text-sm">{run.requestContext.candidateTaskCount}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Distinct Orders</p>
            <p className="mt-1 text-sm">{run.requestContext.distinctOrderCount}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="border p-3" style={{ borderColor: "var(--tessera-border)" }}>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Weights</p>
            <p className="mt-2 text-sm">Travel {run.requestContext.weights.travelTime.toFixed(3)}</p>
            <p className="text-sm">Tardiness {run.requestContext.weights.tardiness.toFixed(3)}</p>
            <p className="text-sm">Zone {run.requestContext.weights.zoneBalance.toFixed(3)}</p>
          </div>
          <div className="border p-3" style={{ borderColor: "var(--tessera-border)" }}>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Penalties</p>
            <p className="mt-2 text-sm">Zone Cross {run.requestContext.penalties.zoneCross.toFixed(3)}</p>
            <p className="text-sm">Split Order {run.requestContext.penalties.splitOrder.toFixed(3)}</p>
            <p className="text-sm">Grouping {run.requestContext.penalties.groupingViolation.toFixed(3)}</p>
          </div>
          <div className="border p-3" style={{ borderColor: "var(--tessera-border)" }}>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Limits</p>
            <p className="mt-2 text-sm">Max Batches {run.requestContext.limits.maxBatches}</p>
            <p className="text-sm">Max Tasks/Zone {run.requestContext.limits.maxTasksPerZone}</p>
          </div>
          <div className="border p-3" style={{ borderColor: "var(--tessera-border)" }}>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Blocked / No-Go</p>
            <p className="mt-2 text-sm">No-Go Zones: {run.requestContext.noGoZones.join(", ") || "None"}</p>
            <p className="text-sm">Blocked Aisles: {run.requestContext.blockedAisles.join(", ") || "None"}</p>
            <p className="text-sm">Blocked Terminals: {run.requestContext.blockedTerminals.join(", ") || "None"}</p>
          </div>
        </div>
        <div className="mt-4 border p-3" style={{ borderColor: "var(--tessera-border)" }}>
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Available Carts</p>
          <p className="mt-2 text-sm">
            {run.requestContext.availableCarts.map((cart) => `${cart.cartTypeId} x${cart.count}`).join(" · ")}
          </p>
        </div>
      </section>

      <section className="app-card p-4 md:p-6">
        <h2 className="font-display text-lg uppercase tracking-[-0.01em]">Solution Metrics</h2>
        <div className="mt-3 overflow-auto border" style={{ borderColor: "var(--tessera-border)" }}>
          <table className="min-w-full border-collapse text-sm">
            <tbody>
              <tr>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Total Travel</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{run.solutionMetrics.totalDistance}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Total Duration</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{formatSeconds(run.solutionMetrics.totalDuration)}</td>
              </tr>
              <tr>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Total Tardiness</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{run.solutionMetrics.totalTardiness}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Late Orders</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{run.solutionMetrics.nLateOrders}</td>
              </tr>
              <tr>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Batches</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{run.solutionMetrics.nBatches}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Selected Tasks</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{run.solutionMetrics.nSelectedTasks}</td>
              </tr>
              <tr>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Unselected Tasks</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{run.solutionMetrics.nUnselectedTasks}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Max Zone Load</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{run.solutionMetrics.maxZoneLoad}</td>
              </tr>
              <tr>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Zone Crossings</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{run.solutionMetrics.nZoneCrossings}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Split Orders</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{run.solutionMetrics.nSplitOrders}</td>
              </tr>
              <tr>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Grouping Violations</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{run.solutionMetrics.nGroupingViolations}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Priority Alignment</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{Math.round(run.solutionMetrics.priorityAlignment * 100)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-2" style={{ color: "var(--tessera-text-secondary)" }}>Batch Duration Balance</td>
                <td className="px-3 py-2">{run.solutionMetrics.batchDurationBalance.toFixed(2)}</td>
                <td className="px-3 py-2" style={{ color: "var(--tessera-text-secondary)" }}>Batch Distance Balance</td>
                <td className="px-3 py-2">{run.solutionMetrics.batchDistanceBalance.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="app-card p-4 md:p-6">
        <h2 className="font-display text-lg uppercase tracking-[-0.01em]">Batches</h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="min-w-[220px] flex-1">
            <span className="mb-1 block text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Search IDs
            </span>
            <input
              type="search"
              value={batchSearch}
              onChange={(event) => setBatchSearch(event.target.value)}
              placeholder="Batch, task, or order"
              className="w-full border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)", color: "var(--tessera-text-primary)" }}
            />
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Stop Zone
            </span>
            <select
              value={zoneFilter}
              onChange={(event) => setZoneFilter(event.target.value)}
              className="border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)", color: "var(--tessera-text-primary)" }}
            >
              <option value="all">All</option>
              {zoneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Cart Type
            </span>
            <select
              value={cartTypeFilter}
              onChange={(event) => setCartTypeFilter(event.target.value)}
              className="border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)", color: "var(--tessera-text-primary)" }}
            >
              <option value="all">All</option>
              {cartTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Wave
            </span>
            <select
              value={waveFilter}
              onChange={(event) => setWaveFilter(event.target.value)}
              className="border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)", color: "var(--tessera-text-primary)" }}
            >
              <option value="all">All</option>
              {waveOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          {filtersActive ? (
            <button
              type="button"
              className="btn-secondary px-3 py-2 text-sm"
              onClick={() => {
                setBatchSearch("");
                setZoneFilter("all");
                setCartTypeFilter("all");
                setWaveFilter("all");
                setBatchSort(null);
              }}
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          {visibleBatchRows.length} visible rows
        </div>
        <div className="mt-3 overflow-auto border" style={{ borderColor: "var(--tessera-border)" }}>
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                {batchColumnDefs.map((column) => {
                  const columnKey = column.key;
                  return (
                    <th key={column.label} className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                      {columnKey ? (
                        <button type="button" className="whitespace-nowrap text-left" onClick={() => toggleBatchSort(columnKey)} style={{ color: "inherit" }}>
                          {column.label}
                          {getSortLabel(columnKey, batchSort)}
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visibleBatchRows.length === 0 ? (
                <tr>
                  <td colSpan={batchColumnDefs.length} className="px-3 py-6 text-center" style={{ color: "var(--tessera-text-secondary)" }}>
                    No rows match the current search or filters.
                  </td>
                </tr>
              ) : (
                visibleBatchRows.map((row) => (
                  <tr key={row.rowId}>
                    {batchColumnDefs.map((column) => (
                      <td key={`${row.rowId}:${column.label}`} className="border-b px-3 py-2 whitespace-nowrap" style={{ borderColor: "var(--tessera-border)" }}>
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="app-card p-4 md:p-6">
        <h2 className="font-display text-lg uppercase tracking-[-0.01em]">Unselected Tasks</h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          <p>
            Showing {run.unselectedTaskCount === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + taskPageRows.length, run.unselectedTaskCount)} of {run.unselectedTaskCount}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" className="btn-secondary px-3 py-1.5 text-xs" onClick={() => setTaskPage((page) => Math.max(0, page - 1))} disabled={taskPage === 0}>
              Previous
            </button>
            <span>
              Page {taskPage + 1} / {totalPages}
            </span>
            <button
              type="button"
              className="btn-secondary px-3 py-1.5 text-xs"
              onClick={() => setTaskPage((page) => Math.min(totalPages - 1, page + 1))}
              disabled={taskPage >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
        {taskPageLoading ? (
          <div className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            Loading task page...
          </div>
        ) : null}
        {taskPageError ? (
          <div className="mt-3 text-sm" style={{ color: "var(--tessera-danger)" }}>
            {taskPageError}
          </div>
        ) : null}
        <div className="mt-3 overflow-auto border" style={{ borderColor: "var(--tessera-border)" }}>
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Task</th>
                <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {taskPageRows.map((task, index) => (
                <tr key={`${startIndex + index}-${task.taskId}`}>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{task.taskId}</td>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{task.reasonCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

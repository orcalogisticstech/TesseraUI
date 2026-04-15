"use client";

import { formatTradeoffLabel } from "@/lib/heartbeat-recordings-shared";
import type { HeartbeatRunDetails, HeartbeatRunSummary } from "@/lib/app-types";
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

  useEffect(() => {
    setTaskPage(0);
  }, [runTab.summary.requestId, runTab.summary.tradeoffLabel]);

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
  const totalPages = Math.max(1, Math.ceil(run.unselectedTaskCount / UNSELECTED_TASKS_PAGE_SIZE));
  const startIndex = taskPage * UNSELECTED_TASKS_PAGE_SIZE;
  const pageTasks = run.unselectedTasks.slice(startIndex, startIndex + UNSELECTED_TASKS_PAGE_SIZE);

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
        <div className="mt-3 overflow-auto border" style={{ borderColor: "var(--tessera-border)" }}>
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                {[
                  "Batch",
                  "Rank",
                  "Priority Score",
                  "Cart Type",
                  "Wave",
                  "Zones",
                  "Route Distance",
                  "Route Duration",
                  "Route Crossings",
                  "Tasks",
                  "Orders"
                ].map((header) => (
                  <th key={header} className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {run.batches.map((batch) => (
                <tr key={batch.batchId}>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{batch.batchId}</td>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{batch.priorityRank}</td>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{batch.priorityScore.toFixed(2)}</td>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{batch.cartTypeId}</td>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{batch.waveId}</td>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{batch.zones.join(", ")}</td>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{batch.route.distance}</td>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{formatSeconds(batch.route.duration)}</td>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{batch.route.nZoneCrossings}</td>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{batch.taskIds.join(", ")}</td>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{batch.orderIds.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="app-card p-4 md:p-6">
        <h2 className="font-display text-lg uppercase tracking-[-0.01em]">Unselected Tasks</h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          <p>
            Showing {startIndex + 1}-{Math.min(startIndex + pageTasks.length, run.unselectedTaskCount)} of {run.unselectedTaskCount}
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
        <div className="mt-3 overflow-auto border" style={{ borderColor: "var(--tessera-border)" }}>
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Task</th>
                <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {pageTasks.map((task, index) => (
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

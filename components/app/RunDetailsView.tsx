"use client";

import type { HeartbeatRunDetails } from "@/lib/app-types";

type RunDetailsViewProps = {
  run: HeartbeatRunDetails;
};

const strategyLabelMap: Record<string, string> = {
  primary: "Tess's Choice",
  minimize_travel: "Minimize Travel",
  zero_late_risk: "Zero Late Risk",
  balance_zones: "Balance Zones",
  maximize_throughput: "Throughput Push"
};

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

function formatStrategyLabel(label: string) {
  return strategyLabelMap[label] ?? label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RunDetailsView({ run }: RunDetailsViewProps) {
  return (
    <div className="mx-auto w-full max-w-[1120px] space-y-4">
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
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Posture</p>
            <p className="mt-1 text-sm">{run.postureName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Strategy</p>
            <p className="mt-1 text-sm">{formatStrategyLabel(run.tradeoffLabel)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Solve Time</p>
            <p className="mt-1 text-sm">{run.computationTime.toFixed(1)}s</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Workflow</p>
            <p className="mt-1 text-sm">{formatWorkflow(run.workflow)}</p>
          </div>
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
        <div className="mt-3 overflow-auto border" style={{ borderColor: "var(--tessera-border)" }}>
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Task</th>
                <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {run.unselectedTasks.map((task) => (
                <tr key={task.taskId}>
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

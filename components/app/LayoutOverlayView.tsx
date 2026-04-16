"use client";

import { LayoutCanvas } from "@/components/app/layout/LayoutCanvas";
import {
  type LayoutGraphData,
  type LayoutOverlayBatch,
  type LayoutOverlayStop
} from "@/components/app/layout/layout-types";
import { useLayoutGraphData } from "@/components/app/layout/useLayoutGraphData";
import type { HeartbeatRunDetails, WorkspaceTabId } from "@/lib/app-types";
import { formatTradeoffLabel } from "@/lib/heartbeat-recordings-shared";
import { useEffect, useMemo, useRef, useState } from "react";

const BATCH_COLORS = [
  "#1f77b4",
  "#8fbce6",
  "#ff7f0e",
  "#f2a65a",
  "#2ca02c",
  "#86cf86",
  "#d62728",
  "#f5a4a4",
  "#9467bd",
  "#b8a4d6",
  "#8c564b",
  "#c49c94",
  "#17becf",
  "#9edae5",
  "#bcbd22",
  "#dbdb8d",
  "#7f7f7f",
  "#c7c7c7",
  "#e377c2",
  "#f7b6d2"
];

type LayoutOverlayViewProps = {
  tabId: WorkspaceTabId;
  runTab: {
    summary: { runId: string; requestLabel: string; tradeoffLabel: string; timestamp: string };
    details: HeartbeatRunDetails | null;
    loading: boolean;
    error: string | null;
    selectedBatchIds: string[];
  };
  onSelectedBatchIdsChange: (tabId: WorkspaceTabId, batchIds: string[]) => void;
};

function formatIsoTimestamp(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });
}

function buildAdjacency(edges: LayoutGraphData["edges"], undirected: boolean) {
  const adjacency = new Map<string, string[]>();

  const addEdge = (source: string, target: string) => {
    const existing = adjacency.get(source);
    if (!existing) {
      adjacency.set(source, [target]);
      return;
    }
    existing.push(target);
  };

  for (const edge of edges) {
    addEdge(edge.source, edge.target);
    if (undirected) {
      addEdge(edge.target, edge.source);
    }
  }

  return adjacency;
}

function shortestPath(start: string, end: string, adjacency: Map<string, string[]>) {
  if (start === end) {
    return [start];
  }

  const queue: string[] = [start];
  const visited = new Set<string>([start]);
  const previous = new Map<string, string>();
  let cursor = 0;

  while (cursor < queue.length) {
    const current = queue[cursor];
    cursor += 1;
    const neighbors = adjacency.get(current);
    if (!neighbors) {
      continue;
    }

    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) {
        continue;
      }
      visited.add(neighbor);
      previous.set(neighbor, current);
      if (neighbor === end) {
        const path: string[] = [end];
        let node = end;
        while (previous.has(node)) {
          node = previous.get(node)!;
          path.push(node);
        }
        path.reverse();
        return path;
      }
      queue.push(neighbor);
    }
  }

  return null;
}

function resolveBatchOverlay({
  runDetails,
  layoutData,
  selectedBatchIds
}: {
  runDetails: HeartbeatRunDetails;
  layoutData: LayoutGraphData;
  selectedBatchIds: Set<string>;
}) {
  const nodeById = new Map(layoutData.nodes.map((node) => [node.id, node]));
  const locationToNodeId = new Map<string, string>();
  for (const node of layoutData.nodes) {
    if (node.sourceLocationId && !locationToNodeId.has(node.sourceLocationId)) {
      locationToNodeId.set(node.sourceLocationId, node.id);
    }
  }

  const allBatchIds = runDetails.batches.map((batch) => batch.batchId);
  const colorByBatchId = new Map(allBatchIds.map((batchId, index) => [batchId, BATCH_COLORS[index % BATCH_COLORS.length]]));
  const selectedBatches = runDetails.batches.filter((batch) => selectedBatchIds.has(batch.batchId));
  const directedAdjacency = buildAdjacency(layoutData.edges, false);
  const undirectedAdjacency = buildAdjacency(layoutData.edges, true);
  const pathCache = new Map<string, string[] | null>();
  const warningSet = new Set<string>();

  const getPath = (source: string, target: string) => {
    const cacheKey = `${source}->${target}`;
    const cached = pathCache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const directedPath = shortestPath(source, target, directedAdjacency);
    if (directedPath) {
      pathCache.set(cacheKey, directedPath);
      return directedPath;
    }

    const fallbackPath = shortestPath(source, target, undirectedAdjacency);
    pathCache.set(cacheKey, fallbackPath);
    return fallbackPath;
  };

  const overlayBatches: LayoutOverlayBatch[] = selectedBatches.map((batch) => {
    const mappedStops: string[] = [];
    const stops: LayoutOverlayStop[] = [];
    for (const stop of batch.sequence) {
      const mappedNodeId = locationToNodeId.get(stop.locationId) ?? (nodeById.has(stop.locationId) ? stop.locationId : null);
      if (!mappedNodeId) {
        warningSet.add(`Batch ${batch.batchId}: missing layout node for stop ${stop.locationId}.`);
        continue;
      }
      mappedStops.push(mappedNodeId);
      const detail = runDetails.taskDetails[stop.taskId];
      stops.push({
        nodeId: mappedNodeId,
        taskId: stop.taskId,
        locationId: stop.locationId,
        zoneId: stop.zoneId,
        orderId: detail?.orderId ?? "Unknown",
        skuId: detail?.skuId ?? null,
        quantity: detail?.quantity ?? null,
        skuWeight: detail?.skuWeight ?? null
      });
    }

    const startNodeId = batch.route.startNodeId && nodeById.has(batch.route.startNodeId) ? batch.route.startNodeId : null;
    const endNodeId = batch.route.endNodeId && nodeById.has(batch.route.endNodeId) ? batch.route.endNodeId : null;

    if (batch.route.startNodeId && !startNodeId) {
      warningSet.add(`Batch ${batch.batchId}: start node ${batch.route.startNodeId} was not found in layout.`);
    }
    if (batch.route.endNodeId && !endNodeId) {
      warningSet.add(`Batch ${batch.batchId}: end node ${batch.route.endNodeId} was not found in layout.`);
    }

    const orderedNodes = [startNodeId, ...mappedStops, endNodeId].filter((value): value is string => value !== null);
    const edgePairs: Array<{ sourceId: string; targetId: string }> = [];

    for (let index = 1; index < orderedNodes.length; index += 1) {
      const sourceNodeId = orderedNodes[index - 1];
      const targetNodeId = orderedNodes[index];
      if (sourceNodeId === targetNodeId) {
        continue;
      }
      const path = getPath(sourceNodeId, targetNodeId);
      if (!path || path.length < 2) {
        warningSet.add(`Batch ${batch.batchId}: no path found from ${sourceNodeId} to ${targetNodeId}.`);
        continue;
      }
      for (let pathIndex = 1; pathIndex < path.length; pathIndex += 1) {
        edgePairs.push({ sourceId: path[pathIndex - 1], targetId: path[pathIndex] });
      }
    }

    return {
      batchId: batch.batchId,
      color: colorByBatchId.get(batch.batchId) ?? "#1f77b4",
      edgePairs,
      stopNodeIds: mappedStops,
      stops,
      startNodeId,
      endNodeId
    };
  });

  return {
    overlayBatches,
    warnings: Array.from(warningSet.values())
  };
}

export function LayoutOverlayView({ tabId, runTab, onSelectedBatchIdsChange }: LayoutOverlayViewProps) {
  const { data: layoutData, error: layoutError, loading: layoutLoading } = useLayoutGraphData("demo_layout_1_v1");
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
  const [batchSearch, setBatchSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const runDetails = runTab.details;

  useEffect(() => {
    if (!batchDropdownOpen) {
      return;
    }

    const onDocumentMouseDown = (event: MouseEvent) => {
      if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
        setBatchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentMouseDown);
    return () => {
      document.removeEventListener("mousedown", onDocumentMouseDown);
    };
  }, [batchDropdownOpen]);

  const allBatchIds = runDetails?.batches.map((batch) => batch.batchId) ?? [];
  const selectedBatchIds = runTab.selectedBatchIds;
  const sortedSelectedBatchIds = [...selectedBatchIds].sort((left, right) => left.localeCompare(right));
  const filteredBatchIds = allBatchIds.filter((batchId) => batchId.toLowerCase().includes(batchSearch.trim().toLowerCase()));

  const { overlayBatches, warnings } = useMemo(() => {
    if (!runDetails || !layoutData) {
      return { overlayBatches: [] as LayoutOverlayBatch[], warnings: [] as string[] };
    }
    return resolveBatchOverlay({
      runDetails,
      layoutData,
      selectedBatchIds: new Set(selectedBatchIds)
    });
  }, [runDetails, layoutData, selectedBatchIds]);

  const colorByBatchId = useMemo(
    () => new Map(allBatchIds.map((batchId, index) => [batchId, BATCH_COLORS[index % BATCH_COLORS.length]])),
    [allBatchIds]
  );

  const selectAllBatches = () => {
    onSelectedBatchIdsChange(tabId, allBatchIds);
  };

  const clearBatches = () => {
    onSelectedBatchIdsChange(tabId, []);
  };

  const toggleBatch = (batchId: string) => {
    const next = new Set(selectedBatchIds);
    if (next.has(batchId)) {
      next.delete(batchId);
    } else {
      next.add(batchId);
    }
    onSelectedBatchIdsChange(tabId, [...next]);
  };

  const renderError = runTab.error || layoutError;
  const isLoading = runTab.loading || layoutLoading;
  const runSummaryLabel = `${runTab.summary.runId} · ${formatTradeoffLabel(runTab.summary.tradeoffLabel)}`;
  const overlayEmptyMessage =
    selectedBatchIds.length === 0
      ? "No batches selected. Use the batch picker to choose one or more batches."
      : overlayBatches.length === 0
        ? "No overlay route segments available for the current selection."
        : null;

  const batchControls =
    !renderError && !isLoading && runDetails && layoutData ? (
      <div className="mt-5 space-y-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {/* Batch picker */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="btn-secondary flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-[0.08em]"
              onClick={() => setBatchDropdownOpen((current) => !current)}
            >
              <span>Batches: {selectedBatchIds.length} selected</span>
              <span aria-hidden="true">{batchDropdownOpen ? "▲" : "▼"}</span>
            </button>

            {batchDropdownOpen ? (
              <div
                className="absolute left-0 top-full z-20 mt-2 w-[320px] border p-3"
                style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)" }}
              >
                <input
                  type="search"
                  value={batchSearch}
                  onChange={(event) => setBatchSearch(event.target.value)}
                  placeholder="Search batch ID"
                  className="w-full border px-2 py-1 text-sm outline-none"
                  style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-page)", color: "var(--tessera-text-primary)" }}
                />
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" className="btn-secondary px-2 py-1 text-[11px] uppercase tracking-[0.08em]" onClick={selectAllBatches}>
                    Select all
                  </button>
                  <button type="button" className="btn-secondary px-2 py-1 text-[11px] uppercase tracking-[0.08em]" onClick={clearBatches}>
                    Clear
                  </button>
                </div>
                <div className="mt-3 max-h-[240px] overflow-auto border p-2" style={{ borderColor: "var(--tessera-border)" }}>
                  {filteredBatchIds.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                      No batches match.
                    </p>
                  ) : (
                    filteredBatchIds.map((batchId) => (
                      <label key={batchId} className="mb-1 flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedBatchIds.includes(batchId)}
                          onChange={() => toggleBatch(batchId)}
                          className="h-4 w-4"
                        />
                        <span className="inline-block h-2.5 w-2.5" style={{ background: colorByBatchId.get(batchId) ?? "#1f77b4" }} />
                        <span className="font-code">{batchId}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Marker legend */}
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <polygon points="6,1 1,11 11,11" fill="var(--tessera-text-secondary)" />
              </svg>
              <span>Start</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
                <rect x="0.5" y="0.5" width="10" height="10" fill="var(--tessera-text-secondary)" />
              </svg>
              <span>End</span>
            </div>
          </div>

          {/* Batch colors */}
          {sortedSelectedBatchIds.length > 0 ? (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {sortedSelectedBatchIds.map((batchId) => (
                <span key={batchId} className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5" style={{ background: colorByBatchId.get(batchId) ?? "#1f77b4" }} />
                  <span className="font-code" style={{ color: "var(--tessera-text-secondary)" }}>
                    {batchId}
                  </span>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {warnings.length > 0 ? (
          <div className="border p-3 text-sm" style={{ borderColor: "var(--tessera-border)" }}>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Overlay Warnings ({warnings.length})
            </p>
            <ul className="mt-2 list-disc pl-5">
              {warnings.slice(0, 8).map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
            {warnings.length > 8 ? (
              <p className="mt-2 text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
                Showing first 8 warnings.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    ) : null;

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl uppercase tracking-[-0.01em]">Solution · Layout View</h1>
          <p className="font-code text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            {runSummaryLabel}
          </p>
        </div>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Request
            </p>
            <p className="mt-1">{runTab.summary.requestLabel}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Run ID
            </p>
            <p className="mt-1 font-code text-sm">{runTab.summary.runId}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Strategy
            </p>
            <p className="mt-1">{formatTradeoffLabel(runTab.summary.tradeoffLabel)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Selected Batches
            </p>
            <p className="mt-1">
              {selectedBatchIds.length} / {allBatchIds.length}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Recorded At
            </p>
            <p className="mt-1">{formatIsoTimestamp(runTab.summary.timestamp)}</p>
          </div>
        </div>
      </section>

      {renderError ? (
        <section className="app-card p-4 md:p-6">
          <p className="text-sm" style={{ color: "var(--tessera-danger)" }}>
            {renderError}
          </p>
        </section>
      ) : null}

      {isLoading ? (
        <section className="app-card p-4 md:p-6">
          <p className="text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            Loading run details and layout graph...
          </p>
        </section>
      ) : null}

      {!renderError && !isLoading && layoutData ? (
        <LayoutCanvas
          title={layoutData.metadata.layout_version}
          data={layoutData}
          overlayBatches={overlayBatches}
          canvasNotice={overlayEmptyMessage}
          batchControls={batchControls}
        />
      ) : null}
    </div>
  );
}

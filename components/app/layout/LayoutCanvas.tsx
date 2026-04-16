"use client";

import {
  BASE_EDGE_COLOR,
  DEFAULT_NODE_COLOR,
  NODE_TYPE_COLORS,
  type LayoutGraphData,
  type LayoutOverlayBatch
} from "@/components/app/layout/layout-types";
import { useEffect, useMemo, useState } from "react";

const PADDING = 2;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM = 1;
const INSPECTOR_GUTTER = 28;
const INSPECTOR_WIDTH_EXPANDED = 320;

function formatInt(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatNullable(value: string | number | null) {
  if (value === null) {
    return "-";
  }
  return String(value);
}

type LayoutCanvasProps = {
  title: string;
  data: LayoutGraphData;
  overlayBatches?: LayoutOverlayBatch[];
  canvasNotice?: string | null;
  topRightLabel?: string;
};

export function LayoutCanvas({ title, data, overlayBatches = [], canvasNotice = null, topRightLabel }: LayoutCanvasProps) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [enabledNodeTypes, setEnabledNodeTypes] = useState<Set<string>>(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const geometry = useMemo(() => {
    const width = data.bounds.maxX - data.bounds.minX + PADDING * 2;
    const height = data.bounds.maxY - data.bounds.minY + PADDING * 2;
    const nodeLookup = new Map(data.nodes.map((node) => [node.id, node]));

    return {
      width,
      height,
      toSvgX: (x: number) => x - data.bounds.minX + PADDING,
      toSvgY: (y: number) => data.bounds.maxY - y + PADDING,
      nodeLookup
    };
  }, [data]);

  const nodeTypes = useMemo(
    () => Object.keys(data.nodeTypeCounts).sort((left, right) => left.localeCompare(right)),
    [data.nodeTypeCounts]
  );

  useEffect(() => {
    if (!nodeTypes.length) {
      return;
    }
    setEnabledNodeTypes(new Set(nodeTypes));
    setZoom(DEFAULT_ZOOM);
  }, [nodeTypes]);

  const visibleNodes = useMemo(() => {
    if (enabledNodeTypes.size === 0) {
      return [] as LayoutGraphData["nodes"];
    }
    return data.nodes.filter((node) => enabledNodeTypes.has(node.type));
  }, [data.nodes, enabledNodeTypes]);

  const allNodesById = useMemo(() => new Map(data.nodes.map((node) => [node.id, node])), [data.nodes]);
  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);

  useEffect(() => {
    if (!selectedNodeId) {
      return;
    }
    if (!visibleNodeIds.has(selectedNodeId)) {
      setSelectedNodeId(null);
    }
  }, [selectedNodeId, visibleNodeIds]);

  const selectedNode = selectedNodeId ? allNodesById.get(selectedNodeId) ?? null : null;
  const inspectorWidth = INSPECTOR_WIDTH_EXPANDED;
  const inspectorReserve = INSPECTOR_WIDTH_EXPANDED + INSPECTOR_GUTTER * 2;
  const zoomPercent = Math.round(zoom * 100);

  const resetView = () => {
    if (!nodeTypes.length) {
      return;
    }
    setZoom(DEFAULT_ZOOM);
    setEnabledNodeTypes(new Set(nodeTypes));
    setSelectedNodeId(null);
  };

  const enableAllTypes = () => {
    setEnabledNodeTypes(new Set(nodeTypes));
  };

  const disableAllTypes = () => {
    setEnabledNodeTypes(new Set());
  };

  const toggleNodeType = (nodeType: string) => {
    setEnabledNodeTypes((current) => {
      const next = new Set(current);
      if (next.has(nodeType)) {
        next.delete(nodeType);
      } else {
        next.add(nodeType);
      }
      return next;
    });
  };

  const zoomOut = () => {
    setZoom((current) => Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2))));
  };

  const zoomIn = () => {
    setZoom((current) => Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2))));
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-display text-2xl uppercase tracking-[-0.01em]">{title}</h1>
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            {topRightLabel ?? data.metadata.layout_version}
          </p>
        </div>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-4">
          <p style={{ color: "var(--tessera-text-secondary)" }}>
            Nodes: <span style={{ color: "var(--tessera-text-primary)" }}>{formatInt(visibleNodes.length)}</span>
            <span style={{ color: "var(--tessera-text-secondary)" }}> / {formatInt(data.nodes.length)}</span>
          </p>
          <p style={{ color: "var(--tessera-text-secondary)" }}>
            Edges: <span style={{ color: "var(--tessera-text-primary)" }}>{formatInt(data.edges.length)}</span>
          </p>
          <p style={{ color: "var(--tessera-text-secondary)" }}>
            Pick Nodes: <span style={{ color: "var(--tessera-text-primary)" }}>{formatInt(data.metadata.pick_node_count)}</span>
          </p>
          <p style={{ color: "var(--tessera-text-secondary)" }}>
            Overlay Batches: <span style={{ color: "var(--tessera-text-primary)" }}>{formatInt(overlayBatches.length)}</span>
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center border text-sm"
            style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Zoom out"
            title="Zoom out"
          >
            -
          </button>
          <p className="w-14 text-center text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            {zoomPercent}%
          </p>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center border text-sm"
            style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Zoom in"
            title="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center border px-3 text-xs uppercase tracking-[0.08em]"
            style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}
            onClick={resetView}
          >
            Reset
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center border px-3 text-xs uppercase tracking-[0.08em]"
            style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}
            onClick={enableAllTypes}
          >
            All
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center border px-3 text-xs uppercase tracking-[0.08em]"
            style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}
            onClick={disableAllTypes}
          >
            None
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-xs">
          {Object.entries(data.nodeTypeCounts)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([nodeType, count]) => {
              const active = enabledNodeTypes.has(nodeType);
              return (
                <button
                  key={nodeType}
                  type="button"
                  onClick={() => toggleNodeType(nodeType)}
                  className="inline-flex items-center gap-2 border px-3 py-1"
                  style={{
                    borderColor: active ? "var(--tessera-accent-signal)" : "var(--tessera-border)",
                    color: active ? "var(--tessera-text-primary)" : "var(--tessera-text-secondary)",
                    opacity: active ? 1 : 0.58,
                    background: active ? "color-mix(in srgb, var(--tessera-accent-signal) 10%, transparent)" : "transparent"
                  }}
                  aria-pressed={active}
                  title={`Toggle ${nodeType}`}
                >
                  <span className="h-2.5 w-2.5" style={{ background: NODE_TYPE_COLORS[nodeType] ?? DEFAULT_NODE_COLOR }} aria-hidden="true" />
                  {nodeType} ({formatInt(count)})
                </button>
              );
            })}
        </div>
      </section>

      <section className="app-card p-2 md:p-3">
        <div className="relative h-[70vh] border" style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-page)" }}>
          <div className="h-full overflow-auto" style={{ paddingRight: `${inspectorReserve}px` }}>
            <div
              style={{
                width: `${zoom * 100}%`
              }}
            >
              <svg
                role="img"
                aria-label="Warehouse layout graph"
                className="block h-auto w-full"
                viewBox={`0 0 ${geometry.width} ${geometry.height}`}
                preserveAspectRatio="xMidYMid meet"
                onClick={() => setSelectedNodeId(null)}
              >
                <g data-layer="base-edges">
                  {data.edges.map((edge, index) => {
                    const sourceNode = geometry.nodeLookup.get(edge.source);
                    const targetNode = geometry.nodeLookup.get(edge.target);
                    if (!sourceNode || !targetNode) {
                      return null;
                    }
                    return (
                      <line
                        key={`${edge.source}-${edge.target}-${index}`}
                        x1={geometry.toSvgX(sourceNode.x)}
                        y1={geometry.toSvgY(sourceNode.y)}
                        x2={geometry.toSvgX(targetNode.x)}
                        y2={geometry.toSvgY(targetNode.y)}
                        stroke={BASE_EDGE_COLOR}
                        strokeWidth={0.08}
                        strokeOpacity={0.6}
                      />
                    );
                  })}
                </g>

                <g data-layer="base-nodes">
                  {visibleNodes.map((node) => (
                    <circle
                      key={node.id}
                      cx={geometry.toSvgX(node.x)}
                      cy={geometry.toSvgY(node.y)}
                      r={selectedNodeId === node.id ? 0.24 : 0.14}
                      fill={NODE_TYPE_COLORS[node.type] ?? DEFAULT_NODE_COLOR}
                      fillOpacity={0.92}
                      stroke={selectedNodeId === node.id ? "var(--tessera-accent-signal)" : "none"}
                      strokeWidth={selectedNodeId === node.id ? 0.08 : 0}
                      style={{ cursor: "pointer" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedNodeId((current) => (current === node.id ? null : node.id));
                      }}
                    />
                  ))}
                </g>

                <g data-layer="overlay-routes">
                  {overlayBatches.flatMap((batch) =>
                    batch.edgePairs.map((edge, edgeIndex) => {
                      const sourceNode = geometry.nodeLookup.get(edge.sourceId);
                      const targetNode = geometry.nodeLookup.get(edge.targetId);
                      if (!sourceNode || !targetNode) {
                        return null;
                      }
                      return (
                        <line
                          key={`${batch.batchId}:${edge.sourceId}:${edge.targetId}:${edgeIndex}`}
                          x1={geometry.toSvgX(sourceNode.x)}
                          y1={geometry.toSvgY(sourceNode.y)}
                          x2={geometry.toSvgX(targetNode.x)}
                          y2={geometry.toSvgY(targetNode.y)}
                          stroke={batch.color}
                          strokeWidth={0.2}
                          strokeOpacity={0.95}
                        />
                      );
                    })
                  )}
                </g>

                <g data-layer="overlay-markers">
                  {overlayBatches.flatMap((batch) =>
                    batch.stopNodeIds.map((stopNodeId, stopIndex) => {
                      const node = geometry.nodeLookup.get(stopNodeId);
                      if (!node) {
                        return null;
                      }
                      return (
                        <circle
                          key={`${batch.batchId}:stop:${stopNodeId}:${stopIndex}`}
                          cx={geometry.toSvgX(node.x)}
                          cy={geometry.toSvgY(node.y)}
                          r={0.28}
                          fill={batch.color}
                          stroke="#222222"
                          strokeWidth={0.05}
                          fillOpacity={0.98}
                        />
                      );
                    })
                  )}
                  {overlayBatches.map((batch) => {
                    if (!batch.startNodeId) {
                      return null;
                    }
                    const node = geometry.nodeLookup.get(batch.startNodeId);
                    if (!node) {
                      return null;
                    }
                    const cx = geometry.toSvgX(node.x);
                    const cy = geometry.toSvgY(node.y);
                    return (
                      <polygon
                        key={`${batch.batchId}:start`}
                        points={`${cx},${cy - 0.56} ${cx - 0.46},${cy + 0.38} ${cx + 0.46},${cy + 0.38}`}
                        fill={batch.color}
                        stroke="#111111"
                        strokeWidth={0.05}
                        fillOpacity={0.98}
                      />
                    );
                  })}
                  {overlayBatches.map((batch) => {
                    if (!batch.endNodeId) {
                      return null;
                    }
                    const node = geometry.nodeLookup.get(batch.endNodeId);
                    if (!node) {
                      return null;
                    }
                    const cx = geometry.toSvgX(node.x);
                    const cy = geometry.toSvgY(node.y);
                    const side = 0.9;
                    return (
                      <rect
                        key={`${batch.batchId}:end`}
                        x={cx - side / 2}
                        y={cy - side / 2}
                        width={side}
                        height={side}
                        fill={batch.color}
                        stroke="#111111"
                        strokeWidth={0.05}
                        fillOpacity={0.98}
                      />
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          <aside
            className="absolute top-3 border p-3"
            style={{
              right: `${INSPECTOR_GUTTER}px`,
              width: `${inspectorWidth}px`,
              borderColor: "var(--tessera-border)",
              background: "color-mix(in srgb, var(--tessera-bg-surface) 92%, transparent)",
              backdropFilter: "blur(6px)"
            }}
          >
            {selectedNode ? (
              <>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
                    Node Inspector
                  </p>
                  <button
                    type="button"
                    className="border px-2 py-1 text-[11px] uppercase tracking-[0.08em]"
                    style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}
                    onClick={() => setSelectedNodeId(null)}
                  >
                    Clear
                  </button>
                </div>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                  <dt style={{ color: "var(--tessera-text-secondary)" }}>Node ID</dt>
                  <dd className="font-code" style={{ color: "var(--tessera-text-primary)" }}>
                    {selectedNode.id}
                  </dd>
                  <dt style={{ color: "var(--tessera-text-secondary)" }}>Node Type</dt>
                  <dd>{selectedNode.type}</dd>
                  <dt style={{ color: "var(--tessera-text-secondary)" }}>Zone</dt>
                  <dd>{formatNullable(selectedNode.zoneId)}</dd>
                  <dt style={{ color: "var(--tessera-text-secondary)" }}>Aisle</dt>
                  <dd>{formatNullable(selectedNode.aisle)}</dd>
                  <dt style={{ color: "var(--tessera-text-secondary)" }}>Location Type</dt>
                  <dd>{formatNullable(selectedNode.locationType)}</dd>
                  <dt style={{ color: "var(--tessera-text-secondary)" }}>Source Location</dt>
                  <dd>{formatNullable(selectedNode.sourceLocationId)}</dd>
                  <dt style={{ color: "var(--tessera-text-secondary)" }}>Bay</dt>
                  <dd>{formatNullable(selectedNode.bay)}</dd>
                  <dt style={{ color: "var(--tessera-text-secondary)" }}>Side</dt>
                  <dd>{formatNullable(selectedNode.side)}</dd>
                  <dt style={{ color: "var(--tessera-text-secondary)" }}>Level</dt>
                  <dd>{formatNullable(selectedNode.level)}</dd>
                  <dt style={{ color: "var(--tessera-text-secondary)" }}>Position</dt>
                  <dd>{formatNullable(selectedNode.position)}</dd>
                  <dt style={{ color: "var(--tessera-text-secondary)" }}>Coordinates</dt>
                  <dd>{`(${selectedNode.x.toFixed(2)}, ${selectedNode.y.toFixed(2)}, ${selectedNode.z?.toFixed(2) ?? "-"})`}</dd>
                </dl>
              </>
            ) : (
              <p className="text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                Select a node to inspect.
              </p>
            )}
          </aside>
        </div>
        {canvasNotice ? (
          <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            {canvasNotice}
          </p>
        ) : null}
      </section>
    </div>
  );
}

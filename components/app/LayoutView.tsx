"use client";

import { useEffect, useMemo, useState } from "react";

type LayoutGraphData = {
  metadata: {
    layout_version: string;
    node_count: number;
    edge_count: number;
    pick_node_count: number;
    staging_node_count: number;
    waypoint_node_count: number;
  };
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  nodeTypeCounts: Record<string, number>;
  nodes: Array<{ id: string; type: string; x: number; y: number }>;
  edges: Array<{ source: string; target: string }>;
};

const NODE_TYPE_COLORS: Record<string, string> = {
  pick: "#c26d00",
  staging: "#005f73",
  aisle_waypoint: "#0a9396",
  aisle_end: "#94d2bd",
  cross_aisle: "#3d405b"
};

const DEFAULT_NODE_COLOR = "#8d99ae";
const BASE_EDGE_COLOR = "#c7d3dd";
const PADDING = 2;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM = 1;

function formatInt(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function LayoutView() {
  const [data, setData] = useState<LayoutGraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [enabledNodeTypes, setEnabledNodeTypes] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError(null);
      try {
        const response = await fetch("/api/layout?layout=demo_layout_1_v1", { cache: "no-store" });
        const payload = (await response.json()) as LayoutGraphData | { error?: string };
        if (!response.ok) {
          throw new Error("error" in payload ? payload.error ?? "Unable to load layout." : "Unable to load layout.");
        }
        if (!cancelled) {
          setData(payload as LayoutGraphData);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load layout.");
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const geometry = useMemo(() => {
    if (!data) {
      return null;
    }

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

  const nodeTypes = useMemo(() => {
    if (!data) {
      return [] as string[];
    }
    return Object.keys(data.nodeTypeCounts).sort((left, right) => left.localeCompare(right));
  }, [data]);

  useEffect(() => {
    if (!nodeTypes.length) {
      return;
    }
    setEnabledNodeTypes(new Set(nodeTypes));
    setZoom(DEFAULT_ZOOM);
  }, [nodeTypes]);

  const visibleNodes = useMemo(() => {
    if (!data) {
      return [] as LayoutGraphData["nodes"];
    }
    if (enabledNodeTypes.size === 0) {
      return [] as LayoutGraphData["nodes"];
    }
    return data.nodes.filter((node) => enabledNodeTypes.has(node.type));
  }, [data, enabledNodeTypes]);

  const zoomPercent = Math.round(zoom * 100);

  const resetView = () => {
    if (!nodeTypes.length) {
      return;
    }
    setZoom(DEFAULT_ZOOM);
    setEnabledNodeTypes(new Set(nodeTypes));
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

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="app-card p-4 md:p-6">
          <h1 className="font-display text-2xl uppercase tracking-[-0.01em]">Layout</h1>
          <p className="mt-3 text-sm" style={{ color: "var(--tessera-danger)" }}>
            {error}
          </p>
        </section>
      </div>
    );
  }

  if (!data || !geometry) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="app-card p-4 md:p-6">
          <h1 className="font-display text-2xl uppercase tracking-[-0.01em]">Layout</h1>
          <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            Loading layout graph...
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-display text-2xl uppercase tracking-[-0.01em]">Layout</h1>
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            {data.metadata.layout_version}
          </p>
        </div>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
          <p style={{ color: "var(--tessera-text-secondary)" }}>
            Nodes: <span style={{ color: "var(--tessera-text-primary)" }}>{formatInt(visibleNodes.length)}</span>
            <span style={{ color: "var(--tessera-text-secondary)" }}> / {formatInt(data.nodes.length)}</span>
          </p>
          <p style={{ color: "var(--tessera-text-secondary)" }}>Edges: <span style={{ color: "var(--tessera-text-primary)" }}>{formatInt(data.edges.length)}</span></p>
          <p style={{ color: "var(--tessera-text-secondary)" }}>Pick Nodes: <span style={{ color: "var(--tessera-text-primary)" }}>{formatInt(data.metadata.pick_node_count)}</span></p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border text-sm"
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
            className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border text-sm"
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
            className="inline-flex h-8 items-center rounded-[10px] border px-3 text-xs uppercase tracking-[0.08em]"
            style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}
            onClick={resetView}
          >
            Reset
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center rounded-[10px] border px-3 text-xs uppercase tracking-[0.08em]"
            style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}
            onClick={enableAllTypes}
          >
            All
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center rounded-[10px] border px-3 text-xs uppercase tracking-[0.08em]"
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
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1"
                  style={{
                    borderColor: active ? "var(--tessera-accent-signal)" : "var(--tessera-border)",
                    color: active ? "var(--tessera-text-primary)" : "var(--tessera-text-secondary)",
                    opacity: active ? 1 : 0.58,
                    background: active ? "color-mix(in srgb, var(--tessera-accent-signal) 10%, transparent)" : "transparent"
                  }}
                  aria-pressed={active}
                  title={`Toggle ${nodeType}`}
                >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_TYPE_COLORS[nodeType] ?? DEFAULT_NODE_COLOR }} aria-hidden="true" />
                {nodeType} ({formatInt(count)})
                </button>
              );
            })}
        </div>
      </section>

      <section className="app-card p-2 md:p-3">
        <div className="h-[70vh] overflow-auto rounded-[10px] border" style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-page)" }}>
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
                  r={0.14}
                  fill={NODE_TYPE_COLORS[node.type] ?? DEFAULT_NODE_COLOR}
                  fillOpacity={0.92}
                />
              ))}
            </g>

            <g data-layer="overlay-routes" />
            <g data-layer="overlay-markers" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}

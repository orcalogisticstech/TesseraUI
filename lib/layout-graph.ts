import { readFile } from "node:fs/promises";
import path from "node:path";

type LayoutMetadata = {
  layout_version: string;
  node_count: number;
  edge_count: number;
  pick_node_count: number;
  staging_node_count: number;
  waypoint_node_count: number;
};

export type LayoutNode = {
  id: string;
  type: string;
  zoneId: string | null;
  aisle: string | null;
  bay: number | null;
  side: string | null;
  level: number | null;
  position: number | null;
  locationType: string | null;
  sourceLocationId: string | null;
  x: number;
  y: number;
  z: number | null;
};

export type LayoutEdge = {
  source: string;
  target: string;
};

export type LayoutGraphData = {
  metadata: LayoutMetadata;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  nodeTypeCounts: Record<string, number>;
  nodes: LayoutNode[];
  edges: LayoutEdge[];
};

export class LayoutLoadError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "LayoutLoadError";
    this.statusCode = statusCode;
  }
}

function normalizeLayoutKey(layoutKey: string) {
  if (!/^[a-zA-Z0-9._-]+$/.test(layoutKey)) {
    throw new LayoutLoadError("Invalid layout key.", 400);
  }
  return layoutKey;
}

export async function loadLayoutGraph(layoutKey: string): Promise<LayoutGraphData> {
  const safeLayoutKey = normalizeLayoutKey(layoutKey);
  const artifactPath = path.join(/* turbopackIgnore: true */ process.cwd(), safeLayoutKey, "layout.render.json");

  try {
    const artifactText = await readFile(artifactPath, "utf-8");
    return JSON.parse(artifactText) as LayoutGraphData;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new LayoutLoadError(`Failed to load layout render artifact: ${message}`, 500);
  }
}

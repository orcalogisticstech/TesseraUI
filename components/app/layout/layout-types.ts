export type LayoutGraphData = {
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
  nodes: Array<{
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
  }>;
  edges: Array<{ source: string; target: string }>;
};

export type LayoutOverlayStop = {
  nodeId: string;
  taskId: string;
  locationId: string;
  zoneId: string;
  orderId: string;
  skuId: string | null;
  quantity: number | null;
  skuWeight: number | null;
};

export type LayoutOverlayBatch = {
  batchId: string;
  color: string;
  edgePairs: Array<{ sourceId: string; targetId: string }>;
  stopNodeIds: string[];
  stops: LayoutOverlayStop[];
  startNodeId: string | null;
  endNodeId: string | null;
};

export const NODE_TYPE_COLORS: Record<string, string> = {
  pick: "#c26d00",
  staging: "#005f73",
  aisle_waypoint: "#0a9396",
  aisle_end: "#94d2bd",
  cross_aisle: "#3d405b"
};

export const DEFAULT_NODE_COLOR = "#8d99ae";
export const BASE_EDGE_COLOR = "#c7d3dd";

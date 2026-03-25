import type { MockSession, UserRole } from "@/lib/mock-auth";

export type SystemMode = "Advisory" | "Closed-Loop";

export type TriggerType = "Heartbeat" | "Batch Completed" | "Rush Order" | "Congestion Alert";

export type DecisionStatus = "Executed" | "Pending" | "Overridden" | "Anomaly";

export type ResponseType = "local-repair" | "partial-reopt" | "full-reopt";

export type ApiName = "Release" | "Batching" | "Prioritize";

export type ZoneStatus = "Active" | "Restricted" | "Blocked";

export type TimeHorizon = "This shift" | "Next 4 hours" | "Until I change it";

export type ObjectiveWeights = {
  deadlineCompliance: number;
  travelEfficiency: number;
  zoneBalance: number;
  congestionMinimization: number;
};

export type ZoneConstraint = {
  zoneId: string;
  zoneName: string;
  maxActiveWork: number;
  status: ZoneStatus;
  reason: string;
};

export type PostureConfig = {
  presetName: string;
  weights: ObjectiveWeights;
  zones: ZoneConstraint[];
  horizon: TimeHorizon;
};

export type WarehouseZone = {
  id: string;
  name: string;
  utilization: number;
  activeWork: number;
  cap: number;
};

export type Order = {
  id: string;
  shipDeadline: string;
  priority: "Low" | "Normal" | "High" | "Critical";
  zones: string[];
  itemCount: number;
  recommendation: "Release" | "Defer";
  reason: string;
  predictedImpact: string;
  locked?: boolean;
};

export type Batch = {
  id: string;
  orderIds: string[];
  pickCount: number;
  primaryZones: string[];
  predictedTravelDelta: number;
  deadlineRisk: "None" | "Low" | "Moderate" | "High";
  zoneDistribution: Array<{ zone: string; share: number }>;
  sequence: string[];
  explanation: string;
  wmsDefaultTravelDelta: number;
};

export type WorkPackage = {
  id: string;
  batchId: string;
  rank: number;
  deadlineProximity: string;
  zone: string;
  score: number;
  reason: string;
};

export type AlternativeMetric = {
  label: string;
  value: string;
  delta: string;
  deltaState: "better" | "worse" | "neutral";
};

export type AlternativePlan = {
  id: string;
  label: string;
  isTessChoice: boolean;
  summary: string;
  metrics: AlternativeMetric[];
};

export type ScenarioConfig = {
  releaseCount: number;
  zoneCaps: Record<string, number>;
  lockedBatches: string[];
  objectiveOverrides: ObjectiveWeights;
};

export type DecisionCycle = {
  id: string;
  timestamp: string;
  triggerType: TriggerType;
  cycleNumber: number;
  mode: SystemMode;
  status: DecisionStatus;
  responseType: ResponseType;
  summary: string;
  metrics: Array<{ label: string; value: string }>;
  apisTouched: ApiName[];
  recommendation: {
    releaseSummary: string;
    batchingSummary: string;
    prioritizeSummary: string;
  };
  operatorAction: string;
  predictedVsActual: {
    throughput: string;
    travel: string;
    lateRisk: string;
  };
  anomalyFlags: string[];
};

export type KpiSnapshot = {
  activeWork: { current: number; cap: number };
  lateRiskOrders: number;
  maxZoneUtilization: number;
  cycleStatus: string;
};

export type IntegrationConfig = {
  platform: "Oracle WMS Cloud" | "SAP EWM" | "Dynamics Business Central" | "Other";
  pollingIntervalSeconds: number;
  eventTriggers: string[];
  status: "Healthy" | "Warning" | "Disconnected";
  readEnabled: boolean;
  writeEnabled: boolean;
};

export type HardConstraints = {
  cutoffWindowHours: number;
  floorCap: number;
  blockedZones: string[];
};

export type AutonomyMatrix = {
  priorityChanges: SystemMode;
  releaseDecisions: SystemMode;
  batchModifications: SystemMode;
};

export type TenantSettings = {
  tenantName: string;
  timezone: string;
  shifts: string[];
  cycleIntervalMinutes: number;
  locationRegex: string;
  routingPoints: string[];
  hardConstraints: HardConstraints;
  integration: IntegrationConfig;
  autonomy: AutonomyMatrix;
};

export type CopilotMessage = {
  id: string;
  actor: "operator" | "tess" | "system";
  text: string;
  grounding?: {
    cycleNumber: number;
    constraintIds: string[];
    metrics: string[];
  };
  viewLink?: { label: string; href: string };
  action?: { label: string; actionId: "open-posture" | "open-explore" | "open-release" };
  metricCards?: Array<{ label: string; value: string }>;
};

export type AppDataBundle = {
  session: MockSession;
  posture: PostureConfig;
  posturePresets: string[];
  kpi: KpiSnapshot;
  zones: WarehouseZone[];
  orders: Order[];
  batches: Batch[];
  workPackages: WorkPackage[];
  cycles: DecisionCycle[];
  alternativesByCycle: Record<string, AlternativePlan[]>;
  scenarioDefaults: ScenarioConfig;
  settings: TenantSettings;
  users: Array<{ id: string; name: string; email: string; role: UserRole }>;
  copilotMessages: CopilotMessage[];
};

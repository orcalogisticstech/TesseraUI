export type SystemMode = "Advisory" | "Write-Back" | "Closed-Loop";

export type TriggerType = "Heartbeat" | "Batch Completed" | "Rush Order" | "Congestion Alert";

export type DecisionStatus = "Executed" | "Pending Review" | "Overridden" | "Anomaly";

export type ApiFilter = "All" | "Release" | "Batching" | "Priority";

export type TriggerFilter = "All" | "Heartbeat" | "Event";

export type StatusFilter = "All" | "Pending" | "Executed" | "Overridden" | "Anomaly";

export type DecisionMetric = {
  label: string;
  value: string;
};

export type DecisionCycle = {
  id: string;
  timestamp: string;
  triggerType: TriggerType;
  cycleNumber: number;
  mode: SystemMode;
  status: DecisionStatus;
  summary: string;
  metrics: DecisionMetric[];
  apisTouched: Array<Exclude<ApiFilter, "All">>;
  predictedVsActual: {
    throughput: string;
    travel: string;
    lateRisk: string;
  };
};

export type AlternativeMetric = {
  label: string;
  value: string;
  delta: string;
  deltaState: "better" | "worse" | "neutral";
};

export type AlternativePlan = {
  label: string;
  isTessChoice: boolean;
  summary: string;
  metrics: AlternativeMetric[];
};

export type ObjectiveWeights = {
  deadlineCompliance: number;
  travelEfficiency: number;
  zoneBalance: number;
  congestionMinimization: number;
};

export type ZoneStatus = "Active" | "Restricted" | "Blocked";

export type ZoneConstraint = {
  zone: string;
  maxActiveWork: number;
  status: ZoneStatus;
  reason: string;
};

export type TimeHorizon = "This shift" | "Next 4 hours" | "Until I change it";

export type PostureConfig = {
  presetName: string;
  weights: ObjectiveWeights;
  zones: ZoneConstraint[];
  horizon: TimeHorizon;
};

import { defaultMockSession, type MockSession } from "@/lib/mock-auth";
import type {
  AlternativePlan,
  AppDataBundle,
  Batch,
  CopilotMessage,
  DecisionCycle,
  KpiSnapshot,
  Order,
  PostureConfig,
  ScenarioConfig,
  TenantSettings,
  WarehouseZone,
  WorkPackage
} from "@/lib/app-types";

const zoneNames = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F"];

const utilizationPattern = [62, 74, 58, 67, 49, 71];
const zoneCaps = [85, 70, 72, 78, 68, 70];

export const warehouseZones: WarehouseZone[] = zoneNames.map((name, index) => ({
  id: `zone-${String.fromCharCode(97 + index)}`,
  name,
  utilization: utilizationPattern[index],
  activeWork: Math.round((zoneCaps[index] * utilizationPattern[index]) / 100),
  cap: zoneCaps[index]
}));

export const defaultPosture: PostureConfig = {
  presetName: "Day Shift - deadline protected",
  weights: {
    deadlineCompliance: 78,
    travelEfficiency: 54,
    zoneBalance: 62,
    congestionMinimization: 68
  },
  zones: warehouseZones.map((zone) => ({
    zoneId: zone.id,
    zoneName: zone.name,
    maxActiveWork: zone.cap,
    status: zone.name === "Zone B" ? "Restricted" : "Active",
    reason: zone.name === "Zone B" ? "Short-staffed until 15:00" : ""
  })),
  horizon: "This shift"
};

export const posturePresetNames = [
  "Day Shift - deadline protected",
  "Carrier crunch - prioritize cutoff",
  "Cycle count - congestion first",
  "Travel-first low-risk"
];

export const orders: Order[] = Array.from({ length: 144 }, (_, index) => {
  const orderNumber = 4400 + index;
  const zoneOne = zoneNames[index % zoneNames.length];
  const zoneTwo = zoneNames[(index + 2) % zoneNames.length];
  const priorityMap: Order["priority"][] = ["Normal", "Normal", "High", "Critical", "Low"];
  const priority = priorityMap[index % priorityMap.length];
  const release = index % 4 !== 0;
  const deadlineHour = 14 + (index % 8);
  const deadlineMinute = (index * 7) % 60;
  const deadline = `${String(deadlineHour).padStart(2, "0")}:${String(deadlineMinute).padStart(2, "0")}`;

  return {
    id: `#${orderNumber}`,
    shipDeadline: deadline,
    priority,
    zones: [zoneOne, zoneTwo],
    itemCount: 3 + (index % 18),
    recommendation: release ? "Release" : "Defer",
    reason: release
      ? `Release now to smooth ${zoneOne} and protect ${deadline} cutoff.`
      : `Defer until next cycle. ${zoneOne} exceeds configured utilization threshold.`,
    predictedImpact: release
      ? "Reduces late-risk exposure and keeps floor utilization under cap."
      : "Avoids congestion spike and preserves travel efficiency.",
    locked: false
  };
});

const batchZonePatterns = [
  ["Zone A", "Zone B"],
  ["Zone C", "Zone D"],
  ["Zone E", "Zone F"],
  ["Zone B", "Zone C"],
  ["Zone A", "Zone D"],
  ["Zone C", "Zone E"]
];

export const batches: Batch[] = Array.from({ length: 12 }, (_, index) => {
  const label = `B-${320 + index}`;
  const start = index * 10;
  const selectedOrders = orders.slice(start, start + 10).map((order) => order.id);
  const zones = batchZonePatterns[index % batchZonePatterns.length];
  const risk: Batch["deadlineRisk"][] = ["None", "Low", "Moderate", "Low", "None", "Moderate"];
  return {
    id: label,
    orderIds: selectedOrders,
    pickCount: 36 + index * 4,
    primaryZones: zones,
    predictedTravelDelta: -12 - (index % 5),
    deadlineRisk: risk[index % risk.length],
    zoneDistribution: zones.map((zone, zoneIndex) => ({ zone, share: zoneIndex === 0 ? 58 : 42 })),
    sequence: selectedOrders.slice(0, 6),
    explanation: `${label} balances zone congestion and keeps carrier-cutoff orders ahead of low urgency picks.`,
    wmsDefaultTravelDelta: -4 - (index % 3)
  };
});

export const workPackages: WorkPackage[] = batches.map((batch, index) => ({
  id: `WP-${index + 1}`,
  batchId: batch.id,
  rank: index + 1,
  deadlineProximity: `${35 + index * 6} min`,
  zone: batch.primaryZones[0],
  score: 92 - index * 4,
  reason: `Ranked for ${batch.primaryZones[0]} deadline pressure and downstream congestion mitigation.`
}));

export const cycleData: DecisionCycle[] = [
  {
    id: "cycle-4828",
    timestamp: "14:45",
    triggerType: "Heartbeat",
    cycleNumber: 4828,
    mode: "Advisory",
    status: "Pending",
    responseType: "full-reopt",
    summary:
      "Tess's Choice recommends releasing 84 orders, deferring 36, and shifting Batch B-327 ahead of B-324 to protect 2pm cutoff spillover.",
    metrics: [
      { label: "Travel delta", value: "-14%" },
      { label: "Zone max util", value: "72%" },
      { label: "Late-risk", value: "0" },
      { label: "Constraint compliance", value: "100%" }
    ],
    apisTouched: ["Release", "Batching", "Prioritize"],
    recommendation: {
      releaseSummary: "84 release / 36 defer to keep active work under cap.",
      batchingSummary: "12 batches formed with mixed-zone balancing.",
      prioritizeSummary: "Top 4 work packages reordered for deadline compliance."
    },
    operatorAction: "Pending supervisor review",
    predictedVsActual: { throughput: "+15% / -", travel: "-14% / -", lateRisk: "0 / -" },
    anomalyFlags: []
  },
  {
    id: "cycle-4827",
    timestamp: "14:30",
    triggerType: "Congestion Alert",
    cycleNumber: 4827,
    mode: "Closed-Loop",
    status: "Executed",
    responseType: "partial-reopt",
    summary: "System auto-throttled Zone C releases and re-batched 3 active packages to remove aisle contention.",
    metrics: [
      { label: "Travel delta", value: "-10%" },
      { label: "Zone max util", value: "68%" },
      { label: "Late-risk", value: "1" },
      { label: "Constraint compliance", value: "100%" }
    ],
    apisTouched: ["Release", "Batching"],
    recommendation: {
      releaseSummary: "Held 2 low-priority waves for one cycle.",
      batchingSummary: "Re-grouped picks away from Zone C chokepoint.",
      prioritizeSummary: "Kept urgent batches on top despite congestion shift."
    },
    operatorAction: "Auto-executed in closed-loop",
    predictedVsActual: { throughput: "+9% / +8%", travel: "-10% / -8%", lateRisk: "1 / 1" },
    anomalyFlags: []
  },
  {
    id: "cycle-4826",
    timestamp: "14:12",
    triggerType: "Batch Completed",
    cycleNumber: 4826,
    mode: "Advisory",
    status: "Overridden",
    responseType: "local-repair",
    summary: "Tess prioritized deadline recovery, but supervisor chose travel-first sequence for Zone D staffing gap.",
    metrics: [
      { label: "Travel delta", value: "-8%" },
      { label: "Zone max util", value: "75%" },
      { label: "Late-risk", value: "2" },
      { label: "Constraint compliance", value: "100%" }
    ],
    apisTouched: ["Prioritize"],
    recommendation: {
      releaseSummary: "No release change.",
      batchingSummary: "No re-batch required.",
      prioritizeSummary: "Ranked by cutoff and congestion risk."
    },
    operatorAction: "Override accepted: travel-first order",
    predictedVsActual: { throughput: "+7% / +6%", travel: "-6% / -8%", lateRisk: "2 / 2" },
    anomalyFlags: []
  },
  {
    id: "cycle-4825",
    timestamp: "13:58",
    triggerType: "Rush Order",
    cycleNumber: 4825,
    mode: "Advisory",
    status: "Anomaly",
    responseType: "full-reopt",
    summary: "Late-risk jumped after trailer delay event. Tess pulled back to advisory and requested operator confirmation.",
    metrics: [
      { label: "Travel delta", value: "-4%" },
      { label: "Zone max util", value: "83%" },
      { label: "Late-risk", value: "4" },
      { label: "Constraint compliance", value: "98%" }
    ],
    apisTouched: ["Release", "Prioritize"],
    recommendation: {
      releaseSummary: "Deferred 19 low urgency orders.",
      batchingSummary: "Kept current batching to avoid churn.",
      prioritizeSummary: "Front-loaded rush-order related packages."
    },
    operatorAction: "Manual review required",
    predictedVsActual: { throughput: "+5% / +1%", travel: "-4% / -2%", lateRisk: "2 / 4" },
    anomalyFlags: ["travel-variance", "late-risk-spike"]
  }
];

export const alternativesByCycle: Record<string, AlternativePlan[]> = {
  "cycle-4828": [
    {
      id: "alt-tess",
      label: "Tess's Choice",
      isTessChoice: true,
      summary: "Balances cutoff protection and congestion relief under current posture.",
      metrics: [
        { label: "Travel", value: "-14%", delta: "Baseline", deltaState: "neutral" },
        { label: "Late Risk", value: "0", delta: "Baseline", deltaState: "neutral" },
        { label: "Zone Balance", value: "Good", delta: "Baseline", deltaState: "neutral" },
        { label: "Throughput", value: "+15%", delta: "Baseline", deltaState: "neutral" }
      ]
    },
    {
      id: "alt-travel",
      label: "Minimize Travel",
      isTessChoice: false,
      summary: "Cuts travel further by clustering picks, but increases deadline pressure.",
      metrics: [
        { label: "Travel", value: "-18%", delta: "4 pts better", deltaState: "better" },
        { label: "Late Risk", value: "2", delta: "2 worse", deltaState: "worse" },
        { label: "Zone Balance", value: "Uneven", delta: "Worse", deltaState: "worse" },
        { label: "Throughput", value: "+12%", delta: "3 pts worse", deltaState: "worse" }
      ]
    },
    {
      id: "alt-balance",
      label: "Balance Zones",
      isTessChoice: false,
      summary: "Spreads active work across all zones and preserves low late-risk.",
      metrics: [
        { label: "Travel", value: "-11%", delta: "3 pts worse", deltaState: "worse" },
        { label: "Late Risk", value: "0", delta: "No change", deltaState: "neutral" },
        { label: "Zone Balance", value: "All < 60%", delta: "Better", deltaState: "better" },
        { label: "Throughput", value: "+13%", delta: "2 pts worse", deltaState: "worse" }
      ]
    },
    {
      id: "alt-zero-late",
      label: "Zero Late Risk",
      isTessChoice: false,
      summary: "Protects all deadlines at the cost of travel and zone concentration.",
      metrics: [
        { label: "Travel", value: "-7%", delta: "7 pts worse", deltaState: "worse" },
        { label: "Late Risk", value: "0", delta: "No change", deltaState: "neutral" },
        { label: "Zone Balance", value: "Zone C heavy", delta: "Worse", deltaState: "worse" },
        { label: "Throughput", value: "+11%", delta: "4 pts worse", deltaState: "worse" }
      ]
    }
  ]
};

export const kpiSnapshot: KpiSnapshot = {
  lateOrders: 1,
  selectedTasks: 180,
  candidateTasks: 240,
  maxZoneLoad: 35,
  zoneCrossings: 4,
  priorityAlignment: 0.95,
  throughputPicksPerHour: 182
};

export const scenarioDefaults: ScenarioConfig = {
  releaseCount: 84,
  zoneCaps: {
    "Zone A": 85,
    "Zone B": 70,
    "Zone C": 72,
    "Zone D": 78,
    "Zone E": 68,
    "Zone F": 70
  },
  lockedBatches: ["B-320", "B-327"],
  objectiveOverrides: {
    deadlineCompliance: 78,
    travelEfficiency: 54,
    zoneBalance: 62,
    congestionMinimization: 68
  }
};

export const tenantSettings: TenantSettings = {
  tenantName: "Tessera East",
  timezone: "America/New_York",
  shifts: ["Day Shift 06:00-14:00", "Swing Shift 14:00-22:00", "Night Shift 22:00-06:00"],
  cycleIntervalMinutes: 15,
  locationRegex: "^(A|B|C|D|E|F)-[0-9]{2}-[0-9]{2}$",
  routingPoints: ["Dock A", "Cross Aisle 1", "Cross Aisle 2", "Pack Wall"],
  hardConstraints: {
    cutoffWindowHours: 2,
    floorCap: 200,
    blockedZones: []
  },
  integration: {
    platform: "Oracle WMS Cloud",
    pollingIntervalSeconds: 30,
    eventTriggers: ["Batch completed", "Rush order", "Zone congestion > 85%"],
    status: "Healthy",
    readEnabled: true,
    writeEnabled: true
  },
  autonomy: {
    priorityChanges: "Closed-Loop",
    releaseDecisions: "Advisory",
    batchModifications: "Advisory"
  }
};

export const tenantUsers: AppDataBundle["users"] = [
  { id: "usr-1", name: "Morgan Patel", email: "morgan@orcalogistics.example", role: "Admin" },
  { id: "usr-2", name: "Avery Stone", email: "avery@orcalogistics.example", role: "Supervisor" },
  { id: "usr-3", name: "Riley Chen", email: "riley@orcalogistics.example", role: "Operator" }
];

export const copilotSeedMessages: CopilotMessage[] = [
  {
    id: "sys-1",
    actor: "system",
    text: "Shift briefing: Zone B remains restricted to 70% active work. Next optimization cycle in 07:42."
  },
  {
    id: "op-1",
    actor: "operator",
    text: "We have a 2pm carrier cutoff and we are short-staffed in Zone B."
  },
  {
    id: "ts-1",
    actor: "tess",
    text: "Updated posture: deadline compliance weight increased to 0.8, Zone B capped at 70%. Next cycle will reflect these changes.",
    grounding: {
      cycleNumber: 4828,
      constraintIds: ["HC-CUTOFF-2H", "ZN-B-CAP-70"],
      metrics: ["late-risk", "zone-utilization"]
    },
    action: { label: "Apply this posture change", actionId: "open-posture" }
  },
  {
    id: "op-2",
    actor: "operator",
    text: "Why did you defer these orders?"
  },
  {
    id: "ts-2",
    actor: "tess",
    text: "Orders #4471-#4473 deferred because Zone C projected 92% capacity. Releasing now increases pick time by 34%.",
    grounding: {
      cycleNumber: 4828,
      constraintIds: ["ZN-C-CAP-72"],
      metrics: ["travel", "zone-utilization"]
    },
    metricCards: [
      { label: "At 80 releases", value: "0 late-risk" },
      { label: "At 120 releases", value: "3 moderate late-risk" }
    ]
  }
];

export function getAppData(session?: MockSession): AppDataBundle {
  const resolvedSession = session ?? defaultMockSession;

  return {
    session: resolvedSession,
    posture: defaultPosture,
    posturePresets: posturePresetNames,
    kpi: kpiSnapshot,
    zones: warehouseZones,
    orders,
    batches,
    workPackages,
    cycles: cycleData,
    alternativesByCycle,
    scenarioDefaults,
    settings: tenantSettings,
    users: tenantUsers,
    copilotMessages: copilotSeedMessages
  };
}

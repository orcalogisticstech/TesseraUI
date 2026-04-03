import { defaultMockSession, type MockSession } from "@/lib/mock-auth";
import type {
  AlternativePlan,
  AppDataBundle,
  Batch,
  CopilotMessage,
  DecisionCycle,
  HeartbeatPlan,
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

export const heartbeatPlanSets: HeartbeatPlan[][] = [
  [
    {
      id: "hb-1-tess",
      label: "Tess's Choice",
      isTessChoice: true,
      summary: "Balances cutoff protection with controlled zone crossings under current posture.",
      metrics: {
        lateOrders: 1,
        selectedTasks: 184,
        maxZoneLoad: 34,
        zoneCrossings: 4,
        priorityAlignment: 0.95,
        throughputPicksPerHour: 186
      },
      run: {
        runId: "run_20260402_1900_001",
        postureName: "Day Shift - deadline protected",
        workflow: "heartbeat",
        mode: "Advisory",
        status: "completed",
        timestamp: "2026-04-02T19:00:04Z",
        computationTime: 3.8,
        solutionId: "sol_primary",
        tradeoffLabel: "primary",
        solutionMetrics: {
          totalDistance: 7100,
          totalDuration: 9400,
          totalTardiness: 0,
          nLateOrders: 1,
          nBatches: 16,
          nSelectedTasks: 184,
          nUnselectedTasks: 56,
          maxZoneLoad: 34,
          nZoneCrossings: 4,
          nSplitOrders: 1,
          nGroupingViolations: 0,
          priorityAlignment: 0.95,
          batchDurationBalance: 0.79,
          batchDistanceBalance: 0.83
        },
        batches: [
          {
            batchId: "batch_1",
            priorityRank: 1,
            priorityScore: 0.94,
            cartTypeId: "standard_tote_cart",
            taskIds: ["task_1001", "task_1002"],
            orderIds: ["order_501", "order_502"],
            waveId: "wave_20260402_1840",
            zones: ["ZONE_A"],
            route: { startNodeId: "STAGE_A", endNodeId: "PACK_1", distance: 410, duration: 520, nZoneCrossings: 0 },
            batchMetrics: { distance: 410, duration: 520, nLateOrders: 0, tardiness: 0 }
          },
          {
            batchId: "batch_2",
            priorityRank: 2,
            priorityScore: 0.9,
            cartTypeId: "standard_tote_cart",
            taskIds: ["task_1030", "task_1031", "task_1032"],
            orderIds: ["order_514", "order_519"],
            waveId: "wave_20260402_1840",
            zones: ["ZONE_B", "ZONE_C"],
            route: { startNodeId: "STAGE_A", endNodeId: "PACK_2", distance: 530, duration: 690, nZoneCrossings: 1 },
            batchMetrics: { distance: 530, duration: 690, nLateOrders: 0, tardiness: 0 }
          }
        ],
        unselectedTasks: [
          { taskId: "task_1401", reasonCode: "zone_congestion" },
          { taskId: "task_1402", reasonCode: "deadline_slack" }
        ]
      }
    },
    {
      id: "hb-1-travel",
      label: "Minimize Travel",
      isTessChoice: false,
      summary: "Reduces crossings and load skew but allows more deadline exposure.",
      metrics: {
        lateOrders: 3,
        selectedTasks: 180,
        maxZoneLoad: 32,
        zoneCrossings: 2,
        priorityAlignment: 0.88,
        throughputPicksPerHour: 176
      },
      run: {
        runId: "run_20260402_1900_002",
        postureName: "Travel-first low-risk",
        workflow: "heartbeat",
        mode: "Advisory",
        status: "completed",
        timestamp: "2026-04-02T19:00:04Z",
        computationTime: 3.4,
        solutionId: "sol_min_travel",
        tradeoffLabel: "minimize_travel",
        solutionMetrics: {
          totalDistance: 6200,
          totalDuration: 8100,
          totalTardiness: 45,
          nLateOrders: 3,
          nBatches: 14,
          nSelectedTasks: 180,
          nUnselectedTasks: 60,
          maxZoneLoad: 32,
          nZoneCrossings: 2,
          nSplitOrders: 3,
          nGroupingViolations: 1,
          priorityAlignment: 0.88,
          batchDurationBalance: 0.71,
          batchDistanceBalance: 0.75
        },
        batches: [
          {
            batchId: "batch_4",
            priorityRank: 1,
            priorityScore: 0.91,
            cartTypeId: "standard_tote_cart",
            taskIds: ["task_1111", "task_1112"],
            orderIds: ["order_588", "order_590"],
            waveId: "wave_20260402_1840",
            zones: ["ZONE_A"],
            route: { startNodeId: "STAGE_A", endNodeId: "PACK_1", distance: 360, duration: 470, nZoneCrossings: 0 },
            batchMetrics: { distance: 360, duration: 470, nLateOrders: 1, tardiness: 18 }
          }
        ],
        unselectedTasks: [
          { taskId: "task_1490", reasonCode: "deadline_slack" },
          { taskId: "task_1491", reasonCode: "capacity_exceeded" }
        ]
      }
    },
    {
      id: "hb-1-deadline",
      label: "Deadline Guard",
      isTessChoice: false,
      summary: "Protects high-priority cutoffs with higher zone concentration.",
      metrics: {
        lateOrders: 0,
        selectedTasks: 176,
        maxZoneLoad: 39,
        zoneCrossings: 5,
        priorityAlignment: 0.97,
        throughputPicksPerHour: 178
      },
      run: {
        runId: "run_20260402_1900_003",
        postureName: "Carrier crunch - prioritize cutoff",
        workflow: "heartbeat",
        mode: "Advisory",
        status: "completed",
        timestamp: "2026-04-02T19:00:04Z",
        computationTime: 4.1,
        solutionId: "sol_zero_late",
        tradeoffLabel: "zero_late_risk",
        solutionMetrics: {
          totalDistance: 7600,
          totalDuration: 9800,
          totalTardiness: 0,
          nLateOrders: 0,
          nBatches: 17,
          nSelectedTasks: 176,
          nUnselectedTasks: 64,
          maxZoneLoad: 39,
          nZoneCrossings: 5,
          nSplitOrders: 1,
          nGroupingViolations: 0,
          priorityAlignment: 0.97,
          batchDurationBalance: 0.68,
          batchDistanceBalance: 0.72
        },
        batches: [
          {
            batchId: "batch_8",
            priorityRank: 1,
            priorityScore: 0.98,
            cartTypeId: "standard_tote_cart",
            taskIds: ["task_2001", "task_2002", "task_2003"],
            orderIds: ["order_701", "order_703"],
            waveId: "wave_20260402_1840",
            zones: ["ZONE_B", "ZONE_C"],
            route: { startNodeId: "STAGE_A", endNodeId: "PACK_1", distance: 560, duration: 740, nZoneCrossings: 2 },
            batchMetrics: { distance: 560, duration: 740, nLateOrders: 0, tardiness: 0 }
          }
        ],
        unselectedTasks: [{ taskId: "task_2090", reasonCode: "zone_congestion" }]
      }
    }
  ],
  [
    {
      id: "hb-2-tess",
      label: "Tess's Choice",
      isTessChoice: true,
      summary: "Rebalances Zone B pressure while preserving throughput.",
      metrics: {
        lateOrders: 1,
        selectedTasks: 182,
        maxZoneLoad: 35,
        zoneCrossings: 3,
        priorityAlignment: 0.94,
        throughputPicksPerHour: 183
      },
      run: {
        runId: "run_20260402_1915_001",
        postureName: "Day Shift - deadline protected",
        workflow: "heartbeat",
        mode: "Advisory",
        status: "completed",
        timestamp: "2026-04-02T19:15:05Z",
        computationTime: 3.6,
        solutionId: "sol_primary",
        tradeoffLabel: "primary",
        solutionMetrics: {
          totalDistance: 7020,
          totalDuration: 9280,
          totalTardiness: 10,
          nLateOrders: 1,
          nBatches: 16,
          nSelectedTasks: 182,
          nUnselectedTasks: 58,
          maxZoneLoad: 35,
          nZoneCrossings: 3,
          nSplitOrders: 1,
          nGroupingViolations: 0,
          priorityAlignment: 0.94,
          batchDurationBalance: 0.8,
          batchDistanceBalance: 0.84
        },
        batches: [
          {
            batchId: "batch_11",
            priorityRank: 1,
            priorityScore: 0.93,
            cartTypeId: "standard_tote_cart",
            taskIds: ["task_3001", "task_3002"],
            orderIds: ["order_801", "order_802"],
            waveId: "wave_20260402_1900",
            zones: ["ZONE_A", "ZONE_B"],
            route: { startNodeId: "STAGE_A", endNodeId: "PACK_2", distance: 440, duration: 600, nZoneCrossings: 1 },
            batchMetrics: { distance: 440, duration: 600, nLateOrders: 0, tardiness: 0 }
          }
        ],
        unselectedTasks: [{ taskId: "task_3099", reasonCode: "deadline_slack" }]
      }
    },
    {
      id: "hb-2-balance",
      label: "Balance Zones",
      isTessChoice: false,
      summary: "Minimizes max zone load with moderate throughput impact.",
      metrics: {
        lateOrders: 2,
        selectedTasks: 178,
        maxZoneLoad: 30,
        zoneCrossings: 4,
        priorityAlignment: 0.9,
        throughputPicksPerHour: 171
      },
      run: {
        runId: "run_20260402_1915_002",
        postureName: "Cycle count - congestion first",
        workflow: "heartbeat",
        mode: "Advisory",
        status: "completed",
        timestamp: "2026-04-02T19:15:05Z",
        computationTime: 3.9,
        solutionId: "sol_balance_zones",
        tradeoffLabel: "balance_zones",
        solutionMetrics: {
          totalDistance: 7450,
          totalDuration: 9700,
          totalTardiness: 20,
          nLateOrders: 2,
          nBatches: 15,
          nSelectedTasks: 178,
          nUnselectedTasks: 62,
          maxZoneLoad: 30,
          nZoneCrossings: 4,
          nSplitOrders: 2,
          nGroupingViolations: 0,
          priorityAlignment: 0.9,
          batchDurationBalance: 0.86,
          batchDistanceBalance: 0.88
        },
        batches: [
          {
            batchId: "batch_12",
            priorityRank: 2,
            priorityScore: 0.88,
            cartTypeId: "standard_tote_cart",
            taskIds: ["task_3201", "task_3202"],
            orderIds: ["order_840", "order_842"],
            waveId: "wave_20260402_1900",
            zones: ["ZONE_D", "ZONE_E"],
            route: { startNodeId: "STAGE_A", endNodeId: "PACK_1", distance: 510, duration: 680, nZoneCrossings: 1 },
            batchMetrics: { distance: 510, duration: 680, nLateOrders: 1, tardiness: 7 }
          }
        ],
        unselectedTasks: [{ taskId: "task_3299", reasonCode: "zone_congestion" }]
      }
    },
    {
      id: "hb-2-output",
      label: "Throughput Push",
      isTessChoice: false,
      summary: "Maximizes picks/hr with more zone crossings and late risk.",
      metrics: {
        lateOrders: 4,
        selectedTasks: 192,
        maxZoneLoad: 41,
        zoneCrossings: 7,
        priorityAlignment: 0.86,
        throughputPicksPerHour: 194
      },
      run: {
        runId: "run_20260402_1915_003",
        postureName: "Travel-first low-risk",
        workflow: "heartbeat",
        mode: "Advisory",
        status: "completed",
        timestamp: "2026-04-02T19:15:05Z",
        computationTime: 3.2,
        solutionId: "sol_throughput_push",
        tradeoffLabel: "maximize_throughput",
        solutionMetrics: {
          totalDistance: 6800,
          totalDuration: 8450,
          totalTardiness: 62,
          nLateOrders: 4,
          nBatches: 18,
          nSelectedTasks: 192,
          nUnselectedTasks: 48,
          maxZoneLoad: 41,
          nZoneCrossings: 7,
          nSplitOrders: 4,
          nGroupingViolations: 2,
          priorityAlignment: 0.86,
          batchDurationBalance: 0.61,
          batchDistanceBalance: 0.66
        },
        batches: [
          {
            batchId: "batch_14",
            priorityRank: 1,
            priorityScore: 0.86,
            cartTypeId: "standard_tote_cart",
            taskIds: ["task_3401", "task_3402", "task_3403"],
            orderIds: ["order_901", "order_902", "order_903"],
            waveId: "wave_20260402_1900",
            zones: ["ZONE_A", "ZONE_C", "ZONE_E"],
            route: { startNodeId: "STAGE_A", endNodeId: "PACK_2", distance: 590, duration: 770, nZoneCrossings: 2 },
            batchMetrics: { distance: 590, duration: 770, nLateOrders: 2, tardiness: 22 }
          }
        ],
        unselectedTasks: [
          { taskId: "task_3491", reasonCode: "capacity_exceeded" },
          { taskId: "task_3492", reasonCode: "blocked_location" }
        ]
      }
    }
  ]
];

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
    heartbeatPlanSets,
    scenarioDefaults,
    settings: tenantSettings,
    users: tenantUsers,
    copilotMessages: copilotSeedMessages
  };
}

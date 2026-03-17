import type { AlternativePlan, DecisionCycle, PostureConfig } from "@/lib/product-types";

export const decisionCycles: DecisionCycle[] = [
  {
    id: "cycle-4821",
    timestamp: "14:15",
    triggerType: "Heartbeat",
    cycleNumber: 4821,
    mode: "Advisory",
    status: "Pending Review",
    summary:
      "Released 42 of 78 pending orders. Deferred 36 to reduce Zone C congestion (predicted: -18% utilization). Formed 8 batches optimized for travel distance under current posture. Re-ranked 3 active batches to reflect the 2pm carrier cutoff.",
    metrics: [
      { label: "Travel distance", value: "-12%" },
      { label: "Zone C utilization", value: "58% (was 76%)" },
      { label: "Late-risk orders", value: "0" },
      { label: "Constraint compliance", value: "100%" }
    ],
    apisTouched: ["Release", "Batching", "Priority"],
    predictedVsActual: { throughput: "+14% / +13%", travel: "-11% / -10%", lateRisk: "0 / 0" }
  },
  {
    id: "cycle-4820",
    timestamp: "14:02",
    triggerType: "Congestion Alert",
    cycleNumber: 4820,
    mode: "Closed-Loop",
    status: "Executed",
    summary:
      "Held two low-priority waves and shifted active picks to Zone A to clear aisle contention. Re-batched to preserve deadline compliance while reducing cross-zone travel.",
    metrics: [
      { label: "Travel distance", value: "-9%" },
      { label: "Zone C utilization", value: "61% (was 74%)" },
      { label: "Late-risk orders", value: "1" },
      { label: "Constraint compliance", value: "100%" }
    ],
    apisTouched: ["Release", "Batching"],
    predictedVsActual: { throughput: "+9% / +8%", travel: "-9% / -7%", lateRisk: "1 / 1" }
  },
  {
    id: "cycle-4819",
    timestamp: "13:48",
    triggerType: "Batch Completed",
    cycleNumber: 4819,
    mode: "Write-Back",
    status: "Overridden",
    summary:
      "Optimizer prioritized deadline compliance over travel efficiency after a rush-order spike. Supervisor overrode with travel-first alternative for Zone B.",
    metrics: [
      { label: "Travel distance", value: "-6%" },
      { label: "Zone C utilization", value: "67% (was 70%)" },
      { label: "Late-risk orders", value: "2" },
      { label: "Constraint compliance", value: "100%" }
    ],
    apisTouched: ["Priority"],
    predictedVsActual: { throughput: "+6% / +6%", travel: "-6% / -8%", lateRisk: "2 / 2" }
  },
  {
    id: "cycle-4818",
    timestamp: "13:30",
    triggerType: "Rush Order",
    cycleNumber: 4818,
    mode: "Advisory",
    status: "Anomaly",
    summary:
      "Predicted dock release window drifted from observed loader throughput. System dropped to advisory mode and requested review before next write-back cycle.",
    metrics: [
      { label: "Travel distance", value: "-3%" },
      { label: "Zone C utilization", value: "71% (was 73%)" },
      { label: "Late-risk orders", value: "3" },
      { label: "Constraint compliance", value: "98%" }
    ],
    apisTouched: ["Release", "Priority"],
    predictedVsActual: { throughput: "+4% / +1%", travel: "-3% / -2%", lateRisk: "1 / 3" }
  }
];

export const alternativesByCycle: Record<string, AlternativePlan[]> = {
  "cycle-4821": [
    {
      label: "Tess's Choice",
      isTessChoice: true,
      summary: "Balanced deadline compliance and congestion relief under current posture.",
      metrics: [
        { label: "Travel", value: "-12%", delta: "Baseline", deltaState: "neutral" },
        { label: "Late risk", value: "0", delta: "Baseline", deltaState: "neutral" },
        { label: "Zone C util", value: "58%", delta: "Baseline", deltaState: "neutral" },
        { label: "Throughput", value: "+14%", delta: "Baseline", deltaState: "neutral" }
      ]
    },
    {
      label: "Minimize Travel",
      isTessChoice: false,
      summary: "Tighter batches cut travel by 18%, but two batches carry moderate deadline risk.",
      metrics: [
        { label: "Travel", value: "-18%", delta: "6 pts better", deltaState: "better" },
        { label: "Late risk", value: "2", delta: "2 worse", deltaState: "worse" },
        { label: "Zone C util", value: "61%", delta: "3 pts worse", deltaState: "worse" },
        { label: "Throughput", value: "+12%", delta: "2 pts worse", deltaState: "worse" }
      ]
    },
    {
      label: "Balance Zones",
      isTessChoice: false,
      summary: "Releases more evenly across zones, preserving deadlines with slight travel trade-off.",
      metrics: [
        { label: "Travel", value: "-10%", delta: "2 pts worse", deltaState: "worse" },
        { label: "Late risk", value: "0", delta: "No change", deltaState: "neutral" },
        { label: "Zone C util", value: "54%", delta: "4 pts better", deltaState: "better" },
        { label: "Throughput", value: "+13%", delta: "1 pt worse", deltaState: "worse" }
      ]
    },
    {
      label: "Zero Late Risk",
      isTessChoice: false,
      summary: "Guarantees on-time risk floor by pulling forward urgent picks and deferring travel optimization.",
      metrics: [
        { label: "Travel", value: "-7%", delta: "5 pts worse", deltaState: "worse" },
        { label: "Late risk", value: "0", delta: "No change", deltaState: "neutral" },
        { label: "Zone C util", value: "60%", delta: "2 pts worse", deltaState: "worse" },
        { label: "Throughput", value: "+11%", delta: "3 pts worse", deltaState: "worse" }
      ]
    }
  ]
};

export const defaultPosture: PostureConfig = {
  presetName: "Normal ops",
  weights: {
    deadlineCompliance: 82,
    travelEfficiency: 56,
    zoneBalance: 56,
    congestionMinimization: 68
  },
  zones: [
    { zone: "Zone A", maxActiveWork: 80, status: "Active", reason: "" },
    { zone: "Zone B", maxActiveWork: 70, status: "Restricted", reason: "Cycle count in progress" },
    { zone: "Zone C", maxActiveWork: 65, status: "Active", reason: "" }
  ],
  horizon: "This shift"
};

export const posturePresetNames = ["Tuesday PM - carrier crunch", "Cycle count - Zone A restricted", "Normal ops"];

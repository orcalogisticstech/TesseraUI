import { formatTradeoffLabel } from "@/lib/heartbeat-recordings-shared";
import type {
  FlattenedBatchRow,
  HeartbeatPlan,
  HeartbeatRunDetails,
  HeartbeatRunSummary,
  OptimizerBatch,
  OptimizerSolutionMetrics,
  OptimizerUnselectedTask,
  SystemMode
} from "@/lib/app-types";
import fs from "node:fs";
import path from "node:path";

type RawRequest = {
  request_id: string;
  tenant_id: string;
  facility_id: string;
  workflow: "heartbeat" | "replan";
  mode: string;
  job: {
    job_id: string;
    created_ts: string;
  };
  job_config: {
    blocked_aisles: string[];
    no_go_zones: string[];
    blocked_terminals: string[];
    weights: {
      travel_time: number;
      tardiness: number;
      zone_balance: number;
    };
    penalties: {
      zone_cross: number;
      split_order: number;
      grouping_violation: number;
    };
    available_carts: Array<{
      cart_type_id: string;
      count: number;
    }>;
    max_batches: number;
    max_tasks_per_zone: number;
  };
  pick_work_release: {
    tasks: Array<{
      task_id: string;
      order_id: string;
    }>;
  };
};

type RawResponse = {
  response_id: string;
  request_id: string;
  status: "completed" | "failed" | "partial";
  timestamp: string;
  computation_time: number;
  solutions: Array<{
    solution_id: string;
    tradeoff_label: string;
    solution_metrics: {
      total_distance: number;
      total_duration: number;
      n_late_risk_orders: number;
      late_risk_cost: number;
      n_batches: number;
      n_selected_tasks: number;
      n_unselected_tasks: number;
      max_zone_load: number;
      n_zone_crossings: number;
      n_split_orders: number;
      n_grouping_violations: number;
      priority_alignment: number;
      batch_duration_balance: number;
      batch_distance_balance: number;
    };
    batches: Array<{
      batch_id: string;
      priority_rank: number;
      priority_score: number;
      cart_type_id: string;
      task_ids: string[];
      order_ids: string[];
      wave_id: string;
      zones: string[];
      route: {
        start_node_id: string;
        end_node_id: string;
        distance: number;
        duration: number;
        n_zone_crossings: number;
      };
      sequence: Array<{
        task_id: string;
        sequence_index: number;
        location_id: string;
        zone_id: string;
      }>;
      batch_metrics: {
        distance: number;
        duration: number;
        n_late_risk_orders: number;
      };
    }>;
    unselected_tasks: Array<{
      task_id: string;
      reason_code: string;
    }>;
  }>;
};

type SummaryDataset = {
  planSets: HeartbeatPlan[][];
  requestFileById: Record<string, string>;
  responseFileById: Record<string, string>;
};

let cachedSummaryDataset: SummaryDataset | null = null;
const cachedRunDetails = new Map<string, HeartbeatRunDetails>();
const DEFAULT_UNSELECTED_TASK_PAGE_SIZE = 100;

function datasetRoot() {
  return path.join(process.cwd(), "20260415T201420Z");
}

function toSystemMode(mode: string): SystemMode {
  return mode.toLowerCase() === "closed-loop" ? "Closed-Loop" : "Advisory";
}

function parseSeed(requestId: string) {
  const parts = requestId.split("_");
  return parts[3] ?? "unknown";
}

function formatRequestLabel(request: RawRequest) {
  const scenario = request.job.job_id.split("_")[2] ?? "scenario";
  return `${request.facility_id} ${scenario} seed ${parseSeed(request.request_id)}`;
}

function formatRunId(request: RawRequest, tradeoffLabel: string) {
  return `${request.facility_id}-${parseSeed(request.request_id)}-${tradeoffLabel}`;
}

function deriveThroughput(selectedTasks: number, totalDuration: number) {
  if (totalDuration <= 0) {
    return 0;
  }
  return Math.round((selectedTasks * 3600) / totalDuration);
}

function buildPlanSummary(
  tradeoffLabel: string,
  metrics: RawResponse["solutions"][number]["solution_metrics"],
  solutions: RawResponse["solutions"]
) {
  const bestDistance = Math.min(...solutions.map((solution) => solution.solution_metrics.total_distance));
  const bestCrossings = Math.min(...solutions.map((solution) => solution.solution_metrics.n_zone_crossings));
  const bestZoneLoad = Math.min(...solutions.map((solution) => solution.solution_metrics.max_zone_load));
  const bestZoneBalance = Math.max(
    ...solutions.map((solution) => {
      const denominator = solution.solution_metrics.max_zone_load || 1;
      return solution.solution_metrics.n_selected_tasks / denominator;
    })
  );
  const throughput = deriveThroughput(metrics.n_selected_tasks, metrics.total_duration);

  if (tradeoffLabel === "primary") {
    return `Primary optimizer solution for this request. ${metrics.n_selected_tasks} tasks selected at ${throughput} picks/hr.`;
  }
  if (tradeoffLabel === "minimize_travel") {
    const lead = metrics.total_distance === bestDistance ? "Lowest total travel in this cycle." : "Travel-focused alternative.";
    return `${lead} ${metrics.n_zone_crossings} zone crossings and ${metrics.n_selected_tasks} selected tasks.`;
  }
  if (tradeoffLabel === "balance_zones") {
    const zoneBalance = metrics.max_zone_load === 0 ? 0 : metrics.n_selected_tasks / metrics.max_zone_load;
    const lead = zoneBalance === bestZoneBalance || metrics.max_zone_load === bestZoneLoad ? "Best zone-balance profile in this cycle." : "Zone-balancing alternative.";
    return `${lead} Max zone load ${metrics.max_zone_load} with ${metrics.n_zone_crossings} crossings.`;
  }
  if (tradeoffLabel === "zero_late_risk") {
    const lead = metrics.n_late_risk_orders === 0 ? "Protects late-risk orders with zero late risk." : "Late-risk protection alternative.";
    const crossingText = metrics.n_zone_crossings === bestCrossings ? "lowest crossing count" : `${metrics.n_zone_crossings} crossings`;
    return `${lead} ${crossingText} and ${metrics.n_selected_tasks} selected tasks.`;
  }

  return `${formatTradeoffLabel(tradeoffLabel)} for this recorded request. ${metrics.n_selected_tasks} selected tasks.`;
}

function normalizeSolutionMetrics(solutionMetrics: RawResponse["solutions"][number]["solution_metrics"]): OptimizerSolutionMetrics {
  return {
    totalDistance: solutionMetrics.total_distance,
    totalDuration: solutionMetrics.total_duration,
    totalTardiness: solutionMetrics.late_risk_cost,
    nLateOrders: solutionMetrics.n_late_risk_orders,
    nBatches: solutionMetrics.n_batches,
    nSelectedTasks: solutionMetrics.n_selected_tasks,
    nUnselectedTasks: solutionMetrics.n_unselected_tasks,
    maxZoneLoad: solutionMetrics.max_zone_load,
    nZoneCrossings: solutionMetrics.n_zone_crossings,
    nSplitOrders: solutionMetrics.n_split_orders,
    nGroupingViolations: solutionMetrics.n_grouping_violations,
    priorityAlignment: solutionMetrics.priority_alignment,
    batchDurationBalance: solutionMetrics.batch_duration_balance,
    batchDistanceBalance: solutionMetrics.batch_distance_balance
  };
}

function normalizeBatches(batches: RawResponse["solutions"][number]["batches"]): OptimizerBatch[] {
  return batches.map((batch) => ({
    batchId: batch.batch_id,
    priorityRank: batch.priority_rank,
    priorityScore: batch.priority_score,
    cartTypeId: batch.cart_type_id,
    taskIds: batch.task_ids,
    orderIds: batch.order_ids,
    waveId: batch.wave_id,
    zones: batch.zones,
    route: {
      startNodeId: batch.route.start_node_id,
      endNodeId: batch.route.end_node_id,
      distance: batch.route.distance,
      duration: batch.route.duration,
      nZoneCrossings: batch.route.n_zone_crossings
    },
    sequence: batch.sequence.map((stop) => ({
      taskId: stop.task_id,
      sequenceIndex: stop.sequence_index,
      locationId: stop.location_id,
      zoneId: stop.zone_id
    })),
    batchMetrics: {
      distance: batch.batch_metrics.distance,
      duration: batch.batch_metrics.duration,
      nLateOrders: batch.batch_metrics.n_late_risk_orders,
      tardiness: 0
    }
  }));
}

function normalizeUnselectedTasks(unselectedTasks: RawResponse["solutions"][number]["unselected_tasks"]): OptimizerUnselectedTask[] {
  return unselectedTasks.map((task) => ({
    taskId: task.task_id,
    reasonCode: task.reason_code
  }));
}

function flattenBatchRows(batches: OptimizerBatch[], taskToOrderId: Map<string, string>): FlattenedBatchRow[] {
  return batches.flatMap((batch): FlattenedBatchRow[] => {
    if (batch.sequence.length === 0) {
      return [
        {
          rowId: `${batch.batchId}:empty`,
          batchId: batch.batchId,
          priorityRank: batch.priorityRank,
          priorityScore: batch.priorityScore,
          cartTypeId: batch.cartTypeId,
          waveId: batch.waveId,
          zones: batch.zones,
          routeDistance: batch.route.distance,
          routeDuration: batch.route.duration,
          routeCrossings: batch.route.nZoneCrossings,
          sequenceIndex: null,
          taskId: "",
          orderId: "Unknown",
          locationId: "",
          stopZoneId: ""
        }
      ];
    }

    return batch.sequence.map((stop) => ({
      rowId: `${batch.batchId}:${stop.sequenceIndex}:${stop.taskId}`,
      batchId: batch.batchId,
      priorityRank: batch.priorityRank,
      priorityScore: batch.priorityScore,
      cartTypeId: batch.cartTypeId,
      waveId: batch.waveId,
      zones: batch.zones,
      routeDistance: batch.route.distance,
      routeDuration: batch.route.duration,
      routeCrossings: batch.route.nZoneCrossings,
      sequenceIndex: stop.sequenceIndex,
      taskId: stop.taskId,
      orderId: taskToOrderId.get(stop.taskId) ?? "Unknown",
      locationId: stop.locationId,
      stopZoneId: stop.zoneId
    }));
  });
}

function normalizePlans(request: RawRequest, response: RawResponse): HeartbeatPlan[] {
  const requestLabel = formatRequestLabel(request);
  return response.solutions.map((solution) => {
    const throughput = deriveThroughput(solution.solution_metrics.n_selected_tasks, solution.solution_metrics.total_duration);
    const runSummary: HeartbeatRunSummary = {
      runId: formatRunId(request, solution.tradeoff_label),
      requestId: request.request_id,
      requestLabel,
      workflow: request.workflow,
      mode: toSystemMode(request.mode),
      status: response.status,
      timestamp: response.timestamp,
      computationTime: response.computation_time,
      solutionId: solution.solution_id,
      tradeoffLabel: solution.tradeoff_label
    };

    return {
      id: `${request.request_id}:${solution.tradeoff_label}`,
      label: formatTradeoffLabel(solution.tradeoff_label),
      isTessChoice: solution.tradeoff_label === "primary",
      summary: buildPlanSummary(solution.tradeoff_label, solution.solution_metrics, response.solutions),
      metrics: {
        lateOrders: solution.solution_metrics.n_late_risk_orders,
        selectedTasks: solution.solution_metrics.n_selected_tasks,
        maxZoneLoad: solution.solution_metrics.max_zone_load,
        zoneCrossings: solution.solution_metrics.n_zone_crossings,
        priorityAlignment: solution.solution_metrics.priority_alignment,
        throughputPicksPerHour: throughput
      },
      run: runSummary
    };
  });
}

function normalizeRunDetails(request: RawRequest, response: RawResponse, tradeoffLabel: string): HeartbeatRunDetails | null {
  const plans = normalizePlans(request, response);
  const summary = plans.find((plan) => plan.run.tradeoffLabel === tradeoffLabel)?.run;
  const solution = response.solutions.find((candidate) => candidate.tradeoff_label === tradeoffLabel);

  if (!summary || !solution) {
    return null;
  }

  const distinctOrderCount = new Set(request.pick_work_release.tasks.map((task) => task.order_id)).size;
  const taskToOrderId = new Map(request.pick_work_release.tasks.map((task) => [task.task_id, task.order_id]));
  const batches = normalizeBatches(solution.batches);

  return {
    ...summary,
    responseId: response.response_id,
    requestContext: {
      requestId: request.request_id,
      responseId: response.response_id,
      jobId: request.job.job_id,
      tenantId: request.tenant_id,
      facilityId: request.facility_id,
      requestTimestamp: request.job.created_ts,
      responseTimestamp: response.timestamp,
      candidateTaskCount: request.pick_work_release.tasks.length,
      distinctOrderCount,
      weights: {
        travelTime: request.job_config.weights.travel_time,
        tardiness: request.job_config.weights.tardiness,
        zoneBalance: request.job_config.weights.zone_balance
      },
      penalties: {
        zoneCross: request.job_config.penalties.zone_cross,
        splitOrder: request.job_config.penalties.split_order,
        groupingViolation: request.job_config.penalties.grouping_violation
      },
      limits: {
        maxBatches: request.job_config.max_batches,
        maxTasksPerZone: request.job_config.max_tasks_per_zone
      },
      availableCarts: request.job_config.available_carts.map((cart) => ({
        cartTypeId: cart.cart_type_id,
        count: cart.count
      })),
      noGoZones: request.job_config.no_go_zones,
      blockedAisles: request.job_config.blocked_aisles,
      blockedTerminals: request.job_config.blocked_terminals
    },
    solutionMetrics: normalizeSolutionMetrics(solution.solution_metrics),
    batches,
    flattenedBatchRows: flattenBatchRows(batches, taskToOrderId),
    unselectedTasks: normalizeUnselectedTasks(solution.unselected_tasks),
    unselectedTaskCount: solution.unselected_tasks.length,
    unselectedTaskPage: 0,
    unselectedTaskPageSize: DEFAULT_UNSELECTED_TASK_PAGE_SIZE
  };
}

function buildSummaryDataset(): SummaryDataset {
  const requestsDirectory = path.join(datasetRoot(), "requests");
  const responsesDirectory = path.join(datasetRoot(), "responses");
  const requestFiles = fs.readdirSync(requestsDirectory).filter((fileName) => fileName.endsWith(".json")).sort();
  const responseFiles = fs.readdirSync(responsesDirectory).filter((fileName) => fileName.endsWith(".json")).sort();
  const responsesByRequestId = new Map<string, RawResponse>();
  const responseFileById: Record<string, string> = {};

  for (const fileName of responseFiles) {
    const response = JSON.parse(fs.readFileSync(path.join(responsesDirectory, fileName), "utf8")) as RawResponse;
    responsesByRequestId.set(response.request_id, response);
    responseFileById[response.request_id] = path.join(responsesDirectory, fileName);
  }

  const requestFileById: Record<string, string> = {};
  const planSets = requestFiles.map((fileName) => {
    const request = JSON.parse(fs.readFileSync(path.join(requestsDirectory, fileName), "utf8")) as RawRequest;
    const response = responsesByRequestId.get(request.request_id);

    if (!response) {
      throw new Error(`Missing response for request ${request.request_id}`);
    }

    requestFileById[request.request_id] = path.join(requestsDirectory, fileName);
    return normalizePlans(request, response);
  });

  return {
    planSets,
    requestFileById,
    responseFileById
  };
}

function getSummaryDataset() {
  if (!cachedSummaryDataset) {
    cachedSummaryDataset = buildSummaryDataset();
  }
  return cachedSummaryDataset;
}

export function getRecordedHeartbeatPlanSets() {
  return getSummaryDataset().planSets;
}

export function getRecordedHeartbeatRunDetails(requestId: string, tradeoffLabel: string) {
  const cacheKey = `${requestId}:${tradeoffLabel}`;
  const cached = cachedRunDetails.get(cacheKey);
  if (cached) {
    return cached;
  }

  const dataset = getSummaryDataset();
  const requestFile = dataset.requestFileById[requestId];
  const responseFile = dataset.responseFileById[requestId];

  if (!requestFile || !responseFile) {
    return null;
  }

  const request = JSON.parse(fs.readFileSync(requestFile, "utf8")) as RawRequest;
  const response = JSON.parse(fs.readFileSync(responseFile, "utf8")) as RawResponse;
  const details = normalizeRunDetails(request, response, tradeoffLabel);

  if (!details) {
    return null;
  }

  cachedRunDetails.set(cacheKey, details);
  return details;
}

export function getRecordedHeartbeatRunDetailsPage(requestId: string, tradeoffLabel: string, page: number, pageSize = DEFAULT_UNSELECTED_TASK_PAGE_SIZE) {
  const details = getRecordedHeartbeatRunDetails(requestId, tradeoffLabel);
  if (!details) {
    return null;
  }

  const safePage = Math.max(0, page);
  const safePageSize = Math.max(1, pageSize);
  const startIndex = safePage * safePageSize;

  return {
    ...details,
    unselectedTasks: details.unselectedTasks.slice(startIndex, startIndex + safePageSize),
    unselectedTaskPage: safePage,
    unselectedTaskPageSize: safePageSize
  };
}

import type {
  AdoptedPlanHistoryEntry,
  AppDataBundle,
  CopilotMessage,
  HeartbeatPlan,
  HeartbeatRunDetails,
  HeartbeatRunSummary,
  KpiSnapshot,
  PostureConfig,
  SystemMode,
  TenantSettings
} from "@/lib/app-types";
import type { LayoutGraphData } from "@/components/app/layout/layout-types";
import type { MockSession } from "@/lib/mock-auth";

export type BackendJobConfig = {
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
  required_group_splits?: Array<[string, string]>;
  preferred_group_splits?: Array<[string, string]>;
  available_carts: Array<{ cart_type_id: string; count: number }>;
  max_batches: number;
  max_tasks_per_zone: number;
};

export type BackendBootstrapBundle = {
  data: AppDataBundle;
  initialHeartbeatPlanSets: HeartbeatPlan[][];
  adoptedPlansHistory: AdoptedPlanHistoryEntry[];
  jobConfig: BackendJobConfig;
  activeJobIds: string[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeMode(value: unknown): SystemMode {
  return value === "Closed-Loop" || value === "closed_loop" ? "Closed-Loop" : "Advisory";
}

function normalizeJobConfig(value: unknown): BackendJobConfig {
  const raw = asRecord(value);
  const weights = asRecord(raw.weights);
  const penalties = asRecord(raw.penalties);
  return {
    blocked_aisles: asArray(raw.blocked_aisles).map((item) => asString(item)).filter(Boolean),
    no_go_zones: asArray(raw.no_go_zones).map((item) => asString(item)).filter(Boolean),
    blocked_terminals: asArray(raw.blocked_terminals).map((item) => asString(item)).filter(Boolean),
    weights: {
      travel_time: asNumber(weights.travel_time, 0.4),
      tardiness: asNumber(weights.tardiness, 0.5),
      zone_balance: asNumber(weights.zone_balance, 0.1)
    },
    penalties: {
      zone_cross: asNumber(penalties.zone_cross, 1),
      split_order: asNumber(penalties.split_order, 0),
      grouping_violation: asNumber(penalties.grouping_violation, 1)
    },
    required_group_splits: [],
    preferred_group_splits: [],
    available_carts: asArray(raw.available_carts).map((item) => {
      const cart = asRecord(item);
      return { cart_type_id: asString(cart.cart_type_id), count: asNumber(cart.count, 0) };
    }),
    max_batches: asNumber(raw.max_batches, 12),
    max_tasks_per_zone: asNumber(raw.max_tasks_per_zone, 40)
  };
}

export function normalizeHeartbeatRunSummary(rawValue: unknown): HeartbeatRunSummary {
  const raw = asRecord(rawValue);
  return {
    runId: asString(raw.run_id),
    requestId: asString(raw.request_id),
    requestLabel: asString(raw.request_label),
    workflow: asString(raw.workflow) === "replan" ? "replan" : "heartbeat",
    mode: normalizeMode(raw.mode),
    status: asString(raw.status) === "failed" ? "failed" : asString(raw.status) === "partial" ? "partial" : "completed",
    timestamp: asString(raw.timestamp),
    computationTime: asNumber(raw.computation_time),
    solutionId: asString(raw.solution_id),
    tradeoffLabel: asString(raw.tradeoff_label)
  };
}

export function normalizeHeartbeatPlan(rawValue: unknown): HeartbeatPlan {
  const raw = asRecord(rawValue);
  const metrics = asRecord(raw.metrics);
  return {
    id: asString(raw.id),
    label: asString(raw.label),
    isTessChoice: asBoolean(raw.is_tess_choice),
    summary: asString(raw.summary),
    metrics: {
      lateOrders: asNumber(metrics.late_orders),
      selectedTasks: asNumber(metrics.selected_tasks),
      maxZoneLoad: asNumber(metrics.max_zone_load),
      zoneCrossings: asNumber(metrics.zone_crossings),
      priorityAlignment: asNumber(metrics.priority_alignment),
      throughputPicksPerHour: asNumber(metrics.throughput_picks_per_hour)
    },
    run: normalizeHeartbeatRunSummary(raw.run)
  };
}

export function normalizeKpiSnapshot(rawValue: unknown): KpiSnapshot {
  const raw = asRecord(rawValue);
  return {
    lateOrders: asNumber(raw.late_orders),
    selectedTasks: asNumber(raw.selected_tasks),
    candidateTasks: asNumber(raw.candidate_tasks),
    maxZoneLoad: asNumber(raw.max_zone_load),
    zoneCrossings: asNumber(raw.zone_crossings),
    priorityAlignment: asNumber(raw.priority_alignment),
    throughputPicksPerHour: asNumber(raw.throughput_picks_per_hour)
  };
}

export function normalizeAdoptedEntry(rawValue: unknown): AdoptedPlanHistoryEntry {
  const raw = asRecord(rawValue);
  return {
    id: asString(raw.id),
    adoptedAt: asString(raw.adopted_at),
    plan: normalizeHeartbeatPlan(raw.plan)
  };
}

function normalizePosture(rawValue: unknown, jobConfig: BackendJobConfig): PostureConfig {
  const raw = asRecord(rawValue);
  const weights = asRecord(raw.weights);
  return {
    presetName: asString(raw.preset_name, "Day Shift - deadline protected"),
    weights: {
      deadlineCompliance: asNumber(weights.deadline_compliance, Math.round(jobConfig.weights.tardiness * 100)),
      travelEfficiency: asNumber(weights.travel_efficiency, Math.round(jobConfig.weights.travel_time * 100)),
      zoneBalance: asNumber(weights.zone_balance, Math.round(jobConfig.weights.zone_balance * 100)),
      congestionMinimization: asNumber(weights.congestion_minimization, 0)
    },
    zones: asArray(raw.zones).map((item) => {
      const zone = asRecord(item);
      return {
        zoneId: asString(zone.zone_id),
        zoneName: asString(zone.zone_name, asString(zone.zone_id)),
        maxActiveWork: asNumber(zone.max_active_work, jobConfig.max_tasks_per_zone),
        status: asString(zone.status) === "Blocked" ? "Blocked" : asString(zone.status) === "Restricted" ? "Restricted" : "Active",
        reason: asString(zone.reason)
      };
    }),
    horizon: asString(raw.horizon) === "Next 4 hours" ? "Next 4 hours" : asString(raw.horizon) === "Until I change it" ? "Until I change it" : "This shift"
  };
}

function normalizeSettings(rawValue: unknown): TenantSettings {
  const raw = asRecord(rawValue);
  const hard = asRecord(raw.hard_constraints);
  const integration = asRecord(raw.integration);
  const autonomy = asRecord(raw.autonomy);
  return {
    tenantName: asString(raw.tenant_name, "Tessera East"),
    timezone: asString(raw.timezone, "America/New_York"),
    shifts: asArray(raw.shifts).map((item) => asString(item)).filter(Boolean),
    cycleIntervalMinutes: asNumber(raw.cycle_interval_minutes, 15),
    locationRegex: asString(raw.location_regex),
    routingPoints: asArray(raw.routing_points).map((item) => asString(item)).filter(Boolean),
    hardConstraints: {
      cutoffWindowHours: asNumber(hard.cutoff_window_hours, 2),
      floorCap: asNumber(hard.floor_cap, 40),
      blockedZones: asArray(hard.blocked_zones).map((item) => asString(item)).filter(Boolean)
    },
    integration: {
      platform: "Oracle WMS Cloud",
      pollingIntervalSeconds: asNumber(integration.polling_interval_seconds, 30),
      eventTriggers: asArray(integration.event_triggers).map((item) => asString(item)).filter(Boolean),
      status: asString(integration.status) === "Disconnected" ? "Disconnected" : asString(integration.status) === "Warning" ? "Warning" : "Healthy",
      readEnabled: asBoolean(integration.read_enabled, true),
      writeEnabled: asBoolean(integration.write_enabled, true)
    },
    autonomy: {
      priorityChanges: normalizeMode(autonomy.priority_changes),
      releaseDecisions: normalizeMode(autonomy.release_decisions),
      batchModifications: normalizeMode(autonomy.batch_modifications)
    }
  };
}

export function normalizeBootstrap(rawValue: unknown, session: MockSession): BackendBootstrapBundle {
  const raw = asRecord(rawValue);
  const jobConfig = normalizeJobConfig(raw.job_config);
  const data: AppDataBundle = {
    session,
    posture: normalizePosture(raw.posture, jobConfig),
    posturePresets: asArray(raw.posture_presets).map((item) => asString(item)).filter(Boolean),
    kpi: normalizeKpiSnapshot(raw.kpi),
    zones: asArray(raw.zones).map((item) => {
      const zone = asRecord(item);
      return {
        id: asString(zone.id),
        name: asString(zone.name),
        utilization: asNumber(zone.utilization),
        activeWork: asNumber(zone.active_work),
        cap: asNumber(zone.cap)
      };
    }),
    orders: [],
    batches: [],
    workPackages: [],
    cycles: [],
    alternativesByCycle: {},
    scenarioDefaults: {
      releaseCount: 0,
      zoneCaps: {},
      lockedBatches: [],
      objectiveOverrides: {
        deadlineCompliance: Math.round(jobConfig.weights.tardiness * 100),
        travelEfficiency: Math.round(jobConfig.weights.travel_time * 100),
        zoneBalance: Math.round(jobConfig.weights.zone_balance * 100),
        congestionMinimization: 0
      }
    },
    settings: normalizeSettings(raw.settings),
    users: [{ id: "current-user", name: session.userName, email: session.userEmail, role: session.role }],
    copilotMessages: asArray(raw.copilot_messages).map((item): CopilotMessage => {
      const message = asRecord(item);
      const actor = asString(message.actor);
      return {
        id: asString(message.id),
        actor: actor === "operator" || actor === "tess" ? actor : "system",
        text: asString(message.text)
      };
    })
  };

  return {
    data,
    initialHeartbeatPlanSets: asArray(raw.heartbeat_plan_sets).map((set) => asArray(set).map(normalizeHeartbeatPlan)),
    adoptedPlansHistory: asArray(raw.adopted_plans_history).map(normalizeAdoptedEntry),
    jobConfig,
    activeJobIds: asArray(raw.active_job_ids).map((item) => asString(item)).filter(Boolean)
  };
}

export function normalizeHeartbeatRunResponse(rawValue: unknown) {
  const raw = asRecord(rawValue);
  return {
    runId: asString(raw.run_id),
    status: asString(raw.status),
    plans: asArray(raw.plans).map(normalizeHeartbeatPlan)
  };
}

export function normalizeRunDetails(rawValue: unknown): HeartbeatRunDetails {
  const raw = asRecord(rawValue);
  const context = asRecord(raw.request_context);
  const weights = asRecord(context.weights);
  const penalties = asRecord(context.penalties);
  const limits = asRecord(context.limits);
  const metrics = asRecord(raw.solution_metrics);
  return {
    ...normalizeHeartbeatRunSummary(raw),
    responseId: asString(raw.response_id),
    requestContext: {
      requestId: asString(context.request_id),
      responseId: asString(context.response_id),
      jobId: asString(context.job_id),
      tenantId: asString(context.tenant_id),
      facilityId: asString(context.facility_id),
      requestTimestamp: asString(context.request_timestamp),
      responseTimestamp: asString(context.response_timestamp),
      candidateTaskCount: asNumber(context.candidate_task_count),
      distinctOrderCount: asNumber(context.distinct_order_count),
      weights: {
        travelTime: asNumber(weights.travel_time),
        tardiness: asNumber(weights.tardiness),
        zoneBalance: asNumber(weights.zone_balance)
      },
      penalties: {
        zoneCross: asNumber(penalties.zone_cross),
        splitOrder: asNumber(penalties.split_order),
        groupingViolation: asNumber(penalties.grouping_violation)
      },
      limits: {
        maxBatches: asNumber(limits.max_batches),
        maxTasksPerZone: asNumber(limits.max_tasks_per_zone)
      },
      availableCarts: asArray(context.available_carts).map((item) => {
        const cart = asRecord(item);
        return { cartTypeId: asString(cart.cart_type_id), count: asNumber(cart.count) };
      }),
      noGoZones: asArray(context.no_go_zones).map((item) => asString(item)).filter(Boolean),
      blockedAisles: asArray(context.blocked_aisles).map((item) => asString(item)).filter(Boolean),
      blockedTerminals: asArray(context.blocked_terminals).map((item) => asString(item)).filter(Boolean)
    },
    solutionMetrics: {
      totalDistance: asNumber(metrics.total_distance),
      totalDuration: asNumber(metrics.total_duration),
      totalTardiness: asNumber(metrics.late_risk_cost),
      nLateOrders: asNumber(metrics.n_late_risk_orders),
      nBatches: asNumber(metrics.n_batches),
      nSelectedTasks: asNumber(metrics.n_selected_tasks),
      nUnselectedTasks: asNumber(metrics.n_unselected_tasks),
      maxZoneLoad: asNumber(metrics.max_zone_load),
      nZoneCrossings: asNumber(metrics.n_zone_crossings),
      nSplitOrders: asNumber(metrics.n_split_orders),
      nGroupingViolations: asNumber(metrics.n_grouping_violations),
      priorityAlignment: asNumber(metrics.priority_alignment),
      batchDurationBalance: asNumber(metrics.batch_duration_balance),
      batchDistanceBalance: asNumber(metrics.batch_distance_balance)
    },
    batches: asArray(raw.batches).map((item) => {
      const batch = asRecord(item);
      const route = asRecord(batch.route);
      const batchMetrics = asRecord(batch.batch_metrics);
      return {
        batchId: asString(batch.batch_id),
        priorityRank: asNumber(batch.priority_rank),
        priorityScore: asNumber(batch.priority_score),
        cartTypeId: asString(batch.cart_type_id),
        taskIds: asArray(batch.task_ids).map((value) => asString(value)).filter(Boolean),
        orderIds: asArray(batch.order_ids).map((value) => asString(value)).filter(Boolean),
        waveId: asString(batch.wave_id),
        zones: asArray(batch.zones).map((value) => asString(value)).filter(Boolean),
        route: {
          startNodeId: asString(route.start_node_id),
          endNodeId: asString(route.end_node_id),
          distance: asNumber(route.distance),
          duration: asNumber(route.duration),
          nZoneCrossings: asNumber(route.n_zone_crossings)
        },
        sequence: asArray(batch.sequence).map((stopValue) => {
          const stop = asRecord(stopValue);
          return {
            taskId: asString(stop.task_id),
            sequenceIndex: asNumber(stop.sequence_index),
            locationId: asString(stop.location_id),
            zoneId: asString(stop.zone_id)
          };
        }),
        batchMetrics: {
          distance: asNumber(batchMetrics.distance),
          duration: asNumber(batchMetrics.duration),
          nLateOrders: asNumber(batchMetrics.n_late_risk_orders),
          tardiness: 0
        }
      };
    }),
    flattenedBatchRows: asArray(raw.flattened_batch_rows).map((item) => {
      const row = asRecord(item);
      return {
        rowId: asString(row.row_id),
        batchId: asString(row.batch_id),
        priorityRank: asNumber(row.priority_rank),
        priorityScore: asNumber(row.priority_score),
        cartTypeId: asString(row.cart_type_id),
        waveId: asString(row.wave_id),
        zones: asArray(row.zones).map((value) => asString(value)).filter(Boolean),
        routeDistance: asNumber(row.route_distance),
        routeDuration: asNumber(row.route_duration),
        routeCrossings: asNumber(row.route_crossings),
        sequenceIndex: row.sequence_index === null ? null : asNumber(row.sequence_index),
        taskId: asString(row.task_id),
        orderId: asString(row.order_id),
        locationId: asString(row.location_id),
        stopZoneId: asString(row.stop_zone_id)
      };
    }),
    taskDetails: Object.fromEntries(
      Object.entries(asRecord(raw.task_details)).map(([taskId, taskValue]) => {
        const task = asRecord(taskValue);
        return [
          taskId,
          {
            orderId: asString(task.order_id),
            skuId: task.sku_id === null ? null : asString(task.sku_id),
            quantity: task.quantity === null ? null : asNumber(task.quantity),
            skuWeight: task.sku_weight === null ? null : asNumber(task.sku_weight)
          }
        ];
      })
    ),
    unselectedTasks: asArray(raw.unselected_tasks).map((item) => {
      const task = asRecord(item);
      return { taskId: asString(task.task_id), reasonCode: asString(task.reason_code) };
    }),
    unselectedTaskCount: asNumber(raw.unselected_task_count),
    unselectedTaskPage: asNumber(raw.unselected_task_page),
    unselectedTaskPageSize: asNumber(raw.unselected_task_page_size)
  };
}

export function normalizeLayoutGraph(rawValue: unknown): LayoutGraphData {
  const raw = asRecord(rawValue);
  const metadata = asRecord(raw.metadata);
  const bounds = asRecord(raw.bounds);
  return {
    metadata: {
      layout_version: asString(metadata.layout_version),
      node_count: asNumber(metadata.node_count),
      edge_count: asNumber(metadata.edge_count),
      pick_node_count: asNumber(metadata.pick_node_count),
      staging_node_count: asNumber(metadata.staging_node_count),
      waypoint_node_count: asNumber(metadata.waypoint_node_count)
    },
    bounds: {
      minX: asNumber(bounds.min_x),
      maxX: asNumber(bounds.max_x),
      minY: asNumber(bounds.min_y),
      maxY: asNumber(bounds.max_y)
    },
    nodeTypeCounts: Object.fromEntries(Object.entries(asRecord(raw.node_type_counts)).map(([key, value]) => [key, asNumber(value)])),
    nodes: asArray(raw.nodes).map((item) => {
      const node = asRecord(item);
      return {
        id: asString(node.id),
        type: asString(node.type),
        zoneId: node.zone_id === null ? null : asString(node.zone_id),
        aisle: node.aisle === null ? null : asString(node.aisle),
        bay: node.bay === null ? null : asNumber(node.bay),
        side: node.side === null ? null : asString(node.side),
        level: node.level === null ? null : asNumber(node.level),
        position: node.position === null ? null : asNumber(node.position),
        locationType: node.location_type === null ? null : asString(node.location_type),
        sourceLocationId: node.source_location_id === null ? null : asString(node.source_location_id),
        x: asNumber(node.x),
        y: asNumber(node.y),
        z: node.z === null ? null : asNumber(node.z)
      };
    }),
    edges: asArray(raw.edges).map((item) => {
      const edge = asRecord(item);
      return { source: asString(edge.source), target: asString(edge.target) };
    })
  };
}

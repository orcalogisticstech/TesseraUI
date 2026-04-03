# Tessera Optimizer Schemas and Evidence

This document defines the target request and response schemas for Tessera's optimizer service, workflow-specific requiredness for heartbeat vs. replan, and evidence tying the fields back to OptiPick's public API and WMS data surfaces.

## Design Principles

**One canonical request schema** serves both workflows. The schema has a fixed structure; what varies between heartbeat and replan is which fields are required vs. optional. Heartbeat stays thin (close to OptiPick's proven integration footprint). Replan adds richer state.

**Configuration is split into two layers.** `site_config` captures slow-changing physical truths about the warehouse — cart types, routing policies, zone crossing rules, terminal nodes, travel metric. `job_config` captures per-shift or mid-shift adjustable settings — objective weights, penalties, available carts, batch limits, grouping split rules. Both are inlined in every request; the optimizer is stateless. All temporary physical unavailability (blocked locations, zones, aisles, terminals) lives in `state`, regardless of whether it was set by the operator or detected by the adapter.

**The optimizer is state-driven.** The request doesn't specify what event occurred or whether the optimizer should do a local repair, partial re-optimization, or full re-optimization. On a replan, the optimizer compares the current tasks and state against the previous plan and infers both what changed and the appropriate scope of response.

**`planning_constraints` on tasks are adapter-derived.** The integration layer sets these flags based on WMS task status, workflow mode, and customer rules. They tell the optimizer what it's allowed to change about each task (can it be rebatched? deferred? resequenced?). This is distinct from the objective weights in `job_config`, which express *strategic intent* — what to optimize for. The constraints say "you may rebatch this task"; the weights say "when you rebatch, prioritize deadline compliance over travel."

---

# 1) Request Schema

## `OptimizerPlanRequest`

```json
{
  "schema_version": "1.0",
  "request_id": "req_20260328_1500_001",
  "tenant_id": "acme",
  "facility_id": "atl-01",
  "layout_uri": "s3://tessera-layouts/acme/atl-01/v3/graph.json",
  "workflow": "heartbeat",
  "mode": "advisory",

  "job": {
    "job_id": "job_20260328_1500",
    "created_ts": "2026-03-28T15:00:00Z",
    "requested_by": {
      "actor_type": "system",
      "actor_id": "heartbeat_scheduler"
    }
  },

  "site_config": {
    "cart_types": [
      {
        "cart_type_id": "standard_tote_cart",
        "max_items": 40,
        "max_weight_kg": 35.0,
        "max_volume_m3": 0.12,
        "max_totes": 6
      }
    ],
    "allowed_routing_policies": ["FREE", "S_SHAPE"],
    "zone_crossing": {
      "allowed": true,
      "max_crossings_per_route": 3
    },
    "order_splitting_allowed": true,
    "start_node_ids": ["STAGE_A"],
    "end_node_ids": ["PACK_1", "PACK_2"],
    "travel_metric": "DISTANCE"
  },

  "job_config": {
    "weights": {
      "travel_time": 0.4,
      "tardiness": 0.5,
      "balance": 0.1
    },
    "penalties": {
      "zone_cross": 10.0,
      "split_order": 50.0,
      "grouping_violation": 20.0
    },
    "required_group_splits": [
      ["hazmat", "non_hazmat"]
    ],
    "preferred_group_splits": [
      ["dock_appt_3pm", "dock_appt_5pm"]
    ],
    "available_carts": [
      {
        "cart_type_id": "standard_tote_cart",
        "count": 18
      }
    ],
    "max_batches": 20,
    "max_tasks_per_zone": 40
  },

  "pick_work_release": {
    "release_id": "pwr_20260328_1500",
    "created_ts": "2026-03-28T15:00:00Z",
    "tasks": [
      {
        "task_id": "task_1001",
        "task_type": "pick",
        "task_status": "candidate",
        "order_id": "order_501",
        "order_line_id": "1",
        "wave_id": "wave_20260328_1400",
        "current_batch_id": null,
        "current_list_id": null,
        "current_sequence": null,

        "location_ids": ["A1-24-006A"],
        "location_id_processed": null,
        "zone_id": "ZONE_A",

        "sku_id": "sku_1",
        "quantity": 2,
        "uom": "each",
        "hu_id": null,
        "hu_type": "tote",

        "order_priority": 2,
        "sequence_priority": null,
        "release_time": "2026-03-28T14:40:00Z",
        "due_time": "2026-03-28T18:00:00Z",
        "carrier_cutoff_time": "2026-03-28T17:30:00Z",

        "sku_width": null,
        "sku_height": null,
        "sku_depth": null,
        "sku_weight": null,

        "group_ids": ["non_hazmat", "dock_appt_3pm"],

        "planning_constraints": {
          "must_include": false,
          "must_exclude": false,
          "can_rebatch": true,
          "can_resequence": true,
          "can_defer": true
        },

        "extra": {}
      }
    ]
  },

  "state": {
    "external_floor_load": [
      {
        "zone_id": "ZONE_A",
        "active_task_count": 18,
        "active_batch_count": 2
      },
      {
        "zone_id": "ZONE_B",
        "active_task_count": 12,
        "active_batch_count": 2
      }
    ],

    "current_plan": {
      "batches": [
        {
          "batch_id": "batch_9",
          "task_ids": ["task_701", "task_702"],
          "priority_rank": 4,
          "zones": ["ZONE_A", "ZONE_B"]
        }
      ]
    },

    "blocked_locations": [
      {
        "location_id": "A1-24-006A",
        "reason": "cycle_count"
      },
      {
        "location_id": "B2-10-004",
        "reason": "replenishment_pending"
      }
    ],

    "blocked_zones": [
      {
        "zone_id": "ZONE_D",
        "reason": "equipment_down"
      }
    ],

    "blocked_aisles": [
      {
        "aisle_id": "A1-24",
        "reason": "spill"
      }
    ],

    "blocked_terminals": [
      {
        "node_id": "PACK_2",
        "reason": "equipment_down"
      }
    ]
  }
}
```

## Field-by-field notes

**Request-level fields.** `schema_version`, `request_id`, `tenant_id`, and `facility_id` identify the request. `layout_uri` references the pre-ingested warehouse graph (produced by a one-time layout integration pipeline). `workflow` is an enum (`heartbeat` | `replan`). `mode` is an enum (`advisory` | `closed_loop`).

**`job`.** Envelope for the optimizer run. `job_id` is a unique identifier for this run. A single `release_id` may appear across multiple jobs (e.g., the same set of tasks optimized under different postures). `requested_by` identifies what triggered the request — a scheduled heartbeat, Tess translating an operator command, or an event-driven replan.

**`site_config`.** Physical truths about the warehouse that change infrequently (weeks/months). `cart_types` defines the catalog of cart types and their physical limits — the optimizer assigns tasks to batches within these constraints. `allowed_routing_policies` declares which routing strategies the layout supports. `zone_crossing` controls whether the optimizer can build routes that cross zone boundaries, and if so, how many crossings per route. `order_splitting_allowed` says whether tasks from the same order can end up in different batches. `start_node_ids` and `end_node_ids` are the terminal nodes in the layout graph where routes begin and end (staging areas, pack stations). `travel_metric` selects whether the optimizer minimizes distance or time.

**`job_config`.** Per-shift or mid-shift adjustable settings.

`weights` is the posture — the objective weights that express strategic intent. The weights must form a convex combination (sum to 1.0). A higher `tardiness` weight means the optimizer will sacrifice travel efficiency to protect deadline compliance. The exact way these weights parameterize the objective function is an optimizer-internal concern; the contract is that increasing a weight increases the optimizer's emphasis on that objective relative to the others.

`penalties` are costs the optimizer incurs for undesirable structural outcomes (crossing zones, splitting orders, violating grouping rules). The `grouping_violation` penalty applies when tasks with group_ids listed in `preferred_group_splits` end up in the same batch.

`required_group_splits` is a list of group_id pairs that must be in separate batches (hard constraint). If a task has `group_ids: ["hazmat"]` and another has `group_ids: ["non_hazmat"]`, and `["hazmat", "non_hazmat"]` is in `required_group_splits`, the optimizer will never place them in the same batch. `preferred_group_splits` is the soft version — the optimizer will avoid co-batching tasks with those group_id pairs but may do so if the trade-offs demand it, incurring the `grouping_violation` penalty.

`available_carts` declares how many of each cart type are available for this run. `max_batches` caps the total number of batches the optimizer can create, limiting how much work gets released. `max_tasks_per_zone` caps the number of tasks assigned to any single zone, preventing zone overload.

**`pick_work_release`.** Wrapper around the task list. `release_id` tracks which batch of tasks was sent together. `tasks` is the array of task objects the optimizer should plan.

**`state`.** All temporary physical unavailability and floor context lives here — whether set by the operator ("Zone D is closed for cycle count this shift") or detected by the adapter ("location B2-10-004 awaiting replenishment"). The orchestrator merges both sources into a single state snapshot before sending the request. The optimizer is state-driven: on a replan, it examines the tasks and the state and determines the right response. `external_floor_load` provides per-zone task and batch counts for work on the floor that is *not* included in this request. `current_plan` carries the previous cycle's batch assignments so the optimizer can do incremental repair rather than replanning from scratch. `blocked_locations`, `blocked_zones`, `blocked_aisles`, and `blocked_terminals` identify temporarily unavailable physical elements, each with a reason. See Section 4 for the full breakdown.

---

# 2) Response Schema

## `OptimizerPlanResponse`

```json
{
  "schema_version": "1.0",
  "response_id": "resp_20260328_150004_abc",
  "request_id": "req_20260328_1500_001",
  "status": "completed",
  "timestamp": "2026-03-28T15:00:04Z",
  "computation_time": 3.7,

  "request_echo": {
    "request_id": "req_20260328_1500_001",
    "job_id": "job_20260328_1500",
    "tenant_id": "acme",
    "facility_id": "atl-01",
    "layout_uri": "s3://tessera-layouts/acme/atl-01/v3/graph.json",
    "workflow": "heartbeat",
    "mode": "advisory",
    "site_config": {
      "cart_types": [
        {
          "cart_type_id": "standard_tote_cart",
          "max_items": 40,
          "max_weight_kg": 35.0,
          "max_volume_m3": 0.12,
          "max_totes": 6
        }
      ],
      "allowed_routing_policies": ["FREE", "S_SHAPE"],
      "zone_crossing": {
        "allowed": true,
        "max_crossings_per_route": 3
      },
      "order_splitting_allowed": true,
      "start_node_ids": ["STAGE_A"],
      "end_node_ids": ["PACK_1", "PACK_2"],
      "travel_metric": "DISTANCE"
    },
    "job_config": {
      "weights": {
        "travel_time": 0.4,
        "tardiness": 0.5,
        "balance": 0.1
      },
      "penalties": {
        "zone_cross": 10.0,
        "split_order": 50.0,
        "grouping_violation": 20.0
      },
      "required_group_splits": [
        ["hazmat", "non_hazmat"]
      ],
      "preferred_group_splits": [
        ["dock_appt_3pm", "dock_appt_5pm"]
      ],
      "available_carts": [
        {
          "cart_type_id": "standard_tote_cart",
          "count": 18
        }
      ],
      "max_batches": 20,
      "max_tasks_per_zone": 40
    }
  },

  "validation": {
    "invalid_tasks": [
      {
        "task_id": "task_999",
        "reason": "Location not found in layout graph"
      }
    ],
    "warnings": []
  },

  "solutions": [
    {
      "solution_id": "sol_primary",
      "tradeoff_label": "primary",

      "solution_metrics": {
        "total_distance": 7100.0,
        "total_duration": 9400.0,
        "total_tardiness": 0.0,
        "n_late_orders": 0,
        "n_batches": 16,
        "n_selected_tasks": 180,
        "n_unselected_tasks": 60,
        "max_zone_load": 35,
        "n_zone_crossings": 4,
        "n_split_orders": 1,
        "n_grouping_violations": 0,
        "priority_alignment": 0.95,
        "batch_duration_balance": 0.78,
        "batch_distance_balance": 0.82
      },

      "batches": [
        {
          "batch_id": "batch_1",
          "priority_rank": 1,
          "priority_score": 0.94,
          "cart_type_id": "standard_tote_cart",
          "task_ids": ["task_1001", "task_1002"],
          "order_ids": ["order_501", "order_502"],
          "wave_id": "wave_20260328_1400",
          "zones": ["ZONE_A"],

          "route": {
            "start_node_id": "STAGE_A",
            "end_node_id": "PACK_1",
            "distance": 410.0,
            "duration": 520.0,
            "n_zone_crossings": 0
          },

          "sequence": [
            {
              "task_id": "task_1002",
              "sequence_index": 1,
              "location_id": "A1-22-003A",
              "zone_id": "ZONE_A"
            },
            {
              "task_id": "task_1001",
              "sequence_index": 2,
              "location_id": "A1-24-006A",
              "zone_id": "ZONE_A"
            }
          ],

          "batch_metrics": {
            "distance": 410.0,
            "duration": 520.0,
            "n_late_orders": 0,
            "tardiness": 0.0
          }
        }
      ],

      "unselected_tasks": [
        {
          "task_id": "task_1401",
          "reason_code": "zone_congestion"
        },
        {
          "task_id": "task_1402",
          "reason_code": "deadline_slack"
        }
      ]
    },

    {
      "solution_id": "sol_min_travel",
      "tradeoff_label": "minimize_travel",

      "solution_metrics": {
        "total_distance": 6200.0,
        "total_duration": 8100.0,
        "total_tardiness": 45.0,
        "n_late_orders": 2,
        "n_batches": 14,
        "n_selected_tasks": 180,
        "n_unselected_tasks": 60,
        "max_zone_load": 42,
        "n_zone_crossings": 2,
        "n_split_orders": 3,
        "n_grouping_violations": 1,
        "priority_alignment": 0.88,
        "batch_duration_balance": 0.71,
        "batch_distance_balance": 0.75
      },

      "batches": ["..."],

      "unselected_tasks": ["..."]
    }
  ],

  "error": null
}
```

### Error response example

When the optimizer fails, `status` is `"failed"`, `solutions` is an empty list, and `error` contains details:

```json
{
  "schema_version": "1.0",
  "response_id": "resp_20260328_150004_def",
  "request_id": "req_20260328_1500_001",
  "status": "failed",
  "timestamp": "2026-03-28T15:00:04Z",
  "computation_time": 2.1,

  "request_echo": { "..." : "..." },

  "validation": {
    "invalid_tasks": [],
    "warnings": []
  },

  "solutions": [],

  "error": {
    "code": "infeasible",
    "message": "No feasible solution found: hard constraints on zone capacity and deadline windows cannot be simultaneously satisfied with the available carts."
  }
}
```

Error codes include: `infeasible` (hard constraints cannot all be satisfied), `timeout` (optimizer exceeded time limit without completing), `invalid_input` (request failed validation), `internal_error` (unexpected failure).

## Field-by-field notes

**Response-level fields.** `schema_version` identifies the response format. `response_id` is a unique identifier for this specific response (distinguishes retries or multiple responses for the same job). `request_id` ties the response back to the request. `status` is an enum (`completed` | `failed` | `partial`). `timestamp` is when the response was produced. `computation_time` is wall-clock seconds the optimizer took.

**`request_echo`.** Contains the request identifiers plus the full `site_config` and `job_config`. This means anyone reading the response can see exactly what weights, penalties, and constraints produced these solutions without looking up the original request. Tasks and state are not echoed — they're large and the caller already has them.

**`validation`.** `invalid_tasks` lists tasks the optimizer couldn't process (bad location, missing required fields) with a reason string. `warnings` captures non-fatal issues that didn't prevent optimization but may affect quality.

**`solutions[]`.** The optimizer returns one or more solutions. The first is the primary solution — the best result given the `job_config` weights (this is "Tess's Choice" from the product description). Additional solutions are neighboring alternatives that trade off one metric for another, so the orchestrator (and ultimately the operator) can see what's available. Each solution is self-contained: you could pick any one and execute it.

**`tradeoff_label`.** A short identifier for what this solution emphasizes. `"primary"` for the main solution. Alternatives get descriptive labels like `"minimize_travel"`, `"zero_late_risk"`, `"balance_zones"`. The optimizer generates these.

**`solution_metrics`.** Aggregate metrics across the entire solution:

- `total_distance`, `total_duration` — sum of travel across all batches.
- `total_tardiness` — sum of lateness (in minutes) for all tasks that miss their deadline. Zero if everything's on time.
- `n_late_orders` — count of orders predicted to miss their carrier cutoff.
- `n_batches`, `n_selected_tasks`, `n_unselected_tasks` — plan shape.
- `max_zone_load` — highest task count in any single zone. Directly relates to the `balance` weight and `max_tasks_per_zone` constraint — if this number is high, one zone is getting hammered.
- `n_zone_crossings` — total zone boundary crossings across all routes. Directly relates to the `zone_cross` penalty.
- `n_split_orders` — count of orders whose tasks ended up in different batches. Directly relates to the `split_order` penalty.
- `n_grouping_violations` — count of batches that contain tasks from group_id pairs listed in `preferred_group_splits`. Directly relates to the `grouping_violation` penalty.
- `priority_alignment` — score from 0 to 1 measuring how well batch priority ranks match the priorities of the orders they contain. 1.0 means every high-priority order is in a high-priority batch. Lower scores mean high-priority orders got placed into batches that will be worked later.
- `batch_duration_balance` — ratio of shortest batch duration to longest (min/max). 1.0 means all batches take roughly the same time. Lower means more skew.
- `batch_distance_balance` — same ratio for distance.

**`batches[]`.** Each batch represents one picker trip — one cart, one route, one sequence of picks.

- `batch_id` — unique within the solution.
- `priority_rank` — the order in which batches should be worked (1 = first).
- `priority_score` — a normalized score (0 to 1) reflecting urgency. Two batches can have close scores but different ranks.
- `cart_type_id` — which cart type from `site_config.cart_types` this batch uses.
- `task_ids`, `order_ids` — what's in the batch.
- `wave_id` — the wave this batch belongs to, if applicable.
- `zones` — list of zone IDs that the batch's tasks touch. Useful for the orchestrator to reason about zone-level impacts.
- `route` — the travel path: start node, end node, total distance, total duration, zone crossings for this route.
- `sequence` — the ordered list of stops. Each stop has the task ID, its position in the sequence, the location, and the zone.
- `batch_metrics` — per-batch predicted metrics: distance, duration, late orders, tardiness.

**`unselected_tasks[]`.** Tasks not assigned to any batch in this solution, with a reason code explaining why (e.g., `zone_congestion`, `deadline_slack`, `capacity_exceeded`, `blocked_location`).

**`error`.** Null on success. On failure, contains `code` (enum: `infeasible`, `timeout`, `invalid_input`, `internal_error`) and a human-readable `message` explaining what went wrong.

---

# 3) Requiredness by Workflow

## A. Heartbeat

### Required
- `schema_version`, `tenant_id`, `facility_id`, `layout_uri`
- `workflow = "heartbeat"`, `mode`
- `job` (full envelope)
- `site_config` (full block)
- `job_config` (full block — weights, penalties, available_carts, max_batches, max_tasks_per_zone; group split lists may be empty)
- `pick_work_release` with `tasks[]`, where each task has at minimum:
  - `task_id`, `task_status`, `order_id`, `location_ids`

### Strongly recommended
- `tasks[].due_time`, `tasks[].carrier_cutoff_time`
- `tasks[].wave_id`
- `tasks[].zone_id`
- `tasks[].current_list_id`, `tasks[].current_sequence`
- `tasks[].group_ids` (if grouping split rules are configured)
- `state.external_floor_load`

### Optional
- `state.current_plan`
- `state.blocked_locations`
- `state.blocked_zones`
- `state.blocked_aisles`
- `state.blocked_terminals`
- SKU dimensions/weights
- `tasks[].planning_constraints` (optional only if the adapter/optimizer default mapping from `task_status` is in force; otherwise explicit)

### Default planning-constraint mapping in heartbeat
When `tasks[].planning_constraints` is omitted in heartbeat, the adapter and optimizer must share a documented default mapping from `task_status` to mutability. A reasonable baseline is:

- `candidate` → `must_include = false`, `must_exclude = false`, `can_rebatch = true`, `can_resequence = true`, `can_defer = true`
- `released` → same as `candidate` unless customer-specific rules say otherwise
- `in_progress` → `can_rebatch = false`, `can_resequence = false`, `can_defer = false`
- `completed` → all flags false

### Semantics
Heartbeat is primarily a candidate-task planning call. The optimizer receives tasks, forms batches, sequences them, and assigns priorities. `state` conditions the release/batching/prioritization decisions, but the optimizer can produce a useful result without a rich live execution snapshot.

---

## B. Replan

### Required
Everything required in heartbeat, plus:

- `workflow = "replan"`
- `state.current_plan` (the optimizer needs to know what it's repairing)
- `state.external_floor_load` (the optimizer needs the full zone-level picture to rebalance)

### Strongly recommended
- `tasks[].planning_constraints` (critical for replan — tells the optimizer which tasks can be modified)
- `tasks[].current_batch_id`
- `tasks[].current_sequence`
- `tasks[].current_list_id`
- `state.blocked_locations`
- `state.blocked_zones`
- `state.blocked_aisles`
- `state.blocked_terminals`

### Semantics On a replan, it examines the tasks (with their current statuses and planning constraints) and the state (external floor load, current plan, blocked locations and zones) and determines the right response. A task pointing at a blocked location signals a short pick. A new high-priority task not in the current plan signals a hot order. Changed deadline fields signal a cutoff shift. The optimizer infers what happened from the data and scopes its re-optimization accordingly — there is no explicit trigger or event signal.

The optimizer uses the difference between the current plan and the current task/state snapshot to determine the appropriate scope of re-optimization (local repair, partial, or full).

### Completed tasks in replan

Completed tasks may appear in replan requests — for example, when an order has been partially picked and the remaining tasks need re-planning in the context of what's already done. Completed tasks must have all `planning_constraints` set to false (`can_rebatch = false`, `can_resequence = false`, `can_defer = false`, `must_include = false`, `must_exclude = false`). The optimizer uses them as context (e.g., to avoid splitting partially-picked orders further) but will not attempt to modify them.

---

# 4) State

The `state` object is the single place for all temporary physical unavailability and floor context. It captures everything the optimizer can't derive from the tasks alone — whether the source is operator configuration ("Zone D is closed for cycle count this shift"), adapter-detected conditions ("location B2-10-004 awaiting replenishment"), or infrastructure state ("pack station 2 is down"). The orchestrator merges all sources into one state snapshot before sending the request.

The design principle is: the adapter and orchestrator provide raw observable facts; the optimizer owns the higher-order reasoning (congestion assessment, release throttling decisions, zone balance evaluation).

Together with the task-level information in `pick_work_release` (each task's status, zone, deadlines, and planning constraints), the state gives the optimizer a complete picture of floor conditions. For a short pick replan, the optimizer sees the affected location in `blocked_locations`, finds the task pointing at it, and either reroutes to an alternate location or defers — all while knowing from `current_plan` which batch to repair and from `external_floor_load` whether the floor can absorb replacement work. For a congestion-driven replan, the optimizer counts tasks per zone from the request, adds the `external_floor_load` per-zone counts, checks `current_plan` to see how batches are distributed, and rebalances. For a blocked zone, the optimizer sees the zone in `blocked_zones`, avoids routing or releasing work into it, and redistributes across remaining zones.

## `state.external_floor_load`
```json
[
  {
    "zone_id": "ZONE_A",
    "active_task_count": 18,
    "active_batch_count": 2
  },
  {
    "zone_id": "ZONE_B",
    "active_task_count": 12,
    "active_batch_count": 2
  }
]
```
Per-zone task and batch counts for work on the floor that is *not* included in this request. The optimizer adds these to the counts it derives from the request's tasks to get the true per-zone load. This is derivable by the adapter: group all active tasks not in this request by zone code. Strongly recommended in heartbeat, required in replan.

## `state.current_plan`
```json
{
  "batches": [
    {
      "batch_id": "batch_9",
      "task_ids": ["task_701", "task_702"],
      "priority_rank": 4,
      "zones": ["ZONE_A", "ZONE_B"]
    }
  ]
}
```
The plan the optimizer produced last cycle. Each batch carries its task assignments, priority rank, and which zones it touches. Not needed in heartbeat (there's nothing to repair). Required in replan so the optimizer can do incremental repair rather than replanning from scratch.

## `state.blocked_locations`
```json
[
  {
    "location_id": "A1-24-006A",
    "reason": "cycle_count"
  },
  {
    "location_id": "B2-10-004",
    "reason": "replenishment_pending"
  }
]
```
Locations that are temporarily unavailable. Each entry carries a reason so the optimizer has context (cycle count, replenishment pending, equipment issue, safety hold, etc.). This absorbs what was previously a separate `inventory_state` module — replenishment delays are represented as blocked locations with `reason: "replenishment_pending"`. The optimizer treats all blocked locations the same today (avoid or defer), but the reason field provides a hook for more nuanced behavior later. Optional in heartbeat, strongly recommended in replan.

## `state.blocked_zones`
```json
[
  {
    "zone_id": "ZONE_D",
    "reason": "equipment_down"
  }
]
```
Zones that are temporarily unavailable, with a reason. The optimizer avoids routing or releasing work into blocked zones. Optional in heartbeat, strongly recommended in replan.

## `state.blocked_aisles`
```json
[
  {
    "aisle_id": "A1-24",
    "reason": "spill"
  }
]
```
Aisles that are temporarily impassable. The optimizer avoids routing through blocked aisles. Optional in heartbeat, strongly recommended in replan.

## `state.blocked_terminals`
```json
[
  {
    "node_id": "PACK_2",
    "reason": "equipment_down"
  }
]
```
Start or end nodes that are temporarily unavailable (a pack station is down, a staging area is full). The optimizer excludes these from route start/end assignments. Optional in heartbeat, strongly recommended in replan.

---

# 5) Shared Task Model

```json
{
  "task_id": "task_1001",
  "task_type": "pick",
  "task_status": "candidate",
  "order_id": "order_501",
  "order_line_id": "1",
  "wave_id": "wave_20260328_1400",
  "current_batch_id": null,
  "current_list_id": null,
  "current_sequence": null,

  "location_ids": ["A1-24-006A"],
  "location_id_processed": null,
  "zone_id": "ZONE_A",

  "sku_id": "sku_1",
  "quantity": 2,
  "uom": "each",
  "hu_id": null,
  "hu_type": "tote",

  "order_priority": 2,
  "sequence_priority": null,
  "release_time": "2026-03-28T14:40:00Z",
  "due_time": "2026-03-28T18:00:00Z",
  "carrier_cutoff_time": "2026-03-28T17:30:00Z",

  "sku_width": null,
  "sku_height": null,
  "sku_depth": null,
  "sku_weight": null,

  "group_ids": ["non_hazmat", "dock_appt_3pm"],

  "planning_constraints": {
    "must_include": false,
    "must_exclude": false,
    "can_rebatch": true,
    "can_resequence": true,
    "can_defer": true
  },

  "extra": {}
}
```

## `task_status` enum
- `candidate` — not yet released; the optimizer may include or defer it
- `released` — released to the floor but not yet started
- `in_progress` — a worker is actively executing it
- `held` — temporarily paused (e.g., awaiting replenishment)
- `blocked` — cannot proceed (e.g., location is inaccessible)
- `completed` — finished; may appear in replan requests for context (e.g., partially picked orders)

The important split is between **status** and **mutability**. `task_status` says what the task currently is; `planning_constraints` says what the optimizer may do with it. These are set by the adapter (integration layer), not the operator. A `released` task might have `can_rebatch = true` (the adapter determines the WMS allows regrouping) or `can_rebatch = false` (the task is already on a cart). A `completed` task must always have all `planning_constraints` set to false. The optimizer respects these flags as hard constraints.

## `group_ids`

An optional list of group labels on each task. Groups are informational by default — the optimizer has no implicit preference to keep tasks with the same group_id together or apart. Grouping behavior is controlled entirely by `required_group_splits` and `preferred_group_splits` in `job_config`. For example, a task with `group_ids: ["hazmat", "dock_appt_3pm"]` will be subject to whatever split rules reference those group IDs.

---

# 6) Evidence by Field Group

The right question for this section is not just “does the WMS expose this exact field name?” It is “can the Tessera adapter populate this field reliably in a realistic integration?” That can happen in four different ways:

- **Direct from WMS** — the source system exposes the field or a very close equivalent.
- **Derived from WMS-visible data** — the source system exposes enough raw fields that the adapter can compute the normalized Tessera field.
- **Integration-configured** — the field is supplied during implementation or maintained by the customer/integration layer rather than read live from the WMS.
- **Tessera-defined** — the field belongs to Tessera’s own optimizer contract and is not expected from the WMS.

This section is therefore about **adapter attainability**, not raw WMS field exposure.

## 6.1 Adapter-supplied operational inputs

These are the fields the adapter is expected to populate from the warehouse environment, either directly or by derivation.

**Integration risk** estimates how likely it is that populating the field will require customer-specific work, nontrivial normalization, or fallback behavior in a production integration stack. It is not a measure of the field’s value to the optimizer.

| Field group | Owned by | Attainability basis | Integration risk | What raw inputs are needed | Evidence | Heartbeat? | Replan? |
|---|---|---|---|---|---|---|---|
| Core task: `task_id`, `order_id`, `wave_id`, `location_ids`, `sku_id`, `quantity`, `hu_id`, `hu_type`, `release_time`, `due_time` | WMS / adapter | **Direct from WMS** | Low | Pick/task objects from the source system | OptiPick’s `picks` schema explicitly includes `pick_id`, `location_id`, `order_id`, `wave_id`, `sku_id`, `quantity`, `hu_id`, `hu_type`, `release_time`, and `due_time`. ([docs.optioryx.com](https://docs.optioryx.com/docs/optipick/latest/optimize-cluster-optimize-cluster-post/)) | Required | Required |
| `current_list_id`, `current_sequence` | WMS / adapter | **Direct from WMS** | Low | Existing grouping/list assignment and as-is sequence | OptiPick explicitly supports `list_id` and `asis_sequence` for as-is grouping and sequence. ([docs.optioryx.com](https://docs.optioryx.com/docs/optipick/latest/optimize-cluster-optimize-cluster-post/)) | Recommended | Recommended |
| `zone_id` | WMS / adapter | **Direct from WMS** or joined from location master | Low | Bin/location metadata, location master, or task line fields | Business Central publicly exposes `Zone Code` on `Warehouse Activity Line`; `Warehouse Shipment Line` also exposes `Zone Code` when bin handling is enabled. ([learn.microsoft.com](https://learn.microsoft.com/en-us/dynamics365/business-central/application/base-application/table/microsoft.warehouse.activity.warehouse-activity-line)) | Recommended | Recommended |
| SKU dimensions/weight | WMS / adapter | **Direct from WMS** or joined from item master | Low to Medium | Pick lines plus item master / WMS task fields | OptiPick includes optional SKU dimension/weight fields; Business Central `Warehouse Activity Line` exposes `Cubage` and `Weight`. ([docs.optioryx.com](https://docs.optioryx.com/docs/optipick/latest/optimize-cluster-optimize-cluster-post/)) | Optional | Optional |
| `task_status` | Adapter | **Derived from WMS-visible data** | Medium | Native task states, activity states, replenishment dependency state | Oracle publicly documents task status changes and replenishment-dependent picks being held/released; SAP EWM publicly documents warehouse task creation and status changes on warehouse requests. The exact Tessera enum is adapter-normalized. ([docs.oracle.com](https://docs.oracle.com/cd/E26401_01/doc.122/e48830/T211976T430466.htm?utm_source=chatgpt.com)) | Required | Required |
| `planning_constraints` | Adapter | **Derived from WMS-visible data** | Medium | Normalized `task_status`, current execution state, workflow mode, customer rules | Oracle and SAP expose enough raw task state to derive whether a task may be rebatched, resequenced, or deferred. These flags are adapter-owned control fields, not native WMS fields. ([docs.oracle.com](https://docs.oracle.com/cd/E26401_01/doc.122/e48830/T211976T430466.htm?utm_source=chatgpt.com)) | Optional in heartbeat if defaults are documented | Strongly recommended |
| `state.external_floor_load` | Adapter | **Derived from WMS-visible data** | Low | Active task objects not included in this request, plus zone membership | Business Central exposes `Zone Code`; Oracle and Blue Yonder publicly describe active task/activity tracking. Per-zone counts are straightforward aggregations over active task objects. ([learn.microsoft.com](https://learn.microsoft.com/en-us/dynamics365/business-central/application/base-application/table/microsoft.warehouse.activity.warehouse-activity-line)) | Recommended | Required |
| `state.current_plan` | Adapter | **Derived from WMS-visible data** / normalized | Medium | Current grouping structures such as lists, warehouse orders, or shipment/activity groupings | OptiPick’s `list_id` is strong evidence for existing grouping, and SAP EWM publicly states that warehouse tasks are grouped into warehouse orders. Together, these support normalizing current active grouping into Tessera batches. ([docs.optioryx.com](https://docs.optioryx.com/docs/optipick/latest/optimize-cluster-optimize-cluster-post/); [help.sap.com](https://help.sap.com/docs/SAP_EXTENDED_WAREHOUSE_MANAGEMENT/9832125c23154a179bfa1784cdc9577a/40525dc2619a256ee10000000a4450e5.html)) | Optional | Required |
| `state.blocked_locations` | WMS / adapter | **Direct from WMS** or **Derived from WMS-visible data** | Medium | Location status, replenishment dependency, inventory/location control tables, exception feeds | Oracle publicly documents replenishment-dependent picking tasks and a Replenishment to Active API; blocked or unavailable pick locations are therefore operationally visible. Other WMSs may expose location status directly or require adapter logic. ([docs.oracle.com](https://docs.oracle.com/en/cloud/saas/readiness/logistics/24d/wms24d/24D-wms-wn-f35242.htm)) | Optional | Strongly recommended |
| `state.blocked_zones` | Adapter | **Derived from WMS-visible data** and sometimes direct | Medium to High | Zone membership, blocked locations, area/zone status feeds, operational exception feeds | Zone membership is directly available in systems like Business Central. A normalized “blocked zone” may be directly available in some WMSs, but can also be derived by the adapter from blocked locations or operational area-status signals. ([learn.microsoft.com](https://learn.microsoft.com/en-us/dynamics365/business-central/application/base-application/table/microsoft.warehouse.activity.warehouse-activity-line)) | Optional | Strongly recommended |
| `state.blocked_aisles` | Orchestrator / adapter | **Integration-configured or derived** | Low to Medium | Operator input (spill, maintenance) or derived from blocked locations within an aisle | Aisle identity is implicit in location IDs in most WMS platforms. Operator-driven blocks are typically entered through the orchestrator. | Optional | Strongly recommended |
| `state.blocked_terminals` | Orchestrator / adapter | **Integration-configured or derived** | Low | Operator input (pack station down, staging full) or derived from equipment status | Terminal nodes are defined in `site_config`; blocking them is an operational decision surfaced through the orchestrator or adapter. | Optional | Strongly recommended |

## 6.2 Integration-configured and Tessera-owned inputs

These fields still belong in the request/response contract, but they are not things we expect a WMS to expose directly.

| Field group | Owned by | Attainability basis | Source of truth | Heartbeat? | Replan? |
|---|---|---|---|---|---|
| `layout_uri` | Layout service / Tessera | **Integration-configured** | Tessera layout-ingestion pipeline and object store | Required | Required |
| `site_config.start_node_ids`, `end_node_ids` | Layout service / integration config | **Integration-configured** | Layout model / site setup | Required | Required |
| `site_config.cart_types` | Integration config / customer setup | **Integration-configured** | Site setup / customer operations data | Required | Required |
| `site_config.allowed_routing_policies`, `zone_crossing`, `order_splitting_allowed`, `travel_metric` | Tessera / integration config | **Tessera-defined or integration-configured** | Tessera policy model plus site setup | Required | Required |
| `job_config.weights`, `penalties`, `required_group_splits`, `preferred_group_splits` | Tessera | **Tessera-defined** | Operator posture / Tess / orchestrator | Required | Required |
| `job_config.available_carts`, `max_batches`, `max_tasks_per_zone` | Tessera / integration config | **Integration-configured** | Shift-level configuration, operator posture, or orchestrator logic | Required | Required |
| `group_ids` | Adapter / customer rules | **Integration-configured** | Customer-specific business rules or adapter enrichment | Recommended when split rules are configured | Recommended |
| Response-only metrics such as `priority_alignment`, `batch_duration_balance`, `batch_distance_balance`, `max_zone_load`, and tradeoff labels | Tessera | **Tessera-defined** | Optimizer output and post-processing | Produced by optimizer | Produced by optimizer |

## Practical conclusion

The most strongly evidenced adapter inputs are still the OptiPick-compatible task object and the as-is grouping/sequence fields. The richer state fields are attainable either directly or by robust derivation from documented task, bin, zone, and activity data. The remaining configuration and scoring fields belong to Tessera’s own contract and should be framed that way rather than as WMS expectations.

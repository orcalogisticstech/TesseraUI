# TESSERA

## The Decision Intelligence Layer for Warehouse Operations

*March 2026*

---

> Tessera is the system that detects operational problems, prescribes mathematically grounded fixes, shows the predicted impact, and surfaces the trade-off space so operators can set strategic intent — all from a single underlying model. It sits on top of a warehouse's existing software and continuously makes better decisions about what work to start, how to group it, and what to do first.

---

## The Problem

Warehouse management systems are good at tracking what's happening and flagging when something goes wrong. A zone is congested. A batch is falling behind. An order is at risk of missing its carrier cutoff. Most systems can detect these problems. Very few can tell you what to do about them in a way that accounts for everything else going on at the same time.

The typical response is either a human manually deciding how to react — often under time pressure, with incomplete information — or a simple rule firing automatically (escalate the priority, pause releases, reassign a worker). These responses treat each problem in isolation. They don't reason about the downstream consequences: deferring one batch to relieve congestion might push three other orders past their deadlines. Escalating a priority might flood a zone that's already overloaded.

The gap isn't in visibility. It's in the step between seeing a problem and knowing the best response given everything else that's happening on the floor.

---

## What Tessera Does

Tessera closes that gap. It provides three decision APIs that address the core operational questions a warehouse faces every few minutes, backed by an optimization engine that reasons about all of them jointly.

### Optimize Release

Controls the flow of work onto the warehouse floor. Given the current backlog of orders and operating conditions, it recommends which work should become active now versus wait until a later cycle. The goal is to keep the floor neither starved for work nor overwhelmed by it.

**Inputs:** Open orders, promised ship times, current active work count, available staff, zone congestion levels.

**Outputs:** Each order marked as "release now" or "defer," an explanation of the reasoning, and a predicted effect on congestion and deadline compliance.

### Optimize Batching

Groups released work into efficient work packages — batches or clusters — so the floor is not flooded with scattered, unrelated tasks. Grouping reflects item proximity (how close items are to each other in the warehouse), order similarity, and zone balance.

**Inputs:** Released orders, item storage locations, zone layout, constraints on batch size or equipment.

**Outputs:** Work packages with order assignments, an explanation of the grouping logic, and predicted efficiency gains (travel distance reduction, zone balance improvement).

### Prioritize Work

Ranks active work packages so the team knows what deserves attention first. Priority reflects not just urgency (deadline proximity) but also floor conditions (zone congestion) and operational efficiency (whether working a different batch first would reduce waiting or travel for everyone).

**Inputs:** Active work packages, shipping deadlines, zone congestion, worker availability, queue state.

**Outputs:** A ranked list with priority scores, explanations for the ranking, and the predicted impact of following the recommended sequence versus the default order.

---

## The Core Idea: One Model That Explains, Decides, and Predicts

Most warehouse software separates analytics, decision-making, and simulation into different tools — or doesn't offer all three at all. Tessera unifies them because they're all expressions of the same underlying optimization model.

### Explain: What's Going Wrong and Why

Tessera doesn't just flag that a zone is congested or that a batch is behind schedule. Because the optimization model encodes the relationships between release volume, batch composition, zone capacity, and deadline risk, it can trace the *cause*: this zone is congested because the last release cycle pushed too many orders into a narrow area of the warehouse, and the current batch structure is making it worse by concentrating picks there. That causal reasoning is a natural byproduct of the optimization — it's not a separate analytics layer bolted on top.

The analytics Tessera provides are specifically the insights only the optimization model can generate. For example: how much travel distance the current batching strategy costs compared to what the optimizer would produce, or how many late shipments could have been avoided last week if the release recommendations had been followed. These are things the WMS can't show because they require counterfactual reasoning — comparing what happened against what a better decision would have produced.

### Decide: What to Do About It

This is the core. When Zone C is congested, Tessera doesn't just alert you. It re-batches the active work to shift 30% of picks to Zone D, re-ranks priorities so the zone can drain, and adjusts the next release cycle to throttle new work flowing into that area. All of these adjustments happen in a single optimization pass that accounts for deadlines, travel distance, worker capacity, and zone balance simultaneously.

This joint reasoning is what separates structured mathematical optimization from simple rule-based systems. A rule-based system applies one fix at a time: escalate priority, then check if that caused a new problem, then apply another fix. An optimization model — whether solved exactly or via a well-designed heuristic — evaluates all the constraints together and finds a solution that balances them. The practical difference is that the optimizer can discover non-obvious trade-offs — like deferring a low-urgency batch and releasing a smaller set of geographically clustered orders that reduces total travel by 20% without increasing late-shipment risk. A rule-based system would never find that because no single rule encodes that interaction.

### Predict: What Would Happen If

Before committing to any recommendation, Tessera can show the predicted impact. This works because the same model that generates the decision can be re-run under different assumptions. An operations manager can ask: "What if I release 80 orders instead of 120?" or "What if I lock this batch and let the optimizer re-arrange everything else around it?" The optimizer runs with modified inputs and returns a comparison — predicted travel distance, predicted congestion, predicted deadline compliance — for each scenario.

This is scenario analysis driven by the optimization model, not a full discrete-event simulation. The distinction matters: a discrete-event simulation models stochastic processes like random pick times and unplanned equipment downtime at second-by-second granularity. That's a different engineering problem with different accuracy characteristics. What Tessera provides is the ability to compare decision alternatives against the same objective function that drives the actual recommendations. The advantage is that the scenario analysis is perfectly consistent with the decisions — the model you use to predict is the same model that decides for you, so there's no gap between "what the simulation said would happen" and "what the optimizer actually recommended."

---

## Operator Interaction: Surfacing the Trade-Off Space

Optimization systems typically present a single recommendation and ask the operator to accept or override it. That interaction model wastes the operator's most valuable asset: their intuition about the operation. An experienced warehouse manager knows things the model doesn't — that Tuesdays are chaotic because of a specific customer's order pattern, that Zone B's pick times are misleadingly fast because veteran workers self-select into it, that today's afternoon carrier pickup means deadline compliance matters more than usual.

Tessera is designed to channel that intuition into the system rather than work around it. It does this through three layers of interaction, each operating at a different time horizon.

### Strategic Posture (Per Shift or Per Period)

Before a shift starts — or when conditions change mid-shift — the operator configures Tessera's operating posture. This means setting high-level preferences that translate directly into the optimization model's objective weights and constraint parameters:

- "This shift, prioritize deadline compliance over travel efficiency — we have a 2pm carrier cutoff."
- "Cap Zone B at 40% of active work — we're short-staffed there today."
- "For the next 4 hours, minimize congestion above all else — we're running a cycle count in Zone A."

These aren't vague preferences. They're precise inputs to the optimizer. Shifting the weight toward deadline compliance changes which batches get formed and in what order. Capping a zone's workload directly constrains the release and batching solutions. The operator sets the intent; the optimizer handles every tactical decision within that intent.

This is the layer that makes closed-loop automation feel collaborative rather than autonomous. "Let Tess handle the rest" doesn't mean "step away from the operation." It means "I've told the system what matters right now, and it executes accordingly."

### Trade-Off Exploration (On Demand)

When the operator wants to understand the implications of a decision or reconsider the current posture, Tessera surfaces alternatives. Rather than a single recommendation, the system can show meaningfully different strategies — each reflecting a different balance of competing objectives.

For example, the Batching API might present:

- **Tess's Choice** (the default, reflecting the current posture): 10 batches optimized for the shift's stated priorities.
- **Alternative A — Minimize Travel:** Fewer, geographically tight batches. Travel drops 18%, but two batches carry moderate deadline risk.
- **Alternative B — Balance Zones:** Work spread evenly across all zones. Travel increases 12%, but no single zone exceeds 60% utilization.
- **Alternative C — Zero Late Risk:** Every batch structured so that deadline compliance is guaranteed. Travel increases 22%, Zone C gets heavy.

Each alternative shows its predicted impact on the metrics that matter — travel distance, congestion, deadline compliance, zone balance — so the operator can see exactly what they'd be gaining and giving up. This isn't a multiple-choice question on every cycle. It's a tool for understanding the trade-off space, available when the operator wants to engage with it.

The alternatives also serve as a calibration tool for the strategic posture. If the operator consistently picks Alternative B over Tess's Choice, that's a signal that the current objective weights don't reflect their actual priorities. They can adjust the posture accordingly, and Tess's Choice in future cycles will naturally align with what they would have picked.

### Tess's Choice (Every Cycle, Automatic)

The default recommendation, generated automatically based on the current posture and constraints. In advisory mode, it appears on the dashboard with a "recommended" badge. In closed-loop mode, it's what gets executed.

Tess's Choice is not a compromise or a generic middle-ground. It's the best solution the optimizer can find given the specific objective weights and constraints the operator has set. It changes as the posture changes, as floor conditions change, and as the model's parameters calibrate over time. The operator trusts it because they set the posture, they can see alternatives anytime, and the guardrails are in place.

---

### The Optimization Core

Tessera's engine is a suite of mathematical optimization methods — including mathematical programming formulations, structured heuristics, and hybrid approaches — selected and combined based on what each decision problem requires. Some problems (like batching) may be best served by a formal optimization model solved by an engine like HiGHS or Gurobi. Others (like real-time priority re-ranking under tight time constraints) may call for a well-designed heuristic that trades some solution quality for speed. The key is that every method in the suite is grounded in the same underlying model of the warehouse's constraints and objectives, so they produce consistent decisions regardless of which solver technique is used for a given API call.

The model encodes the warehouse's operating constraints — zone capacities, batch size limits, deadline windows, worker availability — as explicit mathematical relationships. The objective is configurable and typically balances travel efficiency, deadline compliance, and zone utilization.

This approach has two properties that matter for the product:

**Constraint satisfaction.** Hard constraints — never defer an order within two hours of its cutoff, never exceed the floor's active work cap — are encoded directly in the optimization model. The system enforces them structurally, not through post-hoc checks on the output.

**Solution quality awareness.** Where formal optimization models are used, the solver can quantify how close its solution is to the best possible answer. Where heuristics are used, the system benchmarks their output against known bounds so that solution quality is always measurable, even when exact optimality isn't the goal.

The optimization core is modular: each API (Release, Batching, Prioritize) can run independently or as part of the full pipeline, and each can be triggered incrementally without re-solving the entire problem from scratch.

### Cadence Model

Tessera uses a dual-cadence architecture.

**Baseline heartbeat (every 15 minutes, configurable).** On a fixed interval, Tessera ingests the full warehouse state and re-runs all three APIs end to end. This handles steady-state operations where nothing dramatic has changed.

**Event-driven triggers.** Certain situations are too time-sensitive to wait for the next heartbeat. When one occurs, only the relevant API fires:

- **Batch completion** triggers a Release re-evaluation (active work dropped, should more enter?).
- **Rush order arrival** triggers Prioritize to re-rank immediately.
- **Congestion threshold crossed** triggers Batching and Prioritize to redistribute pressure.

Each API is callable independently and incrementally. This is an architectural property built in from the start — even in the MVP, which primarily uses the polling mode — because the event-driven path requires it.

### Data Model

The warehouse sends Tessera a state snapshot that follows a standardized schema: open orders, item storage locations, active work, zone conditions, staff availability, and deadline information. Platform-specific adapters translate WMS data formats into Tessera's canonical representation.

The snapshot is deliberately kept simple. The system doesn't require real-time sensor feeds or second-by-second worker tracking. It needs the information a warehouse already has in its WMS — just structured consistently and delivered on a regular cadence.

---

## Positioning: What Tessera Is and Is Not

Tessera is not a warehouse management system. It does not track inventory, manage receiving, or print shipping labels. It is a decision layer that sits on top of the WMS a warehouse already runs and continuously improves the decisions that the WMS's own logic handles with heuristic rules.

The positioning aligns with how major warehouse platforms publicly describe execution. Systems like Oracle WMS, SAP EWM, Manhattan Active WM, and Blue Yonder WES all support work release, task management, priority assignment, and dispatch. Tessera operates within that same vocabulary but provides a mathematically rigorous optimization engine where those platforms use configurable rules.

The core differentiator is joint optimization: the ability to reason about deadlines, congestion, travel distance, worker capacity, and zone balance in a single pass, rather than applying separate rules for each factor sequentially. Combined with the explain-decide-predict loop described above, this means Tessera is the only system that can detect an operational problem, prescribe a fix that accounts for all competing constraints, and show the predicted impact — all from the same model.

---

## Evolution: From Advisory to Closed-Loop

Tessera is designed to scale from a recommendation service into a closed-loop decision layer. The same three APIs and the same optimization core stay at the center throughout. What changes is whether the output goes to a dashboard or gets pushed back into the WMS.

### Phase 1: Advisory Mode (MVP)

The warehouse sends state snapshots and receives recommendation lists. A supervisor reviews them and decides whether to act. The value is immediate: better decisions, visible reasoning, and measurable impact on late shipments, travel distance, and zone congestion. Integration is minimal — a read-only API connection and a dashboard.

### Phase 2: Selective Write-Back

On platforms where public documentation shows writable hooks, Tessera begins pushing decisions back into the WMS. Initial write-back actions are limited to the lowest-risk, most easily reversible decisions: priority re-ranking, task holds and releases, and wave execution triggers.

Oracle's public WMS REST API is the clearest write-back surface, with documented endpoints for waves, task status, assignment, priority changes, and replenishment. SAP's public APIs show task creation and confirmation, supporting a narrower but viable path.

### Phase 3: Closed-Loop Automation

The end state is a system that continuously configures the WMS. Every cycle, Tessera ingests the live state, decides which orders to activate, groups them into work packages, updates priorities, and pushes those decisions so the WMS's own dispatch logic makes better local decisions. The system still produces explanations and predicted effects, but the default is automated execution with human override rather than human approval before every action.

---

## Feedback Loop

The feedback loop is what turns Tessera from a static optimizer into a system that improves over time. It operates at three levels.

### Level 1: Re-Optimization with Fresh State

*Included in the MVP.*

Each cycle uses updated warehouse state as input. If the previous release decision caused congestion, the next cycle sees it and compensates. This is not learning — the solver is re-optimizing with fresh data — but it means the system is self-correcting in a basic, important way.

### Level 2: Parameter Calibration

*First post-MVP investment.*

The system tracks outcomes against predictions: actual pick times versus estimated, actual congestion versus predicted, actual late shipments versus risk scores. Over time, it adjusts the model's internal parameters. If Zone B consistently takes 20% longer to pick than the standard estimate, the system learns to inflate its travel-time estimates for that zone.

This is statistically straightforward — regressions or moving averages on execution logs — and produces meaningful accuracy improvements without exotic ML infrastructure. It's also what makes the "predict" capability increasingly trustworthy: as parameters calibrate to reality, the scenario analysis gets closer to what actually happens.

### Level 3: Structural Learning

*Longer-term research direction.*

Discovers patterns the base model didn't anticipate: SKU combinations that cause packing bottlenecks, order profiles that should never be batched together, decomposition strategies the current methods don't encode. This is where techniques at the intersection of operations research and machine learning become relevant — using data to augment the optimization suite with learned structure.

---

## Guardrails for Closed-Loop Trust

### Hard Constraints

Rules the system will never violate, regardless of optimizer output. Configured per tenant, enforced within the optimization model itself — not as post-processing checks.

- Never defer an order within a configurable window of its shipping cutoff.
- Never release more work than the floor can absorb (configurable active-work cap).
- Never assign work to a zone flagged as blocked.

### Anomaly Detection and Automatic Fallback

If reality diverges from predictions, the system pulls back to advisory mode automatically:

- Actual pick times exceeding estimates by more than a configurable threshold for consecutive cycles.
- Supervisor overrides exceeding a threshold (the human is fighting the system).
- Unexpected spike in late-risk orders.

When triggered, Tessera stops writing back and surfaces an alert instead.

### Graduated Autonomy

Automation scope expands incrementally. Start with the lowest-risk decisions (priority re-ranking, easily reversible), keep higher-stakes decisions (large wave releases, urgent order deferrals) in advisory mode until confidence is established. The customer controls the boundary.

---

## Integration Model

### Read Path (All Platforms)

Every integration starts with periodic state snapshots sent to Tessera's API. The schema is standardized; adapters handle platform-specific translation. The data required — orders, locations, active work, zones, staff — is already in the WMS.

### Write Path (Platform-Dependent)

| Platform | Public Write Surface | Closed-Loop Viability |
|----------|---------------------|----------------------|
| Oracle WMS | Waves, task status, assignment, priority, replenishment | Strong — broadest documented surface |
| SAP EWM | Task creation, confirmation | Narrower but viable for core actions |
| Others | Varies; often limited or undocumented | Advisory mode; write-back evaluated per case |

For platforms without write-back APIs, Tessera is fully valuable in advisory mode. The optimization engine and its explain-decide-predict capabilities don't depend on the write path.

---

## Summary

Tessera is a decision intelligence layer for warehouse operations. It combines four capabilities that are rarely found together and almost never unified under a single model:

**Explain** — trace the root cause of operational problems using the optimization model's understanding of how release volume, batch structure, zone capacity, and deadlines interact. Surface insights that only the optimization can generate: counterfactual comparisons between what happened and what a better decision would have produced.

**Decide** — prescribe mathematically grounded fixes that account for all competing constraints simultaneously, rather than applying rules one at a time. The core is a suite of optimization methods — mathematical programming, structured heuristics, and hybrid approaches — unified by a shared model of the warehouse's constraints and objectives, with hard constraint enforcement built into the optimization itself.

**Predict** — show the expected impact of any decision before committing to it, using the same model that generates the recommendation. Scenario analysis is consistent with actual decisions because the prediction model and the decision model are identical.

**Empower** — surface the trade-off space so operators can set strategic intent rather than react to individual decisions. Shift-level posture configuration, on-demand alternatives, and Tess's Choice work together so that operator intuition guides the system at the strategic level while the optimizer handles tactical execution.

These three capabilities are delivered through three stable APIs — Optimize Release, Optimize Batching, and Prioritize Work — that start as advisory recommendations and scale into closed-loop automation with hard constraints, anomaly detection, and graduated autonomy as guardrails. A three-level feedback loop (re-optimization, parameter calibration, structural learning) ensures the system improves over time.

The result is a product that doesn't replace the warehouse's existing software. It makes that software's decisions better — continuously, transparently, and with mathematical rigor.

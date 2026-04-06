# Tessera Website Copy Reframe: Implementation Spec v2

**Purpose:** Reframe the site from "three named APIs" to "one optimizer that returns a complete plan." Elevate Tess from a single Product page section to a presence across Homepage, Product, and Trust. Add "Empower" as a fourth pillar on the homepage.

**Source of truth for copy intent:** `tessera_product_description_finalv2.md`
**Source of truth for technical accuracy:** `tessera_optimizer_schema_and_evidence_v6.md`

**Key positioning principle for Tess:** Tess is not a chatbot that answers questions about data. It is an agent with direct access to the optimization engine. It can modify optimizer inputs, re-run the model, compare solutions, answer counterfactuals ("what would have happened if..."), and work backward from desired KPI outcomes to the inputs that would achieve them. Every conversation example in this spec should reinforce this distinction. The reader should come away thinking "that's not something a dashboard or a chat interface could do — it's actually running the optimizer."

---

## 1. Homepage (`app/page.tsx`)

### 1a. Hero — no changes

The hero copy ("OPTIMIZE THE SHIFT, NOT JUST THE PICK") and subtitle work. They don't reference the three APIs. Keep as-is.

### 1b. Problem section — no changes

"VISIBILITY ISN'T THE GAP. THE RESPONSE IS." and the four problem cards are solid. Keep as-is.

### 1c. Explain / Decide / Predict → Explain / Decide / Predict / Empower

**Current:** Three steps with `explainSteps` array.

**Change:** Add a fourth step — Empower. Update heading and subtitle.

Replace the `explainSteps` array with:

```ts
const coreCapabilities = [
  {
    id: "01",
    title: "EXPLAIN",
    body: "Trace why the floor looks the way it does. Not alerts — causal reasoning. This zone is congested because the last release pushed too many orders into a narrow area, and batching is concentrating picks there."
  },
  {
    id: "02",
    title: "DECIDE",
    body: "Prescribe a fix that accounts for every constraint at once — deadlines, congestion, travel, labor, zone capacity. One optimization pass, not one rule at a time."
  },
  {
    id: "03",
    title: "PREDICT",
    body: "See impact before you commit. The same model that decides also predicts — what happens at 80 orders instead of 120? Zero gap between forecast and action."
  },
  {
    id: "04",
    title: "EMPOWER",
    body: "Surface the trade-off space so operators set strategic intent rather than react to individual alerts. Shift-level posture, on-demand alternatives, and Tess's Choice — your intuition guides the system, the optimizer handles the rest."
  }
];
```

Section heading: `EXPLAIN, DECIDE, PREDICT, EMPOWER.`

Subtitle: `One model. Four capabilities. Every decision grounded in the same optimization that reasons about all constraints simultaneously.`

Update the variable name reference in JSX from `explainSteps` to `coreCapabilities`.

### 1d. NEW SECTION — Tess homepage introduction

**Insert after** the Explain/Decide/Predict/Empower section and **before** the metrics section.

This section is the "wow" moment — a potential buyer should immediately understand that Tess is not a chatbot on top of a dashboard. It's a conversational interface into a real optimization engine that responds with precision.

**Section heading:**
```
TALK TO YOUR OPTIMIZER. TALK TO TESS.
```

**Subtitle:**
```
Tess doesn't query a dashboard. It invokes the optimizer — modifying inputs, running scenarios, and tracing every answer to a specific constraint or metric in the model.
```

**Layout:** A single card containing 3 conversation snippets stacked vertically, styled like the existing Product page copilot conversations (rounded bordered panels with Operator/Tess exchanges).

**Conversation snippets:**

```ts
const tessHomepageConversations = [
  {
    operator: "We have a 2pm carrier cutoff and we're short-staffed in Zone B.",
    tess: "Updated posture. Deadline compliance weight increased to 0.6 and Zone B capped at 35% active work. Next optimization cycle will reflect both changes."
  },
  {
    operator: "Why is Zone C slowing down?",
    tess: "The last release pushed 38 tasks into Zone C against a capacity of 40. Batching is concentrating picks in aisles C3–C5. I've throttled the next release to 12 tasks for that zone and redistributed 8 tasks to Zone D."
  },
  {
    operator: "How do I get to zero late-risk orders this cycle?",
    tess: "I ran the optimizer with deadline compliance at maximum weight. Zero late-risk is achievable — it requires raising the Zone A task cap from 35 to 48 and accepting 22% more total travel. Three batches currently routed through Zone D would need to reroute through Zone A to meet their cutoffs. Alternative: add 2 carts and I can get to zero late-risk with only 9% more travel and no cap change."
  }
];
```

**Below the conversations**, a short line and a link:

```
See everything Tess can do →  (links to /product#tess)
```

### 1e. Metrics section — no changes

Keep the placeholder metrics as-is.

### 1f. Bottom CTA — no changes

---

## 2. Product Page (`app/product/page.tsx`)

### 2a. Page header

**Current subtitle:** "Three APIs that control what work enters the floor, how it's grouped, and what gets worked first. One optimization model that reasons about all constraints simultaneously."

**New subtitle:** "Give Tessera your open work and floor state. It returns a complete execution plan — which tasks to work, how to group them, what sequence to pick in, and what order to work them — optimized jointly against all your constraints."

Keep headline ("The decision layer your WMS is missing.") and eyebrow ("Product").

### 2b. Three API cards → Four joint decisions

**Current heading:** "THREE DECISIONS. EVERY CYCLE."
**Current subtitle:** "Each API addresses one core question the warehouse faces every few minutes."

**New heading:** "FOUR DECISIONS. ONE PASS."
**New subtitle:** "Every few minutes, the warehouse faces four interrelated questions. Tessera answers them jointly — because the answer to each one depends on all the others."

Replace `apiCards` with:

```ts
const decisionCards = [
  {
    step: "01",
    title: "RELEASE",
    question: "What work should enter the floor right now?",
    body: "Given the current backlog and floor conditions, which orders should be activated and which should wait? Release too much and you overwhelm the floor. Release too little and you starve it."
  },
  {
    step: "02",
    title: "BATCHING",
    question: "How should released work be grouped?",
    body: "Form efficient work packages that reflect item proximity, zone balance, deadline urgency, and equipment constraints — so the floor isn't flooded with scattered, unrelated tasks."
  },
  {
    step: "03",
    title: "ROUTING",
    question: "What sequence should each batch follow?",
    body: "Sequence the stops within each work package to minimize travel, respecting aisle constraints, one-way rules, and zone-crossing penalties."
  },
  {
    step: "04",
    title: "PRIORITIZATION",
    question: "What should be worked first?",
    body: "Rank batches by what actually matters right now — not just deadline urgency, but whether working a different batch first would reduce congestion and total travel for everyone."
  }
];
```

Change grid from `lg:grid-cols-3` to `lg:grid-cols-2`.

Remove the `inputs` and `output` fields from each card — those described the old API contracts.

### 2c. "ONE MODEL. NOT THREE." → "ONE MODEL. ONE PLAN."

**New heading:** "ONE MODEL. ONE PLAN."

Replace body paragraphs with:

```
Paragraph 1:
"These four decisions are not independent — they interact. What you release affects how you can batch. How you batch affects what priorities make sense. How you route affects travel and zone congestion. Tessera solves them from a single model. A release decision never creates work that batching can't feasibly group, and a priority ranking never contradicts the deadlines the batcher already accounted for."

Paragraph 2:
"The result is a complete plan: tasks selected or deferred with reasons, batches formed with pick sequences, priority rankings across batches, and predicted metrics for the whole solution. Hard constraints — never defer an order near its cutoff, never exceed the floor's active-work cap — are enforced inside the model, not as post-hoc checks."

Paragraph 3:
"The API surface that delivers this plan adapts to each customer's integration. That might be one endpoint returning the full solution, separate calls per decision type, or a different decomposition entirely. The model doesn't change; the delivery shape does."
```

### 2d. Operator intent section — minor update

Keep heading: "OPERATOR INTENT, OPTIMIZER EXECUTION."

In the "Tess's Choice" `operatorCards` entry, update body:

**Current:** `"The default recommendation generated from posture. In advisory mode it is recommended, in closed-loop mode it executes."`

**New:** `"The default plan, generated from posture. In advisory mode it appears as a recommendation. In closed-loop mode it executes automatically."`

### 2e. Tess copilot section — expand significantly

This is the "what can I actually ask Tess" section. It should feel comprehensive — a buyer reading this should know exactly what kinds of questions Tess handles and see concrete examples of each.

**Keep the section header:**
```
Eyebrow: AI Copilot
Heading: Talk to your optimizer. Talk to TESS.
```

**Update the subtitle:**

**Current:** "Tess sits between operators and the optimization core. Every claim is grounded in optimizer data."

**New:** "Tess is not a chatbot on top of a dashboard. It has direct access to the optimization engine — it can modify inputs, re-run the optimizer, compare scenarios, and answer counterfactuals. Every response traces to an actual optimizer run, not a generated narrative. Ask what would happen, what should change, or what went wrong — Tess runs the model and shows you."

**Replace the left-side conversation panel and right-side capability cards** with a new layout: four capability blocks, each with a heading, description, and one or two conversation examples. Stack them vertically (full width). Each block is a `marketing-card`.

```ts
const tessCapabilities = [
  {
    title: "TRANSLATE INTENT INTO ACTION",
    description: "Operators don't think in objective weights and constraint parameters. They think in operational language — or in desired outcomes. Tess converts both into optimizer runs. Say what you want to achieve, and Tess figures out what inputs produce that result.",
    conversations: [
      {
        operator: "Prioritize deadline compliance until 2pm — we have a tight carrier cutoff.",
        tess: "Deadline compliance weight set to 0.7, travel weight reduced to 0.2, zone balance at 0.1. This posture will hold until 2pm or until you change it."
      },
      {
        operator: "What if we cap Zone B at 30% instead of 40%?",
        tess: "At 30%: 6 tasks rerouted to Zones A and D, travel increases 8%, zero change in late-risk. At 40%: current plan holds. The tighter cap buys you headroom in Zone B but adds 12 minutes of total travel."
      },
      {
        operator: "I need zone balance above 0.85 without adding any late-risk orders. Is that possible?",
        tess: "I tested three posture configurations. At zone balance weight 0.4: balance reaches 0.88, but 2 orders in Zone A move to moderate late-risk. At zone balance weight 0.3 with Zone C task cap raised from 40 to 45: balance hits 0.86, zero late-risk. That's your best path — it requires allowing 5 more concurrent tasks in Zone C."
      }
    ]
  },
  {
    title: "EXPLAIN EVERY DECISION",
    description: "Every recommendation traces to specific constraints, metrics, and plan artifacts. Tess doesn't generate plausible-sounding narratives — it reads the optimization model's actual reasoning. And because Tess can re-run the optimizer on past state, it can answer counterfactuals: what would have happened if you'd made a different choice?",
    conversations: [
      {
        operator: "Why did you defer order 4210?",
        tess: "Zone C is at 92% of its task cap (37 of 40). Releasing order 4210 would add 4 tasks to Zone C. The model deferred it to the next cycle, when 2 active batches in Zone C will have completed. Deadline risk: none — cutoff is 5:30pm, projected completion at next-cycle release is 4:50pm."
      },
      {
        operator: "Why is Batch 17 ranked ahead of Batch 12?",
        tess: "Batch 17 contains 3 orders with carrier cutoffs before 3pm (earliest: 2:40pm). Batch 12's earliest cutoff is 4:15pm. Under the current posture (deadline weight 0.7), the 90-minute gap drives the ranking. At equal deadline weight, Batch 12 would rank first — it has 18% less travel."
      },
      {
        operator: "Last shift we had 8 late shipments. How many would we have had if we'd followed the recommendations?",
        tess: "I re-ran the optimizer on last shift's starting state with recommendations applied. Projected late shipments: 1 (order 6812, which arrived 12 minutes before cutoff with picks in a blocked zone — no plan avoids that). The other 7 were caused by manual priority overrides that delayed Batches 4, 9, and 11 past their deadline windows."
      }
    ]
  },
  {
    title: "GUIDE THROUGH DISRUPTIONS",
    description: "Short picks, delayed replenishment, hot orders, blocked zones, pack station outages — Tess explains what happened, recommends a response, and tells you whether it's a local repair or a broader re-optimization.",
    conversations: [
      {
        operator: "(Automated alert) Short pick at location A1-24-006A — SKU 3847 quantity zero.",
        tess: "Affected task: task 1001, currently in Batch 4. Alternate location A1-26-002B has 14 units of SKU 3847. I've rerouted the pick — Batch 4 travel increases by 22 meters, no impact on deadline compliance. Local repair only, rest of the plan is unchanged."
      },
      {
        operator: "Pack station 2 just went down.",
        tess: "12 active batches are routed to Pack 2. I've rerouted 8 of them to Pack 1 and deferred 4 to the next cycle to avoid overloading Pack 1. Travel increases 6% across affected batches. 1 order moves from zero late-risk to moderate late-risk (order 5523, cutoff 3:15pm, new projected completion 3:08pm). Recommend monitoring that one."
      }
    ]
  },
  {
    title: "BRIEF EVERY SHIFT",
    description: "Before a shift, Tess reads the starting conditions and suggests a posture. After a shift, it summarizes what happened. Think of it as a weather forecast for the warehouse.",
    conversations: [
      {
        label: "Shift start briefing",
        tess: "Starting backlog: 340 orders, 1,812 tasks. Zone A is clear, Zone C has 18 active tasks carrying over from the previous shift. Earliest carrier cutoff: 1:30pm (22 orders). Suggested posture: deadline compliance at 0.6, travel at 0.3, zone balance at 0.1. Zone B is fully staffed today — no cap needed."
      },
      {
        label: "Shift end summary",
        tess: "Shift complete. 298 of 340 orders fulfilled, 42 deferred to next shift (all with cutoffs after 8pm). Tessera recommendations followed: 89%. Overrides: 12, mostly priority re-rankings in the first hour. Measured impact vs. WMS baseline: travel down 11%, late shipments down from 8 to 1. Pattern: early-shift overrides correlated with Zone B congestion — consider a tighter Zone B cap for tomorrow's start."
      }
    ]
  }
];
```

**Layout note:** Each capability block should be a full-width `marketing-card` with the title and description at the top, followed by the conversation examples as bordered inner panels (similar to the current copilot conversations). For the shift briefing block, conversations have a `label` instead of `operator` — these are Tess monologues, not operator-initiated.

**Add an `id="tess"` anchor** to this section's `<section>` element so the homepage "See everything Tess can do →" link works.

### 2f. Integration section → two tiers

**New heading:** "INTEGRATION SCALES TO YOUR NEEDS."

**New subtitle:** "Tessera connects to your existing WMS. No rip-and-replace. Start simple — go deeper when you're ready."

Replace the two integration cards:

**Card 1:**
```
Title: START SIMPLE
Subtitle: Stateless API — send picks, get a plan
Body: A single request with pick IDs, storage locations, order IDs, and a layout reference. Tessera returns optimized batches with pick sequences and predicted metrics. No persistent connection, no floor state, no write-back required. If you can call a REST endpoint, you can call Tessera.
```

**Card 2:**
```
Title: GO DEEPER
Subtitle: Floor state, re-optimization, closed-loop
Body: Add the order backlog and shipping deadlines, active work state, zone congestion signals, and blocked locations. Tessera gains release control, real-time re-optimization, and the ability to push decisions back into the WMS. The optimizer sees the full picture and scales its response — from local repair on a single batch to full re-optimization of all remaining work.
```

**WMS compatibility table** — update to match product description doc:

```ts
const platformRows = [
  ["Oracle WMS Cloud", "Tasks, waves, replenishment, inventory", "Tasks (hold, release, priority), waves", "Strong"],
  ["SAP EWM", "Warehouse Tasks, Orders, bin content", "Task creation, confirmation", "Viable"],
  ["Business Central", "Activity Lines, Shipment Lines", "Pick creation/re-sequencing", "Viable"],
  ["Others", "Varies", "Often limited or undocumented", "Advisory mode"]
];
```

Update table column headers: `Platform | Read Surface | Write Surface | Closed-Loop Viability`

Keep bottom note: "No custom hardware, no sensor feeds, no worker GPS. Just data your WMS already tracks."

### 2g. Bottom CTA — no changes

---

## 3. Trust Page (`app/trust/page.tsx`)

### 3a. Guardrails — update Anomaly Detection card

Update the "Anomaly Detection" item body:

**New:** "If reality diverges from predictions — pick times exceeding estimates for consecutive cycles, supervisor overrides exceeding a threshold, unexpected spike in late-risk orders — Tessera pulls itself back to advisory mode automatically. The system knows when it's wrong."

### 3b. Advisory / Closed-Loop — update subtitle

**Current:** "Same three APIs. Same optimization core. What changes is whether output goes to a dashboard or back into the WMS."

**New:** "Same optimization core. Same explanations. What changes is whether the plan goes to a dashboard or gets pushed back into the WMS."

### 3c. NEW SECTION — Grounded AI (Tess on Trust page)

**Insert after** the Advisory/Closed-Loop section and **before** the metrics section.

This section makes the trust case for Tess specifically. Two ideas: (1) the grounding principle, and (2) decision review as an operator verification tool.

**Section heading:** "AI THAT SHOWS ITS WORK."

**Subtitle:** "Tess is an AI copilot. That means earning trust, not assuming it."

**Layout:** Two `marketing-card` blocks stacked vertically.

**Card 1 — Grounding principle:**

```
Title: GROUNDED IN OPTIMIZER DATA. NOT GENERATED NARRATIVES.
Body: "Tess is not a language model guessing at warehouse operations. It has direct access to the optimization engine — when you ask a question, Tess modifies inputs and runs the optimizer to find the answer. When Tess says 'this batch was deferred because Zone C is congested,' that points to a specific binding constraint in the model. When it says 'zero late-risk requires raising the Zone A cap to 48,' that's the result of an actual optimizer run with modified parameters. If Tess can't ground a statement in optimizer output, it doesn't make the statement."
```

**Card 2 — Decision review:**

```
Title: THE OPERATOR VERIFIES. ALWAYS.
Body: "In advisory mode, Tess helps operators review recommendations efficiently — 'Summarize the top three changes,' 'Which ones are reversible?,' 'Which one reduces deadline risk the most?,' 'Apply only the priority updates.' In closed-loop mode, Tess becomes the transparency surface — 'Why did the system fall back to advisory?,' 'Pause automatic release changes next cycle,' 'Require approval for large deferrals.' The operator always has the tools to check the system's work."
```

### 3d. Metrics, bottom CTA — no changes

---

## 4. Team Page (`app/team/page.tsx`)

No changes. The `whyCards` array has been removed.

---

## 5. Demo Page (`app/demo/page.tsx`)

No changes.

---

## Section order summary (for reference)

### Homepage
1. Hero
2. The Problem
3. Explain, Decide, Predict, Empower
4. **NEW: Talk to Your Optimizer. Talk to TESS.** ← new section
5. Rigor You Can Measure (metrics)
6. Ready to See It Run? (CTA)

### Product Page
1. Page header
2. Four Decisions. One Pass. (was "Three Decisions")
3. One Model. One Plan. (was "One Model. Not Three.")
4. Operator Intent, Optimizer Execution.
5. **EXPANDED: Talk to Your Optimizer. Talk to TESS.** ← now 4 capability blocks with conversations
6. Integration Scales to Your Needs. (was "Same Systems" with Minimal/Full)
7. Ready to Go Deeper? (CTA)

### Trust Page
1. Page header
2. Autonomy, With Guardrails. (anomaly detection card updated)
3. Advisory or Closed Loop. (subtitle updated)
4. **NEW: AI That Shows Its Work.** ← grounding + decision review
5. Rigor You Can Measure (metrics)
6. See It in Action. (CTA)

---

## Data changes summary

| File | Variable/Section | Action |
|---|---|---|
| `app/page.tsx` | `explainSteps` | Rename to `coreCapabilities`, add EMPOWER, update heading |
| `app/page.tsx` | New section | Add Tess homepage intro with 3 conversation snippets |
| `app/product/page.tsx` | `apiCards` | Replace with `decisionCards` (4 items, no inputs/output) |
| `app/product/page.tsx` | Grid layout | Change `lg:grid-cols-3` to `lg:grid-cols-2` |
| `app/product/page.tsx` | "ONE MODEL" section | New heading + 3 new body paragraphs |
| `app/product/page.tsx` | Page subtitle | Rewrite for unified plan output |
| `app/product/page.tsx` | Tess section | Replace with 4 expanded capability blocks with conversations |
| `app/product/page.tsx` | Integration section | Replace with START SIMPLE / GO DEEPER + updated table |
| `app/product/page.tsx` | `platformRows` | Update columns and data to match product description doc |
| `app/product/page.tsx` | Operator "Tess's Choice" card | Update body copy |
| `app/trust/page.tsx` | Anomaly Detection card | Expand body copy |
| `app/trust/page.tsx` | Advisory/Closed-Loop subtitle | Remove "Same three APIs" |
| `app/trust/page.tsx` | New section | Add "AI That Shows Its Work" with grounding + decision review |

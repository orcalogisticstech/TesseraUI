# TESSERA — Brand + UI Specification

**Version 2.0 — March 2026**
**Scope:** Full Web Application (Marketing Site + Product Dashboard)
**Mode:** Dark-first

---

## Contents

1. Brand Identity
2. Voice, Tone, and Language
3. Color System
4. Typography
5. Layout and Spacing
6. UI Component Styling
7. Imagery and Motifs
8. Marketing Site Architecture and Copy
9. Product Application UI Patterns
10. Interaction Patterns: Decision Feed
11. Interaction Patterns: Strategic Posture
12. Interaction Patterns: Trade-Off Exploration
13. Implementation Notes

---

## 1. Brand Identity

### Brand Essence

Tessera is the decision intelligence layer for warehouse operations. It sits on top of existing warehouse management systems and continuously makes better decisions about what work to start, how to group it, and what to do first. The brand communicates scientific rigor applied to real operational problems — not abstract AI promises.

The visual and verbal identity feels like an operating system for decisions: high-contrast, minimal, decisive, and slightly severe. Every element should feel inevitable, not decorative. The system earns trust by showing its reasoning, not by hiding behind a polished surface.

### Brand Positioning

Tessera is not a warehouse management system. It does not track inventory, manage receiving, or print labels. It is a decision layer that ingests warehouse state and returns mathematically grounded recommendations — with explanations, predicted impact, and alternatives — across three stable APIs: Optimize Release, Optimize Batching, and Prioritize Work.

The core differentiator is joint optimization: the ability to reason about deadlines, congestion, travel distance, worker capacity, and zone balance in a single pass, rather than applying separate rules for each factor one at a time.

### Brand Doctrine

These are the seven doctrine lines. Use them as section headings, slide titles, and anchor phrases throughout the marketing site and product UI. They are always rendered in ALL CAPS.

- **DECISIONS, NOT DASHBOARDS.** The hero line. Tessera doesn't show you the problem — it tells you what to do about it.
- **TURN CONSTRAINTS INTO EXECUTION.** The system converts operational constraints into actionable decisions, not just visibility.
- **KILL OPTIMIZATION THEATER.** If it doesn't execute, it's a slideshow. Plans that arrive too late, dashboards that don't decide, rules that don't generalize.
- **EXPLAIN, DECIDE, PREDICT.** One model that traces root causes, prescribes fixes accounting for all constraints, and shows predicted impact before committing.
- **OPERATOR INTENT, OPTIMIZER EXECUTION.** The operator sets the strategy. The math handles every tactical decision within that strategy.
- **AUTONOMY, WITH GUARDRAILS.** Closed-loop automation with hard constraints, anomaly detection, and graduated autonomy.
- **RIGOR THAT MOVES BOXES.** Mathematical optimization applied to the actual floor, not to a simplified model of it.

> **Note:** The old doctrine line "A Mosaic of Decisions" is retired. "Explain, Decide, Predict" replaces it. "Decisions, Not Dashboards" and "Operator Intent, Optimizer Execution" are new additions.

---

## 2. Voice, Tone, and Language

### Tone

- **Declarative.** Short sentences. No hedging ("might," "could," "perhaps"). State what the system does.
- **High-conviction.** Tessera earns conviction by showing its work, not by asserting confidence. Every claim should be traceable to a mechanism.
- **Operator-respectful.** The audience runs warehouses. They know what congestion looks like. Do not explain basics; address trade-offs.
- **Technically precise without jargon dumps.** Use the correct term, then show what it means in context. "Joint optimization" is fine if you show the example of re-batching to relieve congestion while maintaining deadlines.

### Copy Patterns

- Headings: 2–6 words, often ALL CAPS.
- Subheads: 1–2 short lines, plain language.
- Bullets: verb + object or noun phrase. No full paragraphs inside bullets.
- CTAs: "Request a demo," "See it run," "Talk to an operator."

### Approved Vocabulary

constraints, guardrails, audit trail, execution, latency, coordination tax, decision loop, operators, rigor, joint optimization, trade-off space, strategic posture, decision intelligence, explain-decide-predict, Tess's Choice, hard constraints, write-back, advisory mode, closed-loop

### Banned Vocabulary

revolutionary, magical, game-changing, world-class, best-in-class, AI-powered (AI is assumed), disruptive, seamless, next-generation, unlock, empower (except in the specific product context of "empower operators"), leverage (as a verb), synergy

---

## 3. Color System

### Core Backgrounds

| Swatch | Token | Hex | Usage |
|---|---|---|---|
| ■ | Dark Page BG | `#0B0D10` | Primary background (dark-first default) |
| ■ | Light Page BG | `#F5F7FA` | Primary background in light mode |
| ■ | Dark Surface | `#14161B` | Elevated cards, modals, popovers in dark mode |
| ■ | Light Surface | `#FFFFFF` | Elevated cards, modals, popovers in light mode |

### Text

| Swatch | Token | Hex | Usage |
|---|---|---|---|
| ■ | Dark Primary | `#F5F7FA` | Primary text in dark mode |
| ■ | Dark Secondary | `#D5DAE2` | Secondary text, labels in dark mode |
| ■ | Light Primary | `#0B0D10` | Primary text in light mode |
| ■ | Light Secondary | `#4B5563` | Secondary text, labels in light mode |

### Borders and Dividers

| Mode | Value |
|---|---|
| Dark mode | `rgba(245, 247, 250, 0.12)` |
| Light mode | `rgba(11, 13, 16, 0.10)` |

### Accent and Signal

| Token | Hex | Usage |
|---|---|---|
| Signal Lime | `#D8FF2A` | Primary brand accent. One accent per surface. The only brand color. |

### Semantic Colors (UI Only)

These are functional colors for state communication. They are never used as brand accents or decorative elements.

| Token | Hex | Usage |
|---|---|---|
| Danger | `#FF3B30` | Errors, constraint violations, hard-stop states |
| Warning | `#FFB020` | Anomaly alerts, threshold warnings, drift indicators |
| Success | `#34C759` | Constraint compliance, successful write-back, healthy zones |

**Rule:** One accent per surface. Signal Lime is the only brand accent. Semantic colors are reserved for their specific UI states and must never appear decoratively.

---

## 4. Typography

### Font Stack

| Role | Font |
|---|---|
| Headings (Display) | `Space Grotesk` (fallback: `Inter`, `system-ui`) |
| Body / UI | `Inter` (fallback: `system-ui`) |
| Code / Tokens | `JetBrains Mono` or `SF Mono` (fallback: `monospace`) |

### Type Scale

| Element | Size / Line Height | Weight / Tracking |
|---|---|---|
| H1 (Hero) | 64px / 1.0 | 600–700 / -0.02em |
| H2 (Section) | 44px / 1.05 | 600 / -0.01em |
| H3 (Subsection) | 28px / 1.15 | 600 / 0 |
| Body (Marketing) | 18px / 1.5 | 400–500 / 0 |
| Body (App UI) | 14–16px / 1.5 | 400–500 / 0 |
| Small / Label | 13px / 1.4 | 500 / 0.01em |
| Code | 13–14px / 1.5 | 400 / 0 |

### Typographic Signature

- Headings are often ALL CAPS, especially doctrine lines and section headers.
- Minimal punctuation in headings. No periods at end of headlines.
- Dense hierarchy: large H1 with generous whitespace, tight line spacing on body text.
- In the product UI, body text drops to 14–16px and line height stays at 1.5 for readability in dense data contexts.

---

## 5. Layout and Spacing

### Grid

| Property | Value |
|---|---|
| Max content width | 1120–1200px |
| Column system | 12-column |
| Gutter | 24px |
| App sidebar width | 240–280px (collapsible to 64px icon rail) |

### Vertical Spacing

| Context | Desktop | Mobile |
|---|---|---|
| Marketing section padding | 96px | 40px |
| App page padding | 32–48px | 16–24px |
| Card internal padding | 24–32px | 16–24px |
| Between feed items | 12–16px | 8–12px |

### Spacing Scale Tokens

`4, 8, 12, 16, 24, 32, 48, 64, 96`

All spacing values must come from this scale. No arbitrary pixel values.

---

## 6. UI Component Styling

### Cards and Surfaces

| Property | Value |
|---|---|
| Border radius | 16px (marketing), 12px (app UI) |
| Shadow | Minimal or none. Prefer 1px border. |
| Dark card BG | `#14161B` |
| Light card BG | `#FFFFFF` |
| Card border | 1px, uses border token (rgba) |

### Buttons

#### Primary Button

| Property | Value |
|---|---|
| Background | Signal Lime `#D8FF2A` |
| Text color | `#0B0D10` |
| Border radius | 14–16px |
| Padding | 12px 16px |
| Hover | Reduce brightness 8–10% |
| Usage | One per visible viewport. Main CTA only. |

#### Secondary Button

| Property | Value |
|---|---|
| Background | Transparent |
| Border | 1px, subtle border token |
| Text | Inherits current text color |
| Hover | Very subtle background tint |
| Usage | Alternatives, secondary actions, filters. |

#### Ghost Button

| Property | Value |
|---|---|
| Background | Transparent |
| Border | None |
| Text | Signal Lime or secondary text |
| Hover | Underline or subtle tint |
| Usage | Inline actions, links-as-buttons, drill-downs. |

### Chips and Tags

- Neutral background tint by default.
- Semantic colors (danger, warning, success) only when communicating state: constraint violation, anomaly alert, compliance confirmed.
- No bright decorative colors.

### Links

- Default: underline on hover only.
- Signal Lime used for hover/active state, not resting state.

### Tooltips and Popovers

| Property | Value |
|---|---|
| Background | Elevated surface token |
| Border | 1px border token |
| Border radius | 8px |
| Max width | 320px |
| Usage | Explanations, metric definitions, constraint details |

---

## 7. Imagery and Motifs

- Never use stock warehouse photography.
- Prefer: diagrams, simple isometric or tile patterns, product UI screenshots, data visualizations.
- Background graphics: faint tessellation grid at 3–6% opacity when a section needs texture.
- Icons: line-style, 1.5–2px stroke, monochrome (primary text color). No filled icons, no colored icon sets.
- Data visualizations in marketing materials use Signal Lime as the primary data color against the dark background, with secondary text color for axes and labels.
- Illustrations, if any, should be geometric and tile-based, referencing the tessera motif. No organic shapes, no gradients.

---

## 8. Marketing Site Architecture and Copy

The marketing site is a single responsive landing page with a dark-first default and a light mode toggle. The section flow is structured around the product's explain-decide-predict narrative.

### Section 1: Hero

Background: Dark page background (`#0B0D10`). Full viewport height.

- **Headline:** DECISIONS, NOT DASHBOARDS.
- **Subhead:** The decision intelligence layer for warehouse operations. Detect problems, prescribe fixes, show predicted impact — all from a single model.
- **Primary CTA:** Request a demo
- **Secondary CTA:** See it run

### Section 2: The Problem

Replaces the old "Enemy" section with a more precise articulation of the gap Tessera closes.

- **Headline:** KILL OPTIMIZATION THEATER.
- **Subhead:** Your WMS can see the problem. It cannot tell you what to do about it given everything else happening on the floor.

Bullets:
- Rules that fix one problem and create two more
- Escalations that flood already-congested zones
- Dashboards that show the fire but don't hand you the extinguisher
- Every fix evaluated in isolation, never jointly

### Section 3: Explain, Decide, Predict

The core product capability section. Three cards, each corresponding to one capability. This is the conceptual heart of the page.

- **Headline:** EXPLAIN, DECIDE, PREDICT.
- **Subhead:** One model. Three capabilities. Every decision grounded in the same optimization that reasons about all constraints simultaneously.

**Card 1 — Explain:**
Trace the root cause: this zone is congested because the last release cycle pushed too many orders into a narrow area, and the batch structure is concentrating picks there. Counterfactual analysis shows how much a better decision would have saved.

**Card 2 — Decide:**
Prescribe a fix that accounts for every constraint at once. Re-batch active work, re-rank priorities, and throttle the next release — in a single pass. No sequential rule-firing. No fix-one-break-two loops.

**Card 3 — Predict:**
Before committing, see the predicted impact. Same model that decides also predicts. Scenario analysis consistent with actual recommendations — no gap between what the simulation promised and what the optimizer does.

### Section 4: The Three APIs

Concrete product capabilities. Three cards with operational detail.

- **Headline:** THREE DECISIONS. EVERY CYCLE.
- **Subhead:** Each API addresses one core question the warehouse faces every few minutes.

- **OPTIMIZE RELEASE** — Controls what work enters the floor. Release now or defer to the next cycle, with predicted effect on congestion and deadlines.
- **OPTIMIZE BATCHING** — Groups released work into efficient packages. Reflects item proximity, order similarity, zone balance, and equipment constraints.
- **PRIORITIZE WORK** — Ranks active work so the team knows what deserves attention first. Reflects deadline urgency, zone congestion, and system-wide efficiency.

### Section 5: Operator Interaction

Differentiates Tessera from black-box optimizers. Shows the three interaction layers.

- **Headline:** OPERATOR INTENT, OPTIMIZER EXECUTION.
- **Subhead:** Your experience makes the system better, not the other way around. Set the strategy; the math handles the rest.

- **Strategic Posture:** Set shift-level priorities. "This shift, prioritize deadline compliance over travel efficiency." Translates directly into objective weights.
- **Trade-Off Exploration:** See meaningfully different strategies: minimize travel, balance zones, zero late risk. Each with predicted impact. Available when you want to engage with it.
- **Tess's Choice:** The default recommendation, generated every cycle based on your posture. In advisory mode, it appears on the dashboard. In closed-loop mode, it executes.

### Section 6: Trust and Guardrails

- **Headline:** AUTONOMY, WITH GUARDRAILS.
- **Subhead:** Hard constraints. Anomaly detection. Graduated autonomy. Full audit trail.

- Hard constraints: never defer an order near cutoff, never exceed the floor's active-work cap, never assign work to a blocked zone. Enforced inside the optimization, not as post-processing.
- Anomaly detection: if reality diverges from predictions, the system pulls back to advisory mode automatically.
- Graduated autonomy: start with low-risk decisions (priority re-ranking), expand scope as confidence builds. The customer controls the boundary.
- Audit trail: every decision is replayable with full reasoning.

### Section 7: Proof

- **Headline:** RIGOR YOU CAN MEASURE.
- **Subhead:** Before/after metrics and constraint adherence — every run.

Placeholder stats (replace with real data when available):
- -12% travel distance
- -8% pick time
- +15% throughput at same labor
- 100% constraint compliance (or explainable exceptions)

### Section 8: Evolution

Addresses the advisory-to-closed-loop journey.

- **Headline:** FROM ADVISORY TO CLOSED-LOOP.
- **Subhead:** Same three APIs. Same optimization core. What changes is whether the output goes to a dashboard or gets pushed back into the WMS.

- **Phase 1 — Advisory:** Read-only connection. Recommendations on a dashboard. Immediate value: better decisions, visible reasoning.
- **Phase 2 — Selective Write-Back:** Low-risk decisions pushed to the WMS. Priority re-ranking, task holds, wave triggers.
- **Phase 3 — Closed-Loop:** Continuous automated execution with human override. The default is automated; intervention is the exception.

### Section 9: Footer CTA

- **Headline:** READY TO SEE IT RUN?
- **Subhead:** Bring one facility. We'll produce an executable plan.
- **CTA:** Talk to an operator

---

## 9. Product Application UI Patterns

### Overall App Layout

The product application uses a sidebar + main content layout. Dark mode is the default.

| Element | Description |
|---|---|
| Sidebar | Left-aligned, 240–280px. Collapsible to 64px icon rail. Contains: Tessera micro mark, navigation (Decision Feed, Posture, History, Settings), and current shift indicator. |
| Main content | Scrollable feed/timeline. Max content width 960px within the main area, centered. |
| Top bar | Sticky. Shows current cycle status (heartbeat countdown or event trigger), active posture summary, and mode indicator (Advisory / Write-Back / Closed-Loop). |
| Detail panel | Right-side slide-out or full-page drill-down for trade-off exploration and decision detail. |

### Navigation Structure

- **Decision Feed** (default view) — Chronological stream of Tess's recommendations, one card per cycle or event trigger.
- **Strategic Posture** — Configuration view for shift-level priorities, zone caps, and objective weights.
- **History** — Searchable log of past decisions with outcomes vs. predictions.
- **Settings** — Tenant configuration: hard constraints, anomaly thresholds, autonomy scope, integration status.

---

## 10. Interaction Patterns: Decision Feed

The Decision Feed is the primary view in the product application. It is a vertical timeline of decision cycles, with the most recent at the top. Each entry represents one optimization cycle — either a scheduled heartbeat (every 15 minutes by default) or an event-driven trigger (batch completion, rush order, congestion threshold).

### Feed Entry Card

Each feed entry is a card on the dark surface (`#14161B`) with the following structure:

#### Card Header

- Timestamp and trigger type (Heartbeat / Batch Completed / Rush Order / Congestion Alert)
- Cycle number
- Mode badge: Advisory, Write-Back, or Closed-Loop
- Status chip: Executed (green), Pending Review (Signal Lime), Overridden (warning), Anomaly (danger)

#### Card Body: Tess's Choice Summary

A concise natural-language summary of what the optimizer recommended this cycle. For example:

> *"Released 42 of 78 pending orders. Deferred 36 to reduce Zone C congestion (predicted: -18% utilization). Formed 8 batches optimized for travel distance under current posture. Re-ranked 3 active batches to reflect the 2pm carrier cutoff."*

#### Card Body: Key Metrics Row

A horizontal row of 3–5 metric pills showing the predicted impact of this cycle's decisions:

- Travel distance: -12%
- Zone C utilization: 58% (was 76%)
- Late-risk orders: 0
- Constraint compliance: 100%

#### Card Footer: Actions

- **View Alternatives** — Opens the trade-off exploration panel for this cycle.
- **View Detail** — Drill-down into the full Release / Batching / Priority breakdown.
- In Advisory mode: Approve / Override buttons.
- In Closed-Loop mode: Override (with confirmation) and Audit Log link.

### Feed Filtering

- Filter by API: Release, Batching, Priority, or All.
- Filter by trigger type: Heartbeat, Event.
- Filter by status: All, Pending, Executed, Overridden, Anomaly.
- Time range picker for reviewing historical decisions.

### Empty and Loading States

- **Loading:** Skeleton cards with subtle pulse animation (150ms ease).
- **Empty:** "No decisions yet this shift. Next heartbeat in [countdown]."
- **Error:** "Connection to [WMS] interrupted. Last successful sync: [timestamp]." Uses Danger color for the status indicator.

---

## 11. Interaction Patterns: Strategic Posture

The Strategic Posture view is where operators configure Tessera's operating priorities for the current shift or period. Every setting on this page maps directly to a parameter in the optimization model — objective weights, constraint bounds, or zone-level caps.

### Posture Controls

#### Objective Weight Sliders

A set of sliders (or a ranked list with drag-and-drop) for the primary optimization objectives. Each slider adjusts the relative weight of that objective in the optimization model's objective function.

- Deadline compliance (weight: 0–100)
- Travel efficiency (weight: 0–100)
- Zone balance (weight: 0–100)
- Congestion minimization (weight: 0–100)

Weights are normalized internally. The UI shows relative priority, not raw numbers. A plain-language summary updates in real time below the sliders: "Current posture: deadline compliance is the top priority, followed by congestion minimization. Travel efficiency and zone balance are weighted equally."

#### Zone Constraints

Per-zone controls that translate into hard constraints in the optimization model:

- Max active work percentage (slider, 0–100%)
- Zone status toggle: Active / Restricted / Blocked
- Reason field (free text, stored in audit log): "Cycle count in progress"

#### Time Horizon

A time picker that sets the effective period for this posture configuration:

- This shift (auto-expires at shift change)
- Next N hours (countdown displayed)
- Until I change it (persistent)

#### Posture Presets

Saved posture configurations for recurring scenarios. Operators can save and name configurations:

- "Tuesday PM — carrier crunch"
- "Cycle count — Zone A restricted"
- "Normal ops"

### Posture Summary Bar

A persistent summary bar (below the top bar or as a collapsible banner) that shows the active posture at all times throughout the application. This ensures the operator always knows what strategic intent is driving Tess's current decisions. It includes the posture name (if preset), top-priority objective, any zone restrictions, and time remaining.

---

## 12. Interaction Patterns: Trade-Off Exploration

The Trade-Off Exploration panel is accessible from any Decision Feed entry via the "View Alternatives" action. It shows the operator meaningfully different strategies the optimizer can produce for the same set of inputs, each reflecting a different balance of competing objectives.

### Alternatives Layout

The panel displays 2–4 alternatives side by side (on desktop) or stacked (on mobile). Each alternative is a card with a distinct label, metric predictions, and an action to adopt it.

#### Alternative Card Structure

- **Label:** A short, descriptive name. "Tess's Choice," "Minimize Travel," "Balance Zones," "Zero Late Risk."
- **Badge:** "Tess's Choice" gets a Signal Lime badge. Others are neutral.
- **Metric Grid:** A 2×2 or 2×3 grid of key metrics for this alternative. Each metric shows: label, predicted value, and delta from Tess's Choice (color-coded: green if better, danger if worse, neutral if within tolerance).
- **Trade-Off Summary:** One sentence explaining what this alternative prioritizes and what it gives up. Example: "Tighter batches cut travel by 18%, but two batches carry moderate deadline risk."
- **Action:** "Adopt This Plan" (replaces Tess's Choice for this cycle). In Closed-Loop mode, this triggers immediate re-execution.

### Comparison View

A toggle to switch from card view to a comparison table. Rows are metrics; columns are alternatives. Delta cells are color-coded. This is the dense-data view for operators who want to see every number at once.

### Posture Feedback Loop

Below the alternatives, a prompt: "Consistently preferring a different strategy? Adjust your posture to match." with a link to the Posture configuration. This closes the loop described in the product description: if the operator keeps picking Alternative B, the system signals that the current posture weights may not reflect their actual priorities.

---

## 13. Implementation Notes

### Marketing Site

- Single responsive page. Dark-first default with light mode toggle (persist preference in local storage).
- Header: micro mark + "TESSERA" wordmark, navigation links (APIs, How It Works, Trust, Demo), and dark/light toggle.
- Sections use the architecture described in Section 8 of this spec.
- Minimal animation: fade and slide on section reveal, 150–250ms duration, ease-out timing.
- No gradients. No decorative illustrations. Use design tokens exactly as specified.
- If background texture is needed, use a faint tessellation grid at 3–6% opacity.

### Product Application

- Framework: React (or equivalent component-based framework).
- State management should support real-time updates for the Decision Feed (WebSocket or polling on the heartbeat cadence).
- Dark mode is the default. Light mode is available via toggle.
- All spacing, color, and typography values must use the design tokens from this spec. No hardcoded values.
- Animations: 150ms ease for micro-interactions (hovers, toggles). 250ms ease-out for panel transitions and card reveals.
- Responsive: the sidebar collapses to an icon rail at breakpoints below 1024px. The detail panel becomes a full-page view on mobile.
- Accessibility: WCAG 2.1 AA minimum. All interactive elements must have visible focus states (Signal Lime outline). Color is never the sole indicator of state; always pair with text or icons.

### Design Token Format

Export all tokens as CSS custom properties and as a JSON file for use in component libraries.

```css
--tessera-bg-page: #0B0D10;
--tessera-bg-surface: #14161B;
--tessera-text-primary: #F5F7FA;
--tessera-text-secondary: #D5DAE2;
--tessera-accent-signal: #D8FF2A;
--tessera-border: rgba(245, 247, 250, 0.12);
--tessera-danger: #FF3B30;
--tessera-warning: #FFB020;
--tessera-success: #34C759;
--tessera-radius-card: 12px;
--tessera-radius-button: 14px;
--tessera-font-display: 'Space Grotesk', 'Inter', system-ui;
--tessera-font-body: 'Inter', system-ui;
--tessera-font-code: 'JetBrains Mono', 'SF Mono', monospace;
```

### What This Spec Does Not Cover

This spec covers brand identity, visual design system, marketing copy, and product UI interaction patterns. It does not cover:

- API documentation or technical integration guides.
- Backend architecture or data model schemas.
- Detailed animation choreography beyond the timing values specified.
- Content for secondary marketing pages (pricing, about, blog).
- Email templates or outbound marketing materials.

These should be developed as extensions of this spec, using the same tokens, voice, and patterns established here.

---

*END OF SPECIFICATION*

# TESSERA — Implementation Specification

**Website:** runtessera.com
**Application:** runtessera.com/app
**Date:** March 2026
**For implementation by Claude Code / Codex**

**Source of truth for brand/UI tokens:** `tessera_brand_ui_spec_v2.md` and `tailwind.config.ts` in the TesseraUI repo (`github.com/orcalogisticstech/TesseraUI`). Extend the existing codebase rather than starting from scratch.

---

## Table of Contents

### Part 1: Marketing Site
- 1.1 Design System (Reference Summary)
- 1.2 Site Architecture & Navigation
- 1.3 Landing Page (`/`)
- 1.4 Product Page (`/product`)
- 1.5 Trust Page (`/trust`)
- 1.6 Team Page (`/team`)
- 1.7 Demo Page (`/demo`)
- 1.8 Shared: Footer

### Part 2: Application (`/app`)
- 2.1 Application Architecture
- 2.2 Authentication & Tenant Model
- 2.3 Dashboard / Decision Feed
- 2.4 Posture Configuration Panel
- 2.5 Release View
- 2.6 Batching View
- 2.7 Prioritization View
- 2.8 Trade-Off Explorer
- 2.9 Tess Copilot Panel
- 2.10 Cycle History & Audit Trail
- 2.11 Settings & Configuration
- 2.12 Component Library & Design Tokens

---

# PART 1: Marketing Site

---

## 1.1 Design System (Reference Summary)

**This is a condensed reference of the existing brand spec. Do not deviate from these values.**

### Mode

Dark mode only. There is no light mode. Remove the dark/light toggle from the existing site.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Page BG | `#0B0D10` | Primary background |
| Surface | `#14161B` | Elevated cards, modals, popovers |
| Text Primary | `#F5F7FA` | Headings, body text |
| Text Secondary | `#D5DAE2` | Subheadings, labels, captions |
| Border | `rgba(245,247,250,0.12)` | Dividers, card borders |
| **Signal Lime** | **`#D8FF2A`** | **Primary brand accent. The only brand color.** |
| Danger | `#FF3B30` | Errors, constraint violations |
| Warning | `#FFB020` | Anomaly alerts, threshold warnings |
| Success | `#34C759` | Compliance, healthy zones |

**Rule:** One accent per surface. Signal Lime is the only brand accent. Semantic colors are reserved for UI state only.

### Typography

| Role | Font | Fallback |
|------|------|----------|
| Headings (Display) | `Space Grotesk` | `Inter`, `system-ui`, `sans-serif` |
| Body / UI | `Inter` | `system-ui`, `sans-serif` |
| Code / Labels | `JetBrains Mono` | `SF Mono`, `monospace` |

| Element | Size / Line Height | Weight / Tracking |
|---------|-------------------|-------------------|
| H1 (Hero) | 64px / 1.0 | 600–700 / -0.02em |
| H2 (Section) | 44px / 1.05 | 600 / -0.01em |
| H3 (Subsection) | 28px / 1.15 | 600 / 0 |
| Body (Marketing) | 18px / 1.5 | 400–500 / 0 |
| Small / Label | 13px / 1.4 | 500 / 0.01em |

### Spacing & Grid

Max content width: 1120–1200px. 12-column grid, 24px gutters. Spacing scale: `4, 8, 12, 16, 24, 32, 48, 64, 96`. Section vertical padding: 96px desktop, 40px mobile. Card padding: 24–32px desktop, 16–24px mobile.

### Components

Card border radius: 16px (marketing), 12px (app). Button border radius: 14–16px. Shadows: minimal or none, prefer 1px border.

**Primary button:** Signal Lime `#D8FF2A` BG, `#0B0D10` text. One per viewport. Hover: brightness -8%.
**Secondary button:** Transparent, 1px border, inherits text color.
**Ghost button:** Transparent, no border, Signal Lime or secondary text.

### Motion

Section reveal: 150–250ms ease-out, scroll-triggered (IntersectionObserver). Micro-interactions: 150ms ease. Respect `prefers-reduced-motion`.

### Brand Elements to Preserve

- Step numbering ("Step 01") in JetBrains Mono
- Tessera wordmark SVG
- ALL CAPS doctrine-line section headings
- Declarative, high-conviction, anti-buzzword tone
- Faint tessellation grid at 3–6% opacity for background texture
- Line-style icons, 1.5–2px stroke, monochrome

---

## 1.2 Site Architecture & Navigation

### Page Structure

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Landing | The hook. What Tessera is, why it matters. Under 30 seconds. |
| `/product` | Product | Technical depth: the three APIs, operator interaction, Tess copilot, integration model. |
| `/trust` | Trust | Guardrails, advisory-to-closed-loop, proof metrics. Answers "why should I trust this?" |
| `/team` | Team | Who built this and why their background matters. |
| `/demo` | Demo | Dedicated contact/demo request form. |

### Navbar

Fixed top bar, `backdrop-filter: blur(12px)`, page BG at ~80% opacity, z-index 50.

**Left:** Tessera wordmark SVG (link to `/`).

**Center/Right nav links:** Product · Trust · Team

**Far right:** "Request Demo" (Signal Lime primary button, links to `/demo`).

**Mobile:** Hamburger menu, slide-in drawer from right. Same links, CTA at bottom of drawer.

The nav links are page navigations (Next.js `<Link>`), not scroll anchors. Active page gets a Signal Lime underline or dot indicator.

### Page Transitions

Crossfade between pages, 200ms. Content fades in with the standard reveal-up animation on each page load.

---

## 1.3 Landing Page (`/`)

### Purpose

The sharp hook. A visitor should understand what Tessera does and why it matters in under 30 seconds, then either request a demo or click into `/product` for depth. Five sections max.

### Section 1: Hero

Full viewport height (100vh), flex-centered.

- **Eyebrow** (JetBrains Mono, 13px, secondary text, ALL CAPS): `DECISION INTELLIGENCE LAYER`
- **Headline** (H1, 64px, ALL CAPS): `OPTIMIZE THE SHIFT, NOT JUST THE PICK.`
- **Subheadline** (18px, secondary text): "Tessera sits on top of your WMS and continuously makes better decisions about what work to release, how to group it, and what to prioritize — all from a single optimization model."
- **Primary CTA:** "Request a Demo" → `/demo`
- **Secondary CTA:** "See How It Works" (ghost button) → scrolls to Section 3

Subtle scroll-down chevron below CTAs. Optional: faint tessellation grid at 3–6% opacity.

### Section 2: Problem

- **Label** (JetBrains Mono, ALL CAPS): `THE PROBLEM`
- **Headline** (H2, ALL CAPS): `KILL OPTIMIZATION THEATER.`
- **Subhead:** "Your WMS can see the problem. It cannot tell you what to do about it given everything else happening on the floor."

Four pain-point cards in a 2×2 grid (surface BG, 16px radius, 1px border, line-style icon):

| Title | Description |
|-------|-------------|
| Isolated fixes | Rules that fix one problem create two more. Escalating a priority floods an already-congested zone. |
| Frozen configuration | WMS settings reflect last year's reality. Nobody re-tunes because the interdependencies are too complex. |
| No counterfactuals | You can see what happened, but not what a better decision would have produced. |
| Exception paralysis | Every disruption — short picks, late trailers, hot orders — requires a judgment call with incomplete information. |

### Section 3: Explain, Decide, Predict

The core pitch. Keep the existing Step 01/02/03 pattern.

- **Headline** (H2, ALL CAPS): `EXPLAIN, DECIDE, PREDICT.`
- **Subhead:** "One model. Three capabilities. Every decision grounded in the same optimization that reasons about all constraints simultaneously."

Three vertically stacked blocks, step number left (JetBrains Mono), content right. Fade in sequentially on scroll.

**Step 01 — EXPLAIN.** "Trace the root cause." — This zone is congested because the last release cycle pushed too many orders into a narrow area, and the current batch structure is concentrating picks there. Tessera surfaces insights only the optimizer can generate: counterfactual comparisons between what happened and what a better decision would have produced.

**Step 02 — DECIDE.** "Prescribe a fix that accounts for everything." — Re-batch active work to shift picks across zones, re-rank priorities, and throttle the next release — in a single optimization pass. The optimizer finds non-obvious trade-offs a rule-based system would never discover.

**Step 03 — PREDICT.** "See the impact before you commit." — The same model that decides also predicts. 'What if I release 80 instead of 120?' Zero gap between what the system predicts and what it would actually do.

Note: these are shorter than the v3 document's full explanations. The landing page versions are punchy summaries. The full depth lives on `/product`.

### Section 4: Social Proof / Metrics (lightweight)

- **Headline** (H2, ALL CAPS): `RIGOR YOU CAN MEASURE.`

Four metric callouts in a horizontal row. Numbers in Space Grotesk, 48–64px, Signal Lime. Labels in Inter, secondary text.

| -12% | -8% | +15% | 100% |
|------|-----|------|------|
| Travel distance | Pick time | Throughput at same labor | Constraint compliance |

Small footnote: "Placeholder metrics. Replace with observed facility data when available."

### Section 5: CTA Strip

Not a full form — just a strong closing statement with a button.

- **Headline** (H2): `READY TO SEE IT RUN?`
- **Subhead:** "Bring one facility. We'll produce an executable plan."
- **CTA:** "Request a Demo" → `/demo` (Signal Lime button)
- **Secondary link:** "Learn how it works →" → `/product` (ghost link)

---

## 1.4 Product Page (`/product`)

### Purpose

The technical depth page. This is where the ops leader or technical buyer goes after the landing page hook. They want to understand the mechanics: what the APIs do, how operator interaction works, what Tess is, and how integration happens. The page should feel like reading a well-structured technical brief, not a marketing brochure.

### Section 1: Page Hero

Shorter than the landing hero — not full viewport. ~40vh or auto-height with generous padding.

- **Eyebrow** (JetBrains Mono): `PRODUCT`
- **Headline** (H1): `The decision layer your WMS is missing.`
- **Subhead:** "Three APIs that control what work enters the floor, how it's grouped, and what gets worked first. One optimization model that reasons about all constraints simultaneously."

### Section 2: The Three APIs

- **Headline** (H2, ALL CAPS): `THREE DECISIONS. EVERY CYCLE.`
- **Subhead:** "Each API addresses one core question the warehouse faces every few minutes."

Three cards in a horizontal row (stack on mobile). Surface BG, 16px radius, Signal Lime left border, 1px border. Step numbers in JetBrains Mono.

**01 — OPTIMIZE RELEASE**
"What work should enter the floor right now?"
Controls the flow of work onto the warehouse floor. Given the current backlog and operating conditions, recommends which orders to release now vs. defer.
*Inputs:* open orders, ship times, active work count, available staff, zone congestion.
*Output:* each order marked release/defer, reasoning, predicted effect on congestion and deadline compliance.

**02 — OPTIMIZE BATCHING**
"How should released work be grouped?"
Groups released work into efficient work packages reflecting item proximity, order similarity, zone balance, and deadline urgency.
*Inputs:* released orders, storage locations, zone layout, batch size/equipment constraints, deadlines.
*Output:* work packages with assignments, grouping explanation, predicted efficiency gains and deadline compliance.

**03 — PRIORITIZE WORK**
"What deserves attention first?"
Ranks active work packages by deadline urgency, zone congestion, and system-wide efficiency — not just simple priority numbers.
*Inputs:* active work packages, shipping deadlines, congestion, worker availability.
*Output:* ranked list with scores, explanations, predicted impact of recommended vs. default sequence.

### Section 3: The Optimization Core

A brief section explaining what makes joint optimization different from rule-based systems. This is the "why this is hard and why our approach works" section.

- **Headline** (H2, ALL CAPS): `ONE MODEL. NOT THREE.`
- **Body** (2–3 paragraphs, Inter 18px): The three APIs are not three separate optimizers. They are different views into the same underlying model: Release decides what enters the system, Batching decides how to group it, Prioritize decides what to work first. Because they share the same representation of constraints and objectives, their outputs are mutually consistent — a release decision never creates work that the batching logic can't feasibly group.

Hard constraints — never defer an order within two hours of its cutoff, never exceed the floor's active work cap — are encoded directly in the model. The system enforces them structurally, not through post-hoc checks.

When the plan breaks, the system scales its response to match the disruption. A short pick at one location needs a quick local repair. A late trailer that shifts deadline risk across dozens of orders requires a complete re-optimization. The system knows the difference.

### Section 4: Operator Interaction

- **Headline** (H2, ALL CAPS): `OPERATOR INTENT, OPTIMIZER EXECUTION.`
- **Subhead:** "Your experience makes the system better, not the other way around."

Three subsections, presented as a tabbed interface or three cards with distinct time-horizon labels.

**Strategic Posture** — *Per Shift*
Before a shift starts, the operator sets high-level preferences that translate directly into objective weights and constraints. Examples as styled quote cards:
- *"Prioritize deadline compliance — we have a 2pm carrier cutoff."*
- *"Cap Zone B at 40% — short-staffed there today."*
- *"Minimize congestion above all else — cycle count in Zone A."*

These aren't vague preferences. They're precise inputs to the optimizer. The operator sets the intent; the optimizer handles every tactical decision within that intent.

**Trade-Off Exploration** — *On Demand*
Tessera surfaces meaningfully different strategies, each reflecting a different balance of competing objectives:

| Strategy | Travel | Deadline Risk | Zone Balance |
|----------|--------|---------------|--------------|
| **Tess's Choice** (Signal Lime badge) | Baseline | Low | Good |
| Minimize Travel | −18% | Moderate | Uneven |
| Balance Zones | +12% | Low | All < 60% |
| Zero Late Risk | +22% | None | Zone C heavy |

Each shows predicted impact so the operator sees exactly what they'd gain and give up. If the operator consistently picks an alternative over Tess's Choice, that signals the posture weights don't reflect their actual priorities — they can adjust accordingly.

**Tess's Choice** — *Every Cycle*
The default recommendation, generated automatically based on the current posture. In advisory mode, it appears on the dashboard with a "recommended" badge. In closed-loop mode, it executes. Not a compromise — the best solution given the operator's stated priorities.

### Section 5: Tess AI Copilot

- **Label** (JetBrains Mono, ALL CAPS): `AI COPILOT`
- **Headline** (H2): `Talk to your optimizer.`
- **Intro:** "Tess sits between you and the optimization core. Every claim is grounded in optimizer data — not a plausible-sounding narrative."

**Chat mockup** (surface card, 16px radius) showing 3 exchanges:

1. **Operator:** "We have a 2pm carrier cutoff and we're short-staffed in Zone B."
   → **Tess:** "Updated posture: deadline compliance weight increased to 0.8, Zone B capped at 35% active work. Next cycle will reflect these changes."

2. **Operator:** "Why did you defer these orders?"
   → **Tess:** "Orders #4471–4473 deferred because Zone C is at 92% capacity. Releasing now would increase pick time by 34%. Scheduled for next cycle when Zone C drops below 70%."

3. **Operator:** "What if we release 80 orders instead of 120?"
   → **Tess:** "At 80: travel drops 14%, Zone C stays below 65%, zero late-risk. At 120: Zone C hits 91%, 3 orders at moderate late risk."

**Three capability cards** beside or below the mockup:

- **Translate:** Converts operational language into optimizer parameters.
- **Explain:** Turns constraint flags and metric deltas into actionable language. Every answer links to concrete plan artifacts.
- **Guide:** Proactive alerts during disruptions. Shift briefings. Summaries. A weather forecast for the warehouse.

### Section 6: Integration Model

- **Headline** (H2, ALL CAPS): `SITS ON TOP. DOESN'T REPLACE.`
- **Subhead:** "Tessera connects to your existing WMS. No rip-and-replace."

Two-tier layout: Minimal (left) → Full (right), connected by a progression arrow.

**Minimal Integration — "Batching & Sequencing Only"**
Single POST request with pick IDs, location IDs, order IDs, site layout reference. Returns optimized batches with sequences and predicted metrics. Same integration footprint as existing pick-path tools.

**Full Integration — "Release, Re-Optimization & Closed-Loop"**
Adds four data categories (all standard WMS APIs): order backlog & deadlines, active work state, zone & capacity signals, replenishment & location status.

**Platform table** (surface card):

| Platform | Read | Write | Closed-Loop |
|----------|------|-------|-------------|
| Oracle WMS Cloud | REST API entities | Tasks, waves, replenishment | Strong |
| SAP EWM | Warehouse Task/Order tables | Task creation, confirmation | Viable |
| Dynamics Business Central | Sales Orders, Activity Lines | Pick creation/re-sequencing | Viable |
| Others | Varies | Often limited | Advisory mode |

**Callout:** "No custom hardware, no sensor feeds, no worker GPS. Just data your WMS already tracks."

### Section 7: CTA

- "Ready to go deeper?" → "Request a Demo" (Signal Lime) → `/demo`
- "How we earn trust →" → `/trust` (ghost link)

---

## 1.5 Trust Page (`/trust`)

### Purpose

Answers the question: "Why should I let an optimizer touch my WMS?" This page is about earned confidence — guardrails, graduated autonomy, and measurable proof. Separate from "what does it do" because trust is a distinct buying concern, especially for closed-loop automation.

### Section 1: Page Hero

- **Eyebrow** (JetBrains Mono): `TRUST`
- **Headline** (H1): `Autonomy you can verify.`
- **Subhead:** "Hard constraints. Anomaly detection. Graduated autonomy. Full audit trail. Every decision replayable."

### Section 2: Guardrails

- **Headline** (H2, ALL CAPS): `AUTONOMY, WITH GUARDRAILS.`

Four cards (surface BG, 16px radius, line-style icon each):

**Hard Constraints**
Never defer an order within a configurable window of its cutoff. Never exceed the floor's active-work cap. Never assign work to a blocked zone. Enforced inside the optimization model — not as post-processing checks on the output. Configured per tenant.

**Anomaly Detection**
If actual pick times exceed estimates by more than a configurable threshold for consecutive cycles, or supervisor overrides exceed a threshold, or late-risk orders spike unexpectedly — the system automatically pulls back to advisory mode and surfaces an alert.

**Graduated Autonomy**
Start with lowest-risk decisions (priority re-ranking, easily reversible). Higher-stakes decisions (large wave releases, urgent order deferrals) stay in advisory until confidence is established. The customer controls the boundary.

**Audit Trail**
Every recommendation, override, and predicted impact is logged. Each cycle is replayable and reviewable. Full reasoning chain from optimizer inputs to outputs.

### Section 3: Advisory to Closed-Loop

- **Headline** (H2, ALL CAPS): `FROM ADVISORY TO CLOSED-LOOP.`
- **Subhead:** "Same three APIs. Same optimization core. What changes is whether the output goes to a dashboard or gets pushed back into the WMS."

Horizontal stepped progression bar connecting three phases. Each phase is a card below. Phase 1 highlighted with Signal Lime to show entry point.

**Phase 1 — Advisory**
Read-only connection. Recommendations on a dashboard. Supervisor reviews and decides. Measurable impact within the first few shifts: fewer late shipments, less manual re-sequencing, reduced congestion.

**Phase 2 — Selective Write-Back**
Low-risk decisions pushed to WMS: priority re-ranking, task holds, wave triggers. Higher-stakes decisions stay in advisory.

**Phase 3 — Closed-Loop**
Continuous automated execution with human override. The default is automated; intervention is the exception. Guardrails ensure the system earns and maintains trust.

### Section 4: Proof

- **Headline** (H2, ALL CAPS): `RIGOR YOU CAN MEASURE.`
- **Subhead:** "Before/after metrics and constraint adherence — every run."

Four metric callouts (Space Grotesk 48–64px, Signal Lime):

| -12% | -8% | +15% | 100% |
|------|-----|------|------|
| Travel distance | Pick time | Throughput at same labor | Constraint compliance |

Footnote: "Placeholder metrics. Replace with observed facility data when available."

Below the metrics, a brief paragraph: "Tessera doesn't ask you to trust a black box. Every recommendation comes with predicted impact, and every cycle produces measurable before/after comparisons. The system's track record is visible, queryable, and auditable."

### Section 5: CTA

- "See it in action." → "Request a Demo" → `/demo`

---

## 1.6 Team Page (`/team`)

### Purpose

Short and high-conviction. The team's background is a genuine competitive advantage — OR PhD, CMU postdoc, Amazon Global Logistics — and this page makes that credibility legible to a warehouse VP evaluating whether to trust an optimization startup. No stock photos, no "passionate team" filler, no mission statement padding.

### Section 1: Page Hero

- **Eyebrow** (JetBrains Mono): `TEAM`
- **Headline** (H1): `Built by people who solve these problems for a living.`
- **Subhead:** "Tessera comes from the intersection of mathematical optimization research and real warehouse operations."

### Section 2: Founder Profile

A single card or full-width section. Clean layout: photo (if available, otherwise skip — no placeholder avatars) on one side, bio on the other.

**Yatharth Dubey** — *Founder*

Bio (3–4 sentences, written in third person, factual): Yatharth holds a PhD in Operations Research from Georgia Tech and completed postdoctoral research at Carnegie Mellon University. His research in integer programming and branch-and-bound algorithms was recognized with 2nd place at the INFORMS George Nicholson Student Paper Prize, with publications in Mathematical Programming. Before founding Tessera, he worked as an Applied Scientist at Amazon Global Logistics, where he built optimization systems for real warehouse operations at scale. Tessera applies that same rigor — mathematical optimization grounded in actual floor conditions — to every warehouse that runs it.

Links: LinkedIn (if desired), Google Scholar or publications page (if desired).

### Section 3: Why This Team

A brief section (2–3 short paragraphs or a few callout cards) explaining why the founder's background matters for this specific product. Not a generic "our team is great" — a direct connection between credentials and product capability.

Possible framing:
- "The optimization core isn't a wrapper around a generic solver. It's built by someone who published research on the algorithms inside the solver."
- "Amazon-scale logistics experience means the system is designed for the warehouse that exists right now, not a textbook model of one."
- "An established network in the 3PL and fulfillment industry means Tessera is built with, not just for, the people who run warehouses."

### Section 4: CTA

- "Talk to us." → "Request a Demo" → `/demo`

### Design Notes

This page should feel sparse and confident. Generous whitespace. No grid of headshots with hover effects. If it's just one founder right now, that's fine — don't pad it with advisory board photos or "hiring" cards. When the team grows, add profiles in the same format.

---

## 1.7 Demo Page (`/demo`)

### Purpose

Dedicated conversion page. Cleaner than burying a form at the bottom of a scroll. The form is the star; everything else on this page supports the conversion.

### Layout

Two-column on desktop, single column on mobile. Left column: form. Right column: supporting context.

### Left Column: Form

Surface card, 16px radius, generous padding (32px).

**Fields:**
- Name (text input)
- Email (text input)
- Company (text input)
- WMS Platform (dropdown: Oracle WMS Cloud, SAP EWM, Manhattan Active WM, ShipHero, Logiwa, Deposco, Extensiv, Other)
- Message (optional textarea, 3 rows)

**Submit:** "Request Demo" (Signal Lime primary button, full width within the card).

Form inputs: `#1A1A2E` BG, 1px border, 12px radius. Submission POSTs to `/api/contact`, inline success state (checkmark + "We'll be in touch within 24 hours."). No page redirect.

### Right Column: Supporting Context

- **Headline** (H2): `What to expect`
- A short list (3–4 items, Inter 18px, line-style icons):
  - "A 30-minute call with the founder."
  - "We'll walk through a live optimization run on sample warehouse data."
  - "Bring your own facility data if you want — we'll show what Tessera would recommend."
  - "No commitment. No 6-month POC. One conversation."

Below the list, optionally: a single testimonial or quote (when available). For now, leave this space empty or show one of the doctrine lines as a large pull quote: *"DECISIONS, NOT DASHBOARDS."*

---

## 1.8 Shared: Footer

Present on all pages. Two rows.

**Row 1:** Tessera wordmark (left). Link columns (right): Product, Trust, Team, Demo, Documentation (placeholder), API Reference (placeholder).

**Row 2:** Copyright line, centered. "© 2026 Tessera. All rights reserved."

Background: surface color (`#14161B`). Minimal styling.

---
---

# PART 2: Application — runtessera.com/app

The authenticated application. Same design tokens as the marketing site (dark-only, Signal Lime, Space Grotesk/Inter/JetBrains Mono). App-specific: card border radius 12px, body text 14–16px, additional semantic tokens for data-rich UI.

**Technology:** Next.js (App Router), React, TypeScript, Tailwind CSS (existing `tailwind.config.ts`), shadcn/ui customized with Tessera tokens. Real-time via WebSocket or SSE. State: Zustand or React Context.

---

## 2.1 Application Architecture

### Route Structure

| Route | View | Description |
|-------|------|-------------|
| `/app` | Dashboard / Decision Feed | Shift overview, current cycle, key metrics |
| `/app/release` | Release View | Current cycle's release recommendations |
| `/app/batching` | Batching View | Current cycle's batch composition |
| `/app/prioritize` | Prioritization View | Active work ranking |
| `/app/explore` | Trade-Off Explorer | Side-by-side strategy comparison |
| `/app/history` | Cycle History | Past cycles, audit trail, overrides |
| `/app/settings` | Settings | Tenant config, posture presets, integrations |

### Persistent Layout

**Left sidebar:** 240–280px, collapsible to 64px icon rail (below 1024px). Tessera micro mark, nav links, current shift indicator. Page BG.

**Top bar:** Sticky. Cycle status (heartbeat countdown or event trigger label), active posture summary, mode badge (Advisory / Write-Back / Closed-Loop), Tess copilot toggle.

**Main content:** Scrollable, max width 960px centered.

### Sidebar Navigation

- Decision Feed (home icon) — default
- Release (play-circle icon)
- Batching (layers icon)
- Prioritize (list-ordered icon)
- Explore (git-branch icon)
- History (clock icon)
- *Divider*
- Settings (gear icon)

All icons: line-style, 1.5–2px stroke, monochrome.

---

## 2.2 Authentication & Tenant Model

Clerk or NextAuth.js, email + SSO. Multi-tenant with isolated data, tenant ID in JWT. Roles: Admin (full config), Supervisor (posture + all views), Operator (read-only + Tess).

Login at `/app/login`. Post-auth → `/app`. Unauthenticated `/app/*` → redirect to login.

---

## 2.3 Dashboard / Decision Feed

### Purpose

Default view after login. Implements the Decision Feed from the brand spec: vertical timeline of optimization cycles, most recent at top.

### Layout

**Row 1 — Shift Header Bar:**
Shift label ("Day Shift — Mar 23"), posture summary ("Deadline compliance priority, Zone B capped at 40%"), "Edit Posture" button.

**Row 2 — KPI Cards (4 across):**

| KPI | Display | Color Logic |
|-----|---------|-------------|
| Active Work | Tasks on floor vs. cap | Success < 80%, Warning 80–95%, Danger > 95% |
| Late-Risk Orders | Deadline < 2h count | Success = 0, Warning 1–3, Danger > 3 |
| Zone Balance | Max zone utilization % | Success < 70%, Warning 70–85%, Danger > 85% |
| Cycle Status | Countdown to next cycle | Last cycle result |

Cards: 12px radius, 1px border, surface BG. Values in Space Grotesk 28px, status color on value text only.

**Row 3 — Decision Feed:**

Each feed entry card (surface BG, 12px radius, 1px border):

*Header:* Timestamp + trigger (JetBrains Mono). Cycle number. Mode badge. Status chip: Executed (Success), Pending (Signal Lime), Overridden (Warning), Anomaly (Danger).

*Body:* Tess's Choice summary in natural language. Metric pills row (travel delta, zone utilization, late-risk count, constraint compliance).

*Footer:* "View Alternatives" → trade-off explorer. "View Detail" → drill-down. Advisory mode: Approve / Override. Closed-loop: Override (with confirmation) + Audit Log.

*Filtering:* By API, trigger type, status. Time range picker.

*Empty:* "No decisions yet this shift. Next heartbeat in [countdown]."
*Loading:* Skeleton cards, 150ms pulse.

---

## 2.4 Posture Configuration Panel

Slide-over from right (480px, 250ms ease-out). Triggered by "Edit Posture" or via Tess.

**Objective Weight Sliders:** Deadline Compliance, Travel Efficiency, Zone Balance, Congestion Minimization. Relative weights, normalized internally. Signal Lime slider thumbs. Plain-language summary auto-updates below.

**Zone Constraints:** Per-zone table: name, status (Active/Restricted/Blocked), max active work %, reason field.

**Hard Constraints:** Display-only (Admin can modify). "Never defer within 2h of cutoff", "Floor cap: 200 active tasks", etc.

**Time Horizon:** "This shift" / "Next N hours" / "Until I change it."

**Presets:** Save/load named configurations. Per-tenant.

**Apply:** "Apply to next cycle" — Signal Lime button. Takes effect next cycle.

---

## 2.5 Release View

**Summary bar:** "Recommending release of 84 orders, deferring 36. Predicted floor utilization: 72%. Late-risk: 0."

**Data table:** Order ID, Ship Deadline, Priority, Zone(s), Recommendation (Release/Defer), Reason (expandable). Deferred rows muted. Sortable, filterable.

**Detail panel (collapsible):** Selected order's contents, deadline, predicted impact, constraint explanation.

**Actions (advisory):** "Accept All" / "Accept with Changes" / "Reject". "Accept with Changes" lets operator toggle individual orders and re-run with locks.

---

## 2.6 Batching View

**Summary bar:** "12 batches formed. Travel reduction vs. WMS default: 22%. All zones < 65%."

**Batch cards grid** (12px radius): Batch ID, order/pick count, primary zones, predicted travel, deadline risk chip, zone-distribution bar. Draggable for re-grouping.

**Detail:** Click → full panel with orders, pick sequence, route viz (if layout configured), grouping explanation.

**Comparison:** "Show WMS default" overlays original batching with deltas.

---

## 2.7 Prioritization View

**Ranked list:** Active work packages in recommended order. Rank #, Batch ID, deadline proximity, zone, score, reason. Draggable.

**Side panel:** "Tessera's order" vs. "WMS default" vs. "Your custom order". Predicted late shipments, travel, congestion peaks.

---

## 2.8 Trade-Off Explorer

**Scenario builder:** Release count slider, zone cap sliders, locked batches, objective overrides. "Run Scenario" (Signal Lime).

**Comparison cards (2–4):** Label, metric grid, trade-off summary, "Adopt This Plan." Tess's Choice gets Signal Lime badge. Deltas: Success/Danger/neutral.

**Table toggle:** Dense metrics-as-rows view.

**Posture feedback:** "Consistently preferring a different strategy? Adjust your posture." → link to posture panel.

---

## 2.9 Tess Copilot Panel

**Trigger:** Toggle in top bar. Right panel, 400px, 250ms ease-out. Stays open across navigation.

**Chat interface:** Operator messages right-aligned, Tess left-aligned (surface BG). Tess can include: text, inline metric cards, view links ("View Batch 17"), action buttons ("Apply this posture change" — Signal Lime ghost button).

**Grounding badge:** Signal Lime dot on responses referencing optimizer data. Click → constraint IDs, metrics, cycle number.

**Proactive messages:** Shift briefings, exception alerts, summaries. System message styling (centered, secondary text, no bubble).

---

## 2.10 Cycle History & Audit Trail

**Timeline:** Past cycles, most recent first. Timestamp, cycle number, response type (local repair / partial / full re-opt), key metrics, override indicator.

**Drill-down:** Click → recommendation, operator action, predicted vs. actual, anomaly flags.

**Filters:** Date range, response type, override status, anomaly flags.

---

## 2.11 Settings & Configuration

**General:** Tenant name, timezone, shift definitions, cycle interval (default 15 min).

**Warehouse Layout:** Zone definitions, location regex, routing points. Upload or manual.

**Integration:** WMS platform, credentials, polling interval, event triggers. Status indicator, test button.

**Hard Constraints:** Cutoff window (default 2h), floor cap, blocked zones. Modifies the optimization model.

**Posture Presets:** Create, edit, delete, set default.

**Users & Roles:** Invite, assign (Admin/Supervisor/Operator). Admin-only.

**Autonomy Level:** Decision type × mode matrix. Priority changes, releases, batch mods each configurable as advisory or auto-execute.

---

## 2.12 Component Library & Design Tokens

### CSS Custom Properties

```css
/* Brand tokens — DO NOT CHANGE */
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

/* App additions */
--tessera-bg-input: #1A1A2E;
--tessera-radius-marketing-card: 16px;
```

### Key Components

shadcn/ui base, customized with tokens:

- **KPICard:** icon, label, value (Space Grotesk 28px), trend arrow, semantic color on value.
- **FeedEntryCard:** header with timestamps/badges, summary, metric pills, actions.
- **BatchCard:** summary, zone distribution bar, deadline indicator, drag handle.
- **ZoneHeatmap:** SVG zone map, Success → Warning → Danger gradient, click handlers.
- **CycleTimer:** JetBrains Mono countdown.
- **PostureSliders:** linked group, Signal Lime thumbs, auto-normalizing, plain-language summary.
- **RecommendationSummary:** compact card, approve/reject.
- **ChatPanel:** Tess copilot, grounding badges, inline actions.
- **ComparisonTable:** side-by-side scenarios, delta colors.
- **DataTable:** sortable, filterable, expandable rows. Release + History views.
- **ActivityFeed:** timestamped events, semantic color coding.
- **ModeBadge:** Advisory (neutral) / Write-Back (Signal Lime outline) / Closed-Loop (Signal Lime fill).
- **StatusChip:** Executed (Success), Pending (Signal Lime), Overridden (Warning), Anomaly (Danger).

---

## Implementation Notes

**Section-by-section.** Each section is self-contained. Recommended build order:
1. Site shell: navbar, footer, page routing (`/`, `/product`, `/trust`, `/team`, `/demo`)
2. Landing page (5 sections)
3. Product page
4. Trust, Team, Demo pages
5. App shell: sidebar, top bar, routing
6. Dashboard / Decision Feed
7. Posture panel + Tess copilot (cross-cutting overlays)
8. Individual app views (Release, Batching, Prioritize, Explorer, History, Settings)

**Data mocking:** `/lib/mock-data.ts` with 100–200 orders, 5–7 zones, 10–15 batches per cycle. Exercise all states.

**API contract:** TypeScript interfaces for Order, Batch, WorkPackage, CycleResult, PostureConfig, etc. Mock implementations. Real API conforms to these types.

**Existing code:** Extend `github.com/orcalogisticstech/TesseraUI`. Brand tokens already in `tailwind.config.ts`.

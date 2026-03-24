# Tessera Website Copy Changes

All changes are text-only — no layout, styling, or structural changes. Each change lists the file, the exact current text, and the replacement.

---

## 1. Homepage Hero Subtext

**File:** `app/page.tsx` (line 59–61)

**Current:**
```
Tessera sits on top of your WMS and continuously makes better decisions about what work to release, how to group it, and what to prioritize - all from a single optimization model.
```

**Replace with:**
```
Tessera sits on top of your WMS and decides what work to release, how to group it, and what to prioritize — accounting for every constraint on the floor simultaneously.
```

---

## 2. Homepage Problem Section Headline

**File:** `app/page.tsx` (line 82)

**Current:**
```
KILL OPTIMIZATION THEATER.
```

**Replace with:**
```
VISIBILITY ISN'T THE GAP. THE RESPONSE IS.
```

---

## 3. Homepage Problem Card — "No counterfactuals"

**File:** `app/page.tsx` (line 16–18, inside `problemCards` array)

**Current:**
```json
{
  title: "No counterfactuals",
  description: "You can see what happened, but not what a better decision would have produced."
}
```

**Replace with:**
```json
{
  title: "No way to compare",
  description: "You can see what happened, but not what a better decision would have produced."
}
```

Only the title changes. The description is already clear without the word "counterfactuals."

---

## 4. Homepage Explain/Decide/Predict Card Bodies

**File:** `app/page.tsx` (lines 25–41, inside `explainSteps` array)

**Current EXPLAIN body:**
```
Trace the root cause. This zone is congested because the last release cycle pushed too many orders into a narrow area, and the current batch structure is concentrating picks there. Tessera surfaces optimizer-level counterfactuals between what happened and what a better decision would have produced.
```

**Replace with:**
```
Trace why the floor looks the way it does. Not just alerts — causal reasoning. This zone is slow because the last release was too dense and batching is concentrating picks there.
```

**Current DECIDE body:**
```
Prescribe a fix that accounts for everything. Re-batch active work to shift picks across zones, re-rank priorities, and throttle the next release in a single optimization pass. The optimizer finds non-obvious trade-offs a rule-based system would not discover.
```

**Replace with:**
```
Prescribe a fix that respects every constraint at once — deadlines, congestion, travel, labor. One pass, not one rule at a time.
```

**Current PREDICT body:**
```
See the impact before you commit. The same model that decides also predicts. What if you release 80 instead of 120? Zero gap between what the system predicts and what it would actually do.
```

**Replace with:**
```
See impact before you commit. Same model that decides also predicts — zero gap between forecast and action.
```

---

## 5. Product Page — Optimize Release Body

**File:** `app/product/page.tsx` (line 10, inside `apiCards` array, first card)

**Current:**
```
Controls what work enters the floor and recommends which orders to release now vs. defer.
```

**Replace with:**
```
Decides what hits the floor and what waits — so you don't release 120 orders into a zone that can handle 80.
```

---

## 6. Product Page — Optimize Batching Body

**File:** `app/product/page.tsx` (line 18, inside `apiCards` array, second card)

**Current:**
```
Groups released work into efficient packages reflecting proximity, order similarity, zone balance, and urgency.
```

**Replace with:**
```
Groups work so the floor isn't flooded with scattered, unrelated tasks. Reflects proximity, zone balance, and deadline urgency.
```

---

## 7. Product Page — Prioritize Work Body

**File:** `app/product/page.tsx` (line 26, inside `apiCards` array, third card)

**Current:**
```
Ranks active work by deadline urgency, zone congestion, and system-wide efficiency.
```

**Replace with:**
```
Ranks work by what actually matters right now — not just deadline urgency, but whether working a different batch first would reduce waiting for everyone.
```

---

## 8. Product Page — "ONE MODEL. NOT THREE." Body Text

**File:** `app/product/page.tsx` (lines 114–115)

**Current:**
```
The three APIs are not separate optimizers. They are views into one model: Release decides what enters the system, Batching decides how to group it, and Prioritize decides what to work first. Because they share one constraint and objective representation, outputs stay mutually consistent.
```

**Replace with:**
```
The three APIs are not separate optimizers. They are views into one model: Release decides what enters the system, Batching decides how to group it, and Prioritize decides what to work first. A release decision never creates work that batching can't feasibly group, and a priority ranking never contradicts the deadlines the batcher already accounted for.
```

Only the last sentence changes. "Outputs stay mutually consistent" becomes a concrete explanation of what mutual consistency actually means.

---

## 9. Product Page — Tess Copilot Capability Cards

**File:** `app/product/page.tsx` (lines 57–61, inside `copilotCapabilities` array)

**Current:**
```json
{ title: "Translate", body: "Converts operational language into optimizer parameters." },
{ title: "Explain", body: "Turns constraint flags and metric deltas into actionable language tied to plan artifacts." },
{ title: "Guide", body: "Proactive alerts, shift briefings, and disruption summaries." }
```

**Replace with:**
```json
{ title: "Translate", body: "Operators say what matters. Tess converts it into optimizer settings." },
{ title: "Explain", body: "Tells you why a decision was made — traced to specific orders, batches, and metrics. Not a plausible-sounding guess." },
{ title: "Guide", body: "Surfaces what you haven't asked about yet — starting conditions, what changed since last cycle, and what to watch." }
```

---

## 10. Product Page — Integration Section Headline

**File:** `app/product/page.tsx` (line 193)

**Current:**
```
SITS ON TOP. DOESN'T REPLACE.
```

**Replace with:**
```
SAME SYSTEMS. SAME WORKFLOWS. BETTER DECISIONS.
```

---

## 11. Trust Page — Anomaly Detection Card

**File:** `app/trust/page.tsx` (lines 12–13, inside `guardrails` array, second item)

**Current:**
```
If estimates diverge from reality or overrides spike, the system automatically pulls back to advisory mode and alerts the team.
```

**Replace with:**
```
If pick times exceed estimates for consecutive cycles, or supervisors start fighting the system, Tessera pulls itself back to advisory mode. The system knows when it's wrong.
```

---

## Summary

11 text changes across 3 files. No structural, layout, or styling changes. All changes are approximately the same length as the originals or shorter. The goal in every case: replace technical descriptions with concrete consequences, at the same word count.

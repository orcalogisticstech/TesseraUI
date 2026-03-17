Below is a **single, self-contained UI + brand spec** you can paste into Codex to generate a dummy Tessera webpage. It includes **logo usage, colors (your final light/dark), typography, layout, components, tone, and copy blocks**.

---

# Tessera UI + Brand Spec (Codex-ready)

## 1) Brand essence (1 paragraph)
Tessera is a **warehouse optimization OS** built with **scientific rigor**. The brand feels like an operating system: **high-contrast, minimal, decisive**, and slightly severe. Avoid playful SaaS vibes. Everything should look **inevitable**, not decorative.

### Brand doctrine (use as headings)
- **TURN CONSTRAINTS INTO EXECUTION.**
- **KILL OPTIMIZATION THEATER.**
- **AUTONOMY, WITH GUARDRAILS.**
- **RIGOR THAT MOVES BOXES.**
- **LATENCY IS WASTE.**

---

## 2) Voice / tone / language rules

### Tone
- **Declarative, short sentences.**
- **High-conviction.** No hedging (“might, could, perhaps”).
- **Operator-respectful.** No fluff.
- **Technical precision** without jargon dumps.

### Copy patterns
- Headings: 2–6 words, often **ALL CAPS**.
- Subhead: 1–2 short lines, plain language.
- Bullets: “verb + object” or “noun phrase” (no full paragraphs).
- CTAs: “Request a demo”, “See it run”, “Talk to an operator”.

### Approved vocabulary
- **constraints, guardrails, audit trail, execution, latency, coordination tax, decision loop, operators, rigor**
- Avoid: “revolutionary, magical, game-changing, world-class, best-in-class, AI-powered” (AI is assumed).

---

## 3) Logo usage (your mark)

### Structure
- Tessera mark is three tesserae/planes forming a **negative-space T** at the intersection.
- A **single signal tile** sits at the intersection.

### Color (final)
Use these exact tokens for the mark.

**Light mode logo**
- Background: `#F5F7FA`
- Tile light: `#B8C0CC`
- Tile mid: `#6B7380`
- Tile dark: `#1A1F2B`
- Signal: `#D8FF2A`

**Dark mode logo**
- Background: `#0B0D10` (or `#0A0B0D`)
- Tile light: `#F5F7FA`
- Tile mid: `#D5DAE2`
- Tile dark: `#8B93A1`
- Signal: `#D8FF2A`

### Logo rules
- **No strokes/outlines.**
- **Signal color only appears once** (the tiny center tile).
- Provide **micro mark** variant: at 16–24px, slightly enlarge the signal tile and increase contrast between tile mid/dark by ~10%.

---

## 4) Color system (site-wide)

### Core backgrounds
- Light page background: `#F5F7FA`
- Dark page background: `#0B0D10`
- Elevated surface (light): `#FFFFFF`
- Elevated surface (dark): `#14161B`

### Text
- Light mode primary text: `#0B0D10`
- Light mode secondary text: `#4B5563`
- Dark mode primary text: `#F5F7FA`
- Dark mode secondary text: `#D5DAE2`

### Borders / dividers
- Light mode border: `rgba(11,13,16,0.10)`
- Dark mode border: `rgba(245,247,250,0.12)`

### Accent / signal
- Signal / primary accent: `#D8FF2A`

### Semantic colors (UI only, not brand accents)
- Danger: `#FF3B30` (errors only)
- Warning: `#FFB020` (warnings only)
- Success: `#34C759` (success only)

**Rule:** One accent per surface. Signal lime is the only “brand” accent.

---

## 5) Typography

### Fonts (use free web fonts)
- **Headings (Display):** `Space Grotesk` (fallback: `Inter`, `system-ui`)
- **Body/UI:** `Inter` (fallback: `system-ui`)

### Type scale
- H1: 64px / 1.0 / weight 600–700 / tracking -0.02em
- H2: 44px / 1.05 / weight 600
- H3: 28px / 1.15 / weight 600
- Body: 16–18px / 1.5 / weight 400–500
- Small: 13px / 1.4

### Typographic signature
- Headings often **ALL CAPS**
- Minimal punctuation
- Dense hierarchy: large H1, lots of whitespace, tight lines

---

## 6) Layout and spacing

### Grid
- Max width: 1120–1200px
- 12-column layout
- Section vertical padding: 96px desktop, 64px tablet, 40px mobile
- Spacing scale tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96

### Section pattern (repeatable blocks)
1) Hero doctrine
2) “Enemy” section (optimization theater)
3) Guardrails + audit
4) Modules (TesseraPick/Slot/Labor/Load)
5) Proof / metrics
6) CTA footer

---

## 7) UI component styling

### Cards / surfaces
- Border radius: 16px
- Shadow: minimal (or none). Prefer borders.
- Light card background: `#FFFFFF`
- Dark card background: `#14161B`
- Card border: subtle 1px divider

### Buttons
**Primary**
- Background: Signal `#D8FF2A`
- Text: `#0B0D10`
- Radius: 14–16px
- Padding: 12px 16px
- Hover: slightly darker lime (or reduce brightness 8–10%)

**Secondary**
- Transparent background
- Border: subtle
- Text: inherits
- Hover: background tint (very subtle)

### Chips / tags
- Neutral background tint
- No bright colors except semantic statuses

### Links
- Understated. Use signal lime for hover/active only.

---

## 8) Imagery & motifs
- Avoid stock warehouse photos.
- Prefer: diagrams, simple isometric/tile patterns, UI screenshots.
- If using background graphics: faint tessellation grid at 3–6% opacity.

---

## 9) Homepage copy (ready to use)

### Hero
**TURN CONSTRAINTS INTO EXECUTION.**  
Warehouse optimization built from the ground up with scientific rigor.

Primary CTA: **Request a demo**  
Secondary CTA: **See modules**

### Section: Enemy
**KILL OPTIMIZATION THEATER.**  
If it doesn’t execute, it’s a slideshow.

Bullets:
- Plans that arrive too late
- Rules that don’t generalize
- Dashboards that don’t decide
- Local heroics masking systemic waste

### Section: Guardrails
**AUTONOMY, WITH GUARDRAILS.**  
Transparent trade-offs. Configurable approvals. Full audit trail.

Bullets:
- Constraint-first decisions
- Explainable trade-offs
- Approval gates where needed
- Replayable decision logs

### Section: Modules
**A MOSAIC OF DECISIONS.**  
Each module is a tile. Together, they execute.

Cards:
- **TesseraPick** — routing + batching under constraints  
- **TesseraSlot** — slotting that matches demand and labor reality  
- **TesseraLabor** — staffing and task allocation with service guarantees  
- **TesseraLoad** — load plans that respect weight, stability, and cost

### Proof block
**RIGOR YOU CAN MEASURE.**  
Before/after metrics and constraint adherence—every run.

Example stats (placeholder):
- -12% travel distance
- -8% pick time
- +15% throughput at same labor
- 100% constraint compliance (or explainable exceptions)

### Footer CTA
**READY TO SEE IT RUN?**  
Bring one facility. We’ll produce an executable plan.

CTA: **Talk to an operator**

---

## 10) Implementation instructions for Codex (what to build)
Build a **single responsive landing page** with:
- Light/dark mode toggle (persist in localStorage)
- Header with logo mark + “Tessera”
- Hero section with doctrine headline and two CTAs
- 4–6 sections as above, using card components
- Minimal animation: fade/slide on section reveal, 150–250ms
- Use the design tokens exactly; avoid gradients; no illustrations beyond simple line icons

---

If you paste that into Codex, it should be enough for it to generate a clean dummy site. If you want, tell me whether you prefer **light-first** (default light, dark toggle) or **dark-first** (default dark, light toggle), and I’ll tailor the hero background and header style accordingly.

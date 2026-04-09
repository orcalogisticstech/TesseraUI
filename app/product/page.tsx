import { MarketingShell } from "@/components/marketing/MarketingShell";
import Link from "next/link";

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

const operatorCards = [
  {
    title: "Strategic Posture",
    horizon: "Per Shift",
    body: "Before a shift starts, operators set objective weights and constraints. The optimizer executes tactical decisions within that intent.",
    points: [
      '"Prioritize deadline compliance - we have a 2pm carrier cutoff."',
      '"Cap Zone B at 40% - short-staffed there today."',
      '"Minimize congestion above all else - cycle count in Zone A."'
    ]
  },
  {
    title: "Trade-Off Exploration",
    horizon: "On Demand",
    body: "Tessera surfaces meaningfully different strategies so operators can see exactly what they gain and give up.",
    points: ["Tess's Choice: baseline travel, low deadline risk", "Minimize Travel: -18% travel, moderate risk", "Zero Late Risk: +22% travel, no late-risk"]
  },
  {
    title: "Tess's Choice",
    horizon: "Every Cycle",
    body: "The default plan, generated from posture. In advisory mode it appears as a recommendation. In closed-loop mode it executes automatically.",
    points: ["Not a compromise", "Best fit to declared priorities", "Recomputed every cycle"]
  }
];

const tessCapabilities = [
  {
    title: "TRANSLATE INTENT INTO ACTION",
    description:
      "Operators don't think in objective weights and constraint parameters. They think in operational language — or in desired outcomes. Tess converts both into optimizer runs. Say what you want to achieve, and Tess figures out what inputs produce that result.",
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
    description:
      "Every recommendation traces to specific constraints, metrics, and plan artifacts. Tess doesn't generate plausible-sounding narratives — it reads the optimization model's actual reasoning. And because Tess can re-run the optimizer on past state, it can answer counterfactuals: what would have happened if you'd made a different choice?",
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
    description:
      "Short picks, delayed replenishment, hot orders, blocked zones, pack station outages — Tess explains what happened, recommends a response, and tells you whether it's a local repair or a broader re-optimization.",
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
    description:
      "Before a shift, Tess reads the starting conditions and suggests a posture. After a shift, it summarizes what happened. Think of it as a weather forecast for the warehouse.",
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

const platformRows = [
  ["Oracle WMS Cloud", "Tasks, waves, replenishment, inventory", "Tasks (hold, release, priority), waves", "Strong"],
  ["SAP EWM", "Warehouse Tasks, Orders, bin content", "Task creation, confirmation", "Viable"],
  ["Business Central", "Activity Lines, Shipment Lines", "Pick creation/re-sequencing", "Viable"],
  ["Others", "Varies", "Often limited or undocumented", "Advisory mode"]
];

export default function ProductPage() {
  return (
    <MarketingShell>
      <section className="border-b" style={{ borderColor: "var(--tessera-border)" }}>
        <div className="section-wrap pb-8 pt-6 md:py-12">
          <p className="font-code text-xs uppercase tracking-[0.14em] text-signal">
            Product
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.02em] md:text-6xl">The decision layer your WMS is missing.</h1>
          <p className="mt-6 max-w-4xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
            Give Tessera your open work and floor state. It returns a complete execution plan — which tasks to work, how to group them, what sequence to pick in, and what order to work them — optimized jointly against all your constraints.
          </p>
        </div>
      </section>

      <section id="tess" className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">FOUR DECISIONS. ONE PASS.</h2>
            <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Every few minutes, the warehouse faces four interrelated questions. Tessera answers them jointly — because the answer to each one depends on all the others.
            </p>
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {decisionCards.map((card) => (
                <article key={card.title} className="marketing-card border-l-2 p-6" style={{ borderLeftColor: "var(--tessera-accent-signal)" }}>
                  <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
                    {card.step}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[-0.01em]">{card.title}</h3>
                  <p className="mt-3 text-base font-medium">{card.question}</p>
                  <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
      </section>

      <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap max-w-[980px]">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">ONE MODEL. ONE PLAN.</h2>
            <p className="mt-5 text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              These four decisions are not independent — they interact. What you release affects how you can batch. How you batch affects what priorities make sense. How you route affects travel and zone congestion. Tessera solves them from a single model. A release decision never creates work that batching can&apos;t feasibly group, and a priority ranking never contradicts the deadlines the batcher already accounted for.
            </p>
            <p className="mt-4 text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              The result is a complete plan: tasks selected or deferred with reasons, batches formed with pick sequences, priority rankings across batches, and predicted metrics for the whole solution. Hard constraints — never defer an order near its cutoff, never exceed the floor&apos;s active-work cap — are enforced inside the model, not as post-hoc checks.
            </p>
            <p className="mt-4 text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              The API surface that delivers this plan adapts to each customer&apos;s integration. That might be one endpoint returning the full solution, separate calls per decision type, or a different decomposition entirely. The model doesn&apos;t change; the delivery shape does.
            </p>
          </div>
      </section>

      <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">OPERATOR INTENT, OPTIMIZER EXECUTION.</h2>
            <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Your experience makes the system better, not the other way around.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {operatorCards.map((card) => (
                <article key={card.title} className="marketing-card p-6">
                  <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>{card.horizon}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[-0.01em]">{card.title}</h3>
                  <p className="mt-3 text-base" style={{ color: "var(--tessera-text-secondary)" }}>{card.body}</p>
                  <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                    {card.points.map((point) => (
                      <li key={point}>- {point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
      </section>

      <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>AI Copilot</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.01em]">
              Talk to your optimizer. Talk to <span className="text-signal">TESS</span>.
            </h2>
            <p className="mt-4 max-w-3xl text-base" style={{ color: "var(--tessera-text-secondary)" }}>
              Tess is not a chatbot on top of a dashboard. It has direct access to the optimization engine — it can modify inputs, re-run the optimizer, compare scenarios, and answer counterfactuals. Every response traces to an actual optimizer run, not a generated narrative. Ask what would happen, what should change, or what went wrong — Tess runs the model and shows you.
            </p>
            <div className="mt-8 space-y-4">
              {tessCapabilities.map((capability) => (
                <article key={capability.title} className="marketing-card p-6">
                  <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">{capability.title}</h3>
                  <p className="mt-3 text-base" style={{ color: "var(--tessera-text-secondary)" }}>
                    {capability.description}
                  </p>
                  <div className="mt-5 space-y-3">
                    {capability.conversations.map((conversation) => (
                      <div key={conversation.tess} className="rounded-[12px] border p-4" style={{ borderColor: "var(--tessera-border)" }}>
                        {"label" in conversation ? (
                          <p className="font-code text-xs uppercase tracking-[0.12em]" style={{ color: "var(--tessera-text-secondary)" }}>
                            {conversation.label}
                          </p>
                        ) : (
                          <p className="text-sm">Operator: {conversation.operator}</p>
                        )}
                        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                          Tess: {conversation.tess}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
      </section>

      <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">INTEGRATION SCALES TO YOUR NEEDS.</h2>
            <p className="mt-5 max-w-4xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Tessera connects to your existing WMS. No rip-and-replace. Start simple — go deeper when you&apos;re ready.
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <article className="marketing-card p-6">
                <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">START SIMPLE</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>Stateless API — send picks, get a plan</p>
                <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                  A single request with pick IDs, storage locations, order IDs, and a layout reference. Tessera returns optimized batches with pick sequences and predicted metrics. No persistent connection, no floor state, no write-back required. If you can call a REST endpoint, you can call Tessera.
                </p>
              </article>
              <article className="marketing-card p-6">
                <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">GO DEEPER</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>Floor state, re-optimization, closed-loop</p>
                <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                  Add the order backlog and shipping deadlines, active work state, zone congestion signals, and blocked locations. Tessera gains release control, real-time re-optimization, and the ability to push decisions back into the WMS. The optimizer sees the full picture and scales its response — from local repair on a single batch to full re-optimization of all remaining work.
                </p>
              </article>
            </div>
            <div className="marketing-card mt-6 overflow-x-auto p-4">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead style={{ color: "var(--tessera-text-secondary)" }}>
                  <tr>
                    <th className="pb-3 pr-4">Platform</th>
                    <th className="pb-3 pr-4">Read Surface</th>
                    <th className="pb-3 pr-4">Write Surface</th>
                    <th className="pb-3">Closed-Loop Viability</th>
                  </tr>
                </thead>
                <tbody>
                  {platformRows.map((row) => (
                    <tr key={row[0]} className="border-t" style={{ borderColor: "var(--tessera-border)" }}>
                      <td className="py-3 pr-4">{row[0]}</td>
                      <td className="py-3 pr-4" style={{ color: "var(--tessera-text-secondary)" }}>{row[1]}</td>
                      <td className="py-3 pr-4" style={{ color: "var(--tessera-text-secondary)" }}>{row[2]}</td>
                      <td className="py-3" style={{ color: "var(--tessera-text-secondary)" }}>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
              No custom hardware, no sensor feeds, no worker GPS. Just data your WMS already tracks.
            </p>
          </div>
      </section>

      <section className="section-space">
          <div className="section-wrap marketing-card p-8 md:p-12">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">READY TO GO DEEPER?</h2>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/demo" className="btn-primary">Request a Demo</Link>
              <Link href="/trust" className="inline-flex items-center text-sm font-medium" style={{ color: "var(--tessera-text-secondary)" }}>
                How we earn trust →
              </Link>
            </div>
          </div>
      </section>
    </MarketingShell>
  );
}

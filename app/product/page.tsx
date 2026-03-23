import { Reveal } from "@/components/Reveal";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import Link from "next/link";

const apiCards = [
  {
    step: "01",
    title: "OPTIMIZE RELEASE",
    question: "What work should enter the floor right now?",
    body: "Controls what work enters the floor and recommends which orders to release now vs. defer.",
    inputs: "Inputs: open orders, ship times, active work count, available staff, zone congestion.",
    output: "Output: release/defer per order, reasoning, and predicted effect on congestion and deadline compliance."
  },
  {
    step: "02",
    title: "OPTIMIZE BATCHING",
    question: "How should released work be grouped?",
    body: "Groups released work into efficient packages reflecting proximity, order similarity, zone balance, and urgency.",
    inputs: "Inputs: released orders, storage locations, zone layout, batch constraints, deadlines.",
    output: "Output: work packages with assignments, grouping explanation, and predicted efficiency gains."
  },
  {
    step: "03",
    title: "PRIORITIZE WORK",
    question: "What deserves attention first?",
    body: "Ranks active work by deadline urgency, zone congestion, and system-wide efficiency.",
    inputs: "Inputs: active work packages, shipping deadlines, congestion, worker availability.",
    output: "Output: ranked list with scores, explanations, and predicted impact vs. default sequencing."
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
    body: "The default recommendation generated from posture. In advisory mode it is recommended, in closed-loop mode it executes.",
    points: ["Not a compromise", "Best fit to declared priorities", "Recomputed every cycle"]
  }
];

const copilotCapabilities = [
  { title: "Translate", body: "Converts operational language into optimizer parameters." },
  { title: "Explain", body: "Turns constraint flags and metric deltas into actionable language tied to plan artifacts." },
  { title: "Guide", body: "Proactive alerts, shift briefings, and disruption summaries." }
];

const platformRows = [
  ["Oracle WMS Cloud", "REST API entities", "Tasks, waves, replenishment", "Strong"],
  ["SAP EWM", "Warehouse Task/Order tables", "Task creation, confirmation", "Viable"],
  ["Dynamics Business Central", "Sales Orders, Activity Lines", "Pick creation/re-sequencing", "Viable"],
  ["Others", "Varies", "Often limited", "Advisory mode"]
];

export default function ProductPage() {
  return (
    <MarketingShell>
      <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
        <div className="section-wrap py-8 md:py-12">
          <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Product
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.02em] md:text-6xl">The decision layer your WMS is missing.</h1>
          <p className="mt-6 max-w-4xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
            Three APIs that control what work enters the floor, how it&apos;s grouped, and what gets worked first. One optimization model that reasons about all constraints simultaneously.
          </p>
        </div>
      </section>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">THREE DECISIONS. EVERY CYCLE.</h2>
            <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Each API addresses one core question the warehouse faces every few minutes.
            </p>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {apiCards.map((card) => (
                <article key={card.title} className="marketing-card border-l-2 p-6" style={{ borderLeftColor: "var(--tessera-accent-signal)" }}>
                  <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
                    {card.step}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[-0.01em]">{card.title}</h3>
                  <p className="mt-3 text-base font-medium">{card.question}</p>
                  <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>{card.body}</p>
                  <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>{card.inputs}</p>
                  <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>{card.output}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap max-w-[980px]">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">ONE MODEL. NOT THREE.</h2>
            <p className="mt-5 text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              The three APIs are not separate optimizers. They are views into one model: Release decides what enters the system, Batching decides how to group it, and Prioritize decides what to work first. Because they share one constraint and objective representation, outputs stay mutually consistent.
            </p>
            <p className="mt-4 text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Hard constraints, like never deferring orders near cutoff and never exceeding active-work caps, are encoded directly in the model. Enforcement is structural, not post-hoc.
            </p>
            <p className="mt-4 text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              When operating conditions break, the system scales its response to the disruption, from local repair to complete re-optimization.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
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
      </Reveal>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>AI Copilot</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.01em]">Talk to your optimizer.</h2>
            <p className="mt-4 max-w-3xl text-base" style={{ color: "var(--tessera-text-secondary)" }}>
              Tess sits between operators and the optimization core. Every claim is grounded in optimizer data.
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-stretch">
              <article className="marketing-card p-6">
                <div className="space-y-4">
                  <div className="rounded-[12px] border p-4" style={{ borderColor: "var(--tessera-border)" }}>
                    <p className="text-sm">Operator: We have a 2pm carrier cutoff and we&apos;re short-staffed in Zone B.</p>
                    <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>Tess: Updated posture. Deadline compliance weight increased and Zone B capped at 35% active work.</p>
                  </div>
                  <div className="rounded-[12px] border p-4" style={{ borderColor: "var(--tessera-border)" }}>
                    <p className="text-sm">Operator: Why did you defer these orders?</p>
                    <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>Tess: Zone C is at 92% capacity. Releasing now would increase pick time by 34%.</p>
                  </div>
                  <div className="rounded-[12px] border p-4" style={{ borderColor: "var(--tessera-border)" }}>
                    <p className="text-sm">Operator: What if we release 80 orders instead of 120?</p>
                    <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>Tess: At 80, travel drops 14% with zero late-risk. At 120, Zone C hits 91% and introduces moderate late-risk.</p>
                  </div>
                </div>
              </article>
              <div className="grid h-full grid-rows-3 gap-3">
                {copilotCapabilities.map((capability) => (
                  <article key={capability.title} className="marketing-card h-full p-5">
                    <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">{capability.title}</h3>
                    <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>{capability.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">SITS ON TOP. DOESN&apos;T REPLACE.</h2>
            <p className="mt-5 max-w-4xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Tessera connects to your existing WMS. No rip-and-replace.
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <article className="marketing-card p-6">
                <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">Minimal Integration</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>Batching and Sequencing Only</p>
                <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                  Single request with pick IDs, location IDs, order IDs, and layout reference. Returns optimized batches with sequences and predicted metrics.
                </p>
              </article>
              <article className="marketing-card p-6">
                <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">Full Integration</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>Release, Re-Optimization, Closed-Loop</p>
                <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                  Adds backlog and deadlines, active work state, zone/capacity signals, and replenishment/location status.
                </p>
              </article>
            </div>
            <div className="marketing-card mt-6 overflow-x-auto p-4">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead style={{ color: "var(--tessera-text-secondary)" }}>
                  <tr>
                    <th className="pb-3 pr-4">Platform</th>
                    <th className="pb-3 pr-4">Read</th>
                    <th className="pb-3 pr-4">Write</th>
                    <th className="pb-3">Closed-Loop</th>
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
      </Reveal>

      <Reveal>
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
      </Reveal>
    </MarketingShell>
  );
}

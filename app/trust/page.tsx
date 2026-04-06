import { Reveal } from "@/components/Reveal";
import { RuledFeatureList } from "@/components/marketing/RuledFeatureList";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import Link from "next/link";

const guardrails = [
  {
    title: "Hard Constraints",
    body: "Never defer an order near cutoff, never exceed active-work cap, and never assign work to a blocked zone. Enforced inside the optimization model and configured per tenant."
  },
  {
    title: "Anomaly Detection",
    body: "If reality diverges from predictions — pick times exceeding estimates for consecutive cycles, supervisor overrides exceeding a threshold, unexpected spike in late-risk orders — Tessera pulls itself back to advisory mode automatically. The system knows when it's wrong."
  },
  {
    title: "Graduated Autonomy",
    body: "Start with low-risk decisions. Move higher-stakes decisions to automation only after confidence is earned."
  },
  {
    title: "Audit Trail",
    body: "Every recommendation, override, and predicted impact is logged. Each cycle is replayable and reviewable."
  }
];

const operatingModes = [
  {
    title: "ADVISORY",
    body: "Tessera recommends, the operator decides. Read-only connection, recommendations on a dashboard with full reasoning. The operator reviews and approves, modifies, or rejects each cycle."
  },
  {
    title: "CLOSED-LOOP",
    body: "Tessera executes, the operator oversees. Decisions push directly into the WMS with hard constraints, anomaly detection, and graduated autonomy as guardrails. The operator sets the posture and intervenes by exception."
  }
];

const proof = [
  { value: "-12%", label: "Travel distance" },
  { value: "-8%", label: "Pick time" },
  { value: "+15%", label: "Throughput at same labor" },
  { value: "100%", label: "Constraint compliance" }
];

export default function TrustPage() {
  return (
    <MarketingShell>
      <section className="border-b" style={{ borderColor: "var(--tessera-border)" }}>
        <div className="section-wrap pb-8 pt-6 md:py-12">
          <p className="font-code text-xs uppercase tracking-[0.14em] text-signal">Trust</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.02em] md:text-6xl">Autonomy you can verify.</h1>
          <p className="mt-6 max-w-3xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
            Hard constraints. Anomaly detection. Graduated autonomy. Full audit trail. Every decision replayable.
          </p>
        </div>
      </section>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">AUTONOMY, WITH GUARDRAILS.</h2>
            <div className="mt-10">
              <RuledFeatureList
                items={guardrails.map((item) => ({
                  title: item.title,
                  description: item.body
                }))}
              />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">ADVISORY OR CLOSED LOOP.</h2>
            <p className="mt-5 max-w-4xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Same optimization core. Same explanations. What changes is whether the plan goes to a dashboard or gets pushed back into the WMS.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {operatingModes.map((mode) => (
                <article key={mode.title} className="marketing-card p-6">
                  <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">{mode.title}</h3>
                  <p className="mt-3 text-base" style={{ color: "var(--tessera-text-secondary)" }}>{mode.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">AI THAT SHOWS ITS WORK.</h2>
            <p className="mt-5 text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Tess is an AI copilot. That means earning trust, not assuming it.
            </p>
            <div className="mt-8 space-y-4">
              <article className="marketing-card p-6">
                <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">GROUNDED IN OPTIMIZER DATA. NOT GENERATED NARRATIVES.</h3>
                <p className="mt-3 text-base" style={{ color: "var(--tessera-text-secondary)" }}>
                  Tess is not a language model guessing at warehouse operations. It has direct access to the optimization engine — when you ask a question, Tess modifies inputs and runs the optimizer to find the answer. When Tess says "this batch was deferred because Zone C is congested," that points to a specific binding constraint in the model. When it says "zero late-risk requires raising the Zone A cap to 48," that&apos;s the result of an actual optimizer run with modified parameters. If Tess can&apos;t ground a statement in optimizer output, it doesn&apos;t make the statement.
                </p>
              </article>
              <article className="marketing-card p-6">
                <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">THE OPERATOR VERIFIES. ALWAYS.</h3>
                <p className="mt-3 text-base" style={{ color: "var(--tessera-text-secondary)" }}>
                  In advisory mode, Tess helps operators review recommendations efficiently — "Summarize the top three changes," "Which ones are reversible?," "Which one reduces deadline risk the most?," "Apply only the priority updates." In closed-loop mode, Tess becomes the transparency surface — "Why did the system fall back to advisory?," "Pause automatic release changes next cycle," "Require approval for large deferrals." The operator always has the tools to check the system&apos;s work.
                </p>
              </article>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">RIGOR YOU CAN MEASURE.</h2>
            <p className="mt-5 text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Before/after metrics and constraint adherence - every run.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {proof.map((metric) => (
                <article key={metric.label} className="marketing-card px-5 py-6">
                  <p className="font-display text-5xl font-semibold text-signal">{metric.value}</p>
                  <p className="mt-3 text-sm uppercase tracking-[0.1em]" style={{ color: "var(--tessera-text-secondary)" }}>{metric.label}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
              Placeholder metrics. Replace with observed facility data when available.
            </p>
            <p className="mt-4 max-w-4xl text-base" style={{ color: "var(--tessera-text-secondary)" }}>
              Tessera does not ask you to trust a black box. Every recommendation includes predicted impact, and every cycle produces measurable before/after comparisons. The track record is visible, queryable, and auditable.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-space">
          <div className="section-wrap marketing-card p-8 md:p-12">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">SEE IT IN ACTION.</h2>
            <div className="mt-8">
              <Link href="/demo" className="btn-primary">Request a Demo</Link>
            </div>
          </div>
        </section>
      </Reveal>
    </MarketingShell>
  );
}

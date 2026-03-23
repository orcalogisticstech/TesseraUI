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
    body: "If estimates diverge from reality or overrides spike, the system automatically pulls back to advisory mode and alerts the team."
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

const phases = [
  {
    title: "Phase 1 - Advisory",
    body: "Read-only connection. Recommendations on a dashboard. Supervisor reviews and decides."
  },
  {
    title: "Phase 2 - Selective Write-Back",
    body: "Low-risk decisions push to WMS while higher-stakes decisions remain in advisory mode."
  },
  {
    title: "Phase 3 - Closed-Loop",
    body: "Continuous automated execution with human override. Guardrails maintain trust as scope expands."
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
      <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
        <div className="section-wrap py-8 md:py-12">
          <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>Trust</p>
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
            <h2 className="headline text-4xl font-semibold md:text-[44px]">FROM ADVISORY TO CLOSED-LOOP.</h2>
            <p className="mt-5 max-w-4xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Same three APIs. Same optimization core. What changes is whether output goes to a dashboard or back into the WMS.
            </p>
            <div className="mt-8 hidden grid-cols-3 gap-4 md:grid" style={{ color: "var(--tessera-accent-signal)" }}>
              <span>●───</span>
              <span>───●───</span>
              <span>───●</span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {phases.map((phase, index) => (
                <article
                  key={phase.title}
                  className="marketing-card p-6"
                  style={index === 0 ? { borderColor: "var(--tessera-accent-signal)" } : undefined}
                >
                  <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">{phase.title}</h3>
                  <p className="mt-3 text-base" style={{ color: "var(--tessera-text-secondary)" }}>{phase.body}</p>
                </article>
              ))}
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

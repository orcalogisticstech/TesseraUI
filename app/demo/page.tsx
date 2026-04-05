import { Reveal } from "@/components/Reveal";
import { DemoForm } from "@/components/marketing/DemoForm";
import { MarketingShell } from "@/components/marketing/MarketingShell";

const expectations = [
  "A 30-minute call with the founder.",
  "We will walk through a live optimization run on sample warehouse data.",
  "Bring your own facility data if you want. We will show what Tessera would recommend.",
  "No commitment. No 6-month POC. One conversation."
];

export default function DemoPage() {
  return (
    <MarketingShell>
      <section className="pb-10 pt-6 md:py-16">
        <div className="section-wrap">
          <Reveal>
            <div className="mb-10 max-w-3xl">
              <p className="font-code text-xs uppercase tracking-[0.14em] text-signal">
                Demo
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.02em] md:text-6xl">See Tessera run on your operation.</h1>
            </div>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <DemoForm />
            </Reveal>
            <Reveal>
              <aside className="marketing-card p-8">
                <h2 className="font-display text-4xl font-semibold tracking-[-0.01em]">What to expect</h2>
                <ul className="mt-6 space-y-4 text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
                  {expectations.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span style={{ color: "var(--tessera-accent-signal)" }}>◦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <blockquote className="mt-10 border-l-2 pl-4 font-display text-3xl font-semibold tracking-[-0.01em]" style={{ borderColor: "var(--tessera-accent-signal)" }}>
                  DECISIONS, NOT DASHBOARDS.
                </blockquote>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

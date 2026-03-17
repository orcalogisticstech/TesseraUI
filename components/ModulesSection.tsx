import { Card } from "@/components/Card";

const modules = [
  {
    title: "Optimize Release",
    description:
      "Given open orders, ship times, active work, staffing, and congestion, recommends release now versus defer with reasoning and predicted impact.",
    tag: "API",
    step: "01"
  },
  {
    title: "Optimize Batching",
    description:
      "Builds efficient work packages from released orders using proximity, order similarity, and zone balance. Returns grouping logic and predicted travel reduction.",
    tag: "API",
    step: "02"
  },
  {
    title: "Prioritize Work",
    description:
      "Ranks active work by deadline proximity, congestion, and efficiency. Returns scores, explanations, and impact versus default sequencing.",
    tag: "API",
    step: "03"
  },
  {
    title: "Empower Operators",
    description:
      "Shift-level posture, on-demand alternatives, and Tess's Choice let operators set strategic intent while the optimizer handles tactical execution.",
    tag: "Core"
  }
];

export function ModulesSection() {
  return (
    <section id="apis" className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap">
        <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">THREE APIS. ONE DECISION LOOP.</h2>
        <p className="mt-5 max-w-2xl text-lg" style={{ color: "var(--text-secondary)" }}>
          Each API addresses a core warehouse question. Together they run as a continuous decision layer on top of your existing WMS.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <Card key={module.title} title={module.title} description={module.description} tag={module.tag} step={module.step} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { Card } from "@/components/Card";

const modules = [
  {
    title: "OPTIMIZE RELEASE",
    description:
      "Controls what work enters the floor. Release now or defer to the next cycle, with predicted effect on congestion and deadlines.",
    step: "01"
  },
  {
    title: "OPTIMIZE BATCHING",
    description:
      "Groups released work into efficient packages. Reflects item proximity, order similarity, zone balance, and equipment constraints.",
    step: "02"
  },
  {
    title: "PRIORITIZE WORK",
    description:
      "Ranks active work so the team knows what deserves attention first. Reflects deadline urgency, zone congestion, and system-wide efficiency.",
    step: "03"
  }
];

export function ModulesSection() {
  return (
    <section id="apis" className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
      <div className="section-wrap">
        <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">THREE DECISIONS. EVERY CYCLE.</h2>
        <p className="mt-5 max-w-2xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
          Each API addresses one core question the warehouse faces every few minutes.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.title} title={module.title} description={module.description} step={module.step} />
          ))}
        </div>
      </div>
    </section>
  );
}

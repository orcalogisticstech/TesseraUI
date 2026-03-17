export function Footer() {
  return (
    <footer className="border-t py-8" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
        <div className="font-display text-xl font-semibold uppercase tracking-[-0.02em]">Tessera</div>
        <div className="flex flex-wrap gap-6" style={{ color: "var(--text-secondary)" }}>
          <a href="#" className="hover:text-[var(--text-primary)]">Documentation</a>
          <a href="#" className="hover:text-[var(--text-primary)]">API Reference</a>
          <a href="#" className="hover:text-[var(--text-primary)]">Contact</a>
        </div>
      </div>
    </footer>
  );
}

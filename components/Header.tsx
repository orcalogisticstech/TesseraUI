import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b backdrop-blur" style={{ borderColor: "var(--divider)", background: "color-mix(in srgb, var(--page-bg) 92%, transparent)" }}>
      <div className="section-wrap flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-display text-2xl font-semibold uppercase tracking-[-0.02em]">Tessera</div>
          <span className="hidden text-xs uppercase tracking-[0.14em] md:block" style={{ color: "var(--text-secondary)" }}>
            Warehouse OS
          </span>
        </div>
        <nav className="hidden gap-8 text-sm md:flex" style={{ color: "var(--text-secondary)" }}>
          <a href="#how-it-works" className="hover:text-[var(--text-primary)]">How It Works</a>
          <a href="#modules" className="hover:text-[var(--text-primary)]">Platform</a>
          <a href="#proof" className="hover:text-[var(--text-primary)]">Proof</a>
          <a href="#contact" className="hover:text-[var(--text-primary)]">Contact</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

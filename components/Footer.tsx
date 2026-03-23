import { BrandWordmark } from "@/components/BrandWordmark";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)" }}>
      <div className="section-wrap py-8">
        <div className="flex flex-col gap-6 border-b pb-6 md:flex-row md:items-start md:justify-between" style={{ borderColor: "var(--tessera-border)" }}>
          <Link href="/" aria-label="Tessera home">
            <BrandWordmark variant="footer" className="relative block h-10 w-[220px] overflow-hidden" />
          </Link>
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm md:grid-cols-3" style={{ color: "var(--tessera-text-secondary)" }}>
            <Link href="/product" className="hover:text-[var(--tessera-text-primary)]">Product</Link>
            <Link href="/trust" className="hover:text-[var(--tessera-text-primary)]">Trust</Link>
            <Link href="/team" className="hover:text-[var(--tessera-text-primary)]">Team</Link>
            <Link href="/demo" className="hover:text-[var(--tessera-text-primary)]">Demo</Link>
            <a href="#" className="hover:text-[var(--tessera-text-primary)]">Documentation</a>
            <a href="#" className="hover:text-[var(--tessera-text-primary)]">API Reference</a>
          </div>
        </div>
        <p className="pt-5 text-center text-xs uppercase tracking-[0.12em]" style={{ color: "var(--tessera-text-secondary)" }}>
          © 2026 Tessera. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

"use client";

import type { ReactNode } from "react";

type DetailPanelProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function DetailPanel({ open, title, onClose, children }: DetailPanelProps) {
  return (
    <>
      {open && <button type="button" aria-label="Close panel backdrop" className="fixed inset-0 z-20 bg-black/45" onClick={onClose} />}
      <aside
        className={`fixed right-0 top-0 z-30 h-screen w-full border-l transition-transform duration-[250ms] ease-out md:w-[560px] ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)" }}
      >
        <div className="flex h-16 items-center justify-between border-b px-4" style={{ borderColor: "var(--tessera-border)" }}>
          <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-button border px-3 py-2 text-sm" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
            Close
          </button>
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 md:p-6">{children}</div>
      </aside>
    </>
  );
}

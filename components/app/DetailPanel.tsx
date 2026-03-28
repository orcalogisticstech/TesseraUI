"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

type DetailPanelProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function DetailPanel({ open, title, onClose, children }: DetailPanelProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-2 md:p-6" onClick={onClose}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-[960px] overflow-hidden rounded-[14px] border shadow-2xl"
            style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-16 items-center justify-between border-b px-4" style={{ borderColor: "var(--tessera-border)" }}>
              <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">{title}</h2>
              <button type="button" onClick={onClose} className="rounded-button border px-3 py-2 text-sm" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                Close
              </button>
            </div>
            <div className="max-h-[calc(80vh-4rem)] overflow-y-auto p-4 md:p-6">{children}</div>
          </section>
        </div>
      ) : null}
    </>
  );
}

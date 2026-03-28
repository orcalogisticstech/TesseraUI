"use client";

import { ModeBadge } from "@/components/app/ModeBadge";
import { useAppState } from "@/components/app/AppProvider";
import { useEffect, useState } from "react";

const HEARTBEAT_SECONDS = 15 * 60;

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TopBar() {
  const { mode, setMode, session, copilotOpen, setCopilotOpen, setPosturePanelOpen } = useAppState();
  const [remaining, setRemaining] = useState(462);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((current) => (current <= 1 ? HEARTBEAT_SECONDS : current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header
      className="sticky top-0 z-10 border-b backdrop-blur"
      style={{
        borderColor: "var(--tessera-border)",
        background: "color-mix(in srgb, var(--tessera-bg-page) 92%, transparent)"
      }}
    >
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border px-3 py-1" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
            NEXT HEARTBEAT: <span style={{ color: "var(--tessera-accent-signal)" }}>{formatCountdown(remaining)}</span>
          </span>
          <span className="hidden rounded-full border px-3 py-1 text-xs md:inline" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
            {session.tenantName} · {session.role}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as typeof mode)}
            className="rounded-[10px] border bg-transparent px-2 py-1 text-xs"
            style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}
          >
            <option>Advisory</option>
            <option>Closed-Loop</option>
          </select>
          <ModeBadge mode={mode} />
          <button type="button" className="btn-secondary hidden px-3 py-2 text-xs md:inline-flex" onClick={() => setPosturePanelOpen(true)}>
            Edit Posture
          </button>
          <button
            type="button"
            className="rounded-button border px-3 py-2 text-xs lg:hidden"
            style={{
              borderColor: copilotOpen ? "var(--tessera-accent-signal)" : "var(--tessera-border)",
              color: copilotOpen ? "var(--tessera-accent-signal)" : "var(--tessera-text-secondary)"
            }}
            onClick={() => setCopilotOpen(!copilotOpen)}
          >
            Tess
          </button>
        </div>
      </div>
    </header>
  );
}

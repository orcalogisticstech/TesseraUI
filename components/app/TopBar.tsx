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
  const { mode, posture } = useAppState();
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
            Next heartbeat {formatCountdown(remaining)}
          </span>
          <span className="hidden text-sm md:inline" style={{ color: "var(--tessera-text-secondary)" }}>
            Posture: {posture.presetName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ModeBadge mode={mode} />
        </div>
      </div>
    </header>
  );
}

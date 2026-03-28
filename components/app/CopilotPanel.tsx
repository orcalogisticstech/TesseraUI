"use client";

import { useAppState } from "@/components/app/AppProvider";
import Link from "next/link";
import { useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

const COPILOT_WIDTH_MIN = 320;
const COPILOT_WIDTH_MAX = 560;

function clampCopilotWidth(width: number) {
  return Math.min(COPILOT_WIDTH_MAX, Math.max(COPILOT_WIDTH_MIN, width));
}

export function CopilotPanel() {
  const { copilotOpen, setCopilotOpen, copilotMessages, setCopilotMessages, setPosturePanelOpen, copilotWidth, setCopilotWidth } = useAppState();
  const [draft, setDraft] = useState("");
  const panelStyle = {
    borderColor: "var(--tessera-border)",
    background: "var(--tessera-bg-page)",
    "--tessera-copilot-width": `${copilotWidth}px`
  } as CSSProperties;

  const submitMessage = () => {
    if (!draft.trim()) {
      return;
    }

    const operatorMessage = {
      id: `op-${Date.now()}`,
      actor: "operator" as const,
      text: draft.trim()
    };

    const tessReply = {
      id: `ts-${Date.now() + 1}`,
      actor: "tess" as const,
      text: "I mapped that request to the active optimization model. Open Explore to compare scenarios or Edit Posture to adjust objective weights.",
      grounding: {
        cycleNumber: 4828,
        constraintIds: ["OBJ-DEADLINE", "OBJ-CONGESTION"],
        metrics: ["travel", "late-risk", "zone-utilization"]
      },
      viewLink: { label: "Open Trade-Off Explorer", href: "/app/explore" },
      action: { label: "Apply this posture change", actionId: "open-posture" as const }
    };

    setCopilotMessages([...copilotMessages, operatorMessage, tessReply]);
    setDraft("");
  };

  const onAction = (actionId: "open-posture" | "open-explore" | "open-release") => {
    if (actionId === "open-posture") {
      setPosturePanelOpen(true);
    }
  };

  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (window.innerWidth < 1024) {
      return;
    }
    event.preventDefault();
    document.body.style.userSelect = "none";

    const onPointerMove = (moveEvent: PointerEvent) => {
      const nextWidth = clampCopilotWidth(window.innerWidth - moveEvent.clientX);
      setCopilotWidth(nextWidth);
    };

    const onPointerUp = () => {
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onPointerMove);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  };

  return (
    <aside
      className={`fixed right-0 top-0 z-40 h-screen w-full overflow-hidden border-l transition-transform duration-[250ms] ease-out md:w-[400px] ${copilotOpen ? "translate-x-0" : "translate-x-full"} lg:sticky lg:z-20 lg:w-[var(--tessera-copilot-width)] lg:translate-x-0`}
      style={panelStyle}
    >
      <button
        type="button"
        className="absolute left-0 top-0 hidden h-full w-3 cursor-col-resize lg:block"
        onPointerDown={startResize}
        aria-label="Resize Tess panel"
        title="Drag to resize"
      />
      <div className="flex h-16 items-center justify-between border-b px-4" style={{ borderColor: "var(--tessera-border)" }}>
        <div>
          <p className="font-code text-xs uppercase tracking-[0.12em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Tess Copilot
          </p>
          <p className="text-sm">Talk to your optimizer</p>
        </div>
        <button type="button" className="btn-secondary px-3 py-2 text-sm lg:hidden" onClick={() => setCopilotOpen(false)}>
          Close
        </button>
      </div>

      <div className="flex h-[calc(100vh-4rem)] min-h-0 flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {copilotMessages.map((message) => (
            <div key={message.id}>
              {message.actor === "system" ? (
                <p className="text-center text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
                  {message.text}
                </p>
              ) : (
                <div className={`max-w-[90%] rounded-card border p-3 ${message.actor === "operator" ? "ml-auto" : "mr-auto"}`} style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)" }}>
                  <p className="text-sm leading-relaxed">{message.text}</p>

                  {message.grounding && (
                    <p className="mt-2 inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: "var(--tessera-accent-signal)" }} />
                      Grounded · Cycle {message.grounding.cycleNumber}
                    </p>
                  )}

                  {message.metricCards && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {message.metricCards.map((card) => (
                        <div key={card.label} className="rounded-[10px] border p-2" style={{ borderColor: "var(--tessera-border)" }}>
                          <p className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
                            {card.label}
                          </p>
                          <p className="mt-1 text-sm font-medium">{card.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.viewLink && (
                      <Link href={message.viewLink.href} className="btn-secondary px-3 py-2 text-xs">
                        {message.viewLink.label}
                      </Link>
                    )}
                    {message.action && (
                      <button type="button" className="rounded-button px-3 py-2 text-xs" style={{ border: "1px solid var(--tessera-accent-signal)", color: "var(--tessera-accent-signal)" }} onClick={() => onAction(message.action!.actionId)}>
                        {message.action.label}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t p-4" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submitMessage();
                }
              }}
              placeholder="Ask Tess about this cycle..."
              className="w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
              style={{ borderColor: "var(--tessera-border)" }}
            />
            <button type="button" className="btn-primary px-3 py-2" onClick={submitMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

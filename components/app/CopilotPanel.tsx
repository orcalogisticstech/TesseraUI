"use client";

import { useAppState } from "@/components/app/AppProvider";
import tessWordmarkDark from "@/tessera_svg_elements_exact/tess.svg";
import tessWordmarkLight from "@/tessera_svg_elements_exact/tess_light.svg";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

const COPILOT_WIDTH_MIN = 320;
const COPILOT_WIDTH_MAX = 744;

function clampCopilotWidth(width: number) {
  return Math.min(COPILOT_WIDTH_MAX, Math.max(COPILOT_WIDTH_MIN, width));
}

export function CopilotPanel() {
  const {
    copilotOpen,
    setCopilotOpen,
    copilotMessages,
    setCopilotMessages,
    copilotDraftAttachments,
    setCopilotDraftAttachments,
    setPosturePanelOpen,
    copilotWidth,
    setCopilotWidth,
    theme
  } = useAppState();
  const [draft, setDraft] = useState("");
  const tessWordmarkSrc = theme === "light" ? tessWordmarkLight : tessWordmarkDark;
  const tessWordmarkClass = theme === "light" ? "object-contain object-center scale-[2.45]" : "object-contain object-center";
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
      text: "I mapped that request to the active optimization model. Edit Posture to adjust objective weights for the next cycle.",
      grounding: {
        cycleNumber: 4828,
        constraintIds: ["OBJ-DEADLINE", "OBJ-CONGESTION"],
        metrics: ["travel", "late-risk", "zone-utilization"]
      },
      action: { label: "Apply this posture change", actionId: "open-posture" as const }
    };

    setCopilotMessages([...copilotMessages, operatorMessage, tessReply]);
    setCopilotDraftAttachments([]);
    setDraft("");
  };

  const onAction = (actionId: "open-posture") => {
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
      className={`fixed right-0 top-0 z-40 h-screen w-full overflow-hidden overscroll-contain transition-[transform,width] duration-[250ms] ease-out md:w-[400px] ${copilotOpen ? "translate-x-0 border-l" : "translate-x-full border-l"} lg:sticky lg:z-20 lg:translate-x-0 ${copilotOpen ? "lg:w-[var(--tessera-copilot-width)] lg:border-l" : "lg:w-0 lg:border-l-0"}`}
      style={panelStyle}
    >
      <button
        type="button"
        className="absolute left-0 top-0 hidden h-full w-3 cursor-col-resize lg:block"
        onPointerDown={startResize}
        aria-label="Resize Tess panel"
        title="Drag to resize"
      />
      <div className="flex h-20 items-center justify-between border-b px-4" style={{ borderColor: "var(--tessera-border)" }}>
        <div className="flex flex-1 justify-center lg:justify-center">
          <div className="flex flex-col items-center">
            <div className="relative h-8 w-[134px] overflow-hidden">
              <Image src={tessWordmarkSrc} alt="Tess" fill priority className={tessWordmarkClass} />
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
              TALK TO YOUR OPTIMIZER
            </p>
          </div>
        </div>
        <button type="button" className="btn-secondary px-3 py-2 text-sm lg:hidden" onClick={() => setCopilotOpen(false)}>
          Close
        </button>
      </div>

      <div className="flex h-[calc(100vh-5rem)] min-h-0 flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
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
          {copilotDraftAttachments.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {copilotDraftAttachments.map((attachment) => (
                <div key={attachment.id} className="inline-flex items-center gap-2 rounded-[10px] border px-3 py-2" style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)" }}>
                  <div>
                    <p className="text-xs font-medium">{attachment.title}</p>
                    <p className="text-[11px]" style={{ color: "var(--tessera-text-secondary)" }}>
                      {attachment.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full px-2 py-1 text-xs"
                    style={{ color: "var(--tessera-text-secondary)" }}
                    onClick={() => setCopilotDraftAttachments((current) => current.filter((item) => item.id !== attachment.id))}
                    aria-label={`Remove ${attachment.title}`}
                    title={`Remove ${attachment.title}`}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          ) : null}
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

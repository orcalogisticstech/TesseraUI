"use client";

import { useAppState } from "@/components/app/AppProvider";
import { useState } from "react";
import { BrandTile } from "@/components/BrandTile";

export function SettingsView() {
  const { data, session } = useAppState();
  const [cycleInterval, setCycleInterval] = useState(data.settings.cycleIntervalMinutes);
  const [locationRegex, setLocationRegex] = useState(data.settings.locationRegex);
  const [cutoffWindow, setCutoffWindow] = useState(data.settings.hardConstraints.cutoffWindowHours);
  const [floorCap, setFloorCap] = useState(data.settings.hardConstraints.floorCap);

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <div className="flex items-center gap-3">
          <BrandTile className="h-6 w-auto" variant="collapsed" tone="dark" />
          <h1 className="font-display text-3xl font-semibold uppercase tracking-[-0.01em]">Settings</h1>
        </div>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Tenant configuration, hard constraints, integrations, users, and autonomy matrix.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="app-card p-4 md:p-6">
          <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">General</h2>
          <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            {data.settings.tenantName} · {data.settings.timezone}
          </p>
          <label className="mt-3 block text-sm">
            Cycle interval (minutes)
            <input
              type="number"
              min={5}
              max={60}
              value={cycleInterval}
              onChange={(event) => setCycleInterval(Number(event.target.value))}
              className="mt-2 w-full border bg-transparent px-3 py-2"
              style={{ borderColor: "var(--tessera-border)" }}
            />
          </label>
          <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            Shifts: {data.settings.shifts.join(" · ")}
          </p>

        </article>

        <article className="app-card p-4 md:p-6">
          <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Integration Status</h2>
          <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            Platform: {data.settings.integration.platform}
          </p>
          <p className="mt-1 text-sm" style={{ color: data.settings.integration.status === "Healthy" ? "var(--tessera-success)" : "var(--tessera-warning)" }}>
            {data.settings.integration.status}. Polling every {data.settings.integration.pollingIntervalSeconds}s.
          </p>
          <button type="button" className="btn-secondary mt-3 text-sm">Test connection</button>
        </article>
      </section>

      <section className="app-card space-y-4 p-4 md:p-6">
        <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Warehouse Layout</h2>
        <label className="block text-sm">
          Location regex
          <input
            type="text"
            value={locationRegex}
            onChange={(event) => setLocationRegex(event.target.value)}
            className="mt-2 w-full border bg-transparent px-3 py-2"
            style={{ borderColor: "var(--tessera-border)" }}
          />
        </label>
        <p className="text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Routing points: {data.settings.routingPoints.join(", ")}
        </p>
      </section>

      <section className="app-card space-y-4 p-4 md:p-6">
        <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Hard Constraints</h2>
        <label className="block text-sm">
          Cutoff window (hours)
          <input
            type="number"
            min={1}
            max={6}
            value={cutoffWindow}
            onChange={(event) => setCutoffWindow(Number(event.target.value))}
            className="mt-2 w-full border bg-transparent px-3 py-2"
            style={{ borderColor: "var(--tessera-border)" }}
          />
        </label>
        <label className="block text-sm">
          Floor cap (active tasks)
          <input
            type="number"
            min={120}
            max={350}
            value={floorCap}
            onChange={(event) => setFloorCap(Number(event.target.value))}
            className="mt-2 w-full border bg-transparent px-3 py-2"
            style={{ borderColor: "var(--tessera-border)" }}
          />
        </label>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="app-card p-4 md:p-6">
          <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Autonomy Level</h2>
          <div className="mt-3 space-y-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            <p>Priority changes: {data.settings.autonomy.priorityChanges}</p>
            <p>Release decisions: {data.settings.autonomy.releaseDecisions}</p>
            <p>Batch modifications: {data.settings.autonomy.batchModifications}</p>
          </div>
        </article>

        <article className="app-card p-4 md:p-6">
          <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Users & Roles</h2>
          <p className="mt-2 text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Signed in as {session.role}
          </p>
          {session.role === "Admin" ? (
            <div className="mt-3 space-y-2 text-sm">
              {data.users.map((user) => (
                <div key={user.id} className="border p-2" style={{ borderColor: "var(--tessera-border)" }}>
                  <p>{user.name}</p>
                  <p style={{ color: "var(--tessera-text-secondary)" }}>{user.email} · {user.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
              Admin role required to invite users and assign roles.
            </p>
          )}
        </article>
      </section>

      <button type="button" className="btn-primary">Save Settings</button>
    </div>
  );
}

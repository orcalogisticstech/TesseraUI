"use client";

import type { UserRole } from "@/lib/mock-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const roleOptions: Array<{ role: UserRole; description: string }> = [
  { role: "Admin", description: "Full configuration access across tenant settings and users." },
  { role: "Supervisor", description: "Can configure posture, review recommendations, and run overrides." },
  { role: "Operator", description: "Read-only plus Tess copilot interaction." }
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<UserRole>("Supervisor");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const nextPath = searchParams.get("next") || "/app";

  const login = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/mock-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole })
      });

      if (!response.ok) {
        throw new Error("Unable to create mock session.");
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setErrorMessage("Login failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[520px] items-center px-6 py-10">
      <section className="app-card w-full p-6 md:p-8">
        <p className="font-code text-xs uppercase tracking-[0.12em]" style={{ color: "var(--tessera-text-secondary)" }}>
          APP LOGIN
        </p>
        <h1 className="mt-3 font-display text-4xl uppercase tracking-[-0.02em]">Sign in to Tessera</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Mock auth is enabled for implementation. Choose a role to simulate permissions.
        </p>

        <div className="mt-6 space-y-3">
          {roleOptions.map((option) => {
            const active = selectedRole === option.role;
            return (
              <button
                key={option.role}
                type="button"
                onClick={() => setSelectedRole(option.role)}
                className="w-full rounded-card border p-4 text-left transition duration-150"
                style={{
                  borderColor: active ? "var(--tessera-accent-signal)" : "var(--tessera-border)",
                  background: active ? "color-mix(in srgb, var(--tessera-accent-signal) 12%, transparent)" : "transparent"
                }}
              >
                <p className="font-medium">{option.role}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {errorMessage && (
          <p className="mt-4 text-sm" style={{ color: "var(--tessera-danger)" }}>
            {errorMessage}
          </p>
        )}

        <button type="button" className="btn-primary mt-6 w-full" onClick={login} disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : `Continue as ${selectedRole}`}
        </button>
      </section>
    </main>
  );
}

"use client";

import { FormEvent, useState } from "react";

const platforms = [
  "Oracle WMS Cloud",
  "SAP EWM",
  "Manhattan Active WM",
  "ShipHero",
  "Logiwa",
  "Deposco",
  "Extensiv",
  "Other"
];

type FormState = {
  name: string;
  email: string;
  company: string;
  platform: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  platform: platforms[0],
  message: ""
};

export function DemoForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (field: keyof FormState, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setErrorMessage(payload.error ?? "Could not submit form right now.");
        return;
      }

      setStatus("success");
      setValues(initialState);
    } catch {
      setStatus("error");
      setErrorMessage("Could not submit form right now.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="marketing-card space-y-4 p-8">
      <label className="block text-sm">
        Name
        <input
          required
          type="text"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="mt-2 w-full rounded-[12px] border px-3 py-2"
          style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-input)" }}
        />
      </label>
      <label className="block text-sm">
        Email
        <input
          required
          type="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="mt-2 w-full rounded-[12px] border px-3 py-2"
          style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-input)" }}
        />
      </label>
      <label className="block text-sm">
        Company
        <input
          required
          type="text"
          value={values.company}
          onChange={(event) => updateField("company", event.target.value)}
          className="mt-2 w-full rounded-[12px] border px-3 py-2"
          style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-input)" }}
        />
      </label>
      <label className="block text-sm">
        WMS Platform
        <select
          value={values.platform}
          onChange={(event) => updateField("platform", event.target.value)}
          className="mt-2 w-full rounded-[12px] border px-3 py-2"
          style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-input)" }}
        >
          {platforms.map((platform) => (
            <option key={platform}>{platform}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Message (optional)
        <textarea
          rows={3}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="mt-2 w-full rounded-[12px] border px-3 py-2"
          style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-input)" }}
        />
      </label>

      <button type="submit" className="btn-primary mt-2 inline-flex w-full justify-center" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting..." : "Request Demo"}
      </button>

      {status === "success" ? (
        <p className="text-sm" style={{ color: "var(--tessera-success)" }}>
          ✓ We&apos;ll be in touch within 24 hours.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm" style={{ color: "var(--tessera-danger)" }}>
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}

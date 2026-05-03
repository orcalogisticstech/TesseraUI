import "server-only";

const ORCHESTRATOR_URL = process.env.TESSERA_PICK_ORCHESTRATOR_URL ?? "http://localhost:8100";
const TESSCOPILOT_URL = process.env.TESSERA_PICK_TESSCOPILOT_URL ?? "http://localhost:8200";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body);
    } catch {
      detail = await response.text();
    }
    throw new Error(detail || `TesseraPick request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

function orchestratorUrl(path: string) {
  return new URL(path, ORCHESTRATOR_URL).toString();
}

function tessCopilotUrl(path: string) {
  return new URL(path, TESSCOPILOT_URL).toString();
}

export async function fetchBootstrapRaw(tenantId = "demo", facilityId = "ATL1") {
  const url = new URL(orchestratorUrl("/orchestrator/v1/ui/bootstrap"));
  url.searchParams.set("tenant_id", tenantId);
  url.searchParams.set("facility_id", facilityId);
  return fetchJson<unknown>(url.toString());
}

export async function createHeartbeatRunRaw(payload: unknown) {
  return fetchJson<unknown>(orchestratorUrl("/orchestrator/v1/ui/heartbeat-runs"), {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchRunDetailsRaw(params: {
  runId: string;
  tradeoffLabel: string;
  page: number;
  pageSize: number;
}) {
  const url = new URL(orchestratorUrl(`/orchestrator/v1/ui/runs/${encodeURIComponent(params.runId)}/solution-details`));
  url.searchParams.set("tradeoff_label", params.tradeoffLabel);
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("page_size", String(params.pageSize));
  return fetchJson<unknown>(url.toString());
}

export async function fetchLayoutRenderRaw(tenantId = "demo", facilityId = "ATL1") {
  const url = new URL(orchestratorUrl("/orchestrator/v1/ui/layout-render"));
  url.searchParams.set("tenant_id", tenantId);
  url.searchParams.set("facility_id", facilityId);
  return fetchJson<unknown>(url.toString());
}

export async function adoptPlanRaw(payload: unknown) {
  return fetchJson<unknown>(orchestratorUrl("/orchestrator/v1/ui/adoptions"), {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function listAdoptionsRaw(tenantId = "demo", facilityId = "ATL1") {
  const url = new URL(orchestratorUrl("/orchestrator/v1/ui/adoptions"));
  url.searchParams.set("tenant_id", tenantId);
  url.searchParams.set("facility_id", facilityId);
  return fetchJson<unknown>(url.toString());
}

export async function updateFloorStateRaw(payload: unknown) {
  return fetchJson<unknown>(orchestratorUrl("/orchestrator/v1/ui/floor-state"), {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function queryTessCopilotRaw(payload: unknown) {
  return fetchJson<unknown>(tessCopilotUrl("/tesscopilot/v1/query"), {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

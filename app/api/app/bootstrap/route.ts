import { getMockSession } from "@/lib/mock-auth-server";
import { getAppData } from "@/lib/mock-data";
import { shouldUseMockData } from "@/lib/server/data-mode";
import { getRecordedHeartbeatPlanSets } from "@/lib/server/heartbeat-recordings";
import { fetchBootstrapRaw } from "@/lib/server/tesserapick-client";
import { normalizeBootstrap } from "@/lib/tesserapick-normalizers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getMockSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const url = new URL(request.url);
  const tenantId = url.searchParams.get("tenantId") ?? "demo";
  const facilityId = url.searchParams.get("facilityId") ?? "ATL1";

  try {
    if (shouldUseMockData()) {
      return NextResponse.json({
        data: getAppData(session),
        initialHeartbeatPlanSets: getRecordedHeartbeatPlanSets(),
        adoptedPlansHistory: [],
        jobConfig: {
          blocked_aisles: [],
          no_go_zones: [],
          blocked_terminals: [],
          weights: { travel_time: 0.4, tardiness: 0.5, zone_balance: 0.1 },
          penalties: { zone_cross: 1, split_order: 0, grouping_violation: 1 },
          required_group_splits: [],
          preferred_group_splits: [],
          available_carts: [{ cart_type_id: "CART_SMALL", count: 8 }],
          max_batches: 12,
          max_tasks_per_zone: 40
        },
        activeJobIds: ["MHT-JOB-ATL1-1001"]
      });
    }

    const raw = await fetchBootstrapRaw(tenantId, facilityId);
    return NextResponse.json(normalizeBootstrap(raw, session));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load TesseraPick bootstrap data.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

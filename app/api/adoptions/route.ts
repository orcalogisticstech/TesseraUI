import { shouldUseMockData } from "@/lib/server/data-mode";
import { adoptPlanRaw, listAdoptionsRaw } from "@/lib/server/tesserapick-client";
import { normalizeAdoptedEntry, normalizeKpiSnapshot } from "@/lib/tesserapick-normalizers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get("tenantId") ?? "demo";
  const facilityId = url.searchParams.get("facilityId") ?? "ATL1";

  try {
    if (shouldUseMockData()) {
      return NextResponse.json({ adoptedPlansHistory: [] });
    }

    const raw = (await listAdoptionsRaw(tenantId, facilityId)) as { adopted_plans_history?: unknown[] };
    return NextResponse.json({
      adoptedPlansHistory: (raw.adopted_plans_history ?? []).map(normalizeAdoptedEntry)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load adopted plans.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (shouldUseMockData()) {
      const metrics = body.plan?.metrics ?? {};
      return NextResponse.json(
        {
          entry: {
            id: `adopted-${Date.now()}`,
            adoptedAt: new Date().toISOString(),
            plan: body.plan
          },
          kpi: {
            lateOrders: metrics.late_orders ?? 0,
            selectedTasks: metrics.selected_tasks ?? 0,
            candidateTasks: metrics.candidate_tasks ?? metrics.selected_tasks ?? 0,
            maxZoneLoad: metrics.max_zone_load ?? 0,
            zoneCrossings: metrics.zone_crossings ?? 0,
            priorityAlignment: metrics.priority_alignment ?? 0,
            throughputPicksPerHour: metrics.throughput_picks_per_hour ?? 0
          }
        },
        { status: 201 }
      );
    }

    const raw = (await adoptPlanRaw(body)) as { entry?: unknown; kpi?: unknown };
    return NextResponse.json({ entry: normalizeAdoptedEntry(raw.entry), kpi: normalizeKpiSnapshot(raw.kpi) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to adopt plan.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

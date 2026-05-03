import { adoptPlanRaw, listAdoptionsRaw } from "@/lib/server/tesserapick-client";
import { normalizeAdoptedEntry } from "@/lib/tesserapick-normalizers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get("tenantId") ?? "demo";
  const facilityId = url.searchParams.get("facilityId") ?? "ATL1";

  try {
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
    const raw = (await adoptPlanRaw(body)) as { entry?: unknown };
    return NextResponse.json({ entry: normalizeAdoptedEntry(raw.entry) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to adopt plan.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

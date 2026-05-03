import { shouldUseMockData } from "@/lib/server/data-mode";
import { updateFloorStateRaw } from "@/lib/server/tesserapick-client";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (shouldUseMockData()) {
      return NextResponse.json({
        job_ids: body.job_ids ?? [],
        blocked_location_count: body.blocked_locations?.length ?? 0,
        blocked_zone_count: body.blocked_zones?.length ?? 0
      });
    }

    const raw = await updateFloorStateRaw(body);
    return NextResponse.json(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update floor state.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

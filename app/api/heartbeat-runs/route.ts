import { shouldUseMockData } from "@/lib/server/data-mode";
import { getRecordedHeartbeatPlanSets } from "@/lib/server/heartbeat-recordings";
import { createHeartbeatRunRaw } from "@/lib/server/tesserapick-client";
import { normalizeHeartbeatRunResponse } from "@/lib/tesserapick-normalizers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (shouldUseMockData()) {
      const planSets = getRecordedHeartbeatPlanSets();
      return NextResponse.json(
        {
          runId: planSets[0]?.[0]?.run.runId ?? "mock-run",
          status: "succeeded",
          plans: planSets[0] ?? []
        },
        { status: 201 }
      );
    }

    const body = await request.json();
    const raw = await createHeartbeatRunRaw(body);
    return NextResponse.json(normalizeHeartbeatRunResponse(raw), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create heartbeat run.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

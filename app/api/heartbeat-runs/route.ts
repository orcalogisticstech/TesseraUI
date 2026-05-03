import { createHeartbeatRunRaw } from "@/lib/server/tesserapick-client";
import { normalizeHeartbeatRunResponse } from "@/lib/tesserapick-normalizers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const raw = await createHeartbeatRunRaw(body);
    return NextResponse.json(normalizeHeartbeatRunResponse(raw), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create heartbeat run.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

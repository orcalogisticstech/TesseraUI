import { updateFloorStateRaw } from "@/lib/server/tesserapick-client";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const raw = await updateFloorStateRaw(body);
    return NextResponse.json(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update floor state.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

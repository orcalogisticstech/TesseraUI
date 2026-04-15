import { getRecordedHeartbeatRunDetails } from "@/lib/server/heartbeat-recordings";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get("requestId");
  const tradeoffLabel = searchParams.get("tradeoffLabel");

  if (!requestId || !tradeoffLabel) {
    return NextResponse.json({ error: "requestId and tradeoffLabel are required." }, { status: 400 });
  }

  const details = getRecordedHeartbeatRunDetails(requestId, tradeoffLabel);

  if (!details) {
    return NextResponse.json({ error: "Run details not found." }, { status: 404 });
  }

  return NextResponse.json(details);
}

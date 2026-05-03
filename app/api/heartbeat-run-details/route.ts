import { fetchRunDetailsRaw } from "@/lib/server/tesserapick-client";
import { normalizeRunDetails } from "@/lib/tesserapick-normalizers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId");
  const requestId = searchParams.get("requestId");
  const tradeoffLabel = searchParams.get("tradeoffLabel");
  const page = Number(searchParams.get("page") ?? "0");
  const pageSize = Number(searchParams.get("pageSize") ?? "100");

  if ((!runId && !requestId) || !tradeoffLabel) {
    return NextResponse.json({ error: "runId/requestId and tradeoffLabel are required." }, { status: 400 });
  }

  try {
    const raw = await fetchRunDetailsRaw({
      runId: runId ?? requestId!,
      tradeoffLabel,
      page,
      pageSize
    });
    return NextResponse.json(normalizeRunDetails(raw));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Run details not found.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

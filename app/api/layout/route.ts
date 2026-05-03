import { fetchLayoutRenderRaw } from "@/lib/server/tesserapick-client";
import { normalizeLayoutGraph } from "@/lib/tesserapick-normalizers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get("tenantId") ?? "demo";
  const facilityId = url.searchParams.get("facilityId") ?? "ATL1";

  try {
    const graph = await fetchLayoutRenderRaw(tenantId, facilityId);
    return NextResponse.json(normalizeLayoutGraph(graph));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load layout graph.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

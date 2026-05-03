import { LayoutLoadError, loadLayoutGraph } from "@/lib/layout-graph";
import { shouldUseMockData } from "@/lib/server/data-mode";
import { fetchLayoutRenderRaw } from "@/lib/server/tesserapick-client";
import { normalizeLayoutGraph } from "@/lib/tesserapick-normalizers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get("tenantId") ?? "demo";
  const facilityId = url.searchParams.get("facilityId") ?? "ATL1";

  try {
    if (shouldUseMockData()) {
      const layoutKey = url.searchParams.get("layout") ?? "demo_layout_1_v1";
      return NextResponse.json(await loadLayoutGraph(layoutKey));
    }

    const graph = await fetchLayoutRenderRaw(tenantId, facilityId);
    return NextResponse.json(normalizeLayoutGraph(graph));
  } catch (error) {
    if (error instanceof LayoutLoadError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Failed to load layout graph.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

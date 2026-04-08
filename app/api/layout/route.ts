import { LayoutLoadError, loadLayoutGraph } from "@/lib/layout-graph";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_LAYOUT_KEY = "demo_layout_1_v1";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const layoutKey = url.searchParams.get("layout") ?? DEFAULT_LAYOUT_KEY;

  try {
    const graph = await loadLayoutGraph(layoutKey);
    return NextResponse.json(graph);
  } catch (error) {
    if (error instanceof LayoutLoadError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to load layout graph." }, { status: 500 });
  }
}

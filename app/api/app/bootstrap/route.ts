import { getMockSession } from "@/lib/mock-auth-server";
import { fetchBootstrapRaw } from "@/lib/server/tesserapick-client";
import { normalizeBootstrap } from "@/lib/tesserapick-normalizers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getMockSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const url = new URL(request.url);
  const tenantId = url.searchParams.get("tenantId") ?? "demo";
  const facilityId = url.searchParams.get("facilityId") ?? "ATL1";

  try {
    const raw = await fetchBootstrapRaw(tenantId, facilityId);
    return NextResponse.json(normalizeBootstrap(raw, session));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load TesseraPick bootstrap data.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

"use client";

import type { LayoutGraphData } from "@/components/app/layout/layout-types";
import { useEffect, useState } from "react";

const DEFAULT_LAYOUT_KEY = "demo_layout_1_v1";

export function useLayoutGraphData(layoutKey = DEFAULT_LAYOUT_KEY) {
  const [data, setData] = useState<LayoutGraphData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError(null);
      try {
        const response = await fetch(`/api/layout?tenantId=demo&facilityId=ATL1&layout=${encodeURIComponent(layoutKey)}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load layout.");
        }
        const payload = (await response.json()) as LayoutGraphData;
        if (!cancelled) {
          setData(payload as LayoutGraphData);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load layout.");
          setData(null);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [layoutKey]);

  return {
    data,
    error,
    loading: data === null && error === null
  };
}

import "server-only";

export type TesseraDataMode = "live" | "mock";

export function getTesseraDataMode(): TesseraDataMode {
  const configuredMode = process.env.TESSERA_PICK_DATA_MODE?.trim().toLowerCase();
  if (configuredMode === "mock" || configuredMode === "live") {
    return configuredMode;
  }

  return process.env.VERCEL ? "mock" : "live";
}

export function shouldUseMockData() {
  return getTesseraDataMode() === "mock";
}

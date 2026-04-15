export const tradeoffLabelMap: Record<string, string> = {
  primary: "Tess's Choice",
  minimize_travel: "Minimize Travel",
  zero_late_risk: "Zero Late Risk",
  balance_zones: "Balance Zones"
};

export function formatTradeoffLabel(label: string) {
  return tradeoffLabelMap[label] ?? label.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatWithMaxDecimals(value: number, maxDecimals: number) {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  const rounded = Number(value.toFixed(maxDecimals));
  if (Object.is(rounded, -0)) {
    return "0";
  }
  return String(rounded);
}

export function formatFloatCompact(value: number) {
  return formatWithMaxDecimals(value, 1);
}

export function formatRatio(value: number) {
  return formatWithMaxDecimals(value, 2);
}

export function formatPercentFromRatio(value: number) {
  return `${formatFloatCompact(value * 100)}%`;
}

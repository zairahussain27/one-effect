export function formatNumber(num: number, dp = 0): string {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp
  });
}

export function formatCompact(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k`;
  }
  return num.toString();
}

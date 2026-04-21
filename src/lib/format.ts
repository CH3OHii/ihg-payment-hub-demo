// Number formatters used across cards and tables.

export function formatCNY(n: number): string {
  if (n >= 1_000_000_000) return `¥${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000)     return `¥${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)         return `¥${(n / 1_000).toFixed(1)}k`
  return `¥${Math.round(n).toLocaleString()}`
}

// Exact yuan (no abbreviation) for transaction rows and tooltips.
export function formatCNYExact(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`
}

export function formatPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`
}

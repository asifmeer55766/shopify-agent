/**
 * Currency and Metric Number Formatters (PKR Normalized)
 */

export function formatCurrency(amount: number, currencyCode: string = 'PKR'): string {
  try {
    return `PKR ${Math.round(amount).toLocaleString('en-US')}`;
  } catch {
    return `PKR ${amount.toLocaleString()}`;
  }
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercentage(value: number, includeSign: boolean = false): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

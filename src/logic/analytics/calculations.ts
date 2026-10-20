/**
 * Deterministic Financial Calculations for Shopify Commerce
 * All calculations are strictly grounded in verifiable mathematical formulas.
 */

export function calculateGrossSales(lineItems: { price: number; quantity: number }[]): number {
  return lineItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function calculateNetSales(grossSales: number, discounts: number, refunds: number): number {
  return Math.max(0, grossSales - discounts - refunds);
}

export function calculateGrossProfit(netSales: number, totalCogs: number): number {
  return netSales - totalCogs;
}

export function calculateMarginPercentage(grossProfit: number, netSales: number): number {
  if (netSales <= 0) return 0;
  return Number(((grossProfit / netSales) * 100).toFixed(2));
}

export function calculateRefundRate(totalRefunds: number, grossSales: number): number {
  if (grossSales <= 0) return 0;
  return Number(((totalRefunds / grossSales) * 100).toFixed(2));
}

export function calculateDiscountRate(totalDiscounts: number, grossSales: number): number {
  if (grossSales <= 0) return 0;
  return Number(((totalDiscounts / grossSales) * 100).toFixed(2));
}

export function calculateAverageOrderValue(netSales: number, totalOrders: number): number {
  if (totalOrders <= 0) return 0;
  return Number((netSales / totalOrders).toFixed(2));
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

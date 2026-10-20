/**
 * Inventory Runout Velocity and Reorder Logic
 */

export function calculateDailySalesVelocity(unitsSold: number, daysInPeriod: number): number {
  if (daysInPeriod <= 0) return 0;
  return Number((unitsSold / daysInPeriod).toFixed(2));
}

export function calculateDaysOfInventory(currentStock: number, dailyVelocity: number): number {
  if (dailyVelocity <= 0) return currentStock > 0 ? 999 : 0;
  return Math.round(currentStock / dailyVelocity);
}

export function determineInventoryRisk(daysRemaining: number, currentStock: number) {
  if (currentStock <= 0) return 'stockout_urgent' as const;
  if (daysRemaining <= 7) return 'stockout_urgent' as const;
  if (daysRemaining <= 14) return 'low_stock' as const;
  if (daysRemaining > 90) return 'overstocked' as const;
  return 'healthy' as const;
}

export function calculateReorderQuantity(
  dailyVelocity: number,
  leadTimeDays: number = 14,
  safetyStockDays: number = 7,
  currentStock: number = 0
): number {
  const targetStock = (leadTimeDays + safetyStockDays) * dailyVelocity;
  const needed = Math.ceil(targetStock - currentStock);
  return Math.max(0, needed);
}

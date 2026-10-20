/**
 * Financial and Commerce Analytics Types
 * Grounded deterministic metric models
 */

export interface MetricTrend {
  value: number;
  previousValue: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
  isPositive: boolean; // Context-aware: revenue UP is positive, refund UP is negative
}

export interface BusinessOverviewMetrics {
  grossSales: MetricTrend;
  netSales: MetricTrend;
  totalOrders: MetricTrend;
  averageOrderValue: MetricTrend;
  grossProfit: MetricTrend;
  grossMarginPercentage: MetricTrend;
  totalRefunds: MetricTrend;
  refundRate: MetricTrend;
  totalDiscounts: MetricTrend;
  discountRate: MetricTrend;
}

export interface ProductProfitabilityItem {
  productId: string;
  variantId?: string;
  title: string;
  sku?: string;
  unitsSold: number;
  revenue: number;
  cogs: number; // Cost of goods sold
  grossProfit: number;
  marginPercentage: number;
  refundedUnits: number;
  refundAmount: number;
  cogsMissing: boolean; // Flag if merchant hasn't set unit cost
  profitTier: 'star' | 'cash_cow' | 'underperformer' | 'loss_maker';
}

export interface InventoryVelocityItem {
  productId: string;
  variantId: string;
  title: string;
  sku: string;
  currentStock: number;
  averageDailySales: number;
  daysOfInventoryRemaining: number;
  riskLevel: 'stockout_urgent' | 'low_stock' | 'healthy' | 'overstocked' | 'dead_stock';
  suggestedReorderQuantity: number;
  holdingCostEstimate: number;
}

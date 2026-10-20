/**
 * Shopify Domain Types and Entities
 */

export interface ShopifyStore {
  id: string;
  shopDomain: string;
  name: string;
  currency: string;
  ianaTimezone: string;
  isConnected: boolean;
  lastSyncedAt?: string;
  createdAt: string;
}

export interface ShopifyMoney {
  amount: number;
  currencyCode: string;
}

export interface ShopifyLineItem {
  id: string;
  title: string;
  variantId?: string;
  variantTitle?: string;
  sku?: string;
  quantity: number;
  price: number;
  totalDiscount: number;
  costPrice?: number; // COGS from Shopify inventory item or manual override
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  createdAt: string;
  processedAt: string;
  currency: string;
  totalPrice: number;
  subtotalPrice: number;
  totalDiscounts: number;
  totalTax: number;
  totalRefunded: number;
  financialStatus: 'paid' | 'pending' | 'refunded' | 'partially_refunded' | 'voided';
  fulfillmentStatus: 'fulfilled' | 'unfulfilled' | 'partial' | null;
  lineItems: ShopifyLineItem[];
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number; // Cost of goods sold (COGS)
  inventoryQuantity: number;
  inventoryItemId?: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  status: 'active' | 'archived' | 'draft';
  vendor: string;
  productType: string;
  tags: string[];
  imageUrl?: string;
  variants: ShopifyProductVariant[];
  totalInventory: number;
  updatedAt: string;
}

export interface ShopifyInventoryItem {
  id: string;
  sku?: string;
  productId: string;
  productTitle: string;
  variantTitle: string;
  available: number;
  cost?: number;
  tracked: boolean;
}

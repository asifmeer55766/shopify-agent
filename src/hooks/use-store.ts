'use client';

import { useState } from 'react';
import { ShopifyStore } from '@/types/shopify';

export function useStore() {
  const [currentStore, setCurrentStore] = useState<ShopifyStore | null>({
    id: 'store_demo_1',
    shopDomain: 'demo-store.myshopify.com',
    name: 'Northstar Apparel Co.',
    currency: 'PKR',
    ianaTimezone: 'Asia/Karachi',
    isConnected: true,
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  return {
    currentStore,
    setCurrentStore,
    isConnected: Boolean(currentStore?.isConnected),
  };
}

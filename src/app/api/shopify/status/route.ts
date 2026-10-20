import { NextResponse } from 'next/server';
import { getShopifyStoreData } from '@/services/shopify';

export async function GET() {
  try {
    const data = await getShopifyStoreData();
    return NextResponse.json({
      success: true,
      status: data.status,
      stats: {
        productsCount: data.products.length,
        ordersCount: data.orders.length,
        customersCount: data.customers.length,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

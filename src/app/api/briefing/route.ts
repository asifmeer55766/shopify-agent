import { NextResponse } from 'next/server';
import { getShopifyStoreData } from '@/services/shopify';
import { GeminiService } from '@/services/ai/gemini';

export async function GET() {
  try {
    const storeData = await getShopifyStoreData();
    const orders = storeData.orders || [];
    const products = storeData.products || [];

    const totalOrders = orders.length;
    let totalSalesNum = 0;
    let refundsCount = 0;

    orders.forEach((o) => {
      totalSalesNum += parseFloat(o.total_price || '0');
      if (o.refunds && o.refunds.length > 0) {
        refundsCount += o.refunds.length;
      }
    });

    let lowStockCount = 0;
    products.forEach((p) => {
      p.variants?.forEach((v) => {
        if ((v.inventory_quantity ?? 0) < 5) {
          lowStockCount++;
        }
      });
    });

    const storeDomain = storeData.status?.shopDomain || 'Peak Athletics';
    const storeName = storeDomain.replace('.myshopify.com', '').replace(/-/g, ' ');

    const topProduct = products[0]?.title || 'Classic Fleece Hoodie';
    const grossSalesFormatted = `Rs. ${Math.round(totalSalesNum).toLocaleString('en-US')}`;

    const gemini = new GeminiService();
    const briefing = await gemini.generateExecutiveBriefing({
      storeName: storeName.charAt(0).toUpperCase() + storeName.slice(1),
      totalOrders,
      grossSales: grossSalesFormatted,
      topProductName: topProduct,
      lowStockItemsCount: lowStockCount,
      refundsCount,
    });

    return NextResponse.json({
      success: true,
      briefing,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST() {
  // Allow explicit regeneration
  return GET();
}

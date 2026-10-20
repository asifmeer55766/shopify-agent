import { NextResponse } from 'next/server';
import { getShopifyStoreData } from '@/services/shopify';

export async function GET() {
  try {
    const storeData = await getShopifyStoreData();
    const products = storeData.products || [];

    const inventoryList: Array<{
      productId: string | number;
      productTitle: string;
      variantId: string | number;
      variantTitle: string;
      sku: string;
      price: string;
      stock: number;
      riskLevel: 'critical' | 'low' | 'normal' | 'out_of_stock';
      daysRemaining: number;
    }> = [];

    products.forEach((p) => {
      p.variants?.forEach((v) => {
        const stock = v.inventory_quantity ?? 0;
        let riskLevel: 'critical' | 'low' | 'normal' | 'out_of_stock' = 'normal';
        let daysRemaining = Math.max(1, Math.round(stock / 1.5));

        if (stock <= 0) {
          riskLevel = 'out_of_stock';
          daysRemaining = 0;
        } else if (stock < 5) {
          riskLevel = 'critical';
          daysRemaining = Math.max(1, Math.round(stock / 2));
        } else if (stock < 15) {
          riskLevel = 'low';
          daysRemaining = Math.round(stock / 1.2);
        }

        inventoryList.push({
          productId: p.id,
          productTitle: p.title,
          variantId: v.id,
          variantTitle: v.title,
          sku: v.sku || 'N/A',
          price: v.price,
          stock,
          riskLevel,
          daysRemaining,
        });
      });
    });

    const totalStock = inventoryList.reduce((acc, i) => acc + i.stock, 0);
    const criticalCount = inventoryList.filter((i) => i.riskLevel === 'critical').length;
    const outOfStockCount = inventoryList.filter((i) => i.riskLevel === 'out_of_stock').length;

    return NextResponse.json({
      success: true,
      summary: {
        totalVariants: inventoryList.length,
        totalStock,
        criticalCount,
        outOfStockCount,
      },
      items: inventoryList,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

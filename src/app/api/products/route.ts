import { NextResponse } from 'next/server';
import { getShopifyStoreData } from '@/services/shopify';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status')?.toLowerCase() || 'all';

    const storeData = await getShopifyStoreData();
    let products = storeData.products || [];

    if (search) {
      products = products.filter(
        (p) =>
          p.title?.toLowerCase().includes(search) ||
          p.vendor?.toLowerCase().includes(search) ||
          p.variants?.some((v) => v.sku?.toLowerCase().includes(search) || v.title?.toLowerCase().includes(search))
      );
    }

    if (status !== 'all') {
      products = products.filter((p) => p.status?.toLowerCase() === status);
    }

    // Format for display
    const formatted = products.map((p) => {
      const totalInventory =
        p.variants?.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0) ?? 0;
      const minPrice = p.variants?.[0]?.price || '0.00';
      const maxPrice = p.variants?.[p.variants.length - 1]?.price || minPrice;
      const priceDisplay =
        minPrice === maxPrice
          ? `Rs. ${Math.round(parseFloat(minPrice)).toLocaleString('en-US')}`
          : `Rs. ${Math.round(parseFloat(minPrice)).toLocaleString('en-US')} - Rs. ${Math.round(parseFloat(maxPrice)).toLocaleString('en-US')}`;

      return {
        id: p.id,
        title: p.title,
        vendor: p.vendor || 'In-House',
        status: p.status || 'active',
        image: p.images?.[0]?.src || null,
        variantsCount: p.variants?.length || 1,
        totalInventory,
        priceDisplay,
        variants: p.variants || [],
      };
    });

    return NextResponse.json({
      success: true,
      totalCount: formatted.length,
      products: formatted,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

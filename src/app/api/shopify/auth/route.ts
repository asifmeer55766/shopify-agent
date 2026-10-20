import { NextResponse } from 'next/server';
import { ShopifyClient } from '@/services/shopify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop') || 'peak-athletics.myshopify.com';

  const client = new ShopifyClient({
    shopDomain: shop,
    clientId: process.env.SHOPIFY_CLIENT_ID,
    clientSecret: process.env.SHOPIFY_CLIENT_SECRET,
  });

  const baseUrl = process.env.WEB_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/shopify/callback`;
  const authorizeUrl = client.getAuthorizeUrl(redirectUri);

  return NextResponse.redirect(authorizeUrl);
}

import { NextResponse } from 'next/server';
import { ShopifyClient } from '@/services/shopify';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const shop = searchParams.get('shop') || 'peak-athletics.myshopify.com';
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard/overview?error=missing_code', request.url));
  }

  try {
    const client = new ShopifyClient({
      shopDomain: shop,
      clientId: process.env.SHOPIFY_CLIENT_ID,
      clientSecret: process.env.SHOPIFY_CLIENT_SECRET,
    });

    const tokenData = await client.exchangeOAuthCode(code);
    console.log(`Successfully acquired Shopify token for ${shop}`);

    // If state contains a valid user ID, update their MongoDB document
    if (state && state !== 'guest' && state !== 'storepilot-auth') {
      try {
        const db = await getDb();
        const usersCollection = db.collection('users');
        await usersCollection.updateOne(
          { _id: new ObjectId(state) },
          {
            $set: {
              shopify: {
                storeDomain: shop,
                accessToken: '••••••••' + tokenData.access_token.slice(-4),
                rawAccessToken: tokenData.access_token,
                authType: 'oauth',
                connected: true,
                connectedAt: new Date(),
                lastSyncedAt: new Date(),
              },
              updatedAt: new Date(),
            },
          }
        );
      } catch (dbErr) {
        console.warn('Could not associate Shopify token with user ID:', dbErr);
      }
    }

    return NextResponse.redirect(new URL('/dashboard/overview?connected=true&store=' + encodeURIComponent(shop), request.url));
  } catch (error: unknown) {
    console.error('Shopify OAuth Callback Error:', error);
    return NextResponse.redirect(new URL('/dashboard/overview?error=auth_failed', request.url));
  }
}

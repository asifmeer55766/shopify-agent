import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { ShopifyClient } from '@/services/shopify/client';
import { syncStoreData } from '@/services/shopify/sync-service';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    const body = await req.json();
    const { mode, storeDomain, accessToken, clientId, clientSecret } = body;

    if (!storeDomain || typeof storeDomain !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid Shopify store domain is required (e.g. your-store.myshopify.com).' },
        { status: 400 }
      );
    }

    const cleanDomain = storeDomain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '');

    // Option 1: Direct Credentials (Access Token / Client ID & Secret)
    if (mode === 'credentials') {
      if (!accessToken && (!clientId || !clientSecret)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Please provide either an Admin Access Token (shpat_...) or Client ID & Secret.',
          },
          { status: 400 }
        );
      }

      const client = new ShopifyClient({
        shopDomain: cleanDomain,
        accessToken: accessToken?.trim(),
        clientId: clientId?.trim(),
        clientSecret: clientSecret?.trim(),
      });

      // Save credentials in MongoDB if user is logged in
      const userId = session?.userId || 'guest';
      if (session) {
        const db = await getDb();
        const usersCollection = db.collection('users');

        let userQuery = {};
        try {
          userQuery = { _id: new ObjectId(session.userId) };
        } catch {
          userQuery = { email: session.email };
        }

        await usersCollection.updateOne(userQuery, {
          $set: {
            shopify: {
              storeDomain: cleanDomain,
              accessToken: accessToken ? '••••••••' + accessToken.slice(-4) : '',
              rawAccessToken: accessToken || '',
              clientId: clientId || '',
              authType: 'credentials',
              connected: true,
              connectedAt: new Date(),
              lastSyncedAt: new Date(),
            },
            updatedAt: new Date(),
          },
        });
      }

      // Execute read-only GraphQL ingestion with REST fallback
      const syncResult = await syncStoreData(userId, {
        storeDomain: cleanDomain,
        accessToken: accessToken?.trim(),
        clientId: clientId?.trim(),
        clientSecret: clientSecret?.trim(),
      });

      return NextResponse.json({
        success: true,
        message: `Successfully connected and synced with ${cleanDomain}`,
        storeDomain: cleanDomain,
        mode: 'credentials',
        method: syncResult.method,
        productsCount: syncResult.productsCount,
        ordersCount: syncResult.ordersCount,
      });
    }

    // Option 2: OAuth Handshake
    if (mode === 'oauth') {
      const client = new ShopifyClient({
        shopDomain: cleanDomain,
        clientId: clientId || process.env.SHOPIFY_CLIENT_ID,
        clientSecret: clientSecret || process.env.SHOPIFY_CLIENT_SECRET,
      });

      const baseUrl = process.env.WEB_URL || 'http://localhost:3000';
      const redirectUri = `${baseUrl}/api/shopify/callback`;
      const authorizeUrl = client.getAuthorizeUrl(redirectUri, session ? session.userId : 'guest');

      return NextResponse.json({
        success: true,
        mode: 'oauth',
        storeDomain: cleanDomain,
        authorizeUrl,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid sync mode. Choose "credentials" or "oauth".' },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error('Shopify sync error:', error);
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

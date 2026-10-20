import { getDb } from '../../lib/mongodb';
import { ShopifyClient, ShopifyProductItem, ShopifyOrderItem } from './client';
import { ObjectId } from 'mongodb';

export interface IngestionResult {
  success: boolean;
  storeDomain: string;
  method: 'graphql' | 'rest' | 'sandbox_fallback';
  productsCount: number;
  ordersCount: number;
  syncedAt: Date;
  error?: string;
}

/**
 * Executes a 100% read-only ingestion cycle using GraphQL (with REST fallback)
 * Saves results to MongoDB: `shopify_products` and `shopify_orders`
 */
export async function syncStoreData(
  userId: string,
  credentials?: {
    storeDomain: string;
    accessToken?: string;
    clientId?: string;
    clientSecret?: string;
  }
): Promise<IngestionResult> {
  const db = await getDb();
  const usersCollection = db.collection('users');
  const productsCollection = db.collection('shopify_products');
  const ordersCollection = db.collection('shopify_orders');

  // Resolve credentials: from arguments or from the user's MongoDB record
  let shopDomain = credentials?.storeDomain;
  let accessToken = credentials?.accessToken;
  let clientId = credentials?.clientId;
  let clientSecret = credentials?.clientSecret;

  if (!shopDomain || !accessToken) {
    let userQuery = {};
    try {
      userQuery = { _id: new ObjectId(userId) };
    } catch {
      userQuery = { email: userId };
    }

    const user = await usersCollection.findOne(userQuery);
    if (user?.shopify) {
      shopDomain = shopDomain || user.shopify.storeDomain;
      accessToken = accessToken || user.shopify.rawAccessToken;
      clientId = clientId || user.shopify.clientId;
    }
  }

  // Fallback to environment variables if still unconfigured
  shopDomain = shopDomain || process.env.SHOPIFY_STORE_DOMAIN || 'peak-athletics.myshopify.com';
  accessToken = accessToken || process.env.SHOPIFY_ACCESS_TOKEN || '';
  clientId = clientId || process.env.SHOPIFY_CLIENT_ID || '';
  clientSecret = clientSecret || process.env.SHOPIFY_CLIENT_SECRET || '';

  const client = new ShopifyClient({
    shopDomain,
    accessToken,
    clientId,
    clientSecret,
  });

  let method: 'graphql' | 'rest' | 'sandbox_fallback' = 'graphql';
  let products: ShopifyProductItem[] = [];
  let orders: ShopifyOrderItem[] = [];
  let syncError: string | undefined = undefined;

  // 1. Try GraphQL Ingestion
  try {
    if (accessToken) {
      console.log(`Starting Shopify GraphQL ingestion for ${shopDomain}...`);
      [products, orders] = await Promise.all([
        client.fetchAllProductsGraphQL(500),
        client.fetchAllOrdersGraphQL(500),
      ]);
      method = 'graphql';
    }
  } catch (gqlErr: unknown) {
    console.warn('GraphQL ingestion failed, falling back to REST:', gqlErr);
    // 2. Fallback to REST Ingestion
    try {
      if (accessToken) {
        const [prodRes, orderRes] = await Promise.all([
          client.getProducts(250),
          client.getOrders({ limit: 250 }),
        ]);
        products = prodRes.products || [];
        orders = orderRes.orders || [];
        method = 'rest';
      }
    } catch (restErr: unknown) {
      syncError = restErr instanceof Error ? restErr.message : 'Failed to fetch live data';
      console.warn('REST ingestion failed as well, using sandbox dataset fallback:', syncError);
      method = 'sandbox_fallback';
    }
  }

  const now = new Date();

  // If live data was pulled, persist to MongoDB
  if (products.length > 0 || orders.length > 0) {
    // Upsert products for this store
    if (products.length > 0) {
      const productOps = products.map((p) => ({
        updateOne: {
          filter: { storeDomain: shopDomain, shopifyId: p.id },
          update: {
            $set: {
              ...p,
              shopifyId: p.id,
              storeDomain: shopDomain,
              userId,
              updatedAt: now,
            },
          },
          upsert: true,
        },
      }));
      await productsCollection.bulkWrite(productOps);
    }

    // Upsert orders for this store
    if (orders.length > 0) {
      const orderOps = orders.map((o) => ({
        updateOne: {
          filter: { storeDomain: shopDomain, shopifyId: o.id },
          update: {
            $set: {
              ...o,
              shopifyId: o.id,
              storeDomain: shopDomain,
              userId,
              updatedAt: now,
            },
          },
          upsert: true,
        },
      }));
      await ordersCollection.bulkWrite(orderOps);
    }
  }

  // Update user's shopify connection summary
  try {
    let userQuery = {};
    try {
      userQuery = { _id: new ObjectId(userId) };
    } catch {
      userQuery = { email: userId };
    }

    await usersCollection.updateOne(userQuery, {
      $set: {
        'shopify.lastSyncedAt': now,
        'shopify.productsCount': products.length,
        'shopify.ordersCount': orders.length,
        'shopify.syncMethod': method,
      },
    });
  } catch (err) {
    console.warn('Could not update user sync summary in DB:', err);
  }

  return {
    success: true,
    storeDomain: shopDomain,
    method,
    productsCount: products.length,
    ordersCount: orders.length,
    syncedAt: now,
    error: syncError,
  };
}

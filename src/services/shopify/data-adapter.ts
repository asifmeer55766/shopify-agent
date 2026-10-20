import * as fs from 'fs';
import * as path from 'path';
import { ShopifyClient, ShopifyOrderItem, ShopifyProductItem } from './client';
import { getDb } from '../../lib/mongodb';

export interface ShopifyConnectionStatus {
  mode: 'oauth' | 'client_credentials' | 'postman_sandbox';
  hasClientId: boolean;
  hasClientSecret: boolean;
  hasAccessToken: boolean;
  shopDomain: string;
  oauthAuthorizeUrl: string;
  source: 'live_shopify' | 'mongodb_lakehouse' | 'postman_dataset';
}

export interface ExtractedShopifyData {
  products: ShopifyProductItem[];
  orders: ShopifyOrderItem[];
  customers: unknown[];
  inventoryItems: unknown[];
  marketingEvents: unknown[];
  status: ShopifyConnectionStatus;
}

// In-memory cache for loaded data
let cachedData: ExtractedShopifyData | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

/**
 * Parses the local shopify.postman_collection.json file to extract
 * real recorded Shopify responses as fallback data.
 */
function extractPostmanResponses(): Partial<ExtractedShopifyData> {
  try {
    const postmanPath = path.join(process.cwd(), 'shopify.postman_collection.json');
    if (!fs.existsSync(postmanPath)) {
      return {};
    }

    const content = fs.readFileSync(postmanPath, 'utf8');
    const json = JSON.parse(content);
    const items = json.item || [];

    const result: Partial<ExtractedShopifyData> = {
      products: [],
      orders: [],
      customers: [],
      inventoryItems: [],
      marketingEvents: [],
    };

    for (const it of items) {
      const name = (it.name || '').toLowerCase();
      const response = it.response && it.response[0]?.body;
      if (!response) continue;

      try {
        const bodyObj = JSON.parse(response);
        if (name.includes('product') && bodyObj.products) {
          result.products = bodyObj.products;
        } else if (name.includes('order') && bodyObj.orders) {
          result.orders = bodyObj.orders;
        } else if (name.includes('customer') && bodyObj.customers) {
          result.customers = bodyObj.customers;
        } else if (name.includes('inventory') && bodyObj.inventory_items) {
          result.inventoryItems = bodyObj.inventory_items;
        } else if (name.includes('marketing') && bodyObj.marketing_events) {
          result.marketingEvents = bodyObj.marketing_events;
        }
      } catch {
        // Skip unparseable response bodies
      }
    }

    return result;
  } catch (err) {
    console.warn('Failed to parse shopify.postman_collection.json:', err);
    return {};
  }
}

/**
 * Unified Shopify Data Provider (100% Read-Only)
 * Order of priority:
 * 1. MongoDB Local Lakehouse (fastest & deterministic)
 * 2. Live GraphQL Admin API with Cursor Pagination
 * 3. Live REST API fallback
 * 4. Postman collection sandbox fallback
 */
export async function getShopifyStoreData(shopDomainOverride?: string): Promise<ExtractedShopifyData> {
  const now = Date.now();
  if (cachedData && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedData;
  }

  const shopDomain =
    shopDomainOverride || process.env.SHOPIFY_STORE_DOMAIN || 'peak-athletics.myshopify.com';
  const clientId = process.env.SHOPIFY_CLIENT_ID || '';
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET || '';
  let accessToken = process.env.SHOPIFY_ACCESS_TOKEN || '';

  // 1. Check MongoDB Lakehouse first
  try {
    const db = await getDb();
    const productsCollection = db.collection('shopify_products');
    const ordersCollection = db.collection('shopify_orders');

    const [dbProducts, dbOrders] = await Promise.all([
      productsCollection.find({ storeDomain: shopDomain }).limit(250).toArray(),
      ordersCollection.find({ storeDomain: shopDomain }).sort({ created_at: -1 }).limit(250).toArray(),
    ]);

    if (dbProducts.length > 0 || dbOrders.length > 0) {
      const client = new ShopifyClient({ shopDomain, clientId, clientSecret, accessToken });
      const baseUrl = process.env.WEB_URL || 'http://localhost:3000';
      const oauthAuthorizeUrl = client.getAuthorizeUrl(`${baseUrl}/api/shopify/callback`);

      const finalData: ExtractedShopifyData = {
        products: dbProducts as unknown as ShopifyProductItem[],
        orders: dbOrders as unknown as ShopifyOrderItem[],
        customers: [],
        inventoryItems: [],
        marketingEvents: [],
        status: {
          mode: 'oauth',
          hasClientId: Boolean(clientId),
          hasClientSecret: Boolean(clientSecret),
          hasAccessToken: Boolean(accessToken),
          shopDomain,
          oauthAuthorizeUrl,
          source: 'mongodb_lakehouse',
        },
      };

      cachedData = finalData;
      lastCacheTime = now;
      return finalData;
    }
  } catch (dbErr) {
    console.warn('Could not read from MongoDB lakehouse:', dbErr);
  }

  // 2. Query Live Shopify with GraphQL / REST
  const client = new ShopifyClient({
    shopDomain,
    clientId,
    clientSecret,
    accessToken,
  });

  const baseUrl = process.env.WEB_URL || 'http://localhost:3000';
  const oauthAuthorizeUrl = client.getAuthorizeUrl(`${baseUrl}/api/shopify/callback`);

  let liveProducts: ShopifyProductItem[] | null = null;
  let liveOrders: ShopifyOrderItem[] | null = null;
  let connectionSource: 'live_shopify' | 'mongodb_lakehouse' | 'postman_dataset' = 'postman_dataset';

  try {
    if (!accessToken && clientId && clientSecret) {
      try {
        accessToken = await client.getAccessTokenWithClientCredentials();
      } catch {
        // proceed
      }
    }

    if (accessToken) {
      try {
        // Try GraphQL first
        [liveProducts, liveOrders] = await Promise.all([
          client.fetchAllProductsGraphQL(250),
          client.fetchAllOrdersGraphQL(250),
        ]);
        connectionSource = 'live_shopify';
      } catch {
        // Try REST fallback
        const [prodRes, orderRes] = await Promise.allSettled([
          client.getProducts(250),
          client.getOrders({ limit: 250 }),
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value.products) {
          liveProducts = prodRes.value.products;
          connectionSource = 'live_shopify';
        }
        if (orderRes.status === 'fulfilled' && orderRes.value.orders) {
          liveOrders = orderRes.value.orders;
          connectionSource = 'live_shopify';
        }
      }
    }
  } catch (err) {
    console.warn('Live Shopify API request failed, falling back to Postman collection:', err);
  }

  // 3. Fallback to Postman recorded responses
  const postmanFallback = extractPostmanResponses();

  const finalData: ExtractedShopifyData = {
    products: liveProducts || postmanFallback.products || [],
    orders: liveOrders || postmanFallback.orders || [],
    customers: postmanFallback.customers || [],
    inventoryItems: postmanFallback.inventoryItems || [],
    marketingEvents: postmanFallback.marketingEvents || [],
    status: {
      mode: accessToken ? 'oauth' : 'client_credentials',
      hasClientId: Boolean(clientId),
      hasClientSecret: Boolean(clientSecret),
      hasAccessToken: Boolean(accessToken),
      shopDomain,
      oauthAuthorizeUrl,
      source: connectionSource,
    },
  };

  cachedData = finalData;
  lastCacheTime = now;
  return finalData;
}

/**
 * Shopify Admin GraphQL & REST API Client (100% Read-Only)
 * Supports:
 * - GraphQL queries with cursor pagination (up to 250 items per batch)
 * - Rate-limit backoff & query cost tracking
 * - REST fallback with page_info cursor pagination
 * - Zero write operations guaranteed
 */

export interface ShopifyClientConfig {
  shopDomain: string;
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
  apiVersion?: string;
}

export interface ShopifyProductItem {
  id: number | string;
  title: string;
  vendor?: string;
  product_type?: string;
  status?: string;
  variants?: Array<{
    id: number | string;
    title: string;
    price: string;
    compare_at_price?: string;
    sku?: string;
    inventory_quantity?: number;
    inventory_item_id?: number | string;
  }>;
  images?: Array<{ src: string }>;
}

export interface ShopifyOrderItem {
  id: number | string;
  name?: string;
  created_at: string;
  total_price: string;
  subtotal_price?: string;
  total_discounts?: string;
  total_tax?: string;
  financial_status?: string;
  fulfillment_status?: string | null;
  customer?: {
    id: number | string;
    first_name?: string;
    last_name?: string;
    email?: string;
    orders_count?: number;
    total_spent?: string;
  };
  line_items?: Array<{
    id: number | string;
    title: string;
    quantity: number;
    price: string;
    sku?: string;
  }>;
  refunds?: Array<{
    id: number | string;
    order_id: number | string;
  }>;
}

export interface GraphQLPageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface GraphQLProductsResponse {
  products: {
    pageInfo: GraphQLPageInfo;
    edges: Array<{
      node: {
        id: string;
        title: string;
        vendor: string;
        productType: string;
        status: string;
        images: { edges: Array<{ node: { url: string } }> };
        variants: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              price: string;
              compareAtPrice: string | null;
              sku: string | null;
              inventoryQuantity: number;
              inventoryItem: { id: string } | null;
            };
          }>;
        };
      };
    }>;
  };
}

interface GraphQLOrdersResponse {
  orders: {
    pageInfo: GraphQLPageInfo;
    edges: Array<{
      node: {
        id: string;
        name: string;
        createdAt: string;
        totalPriceSet?: { shopMoney?: { amount?: string } };
        subtotalPriceSet?: { shopMoney?: { amount?: string } };
        totalDiscountsSet?: { shopMoney?: { amount?: string } };
        totalTaxSet?: { shopMoney?: { amount?: string } };
        displayFinancialStatus?: string;
        displayFulfillmentStatus?: string | null;
        customer?: {
          id: string;
          firstName?: string | null;
          lastName?: string | null;
          email?: string | null;
          numberOfOrders?: number;
          amountSpent?: { amount?: string };
        } | null;
        lineItems: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              quantity: number;
              originalUnitPriceSet?: { shopMoney?: { amount?: string } };
              sku?: string | null;
            };
          }>;
        };
        refunds: Array<{ id: string }>;
      };
    }>;
  };
}

export class ShopifyClient {
  private shopDomain: string;
  private accessToken: string;
  private clientId: string;
  private clientSecret: string;
  private apiVersion: string;

  constructor(config: ShopifyClientConfig) {
    this.shopDomain = config.shopDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    this.accessToken = config.accessToken || process.env.SHOPIFY_ACCESS_TOKEN || '';
    this.clientId = config.clientId || process.env.SHOPIFY_CLIENT_ID || '';
    this.clientSecret = config.clientSecret || process.env.SHOPIFY_CLIENT_SECRET || '';
    this.apiVersion = config.apiVersion || process.env.SHOPIFY_API_VERSION || '2026-01';
  }

  getAuthorizeUrl(redirectUri: string, state: string = 'storepilot-auth'): string {
    const scopes = process.env.SHOPIFY_SCOPES || 'read_products,read_orders,read_customers,read_inventory';
    return `https://${this.shopDomain}/admin/oauth/authorize?client_id=${this.clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  }

  async exchangeOAuthCode(code: string): Promise<{ access_token: string; scope: string }> {
    const endpoint = `https://${this.shopDomain}/admin/oauth/access_token`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Shopify OAuth exchange failed (${response.status}): ${err}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    return data;
  }

  async getAccessTokenWithClientCredentials(): Promise<string> {
    const endpoint = `https://${this.shopDomain}/admin/oauth/access_token`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Shopify Client Credentials token request failed: ${err}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    return data.access_token;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async graphql<T = unknown>(
    query: string,
    variables: Record<string, unknown> = {}
  ): Promise<{ data: T; extensions?: { cost?: { requestedQueryCost: number; actualQueryCost: number; throttleStatus: { maximumAvailable: number; currentlyAvailable: number; restoreRate: number } } } }> {
    if (!this.accessToken) {
      throw new Error('No access token available for Shopify GraphQL query.');
    }

    const endpoint = `https://${this.shopDomain}/admin/api/${this.apiVersion}/graphql.json`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (response.status === 429) {
      const retryAfter = parseFloat(response.headers.get('Retry-After') || '2');
      console.warn(`Shopify GraphQL rate limited. Backing off for ${retryAfter}s...`);
      await this.sleep(retryAfter * 1000);
      return this.graphql<T>(query, variables);
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Shopify GraphQL request failed [${response.status}]: ${err}`);
    }

    const json = await response.json();
    if (json.errors && json.errors.length > 0) {
      throw new Error(`Shopify GraphQL Error: ${json.errors[0].message}`);
    }

    // Auto-throttle if currently available points are low
    const cost = json.extensions?.cost;
    const currentlyAvailable = cost?.throttleStatus?.currentlyAvailable;
    const restoreRate = cost?.throttleStatus?.restoreRate || 50;
    if (currentlyAvailable !== undefined && currentlyAvailable < 150) {
      const waitTime = Math.ceil((150 - currentlyAvailable) / restoreRate) * 1000;
      await this.sleep(Math.max(waitTime, 500));
    }

    return json;
  }

  async fetchAllProductsGraphQL(maxItems: number = 1000): Promise<ShopifyProductItem[]> {
    const products: ShopifyProductItem[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    const query = `
      query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              vendor
              productType
              status
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 50) {
                edges {
                  node {
                    id
                    title
                    price
                    compareAtPrice
                    sku
                    inventoryQuantity
                    inventoryItem {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    while (hasNextPage && products.length < maxItems) {
      const batchSize = Math.min(250, maxItems - products.length);
      const res: { data: GraphQLProductsResponse } = await this.graphql<GraphQLProductsResponse>(query, { first: batchSize, after: cursor });

      const pageData: GraphQLProductsResponse['products'] = res.data.products;
      for (const edge of pageData.edges) {
        const p = edge.node;
        products.push({
          id: p.id.replace('gid://shopify/Product/', ''),
          title: p.title,
          vendor: p.vendor,
          product_type: p.productType,
          status: p.status.toLowerCase(),
          images: p.images.edges.map((img: { node: { url: string } }) => ({ src: img.node.url })),
          variants: p.variants.edges.map((v: { node: { id: string; title: string; price: string; compareAtPrice: string | null; sku: string | null; inventoryQuantity: number; inventoryItem: { id: string } | null } }) => ({
            id: v.node.id.replace('gid://shopify/ProductVariant/', ''),
            title: v.node.title,
            price: v.node.price,
            compare_at_price: v.node.compareAtPrice || undefined,
            sku: v.node.sku || '',
            inventory_quantity: v.node.inventoryQuantity,
            inventory_item_id: v.node.inventoryItem?.id.replace('gid://shopify/InventoryItem/', ''),
          })),
        });
      }

      hasNextPage = pageData.pageInfo.hasNextPage;
      cursor = pageData.pageInfo.endCursor;

      if (hasNextPage) {
        await this.sleep(400);
      }
    }

    return products;
  }

  async fetchAllOrdersGraphQL(maxItems: number = 1000): Promise<ShopifyOrderItem[]> {
    const orders: ShopifyOrderItem[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    const query = `
      query GetOrders($first: Int!, $after: String) {
        orders(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              name
              createdAt
              totalPriceSet {
                shopMoney {
                  amount
                }
              }
              subtotalPriceSet {
                shopMoney {
                  amount
                }
              }
              totalDiscountsSet {
                shopMoney {
                  amount
                }
              }
              totalTaxSet {
                shopMoney {
                  amount
                }
              }
              displayFinancialStatus
              displayFulfillmentStatus
              customer {
                id
                firstName
                lastName
                email
                numberOfOrders
                amountSpent {
                  amount
                }
              }
              lineItems(first: 20) {
                edges {
                  node {
                    id
                    title
                    quantity
                    originalUnitPriceSet {
                      shopMoney {
                        amount
                      }
                    }
                    sku
                  }
                }
              }
              refunds {
                id
              }
            }
          }
        }
      }
    `;

    while (hasNextPage && orders.length < maxItems) {
      const batchSize = Math.min(250, maxItems - orders.length);
      const res: { data: GraphQLOrdersResponse } = await this.graphql<GraphQLOrdersResponse>(query, { first: batchSize, after: cursor });

      const pageData: GraphQLOrdersResponse['orders'] = res.data.orders;
      for (const edge of pageData.edges) {
        const o = edge.node;
        orders.push({
          id: o.id.replace('gid://shopify/Order/', ''),
          name: o.name,
          created_at: o.createdAt,
          total_price: o.totalPriceSet?.shopMoney?.amount || '0.00',
          subtotal_price: o.subtotalPriceSet?.shopMoney?.amount,
          total_discounts: o.totalDiscountsSet?.shopMoney?.amount,
          total_tax: o.totalTaxSet?.shopMoney?.amount,
          financial_status: o.displayFinancialStatus?.toLowerCase(),
          fulfillment_status: o.displayFulfillmentStatus?.toLowerCase() || null,
          customer: o.customer
            ? {
                id: o.customer.id.replace('gid://shopify/Customer/', ''),
                first_name: o.customer.firstName || '',
                last_name: o.customer.lastName || '',
                email: o.customer.email || '',
                orders_count: o.customer.numberOfOrders,
                total_spent: o.customer.amountSpent?.amount,
              }
            : undefined,
          line_items: o.lineItems.edges.map((l: { node: { id: string; title: string; quantity: number; originalUnitPriceSet?: { shopMoney?: { amount?: string } }; sku?: string | null } }) => ({
            id: l.node.id.replace('gid://shopify/LineItem/', ''),
            title: l.node.title,
            quantity: l.node.quantity,
            price: l.node.originalUnitPriceSet?.shopMoney?.amount || '0.00',
            sku: l.node.sku || '',
          })),
          refunds: o.refunds.map((r: { id: string }) => ({
            id: r.id.replace('gid://shopify/Refund/', ''),
            order_id: o.id.replace('gid://shopify/Order/', ''),
          })),
        });
      }

      hasNextPage = pageData.pageInfo.hasNextPage;
      cursor = pageData.pageInfo.endCursor;

      if (hasNextPage) {
        await this.sleep(400);
      }
    }

    return orders;
  }

  private async restGet<T>(path: string, queryParams: Record<string, string> = {}): Promise<T> {
    const url = new URL(`https://${this.shopDomain}/admin/api/${this.apiVersion}/${path}`);
    Object.entries(queryParams).forEach(([k, v]) => url.searchParams.append(k, v));

    if (!this.accessToken) {
      throw new Error('No access token available for Shopify REST request.');
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 429) {
      const retryAfter = parseFloat(response.headers.get('Retry-After') || '2');
      await this.sleep(retryAfter * 1000);
      return this.restGet<T>(path, queryParams);
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Shopify API error [${response.status}] on ${path}: ${err}`);
    }

    return await response.json();
  }

  async getProducts(limit: number = 250): Promise<{ products: ShopifyProductItem[] }> {
    return this.restGet<{ products: ShopifyProductItem[] }>('products.json', { limit: limit.toString() });
  }

  async getOrders(params: { status?: string; limit?: number } = {}): Promise<{ orders: ShopifyOrderItem[] }> {
    return this.restGet<{ orders: ShopifyOrderItem[] }>('orders.json', {
      status: params.status || 'any',
      limit: (params.limit || 250).toString(),
    });
  }

  async getCustomers(limit: number = 250): Promise<{ customers: unknown[] }> {
    return this.restGet<{ customers: unknown[] }>('customers.json', { limit: limit.toString() });
  }

  async getInventoryItems(ids?: string[]): Promise<{ inventory_items: unknown[] }> {
    const query: Record<string, string> = {};
    if (ids && ids.length > 0) {
      query.ids = ids.join(',');
    }
    return this.restGet<{ inventory_items: unknown[] }>('inventory_items.json', query);
  }
}

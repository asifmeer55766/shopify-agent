/**
 * Validation helpers for inputs and API payloads
 */

export function isValidShopifyDomain(domain: string): boolean {
  if (!domain) return false;
  const sanitized = domain.trim().toLowerCase();
  return /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(sanitized);
}

export function isValidCurrencyAmount(amount: unknown): boolean {
  return typeof amount === 'number' && !isNaN(amount) && amount >= 0;
}

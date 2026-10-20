/**
 * Frontend Internal API Client
 * Clean HTTP client for calling StorePilot API routes
 */

import { ApiResponse } from '@/types/common';

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const json: ApiResponse<T> = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error?.message || `Request failed with status ${response.status}`);
  }

  return json.data as T;
}

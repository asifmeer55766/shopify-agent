'use client';

import React, { useState, useEffect } from 'react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess?: () => void;
}

export const SyncShopifyModal: React.FC<SyncModalProps> = ({ isOpen, onClose, onSyncSuccess }) => {
  const [activeTab, setActiveTab] = useState<'credentials' | 'oauth'>('credentials');
  const [storeDomain, setStoreDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [connectedStore, setConnectedStore] = useState<string | null>(null);
  const [authType, setAuthType] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMsg(null);
      // Fetch current user sync status
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user?.shopify?.connected) {
            setConnectedStore(data.user.shopify.storeDomain);
            setAuthType(data.user.shopify.authType);
            if (!storeDomain) setStoreDomain(data.user.shopify.storeDomain);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCredentialsSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!storeDomain) {
      setError('Please provide your Shopify store domain (e.g. yourbrand.myshopify.com).');
      return;
    }

    if (!accessToken && (!clientId || !clientSecret)) {
      setError('Please provide an Admin Access Token (shpat_...) or Client ID & Secret.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/shopify/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'credentials',
          storeDomain,
          accessToken,
          clientId,
          clientSecret,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to sync Shopify store.');
      }

      setConnectedStore(data.storeDomain);
      setAuthType('credentials');
      setSuccessMsg(`Successfully synced with ${data.storeDomain}!`);
      if (onSyncSuccess) onSyncSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error syncing store.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!storeDomain) {
      setError('Please enter your Shopify store domain to start OAuth flow.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/shopify/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'oauth',
          storeDomain,
          clientId: clientId || undefined,
          clientSecret: clientSecret || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.authorizeUrl) {
        throw new Error(data.error || 'Failed to generate OAuth redirect link.');
      }

      // Redirect user to official Shopify OAuth installation prompt
      window.location.href = data.authorizeUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'OAuth initiation failed.');
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect this Shopify store?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/shopify/disconnect', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setConnectedStore(null);
        setAuthType(null);
        setSuccessMsg('Shopify store disconnected.');
        if (onSyncSuccess) onSyncSuccess();
      }
    } catch {
      setError('Failed to disconnect store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#008060] flex items-center justify-center text-white shadow-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.467 4.417c-.033-.183-.2-.317-.383-.317-.183 0-3.417.067-4.483-1.017-.583-.6-1.183-1.5-1.95-1.8-.3-.117-.683-.017-.9.25-.033.05-.733 1.05-1.283 1.833-1.083.4-3.567.85-3.8.917-.383.1-.483.433-.45.667l2.25 15.65c.033.25.25.433.5.433h9.617c.25 0 .467-.183.5-.433l1.883-15.35c.017-.117-.017-.233-.083-.333z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sync Shopify Store</h3>
              <p className="text-[11px] text-slate-500">Connect via Access Token, Store Credentials, or OAuth 2.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Current Connection Status Pill if Connected */}
        {connectedStore && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#046a4e] animate-pulse" />
              <div>
                <span className="font-bold text-slate-800">{connectedStore}</span>
                <span className="text-[10px] text-emerald-800 ml-1.5 font-medium uppercase tracking-wider">
                  ({authType || 'Synced'})
                </span>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="px-6 pt-4">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'credentials'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Store ID &amp; Access Token
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('oauth')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'oauth'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shopify OAuth 2.0
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
              <span className="text-rose-500 font-bold">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'credentials' ? (
            <form onSubmit={handleCredentialsSync} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Shopify Store Domain / Store ID
                </label>
                <input
                  type="text"
                  required
                  value={storeDomain}
                  onChange={(e) => setStoreDomain(e.target.value)}
                  placeholder="e.g. peak-athletics.myshopify.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#046a4e]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800">Admin API Access Token</label>
                  <span className="text-[10px] text-slate-400">Custom app token (shpat_...)</span>
                </div>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#046a4e]"
                />
              </div>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2 text-[10px] font-medium text-slate-400 uppercase">
                  OR CLIENT ID &amp; SECRET
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Client ID</label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Shopify App API Key"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#046a4e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Client Secret</label>
                  <input
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="API Secret Key"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#046a4e]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#046a4e] hover:bg-[#035840] disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {loading ? 'Connecting & Syncing...' : 'Sync Store Data Now'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOAuthSync} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Shopify Store Domain / Store ID
                </label>
                <input
                  type="text"
                  required
                  value={storeDomain}
                  onChange={(e) => setStoreDomain(e.target.value)}
                  placeholder="e.g. my-store.myshopify.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#046a4e]"
                />
                <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">
                  You will be securely redirected to Shopify to approve permissions for read-only order, product, and inventory analytics.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">OAuth Permissions Granted:</div>
                <div>• read_products, read_orders, read_customers, read_inventory</div>
                <div>• Zero write-permission guarantee (read-only)</div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#008060] hover:bg-[#006e52] disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {loading ? 'Redirecting to Shopify...' : 'Authorize with Shopify OAuth 2.0 →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

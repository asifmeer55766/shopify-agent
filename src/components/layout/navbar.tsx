'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SyncShopifyModal } from '@/components/shopify/sync-modal';

interface UserInfo {
  id: string;
  email: string;
  shopify?: {
    storeDomain: string;
    connected: boolean;
    authType: string;
    lastSyncedAt: string;
  } | null;
}

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  const fetchUserStatus = () => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUserStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      router.push('/login');
    } catch {
      // fallback
    }
  };

  const isConnected = currentUser?.shopify?.connected;
  const storeName = currentUser?.shopify?.storeDomain || 'peak-athletics.myshopify.com';

  return (
    <>
      <header className="h-14 border-b border-slate-200/90 bg-white px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        {/* Left Breadcrumb & Store Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span>StorePilot</span>
            <span className="text-slate-300 font-mono">/</span>
            <span className="text-slate-500 font-medium">Executive Overview</span>
          </div>

          {/* Sync Shopify Store Action Button */}
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isConnected
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-[#046a4e] text-white hover:bg-[#035840]'
            }`}
            title="Click to sync or configure your Shopify Store"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-[#046a4e] animate-pulse' : 'bg-white'
              }`}
            />
            {/* Shopify bag icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.467 4.417c-.033-.183-.2-.317-.383-.317-.183 0-3.417.067-4.483-1.017-.583-.6-1.183-1.5-1.95-1.8-.3-.117-.683-.017-.9.25-.033.05-.733 1.05-1.283 1.833-1.083.4-3.567.85-3.8.917-.383.1-.483.433-.45.667l2.25 15.65c.033.25.25.433.5.433h9.617c.25 0 .467-.183.5-.433l1.883-15.35c.017-.117-.017-.233-.083-.333z" />
            </svg>
            <span>
              {isConnected ? `Synced: ${storeName}` : 'Sync Shopify Store'}
            </span>
            <span className="text-[10px] opacity-80 underline ml-0.5">
              {isConnected ? 'Edit' : 'Connect'}
            </span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* User Account / Sign in Pill */}
          {currentUser ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-[11px] max-w-[140px] truncate" title={currentUser.email}>
                {currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold ml-1 cursor-pointer transition-colors"
                title="Sign out"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Currency Pill */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-[11px] font-bold text-slate-700 font-mono">
            <span>PKR (₨)</span>
          </div>

          {/* Sync Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isConnected ? 'Live Sync Active' : 'Sandbox Ready'}</span>
          </div>

          {/* Help Circle */}
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Shopify connection settings"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
        </div>
      </header>

      {/* Sync Shopify Modal */}
      <SyncShopifyModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSyncSuccess={fetchUserStatus}
      />
    </>
  );
};

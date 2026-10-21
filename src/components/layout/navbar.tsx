'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  const pathname = usePathname();
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
  const storeName = (currentUser?.shopify?.storeDomain || 'peak-athletics.myshopify.com').replace('.myshopify.com', '');

  // Format current bot mode / route name
  const getRouteLabel = () => {
    if (pathname.includes('/agent-tts')) return 'mode: tts-voice-agent';
    if (pathname.includes('/agent')) return 'mode: investigation-agent';
    if (pathname.includes('/overview')) return 'mode: business-overview';
    if (pathname.includes('/dashboard')) return 'mode: daily-briefing';
    if (pathname.includes('/products')) return 'mode: product-catalog';
    if (pathname.includes('/inventory')) return 'mode: inventory-forecast';
    if (pathname.includes('/analytics')) return 'mode: fiscal-analytics';
    return 'mode: bot-runtime';
  };

  return (
    <>
      <header className="h-12 border-b border-slate-200/90 bg-white/95 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 font-mono text-xs select-none">
        {/* Left: Bot Status, Path & Runtime State */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] tracking-tight">bot:active</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Current Mode / Route */}
          <div className="text-[11px] text-slate-600 font-medium hidden md:flex items-center gap-1.5">
            <span className="text-slate-400">$</span>
            <span className="text-slate-900 font-semibold">{getRouteLabel()}</span>
          </div>

          <span className="text-slate-300 hidden md:inline">|</span>

          {/* Store sync pill */}
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Configure Shopify store"
          >
            <span className="text-slate-400">store:</span>
            <span className="font-semibold text-slate-800">{storeName}</span>
            <span className="text-[10px] text-[#046a4e] underline font-medium">
              [{isConnected ? 'synced' : 'connect'}]
            </span>
          </button>
        </div>

        {/* Right: Telemetry, Currency & Session */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Model Badge */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 border border-slate-200/80 text-[10px] text-slate-500">
            <span>engine:</span>
            <span className="text-slate-800 font-semibold">gemini-2.5-flash</span>
          </div>

          {/* Currency Pill */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
            <span>PKR</span>
            <span className="text-slate-400">(₨)</span>
          </div>

          <span className="text-slate-300">|</span>

          {/* User Status / Logout */}
          {currentUser ? (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-400 hidden sm:inline">user:</span>
              <span className="font-semibold text-slate-800 max-w-[120px] truncate" title={currentUser.email}>
                {currentUser.email.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold cursor-pointer transition-colors"
                title="Sign out"
              >
                [logout]
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-2 py-0.5 rounded border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
            >
              [sign_in]
            </Link>
          )}
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

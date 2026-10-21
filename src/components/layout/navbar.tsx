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
      .catch(() => { });
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

  const userInitial = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U';
  const userDisplayName = currentUser?.email ? currentUser.email.split('@')[0] : 'Merchant';

  return (
    <>
      <header className="h-14 border-b border-slate-200/90 bg-white/95 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-end sticky top-0 z-20 select-none">
        {/* Left: Bot Status, Path & Runtime State */}


        {/* Right: Only Professional User Profile & Logout */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* User Profile Pill */}


              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                title="Sign out of StorePilot"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-800">
                <div className="w-6 h-6 rounded-full bg-[#046a4e] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  {userInitial}
                </div>

              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-[#046a4e] hover:bg-[#03543e] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Sign In
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

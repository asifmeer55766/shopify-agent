'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface UserInfo {
  id: string;
  email: string;
  shopify?: {
    storeDomain: string;
    connected: boolean;
  } | null;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const storeDomain = currentUser?.shopify?.storeDomain || 'peak-athletics.myshopify.com';
  const storeInitials = storeDomain.substring(0, 2).toUpperCase();

  const navItems = [
    {
      group: 'OVERVIEW & BRIEFING',
      items: [
        {
          name: 'Business Overview',
          href: '/dashboard/overview',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          ),
          badge: null,
        },
        {
          name: 'AI Daily Briefing',
          href: '/dashboard',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          ),
          badge: 'Live',
        },
        {
          name: 'Agent TTS Mode',
          href: '/agent-tts',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          ),
          badge: 'Audio',
        },
      ],
    },
    {
      group: 'STORE DATA & OPERATIONS',
      items: [
        {
          name: 'Products & SKUs',
          href: '/products',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="6" x2="12" y2="18" />
            </svg>
          ),
          badge: null,
        },
        {
          name: 'Inventory Forecasting',
          href: '/inventory',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          ),
          badge: null,
        },
        {
          name: 'Fiscal Analytics',
          href: '/analytics',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          ),
          badge: null,
        },
      ],
    },
    {
      group: 'AI DECISION AGENT',
      items: [
        {
          name: 'Investigation Agent',
          href: '/agent',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          ),
          badge: 'AI',
        },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/90 bg-white flex flex-col justify-between h-screen fixed left-0 top-0 z-30 select-none">
      {/* Top Section */}
      <div className="overflow-y-auto flex-1 p-3">
        {/* Brand */}
        <div className="flex items-center justify-between px-2 py-2 mb-3">
          <Link href="/dashboard/overview" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#046a4e] flex items-center justify-center text-white shadow-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              StorePilot <span className="text-[#046a4e]">AI</span>
            </span>
          </Link>
          <span className="text-[10px] font-mono uppercase text-[#046a4e] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
            PRO
          </span>
        </div>

        {/* Connected Store Pill */}
        <div className="p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/70 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#046a4e] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {storeInitials}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">{storeDomain.replace('.myshopify.com', '')}</h4>
              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                Shopify Synced
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="space-y-4">
          {navItems.map((group, gIdx) => (
            <div key={gIdx}>
              <span className="px-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                {group.group}
              </span>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#046a4e] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-50 text-[#046a4e] border border-emerald-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* User Profile at Bottom of Sidebar */}
      <div className="p-3 border-t border-slate-200/90 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#046a4e]/10 border border-emerald-200 text-[#046a4e] font-bold text-xs flex items-center justify-center shrink-0">
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {currentUser?.email ? currentUser.email.split('@')[0] : 'Merchant'}
              </h4>
              <p className="text-[10px] text-slate-400 truncate" title={currentUser?.email || ''}>
                {currentUser?.email || 'Logged In'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

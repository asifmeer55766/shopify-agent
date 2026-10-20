'use client';

import React from 'react';

export const SystemStatusBar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-mono pt-4 border-t border-slate-200/80">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>Shopify Sync: Client ID Active (OAuth Ready) • Synced 2 mins ago</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-slate-500">
        <span>All currencies normalized to PKR (₨)</span>
        <span>•</span>
        <span>Latency: 14ms</span>
        <span>•</span>
        <a href="/api/shopify/auth" className="text-[#046a4e] hover:underline font-medium">
          OAuth Store Handshake
        </a>
        <span>•</span>
        <button className="hover:text-slate-800 transition-colors">Security Ledger</button>
        <span>•</span>
        <span className="text-slate-400">StorePilot AI v4.12.8-Enterprise</span>
      </div>
    </div>
  );
};

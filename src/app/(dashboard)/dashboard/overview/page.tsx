'use client';

import React, { useEffect, useState } from 'react';
import {
  OverviewHeader,
  ExecutiveBriefingPill,
  MetricCardsGrid,
  RevenueVelocityChart,
  ProductVelocityTable,
  AIAlertsActionsCard,
  RealTimeOrderStream,
  SystemStatusBar,
} from '@/features/dashboard';
import { BusinessOverviewMetrics } from '@/types/analytics';
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

export default function BusinessOverviewPage() {
  const [metrics, setMetrics] = useState<BusinessOverviewMetrics | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const loadData = () => {
    fetch('/api/dashboard/overview')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.metrics) {
          setMetrics(data.metrics);
        }
      })
      .catch((err) => console.warn('Could not fetch overview metrics:', err));

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const isConnected = currentUser?.shopify?.connected;
  const storeDomain = currentUser?.shopify?.storeDomain;

  return (
    <div className="space-y-5 max-w-[1380px] mx-auto text-slate-800 pb-12">
      {/* 1. Header Row */}
      <OverviewHeader
        userName={currentUser?.email ? currentUser.email.split('@')[0] : 'Merchant'}
        dateRange="Oct 1 – Oct 30, 2024"
        priorRange="Sep 1 – Sep 30, 2024"
        onExportPack={() => alert('Exporting financial pack...')}
        onManageBenchmarks={() => alert('Opening benchmarks manager...')}
        onRunDeepAudit={() => alert('Running deep store audit...')}
      />

      {/* Sync Shopify Store Banner (prominent for user choice) */}
      <div className="w-full bg-gradient-to-r from-emerald-950 via-[#046a4e] to-emerald-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-emerald-800/60">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/20">
            <svg className="w-5 h-5 text-emerald-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.467 4.417c-.033-.183-.2-.317-.383-.317-.183 0-3.417.067-4.483-1.017-.583-.6-1.183-1.5-1.95-1.8-.3-.117-.683-.017-.9.25-.033.05-.733 1.05-1.283 1.833-1.083.4-3.567.85-3.8.917-.383.1-.483.433-.45.667l2.25 15.65c.033.25.25.433.5.433h9.617c.25 0 .467-.183.5-.433l1.883-15.35c.017-.117-.017-.233-.083-.333z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight">
                {isConnected ? `Shopify Store Connected: ${storeDomain}` : 'Connect & Sync Your Shopify Store'}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                isConnected ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30' : 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
              }`}>
                {isConnected ? 'Active Sync' : 'Action Required'}
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              {isConnected
                ? 'Deterministic ledger and real-time order stream actively synced to your workspace.'
                : 'Sync your catalog, orders, and customer ledger via Store ID + Access Token or 1-Click OAuth.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSyncModalOpen(true)}
          className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-white text-[#046a4e] hover:bg-emerald-50 text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
        >
          <span>{isConnected ? 'Manage Store Sync' : 'Sync Shopify Store'}</span>
          <svg className="w-3.5 h-3.5 text-[#046a4e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* 2. Executive Briefing Pill Banner */}
      <ExecutiveBriefingPill />

      {/* 3. Four Core Metric Cards Grid */}
      <MetricCardsGrid metrics={metrics} />

      {/* 4. 30-Day Revenue Velocity & Gross Margin Dynamics Chart */}
      <RevenueVelocityChart />

      {/* 5. Product Velocity & Margin Integrity (Left) vs AI Alerts & Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 flex flex-col">
          <ProductVelocityTable />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <AIAlertsActionsCard />
        </div>
      </div>

      {/* 6. Real-Time Enterprise Order Stream */}
      <RealTimeOrderStream />

      {/* 7. Bottom Footnote System Status Bar */}
      <SystemStatusBar />

      {/* Sync Shopify Modal */}
      <SyncShopifyModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSyncSuccess={loadData}
      />
    </div>
  );
}

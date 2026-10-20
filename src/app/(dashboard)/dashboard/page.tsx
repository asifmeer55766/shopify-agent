'use client';

import React, { useState } from 'react';
import { useMetrics } from '@/hooks/use-metrics';

export default function DailyBriefingDashboard() {
  // Retain all existing hooks & state logic
  const { metrics } = useMetrics('30d');
  const [checklistStatus, setChecklistStatus] = useState<Record<string, boolean>>({
    poApproved: false,
    adPaused: false,
    disclaimerDrafted: false,
  });

  const executedCount = Object.values(checklistStatus).filter(Boolean).length;

  return (
    <div className="space-y-5 max-w-[1380px] mx-auto text-slate-800 pb-12">
      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#046a4e] tracking-wider uppercase">
              AUTONOMOUS SYNTHESIS • Issue #284
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Daily Briefing — October 30, 2024
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generated today at 06:00 AM EST from 4,192 orders, 1,280 SKUs, and connected Shopify &amp; Meta API streams.
          </p>
        </div>

        {/* Right Badges & Audio Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-medium flex items-center gap-1.5 shadow-2xs">
            <svg className="w-3.5 h-3.5 text-[#046a4e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Confidence Score: <strong className="font-bold text-slate-900">98.4%</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-medium flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Full cost &amp; inventory verified</span>
          </div>

          <button className="px-4 py-1.5 rounded-lg bg-[#046a4e] hover:bg-[#03543e] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span>Audio Brief (2m 14s)</span>
          </button>
        </div>
      </div>

      {/* 2. Executive TL;DR Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-[#046a4e]">
              EXECUTIVE TL;DR
            </span>
            <span className="text-xs text-slate-400 font-medium">Tuesday Performance Loop</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Peak Athletics generated <strong className="text-slate-900 font-bold">Rs. 18,420 net revenue</strong> yesterday (<strong className="text-[#046a4e] font-bold">+22%</strong> vs 30-day Tuesday average). Strong conversion on email campaign, but inventory stockout risks and elevated return rates in footwear require immediate decision-making.
          </p>
        </div>

        {/* 3 Mini KPI blocks */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 w-full lg:w-auto">
          {/* Net Sales */}
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">NET SALES</div>
            <div className="text-xl font-black text-slate-900 tracking-tight mt-0.5">Rs. 18.4k</div>
            <div className="text-[11px] font-semibold text-[#046a4e] flex items-center gap-0.5">
              <span>↑</span> +22%
            </div>
          </div>

          {/* Blended ROAS */}
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">BLENDED ROAS</div>
            <div className="text-xl font-black text-slate-900 tracking-tight mt-0.5">3.82x</div>
            <div className="text-[11px] font-semibold text-[#046a4e] flex items-center gap-0.5">
              <span>↑</span> +0.4x
            </div>
          </div>

          {/* Return Rate */}
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">RETURN RATE</div>
            <div className="text-xl font-black text-rose-600 tracking-tight mt-0.5">14.1%</div>
            <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-0.5">
              <span>↑</span> +5.6%
            </div>
          </div>
        </div>
      </div>

      {/* 3. Two Big Insight Cards Side-by-Side (What Went Well vs What Needs Attention) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: What Went Well */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#046a4e] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">What Went Well</h3>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    POSITIVE OUTLIERS • 2 VECTORS
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#046a4e] bg-emerald-50 border border-emerald-200/70">
                Outperforming
              </span>
            </div>

            <div className="space-y-3">
              {/* Item 1: Lifecycle Marketing */}
              <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-emerald-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[10px] uppercase font-bold text-[#046a4e] tracking-wider">
                    LIFECYCLE MARKETING
                  </span>
                  <span className="text-xs font-bold text-[#046a4e]">+Rs. 7,940</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Email Campaign <strong className="text-slate-900">&ldquo;Winter Kickoff&rdquo;</strong> achieved record <strong className="text-[#046a4e]">4.6% conversion rate</strong>, generating <strong className="text-slate-900">Rs. 7,940 with Rs. 0 marginal ad spend</strong>.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200/50 text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">RECIPIENTS</span>
                    <strong className="text-slate-800 font-bold">18,200</strong>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">OPEN RATE</span>
                    <strong className="text-slate-800 font-bold">34.2%</strong>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">CAMPAIGN AOV</span>
                    <strong className="text-slate-800 font-bold">Rs. 124.50</strong>
                  </div>
                </div>
              </div>

              {/* Item 2: Merchandise Retention */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                    MERCHANDISE RETENTION
                  </span>
                  <span className="text-xs font-bold text-[#046a4e]">+8% vs Baseline</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-2.5">
                  <strong className="text-slate-900">Apex Hybrid Fleece</strong> repeat-customer reorder rate hit <strong className="text-slate-900">31%</strong> (+8% vs store average of 23%). 68 customers bought their second colorway within 30 days of original delivery.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">
                    ∞ High LTV Anchor
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">
                    Marginal Margin: 64.2%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: What Needs Immediate Attention */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">What Needs Immediate Attention</h3>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    URGENT VULNERABILITIES • 2 DETECTED
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200/70">
                Action Required
              </span>
            </div>

            <div className="space-y-3">
              {/* Vulnerability 1: High Return Spike */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-100 text-rose-700">
                      HIGH RETURN SPIKE
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">SKU: CRB-TR-20</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">MERK IMPACT</span>
                    <span className="text-xs font-bold text-rose-600">-Rs. 4,820</span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Footwear Return Spike: <strong className="text-slate-900">Carbon Trail Runner 2.0</strong> refund rate surged to <strong className="text-rose-600">21.4%</strong> (benchmark is 8.5%). Customer feedback indicates size runs 0.5 size small.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    </svg>
                    <span>View 42 refund notes</span>
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-[#991b1b] hover:bg-[#7f1d1d] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                    <span>⚡</span>
                    <span>Update Shopify size recommendation badge</span>
                  </button>
                </div>
              </div>

              {/* Vulnerability 2: Depletion Alert */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-100 text-blue-700">
                      DEPLETION ALERT
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">SKU: MRN-SOX-M</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">RUNOUT VELOCITY</span>
                    <span className="text-xs font-bold text-slate-900">48 pairs/day</span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-2.5">
                  Stockout Imminent: <strong className="text-slate-900">Merino Thermal Socks (M)</strong> currently has 0 stock across 2 distribution hubs (SLC &amp; Columbus). Backorder lost sales: <strong className="text-rose-600">Rs. 1,200/day</strong>.
                </p>
                <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-between text-[11px] text-blue-900 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span>📦</span> ShipBob Inbound in Transit: ETA 4 Days
                  </span>
                  <span className="font-mono text-blue-700 font-bold">PO #4912 Loaded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Row 2: Biggest Growth Opportunity vs Prioritized Action Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Biggest Growth Opportunity */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Biggest Growth Opportunity</h3>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    AI CROSS-SELL ENGINE
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/70">
                Strategic Lever
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-blue-700 tracking-wider mb-1">
                  <span>BUNDLE ELASTICITY OPPORTUNITY</span>
                  <span className="font-mono">Co-Purchase Rate: 44%</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  <strong className="text-slate-900 font-bold">44% of buyers</strong> who purchase <strong className="text-slate-900 font-bold">Apex Thermal Top</strong> also view <strong className="text-slate-900 font-bold">Apex Leggings</strong> within 7 days. Creating an automated &ldquo;Sub-Zero Set&rdquo; bundle with 10% discount is projected to capture latent demand without degrading gross margin.
                </p>

                {/* Projection Box */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 mb-3">
                  <div className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                    PROJECTED NET MONTHLY PROFIT
                  </div>
                  <div className="text-3xl font-black text-blue-700 tracking-tight my-1">
                    +Rs. 18,500
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-blue-800 font-mono pt-1">
                    <span>Model certainty: High (p &lt; 0.01)</span>
                    <span className="font-bold">AOV Lift: +Rs. 36.50</span>
                  </div>
                </div>

                {/* Bundle CTA */}
                <button className="w-full py-2.5 px-4 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer">
                  <span>🛒</span>
                  <span>Publish &ldquo;Sub-Zero Set&rdquo; Shopify Bundle</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Prioritized Daily Action Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Prioritized Daily Action Checklist</h3>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    INTERACTIVE DECISION BOARD
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-600 font-mono">
                {executedCount} / 3 Executed
              </span>
            </div>

            <div className="space-y-3">
              {/* Task 1: Expedite Supplier PO */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-100 text-rose-700">
                      URGENT
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">Expedite Air-Freight Supplier PO</h4>
                  </div>
                  <p className="text-[11px] text-slate-500">Apex Puffer Jack...</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChecklistStatus((prev) => ({ ...prev, poApproved: !prev.poApproved }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      checklistStatus.poApproved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#046a4e] hover:bg-[#03543e] text-white'
                    }`}
                  >
                    <span>✓</span>
                    <span>{checklistStatus.poApproved ? 'Approved' : '1-Click Approve (Rs. 2,140)'}</span>
                  </button>
                  <button className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs hover:bg-slate-50">
                    Delegate
                  </button>
                  <span className="text-slate-400 cursor-pointer">ⓘ</span>
                </div>
              </div>

              {/* Task 2: Suppress Ad Creative */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-100 text-purple-700">
                      HIGH IMPACT
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">Suppress Ad Creative #4029 on Meta Ads</h4>
                  </div>
                  <p className="text-[11px] text-slate-500">Rs. 420 spend in last 48h with 0 purchase...</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChecklistStatus((prev) => ({ ...prev, adPaused: !prev.adPaused }))}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      checklistStatus.adPaused
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'border-rose-300 text-rose-700 bg-white hover:bg-rose-50'
                    }`}
                  >
                    <span>⏸</span>
                    <span>{checklistStatus.adPaused ? 'Paused' : 'Pause Ad'}</span>
                  </button>
                  <span className="text-slate-400 cursor-pointer">ⓘ</span>
                </div>
              </div>

              {/* Task 3: Draft Sizing Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-200 text-slate-700">
                      MEDIUM
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">Draft Sizing Disclaimer on Footwear</h4>
                  </div>
                  <p className="text-[11px] text-slate-500">Add &ldquo;Runs 1/2 size small — we adv...</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChecklistStatus((prev) => ({ ...prev, disclaimerDrafted: !prev.disclaimerDrafted }))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-[#008060]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.467 4.417c-.033-.183-.2-.317-.383-.317-.183 0-3.417.067-4.483-1.017-.583-.6-1.183-1.5-1.95-1.8-.3-.117-.683-.017-.9.25-.033.05-.733 1.05-1.283 1.833-1.083.4-3.567.85-3.8.917-.383.1-.483.433-.45.667l2.25 15.65c.033.25.25.433.5.433h9.617c.25 0 .467-.183.5-.433l1.883-15.35c.017-.117-.017-.233-.083-.333z" />
                    </svg>
                    <span>{checklistStatus.disclaimerDrafted ? 'Drafted' : 'Draft Shopify Update'}</span>
                  </button>
                  <span className="text-slate-400 cursor-pointer">ⓘ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Row 3: Hourly Revenue & Trajectory (2/3) vs SKU Under AI Surveillance (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Hourly Revenue & AI Attribution Trajectory */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hourly Revenue &amp; AI Attribution Trajectory</h3>
                <p className="text-[11px] text-slate-400">Hourly aggregation comparison (Yesterday vs 30D Trend)</p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#046a4e] rounded-full" />
                  <span className="text-slate-700">Yesterday (Rs. 18.4k)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-slate-300 rounded-full" />
                  <span className="text-slate-400">Avg. Tuesday (Rs. 15.1k)</span>
                </div>
              </div>
            </div>

            {/* Smooth SVG Area Chart */}
            <div className="w-full h-48 pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#046a4e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#046a4e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

                {/* Gray baseline (30D average) */}
                <path
                  d="M0,130 C80,128 150,115 200,95 C250,75 300,90 350,90 C400,90 450,85 500,80 C550,75 580,70 600,68"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Green Area Fill */}
                <path
                  d="M0,140 C60,138 120,135 180,110 C220,95 260,65 300,60 C340,55 380,85 420,80 C460,75 500,30 540,25 C570,22 590,50 600,60 L600,160 L0,160 Z"
                  fill="url(#revenueGrad)"
                />

                {/* Green Line (Yesterday) */}
                <path
                  d="M0,140 C60,138 120,135 180,110 C220,95 260,65 300,60 C340,55 380,85 420,80 C460,75 500,30 540,25 C570,22 590,50 600,60"
                  fill="none"
                  stroke="#046a4e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Markers */}
                <circle cx="260" cy="65" r="4" fill="#046a4e" stroke="#ffffff" strokeWidth="2" />
                <circle cx="540" cy="25" r="4" fill="#046a4e" stroke="#ffffff" strokeWidth="2" />
              </svg>

              {/* X Axis Timestamps */}
              <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-100">
                <span>00:00</span>
                <span>04:00</span>
                <span className="font-semibold text-[#046a4e]">08:00 (Email Blast)</span>
                <span>12:00</span>
                <span>16:00</span>
                <span className="font-semibold text-[#046a4e]">20:00 (Evening Surge)</span>
                <span>23:59</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: SKU Under AI Surveillance */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                SKU UNDER AI SURVEILLANCE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200">
                Flagged
              </span>
            </div>

            {/* Sneaker Graphic Card */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 p-4 flex flex-col items-center justify-center min-h-[140px] mb-3 border border-slate-800">
              {/* Stylized Sneaker Icon Graphic */}
              <div className="text-5xl py-2 drop-shadow-lg">
                👟
              </div>
              <span className="px-2.5 py-1 rounded-md bg-black/70 text-white text-[11px] font-semibold tracking-wide border border-white/10">
                Carbon Trail Runner 2.0
              </span>
            </div>

            {/* Diagnostics */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Return Velocity:</span>
                <span className="font-bold text-rose-600">21.4% (Benchmark: 8.5%)</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500 shrink-0">Customer Primary Grievance:</span>
                <span className="font-semibold text-slate-800 text-right">Size runs small (78% mentions)</span>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-blue-600 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            </svg>
            <span>Open Cohort Refund Diagnostic</span>
          </button>
        </div>
      </div>

      {/* 6. Bottom Feeds & Constraints Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#046a4e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Verified System Data Feeds &amp; Constraints
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Last Sync: Oct 30, 2024 at 05:58:12 EST
          </span>
        </div>

        {/* 4 Feed Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Feed 1 */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Shopify Admin API
              </span>
              <span className="text-[10px] font-bold text-[#046a4e] bg-emerald-100/70 px-1.5 py-0.2 rounded">
                Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Orders, line-item units, SKU price changes, returns &amp; customer refunds verified to 2m ago.
            </p>
          </div>

          {/* Feed 2 */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Klaviyo Sync
              </span>
              <span className="text-[10px] font-bold text-[#046a4e] bg-emerald-100/70 px-1.5 py-0.2 rounded">
                Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Campaign open/click tracking, revenue attribution model: 5-day click / 1-day view attribution.
            </p>
          </div>

          {/* Feed 3 */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Meta Marketing API
              </span>
              <span className="text-[10px] font-bold text-[#046a4e] bg-emerald-100/70 px-1.5 py-0.2 rounded">
                Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Ad spend &amp; frequency metrics reconciled across 6 active campaigns through CAPI gateway.
            </p>
          </div>

          {/* Feed 4 */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ShipBob WMS
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded">
                Delayed (15m)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Regional inventory counts in Denver facility delayed pending morning cycle count reconciliations.
            </p>
          </div>
        </div>

        {/* Model Constraint Notes */}
        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <span className="text-blue-600 font-bold shrink-0 mt-0.5">ⓘ</span>
          <p>
            <strong className="text-slate-800 font-bold">Model Constraint Notes:</strong> Footwear refund analysis excludes international orders pending DHL cross-border intake clearance (estimated 18 orders). Profit projections account for standard 2.9% + Rs. 0.30 credit card processing fees and weighted blended shipping cost of Rs. 5.82/package.
          </p>
        </div>
      </div>
    </div>
  );
}

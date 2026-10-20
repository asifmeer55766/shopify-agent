'use client';

import React from 'react';

export const AIAlertsActionsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#046a4e] flex items-center justify-center">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-900">AI Alerts &amp; Autonomous Actions</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200/60 font-mono">
          3 Actionable
        </span>
      </div>

      <div className="space-y-3">
        {/* Alert 1: Urgent Inventory Depletion */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">
                URGENT INVENTORY DEPLETION
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-semibold">
              3.5 Days Supply
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900 font-bold">Apex Puffer Jacket (Black / L)</strong> will stockout in 3.5 days. 42 units left, current sales velocity 12 units/day. Estimated uncaptured revenue: <strong className="text-rose-600 font-bold">Rs. 14,200</strong>.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
            <span className="text-slate-500 font-mono">Supplier Lead: 6 days</span>
            <button className="px-3 py-1 rounded-lg bg-[#991b1b] hover:bg-[#7f1d1d] text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer">
              <span>Review PO / Reorder</span>
              <span>↗</span>
            </button>
          </div>
        </div>

        {/* Alert 2: Ad Spend Inefficiency */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                AD SPEND INEFFICIENCY
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Meta Ads API
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Facebook Campaign <strong className="text-slate-900 font-bold">&ldquo;Retargeting_US_Q4&rdquo;</strong> ROAS dropped from <strong className="text-slate-900">2.8x to 1.4x</strong> following high audience creative fatigue.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
            <span className="text-slate-500 font-mono">Spend: Rs. 1,200/day</span>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded text-slate-600 hover:text-slate-900 text-[11px] font-medium cursor-pointer">
                Dismiss
              </button>
              <button className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold transition-colors cursor-pointer">
                Adjust Budget (-40%)
              </button>
            </div>
          </div>
        </div>

        {/* Alert 3: Revenue Opportunity */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] uppercase font-bold text-[#046a4e] tracking-wider">
                REVENUE OPPORTUNITY
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Klaviyo Plan Ready
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900 font-bold">380 cart abandons</strong> on high-margin Merino Baselayers in last 48h. Projected recovery potential: <strong className="text-[#046a4e] font-bold">Rs. 8,450</strong> with 10% personalized incentive.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
            <span className="text-slate-500 font-mono">Estimated 12% opt-in</span>
            <button className="px-3 py-1 rounded-lg bg-[#046a4e] hover:bg-[#03543e] text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer">
              <span>▶</span>
              <span>Preview AI SMS Flow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

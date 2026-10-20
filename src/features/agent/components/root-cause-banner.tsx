'use client';

import React from 'react';

export interface RootCauseBannerProps {
  grossRevenue?: number;
  netMargin?: number;
  marginDrop?: number;
  dollarLeakage?: number;
  recoverablePotential?: number;
}

export const RootCauseBanner: React.FC<RootCauseBannerProps> = ({
  grossRevenue = 176150,
  netMargin = 45.0,
  marginDrop = 2.8,
  dollarLeakage = 13490,
  recoverablePotential = 10840,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      {/* Left Findings Narrative */}
      <div className="flex-1 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/70 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            ROOT CAUSE DETERMINED
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Confidence Score: <strong className="text-slate-800 font-bold">98.6%</strong> (Based on 16,830 order lines &amp; ledger entries)
          </span>
        </div>

        <h2 className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
          The <strong className="text-rose-600 font-bold">{marginDrop}% margin drop</strong> (Rs. {dollarLeakage.toLocaleString()} profit variance) is primarily driven by three verified factors:{' '}
          <strong className="text-slate-900 font-bold">Expedited Shipping Surcharges (48%)</strong>,{' '}
          <strong className="text-slate-900 font-bold">Increased Footwear Returns (32%)</strong>, and{' '}
          <strong className="text-slate-900 font-bold">Ad Spend Inefficiency on 2 legacy campaigns (20%)</strong>.
        </h2>

        {/* Metrics Row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Total Revenue Leakage: <strong className="text-rose-600 font-bold font-mono">-Rs. {dollarLeakage.toLocaleString()}.00</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Recoverable Margin Potential: <strong className="text-[#046a4e] font-bold font-mono">+Rs. {recoverablePotential.toLocaleString()}.00 (+2.25%)</strong></span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <span>⏱ Time Window: Oct 21 – Oct 28, 2024</span>
          </div>
        </div>
      </div>

      {/* Right KPI Stat Box */}
      <div className="flex items-center gap-4 shrink-0 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            GROSS REVENUE
          </span>
          <div className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
            Rs. {grossRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-[#046a4e] flex items-center gap-0.5">
            <span>↑</span> +14.2% DoD
          </span>
        </div>

        <div className="h-10 w-px bg-slate-200/80" />

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            NET PROFIT MARGIN
          </span>
          <div className="text-xl font-black text-rose-600 tracking-tight mt-0.5">
            {netMargin.toFixed(1)}%
          </div>
          <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-0.5">
            <span>↓</span> -2.8% Delta
          </span>
        </div>
      </div>
    </div>
  );
};

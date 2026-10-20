'use client';

import React from 'react';

export interface OverviewHeaderProps {
  userName?: string;
  dateRange?: string;
  priorRange?: string;
  onExportPack?: () => void;
  onManageBenchmarks?: () => void;
  onRunDeepAudit?: () => void;
}

export const OverviewHeader: React.FC<OverviewHeaderProps> = ({
  userName = 'Sarah',
  dateRange = 'Oct 1 – Oct 30, 2024',
  priorRange = 'Sep 1 – Sep 30, 2024',
  onExportPack,
  onManageBenchmarks,
  onRunDeepAudit,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Greeting */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold text-[#046a4e] tracking-wider flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ENTERPRISE PERFORMANCE COCKPIT • Sync Active
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Good morning, {userName}.
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Here is your store performance overview for <strong className="font-bold text-slate-800">{dateRange}</strong> vs prior period ({priorRange}).
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <button
          onClick={onExportPack}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span>Export Financial Pack</span>
        </button>

        <button
          onClick={onManageBenchmarks}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Manage Benchmarks</span>
        </button>

        <button
          onClick={onRunDeepAudit}
          className="px-3.5 py-1.5 rounded-lg bg-[#046a4e] hover:bg-[#03543e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span>Run Deep Audit</span>
        </button>
      </div>
    </div>
  );
};

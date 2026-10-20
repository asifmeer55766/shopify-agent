'use client';

import React from 'react';

export interface AgentHeaderProps {
  onReplayAudit?: () => void;
  onConfigureWeights?: () => void;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  onReplayAudit,
  onConfigureWeights,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Model Status */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-[#046a4e] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Investigation Agent
          </h1>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Model: StorePilot-Finance-v4 — Connected to Shopify Lakehouse</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed mt-1">
          Autonomous root-cause synthesis, Bayesian margin attribution, and interactive counterfactual simulation across logistics, RMA, and marketing data stores.
        </p>
      </div>

      {/* Top Right Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onReplayAudit}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Replay Audit Trail</span>
        </button>

        <button
          onClick={onConfigureWeights}
          className="px-3.5 py-2 rounded-lg bg-[#046a4e] hover:bg-[#03543e] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span>Configure Lakehouse Weights</span>
        </button>
      </div>
    </div>
  );
};

'use client';

import React from 'react';

export interface ExecutionFooterProps {
  onExportPdf?: () => void;
  onFollowUpReport?: () => void;
  onDraftActionPlan?: () => void;
}

export const ExecutionFooter: React.FC<ExecutionFooterProps> = ({
  onExportPdf,
  onFollowUpReport,
  onDraftActionPlan,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Message */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#046a4e] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">Ready to Execute Corrective Measures?</h4>
          <p className="text-[11px] text-slate-500">
            3 automated actions are packaged and staged for one-click deployment across Shopify &amp; Meta.
          </p>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
        <button
          onClick={onExportPdf}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span>Export PDF Briefing to CFO</span>
        </button>

        <button
          onClick={onFollowUpReport}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Follow up with Detailed SKU Report</span>
        </button>

        <button
          onClick={onDraftActionPlan}
          className="px-4 py-2 rounded-lg bg-[#046a4e] hover:bg-[#03543e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span>Draft Action Plan in Action Center</span>
        </button>
      </div>
    </div>
  );
};

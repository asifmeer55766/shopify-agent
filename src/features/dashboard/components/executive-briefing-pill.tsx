'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BriefingData {
  narrative: string;
  highlights: string[];
  confidenceScore: number;
  generatedAt: string;
}

export const ExecutiveBriefingPill: React.FC = () => {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchBriefing = (isRefresh = false) => {
    if (isRefresh) setRegenerating(true);
    fetch('/api/briefing', { method: isRefresh ? 'POST' : 'GET' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.briefing) {
          setBriefing(data.briefing);
        }
      })
      .catch((err) => console.error('Failed to load AI daily briefing:', err))
      .finally(() => {
        setLoading(false);
        setRegenerating(false);
      });
  };

  useEffect(() => {
    fetchBriefing();
  }, []);

  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-[#f0fdf4] to-emerald-50/40 p-4 sm:p-5 shadow-xs space-y-3 transition-all">
      {/* Top Tag Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#046a4e] text-white flex items-center justify-center shrink-0 shadow-xs">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">StorePilot AI Daily Briefing</h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-[#046a4e] font-mono border border-emerald-200">
            CONFIDENCE {briefing?.confidenceScore ?? 98.4}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 font-mono">
            {loading ? 'Synthesizing...' : `Generated at ${briefing?.generatedAt || 'Just now'}`}
          </span>

          {/* Regenerate Button */}
          <button
            onClick={() => fetchBriefing(true)}
            disabled={regenerating || loading}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-[#046a4e] hover:bg-emerald-100/70 border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50"
            title="Re-run Gemini AI synthesis on live store metrics"
          >
            <svg
              className={`w-3 h-3 ${regenerating ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>{regenerating ? 'Synthesizing...' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* Main Narrative */}
      {loading ? (
        <div className="space-y-2 py-1 animate-pulse">
          <div className="h-3 bg-emerald-200/50 rounded w-full" />
          <div className="h-3 bg-emerald-200/40 rounded w-4/5" />
        </div>
      ) : (
        <p className="text-xs text-slate-700 leading-relaxed font-normal">
          {briefing?.narrative}
        </p>
      )}

      {/* Highlights & Link */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-emerald-200/60">
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
          {briefing?.highlights?.map((hl, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 font-medium bg-white/70 px-2.5 py-0.5 rounded-md border border-emerald-100 text-slate-800"
            >
              {hl}
            </span>
          ))}
        </div>

        <Link
          href="/agent"
          className="text-xs font-bold text-[#046a4e] hover:text-[#035840] hover:underline flex items-center gap-1 group transition-colors"
        >
          <span>Open AI Investigation Agent</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
};

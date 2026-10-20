'use client';

import React from 'react';

export const TraceableEvidenceChain: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#046a4e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          <h3 className="text-sm font-bold text-slate-900">Traceable Evidence Chain</h3>
        </div>
        <span className="text-[11px] font-mono font-medium text-slate-500">
          3 Primary Records
        </span>
      </div>

      <div className="space-y-3">
        {/* Record 1: Carrier Peak Invoicing */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Carrier Peak Invoicing</h4>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                    -Rs. 6,480 Impact
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Logistics Lakehouse • DHL Express API
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 cursor-pointer">↗</button>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Carrier invoices (<strong className="text-slate-900 font-bold">DHL Express #9921</strong>) show unexpected peak seasonal fee of <strong className="text-rose-600 font-bold">+Rs. 19.05/package</strong> applied to 340 expedited replenishment units from the Shenzhen hub.
          </p>

          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 font-mono border-t border-slate-200/60">
            <span>Tracking Batch: #DHL-9921-SHZ</span>
            <a href="#" className="text-blue-600 hover:underline font-semibold font-sans">
              View Manifest ↗
            </a>
          </div>
        </div>

        {/* Record 2: Footwear Returns Spike */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Footwear Returns Spike</h4>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                    -Rs. 4,320 Impact
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Shopify RMA Integration • Loop Returns
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 cursor-pointer">↗</button>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900 font-bold">54 Return RMA requests</strong> in 7 days specifically tagged with customer feedback reason code: <span className="bg-slate-200/80 px-1 py-0.5 rounded font-mono text-[11px]">&ldquo;Too Small / Narrow Toe Box&rdquo;</span> on Apex Carbon Runners.
          </p>

          {/* Product Thumbnail Box */}
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center text-sm shadow-xs">
                👟
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-slate-900">Apex Carbon Runner - Obsidian</h5>
                <p className="text-[10px] text-slate-500 font-mono">
                  SKU: CR-BLK-2024 • Return rate: 21.4% (vs 4.2% catalog avg)
                </p>
              </div>
            </div>
            <button className="px-2 py-1 rounded border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer">
              Shopify RMA #641
            </button>
          </div>
        </div>

        {/* Record 3: Creative Fatigue & CAC Runaway */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Creative Fatigue &amp; CAC Runaway</h4>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                    -Rs. 2,690 Impact
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Meta Marketing API • Attribution Connector
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 cursor-pointer">↗</button>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Meta Ad Set <strong className="text-slate-900 font-bold">ID #892837 (Video Reel: &ldquo;Marathon Ready&rdquo;)</strong> saw CPC surge from <strong className="text-slate-900">Rs. 1.12 to Rs. 2.84</strong> with zero recorded conversions in the last 72 hours.
          </p>

          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 font-mono border-t border-slate-200/60">
            <span>Spend Burn: Rs. 896/day • Current ROAS: 0.41x</span>
            <a href="#" className="text-blue-600 hover:underline font-semibold font-sans">
              Meta Ads Manager ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

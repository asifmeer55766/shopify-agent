'use client';

import React from 'react';

export const MarginWaterfallCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Margin Decomposition Waterfall</h3>
          <p className="text-[11px] text-slate-400">
            Deterministic financial bridge linking Expected Baseline to Actual Performance.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-mono">
          <span>Currency:</span>
          <span className="font-bold">PKR (₨)</span>
        </div>
      </div>

      {/* Variance Bridge Visual Chart */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            VARIANCE BRIDGE ANALYSIS
          </span>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#046a4e]" />
              <span className="text-slate-600 text-[11px]">Baseline / Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" />
              <span className="text-slate-600 text-[11px]">Negative Variance</span>
            </div>
          </div>
        </div>

        {/* 5 Waterfall Columns Graphic */}
        <div className="h-36 pt-4 pb-2 flex items-end justify-between gap-2 sm:gap-4 px-2">
          {/* Bar 1: Expected */}
          <div className="flex-1 flex flex-col items-center h-full justify-end">
            <div className="w-full max-w-[64px] h-[95%] bg-[#046a4e] rounded-t-md flex flex-col items-center justify-center text-white text-[10px] font-bold shadow-xs">
              <span>Rs. 84.2K</span>
              <span className="text-[8px] opacity-80">47.8% Mar</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 mt-2">Expected</span>
          </div>

          {/* Bar 2: Freight */}
          <div className="flex-1 flex flex-col items-center h-full justify-end">
            <div className="w-full max-w-[64px] h-[25%] mb-[60%] bg-rose-600 rounded-md flex flex-col items-center justify-center text-white text-[10px] font-bold shadow-xs">
              <span>-Rs. 6.48K</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 mt-2">Freight (48%)</span>
          </div>

          {/* Bar 3: Returns */}
          <div className="flex-1 flex flex-col items-center h-full justify-end">
            <div className="w-full max-w-[64px] h-[18%] mb-[45%] bg-rose-600 rounded-md flex flex-col items-center justify-center text-white text-[10px] font-bold shadow-xs">
              <span>-Rs. 4.32K</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 mt-2">Returns (32%)</span>
          </div>

          {/* Bar 4: Ad Decay */}
          <div className="flex-1 flex flex-col items-center h-full justify-end">
            <div className="w-full max-w-[64px] h-[12%] mb-[35%] bg-rose-600 rounded-md flex flex-col items-center justify-center text-white text-[10px] font-bold shadow-xs">
              <span>-Rs. 2.69K</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 mt-2">Ad Decay (20%)</span>
          </div>

          {/* Bar 5: Actual Profit */}
          <div className="flex-1 flex flex-col items-center h-full justify-end">
            <div className="w-full max-w-[64px] h-[78%] bg-[#046a4e] rounded-t-md flex flex-col items-center justify-center text-white text-[10px] font-bold shadow-xs">
              <span>Rs. 70.7K</span>
              <span className="text-[8px] opacity-80">45.0% Mar</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 mt-2">Actual Profit</span>
          </div>
        </div>
      </div>

      {/* Waterfall Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-3.5 py-2.5">COMPONENT</th>
              <th className="px-3.5 py-2.5">VARIANCE TYPE</th>
              <th className="px-3.5 py-2.5">PROFIT IMPACT</th>
              <th className="px-3.5 py-2.5">MARGIN DELTA</th>
              <th className="px-3.5 py-2.5">% OF LEAKAGE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {/* Row 1: Baseline */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-3.5 py-3 font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Baseline Expected Profit
              </td>
              <td className="px-3.5 py-3 text-slate-500 font-mono text-[11px]">Lakehouse Projection</td>
              <td className="px-3.5 py-3 font-bold font-mono text-slate-900">Rs. 84,200.00</td>
              <td className="px-3.5 py-3 font-mono text-slate-700">47.8%</td>
              <td className="px-3.5 py-3 text-slate-400">—</td>
            </tr>

            {/* Row 2: Air-freight */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-3.5 py-3 text-slate-800">
                <div className="flex items-center gap-1.5 font-medium">
                  <span>✈</span> Air-freight supplier surcharge on restocks
                </div>
              </td>
              <td className="px-3.5 py-3">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200/60">
                  Logistics Peak Fee
                </span>
              </td>
              <td className="px-3.5 py-3 font-bold font-mono text-rose-600">-Rs. 6,480.00</td>
              <td className="px-3.5 py-3 font-mono text-rose-600">-1.3%</td>
              <td className="px-3.5 py-3 font-bold font-mono text-slate-900">48.0%</td>
            </tr>

            {/* Row 3: Return processing */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-3.5 py-3 text-slate-800">
                <div className="flex items-center gap-1.5 font-medium">
                  <span>↶</span> Return processing &amp; restocking friction (Carbon Runners)
                </div>
              </td>
              <td className="px-3.5 py-3">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200/60">
                  RMA Volume Spike
                </span>
              </td>
              <td className="px-3.5 py-3 font-bold font-mono text-rose-600">-Rs. 4,320.00</td>
              <td className="px-3.5 py-3 font-mono text-rose-600">-0.9%</td>
              <td className="px-3.5 py-3 font-bold font-mono text-slate-900">32.0%</td>
            </tr>

            {/* Row 4: Meta ad spend */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-3.5 py-3 text-slate-800">
                <div className="flex items-center gap-1.5 font-medium">
                  <span>📉</span> Meta ad spend CAC inflation on non-converting creatives
                </div>
              </td>
              <td className="px-3.5 py-3">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200/60">
                  ROAS Decay
                </span>
              </td>
              <td className="px-3.5 py-3 font-bold font-mono text-rose-600">-Rs. 2,690.00</td>
              <td className="px-3.5 py-3 font-mono text-rose-600">-0.6%</td>
              <td className="px-3.5 py-3 font-bold font-mono text-slate-900">20.0%</td>
            </tr>

            {/* Row 5: Actual realized */}
            <tr className="bg-slate-50/70 font-semibold text-slate-900">
              <td className="px-3.5 py-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#046a4e]" />
                Actual Realized Net Profit
              </td>
              <td className="px-3.5 py-3 text-slate-600 font-mono text-[11px]">Shopify Ledger Verified</td>
              <td className="px-3.5 py-3 font-bold font-mono text-[#046a4e]">Rs. 70,710.00</td>
              <td className="px-3.5 py-3 font-mono text-rose-600">45.0% (-2.8%)</td>
              <td className="px-3.5 py-3 font-bold font-mono text-slate-900">100.0%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

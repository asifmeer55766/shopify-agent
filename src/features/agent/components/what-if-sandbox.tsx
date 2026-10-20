'use client';

import React, { useState } from 'react';

export const WhatIfSandbox: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(1.2);
  const [sizingPromptChecked, setSizingPromptChecked] = useState(true);
  const [pauseAdChecked, setPauseAdChecked] = useState(true);

  // Dynamic simulation calculations
  const freightRecovery = Math.round((4.5 - sliderValue) * 1287);
  const rmaRecovery = sizingPromptChecked ? 3900 : 0;
  const adRecovery = pauseAdChecked ? 2690 : 0;
  const totalRecovery = Math.max(0, freightRecovery + rmaRecovery + adRecovery);
  const projectedMargin = (45.0 + (totalRecovery / 176150) * 100).toFixed(2);
  const marginDelta = (Number(projectedMargin) - 45.0).toFixed(2);

  const handleReset = () => {
    setSliderValue(4.5);
    setSizingPromptChecked(false);
    setPauseAdChecked(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#046a4e] flex items-center justify-center">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 2v7.31L4.66 19.3A2 2 0 0 0 6.41 22h11.18a2 2 0 0 0 1.75-2.7L14 9.31V2" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">What-If Counterfactual Sandbox</h3>
            <p className="text-[11px] text-slate-400">
              Run live algorithmic sensitivity models. Modify business rules to project immediate margin recovery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-600 transition-colors cursor-pointer"
          >
            Reset to Actual
          </button>
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-[#046a4e] text-[10px] font-bold uppercase tracking-wider border border-emerald-200/60 font-mono">
            Real-Time Monte Carlo Engine
          </span>
        </div>
      </div>

      {/* Grid: Controls (Left) vs Projected Impact Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Controls: Sliders & Checkboxes */}
        <div className="lg:col-span-7 space-y-4">
          {/* Slider: Carrier Freight */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Carrier Freight Negotiation Surcharge</span>
              <span className="text-[11px] font-mono text-[#046a4e] font-semibold flex items-center gap-1">
                <span>💡</span> Negotiated: +Rs. {sliderValue.toFixed(2)} / unit (Current: +Rs. 4.50)
              </span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="0.5"
              max="6.8"
              step="0.1"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseFloat(e.target.value))}
              className="w-full accent-[#046a4e] cursor-pointer"
            />

            {/* Slider Ticks */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Rs. 0.50 (Max Consolidated)</span>
              <span className="text-slate-600 font-bold">Rs. 1.20 (Target)</span>
              <span>Rs. 4.50 (Actual Incurred)</span>
              <span>Rs. 6.80 (Express Emergency)</span>
            </div>
          </div>

          {/* Toggle 1: Dynamic Sizing */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <input
              type="checkbox"
              id="sizingPrompt"
              checked={sizingPromptChecked}
              onChange={(e) => setSizingPromptChecked(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#046a4e] focus:ring-[#046a4e] accent-[#046a4e] cursor-pointer"
            />
            <label htmlFor="sizingPrompt" className="text-xs space-y-1 cursor-pointer select-none">
              <h4 className="font-bold text-slate-900">
                Inject Dynamic Sizing Prompt: &ldquo;Order 0.5 size up for Apex Runners&rdquo;
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Automatically triggers an inline storefront modal warning for customer foot profiles with wide forefoot telemetry.
              </p>
              <div className="text-[11px] font-semibold text-[#046a4e] font-mono pt-0.5">
                Forecast: -62% return rate spike reduction • +Rs. 3,980 net profit recovery
              </div>
            </label>
          </div>

          {/* Toggle 2: Auto-Pause Ad */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <input
              type="checkbox"
              id="pauseAd"
              checked={pauseAdChecked}
              onChange={(e) => setPauseAdChecked(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#046a4e] focus:ring-[#046a4e] accent-[#046a4e] cursor-pointer"
            />
            <label htmlFor="pauseAd" className="text-xs space-y-1 cursor-pointer select-none">
              <h4 className="font-bold text-slate-900">
                Auto-Pause Meta Ad Set #892837 (Zero Conversions in 72h)
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Instantly reallocates remaining Rs. 2,690 weekly budget to top-performing &ldquo;High-Impact Leggings&rdquo; campaign (ROAS 4.8x).
              </p>
              <div className="text-[11px] font-semibold text-[#046a4e] font-mono pt-0.5">
                Forecast: Prevent Rs. 2,690 pure CAC drag • Yields +Rs. 1,550 recovered gross margin
              </div>
            </label>
          </div>
        </div>

        {/* Right Projected Impact Box */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                SIMULATION PROJECTED IMPACT
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#046a4e] bg-emerald-100 border border-emerald-200/60 font-mono">
                Validated Model
              </span>
            </div>

            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-2">
              PROJECTED NET PROFIT RECOVERY
            </div>
            <div className="text-3xl font-black text-[#046a4e] tracking-tight my-0.5">
              +Rs. {totalRecovery.toLocaleString()}
              <span className="text-xs font-medium text-slate-500 font-mono ml-2">variance delta</span>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2 pt-3 border-t border-slate-200/70 text-xs mt-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Projected Net Margin:</span>
                <span className="font-bold font-mono text-slate-900">
                  {projectedMargin}% <span className="text-[#046a4e]">(+{marginDelta}%)</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Avoided Restock Inefficiency:</span>
                <span className="font-bold font-mono text-slate-900">+Rs. {freightRecovery.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">RMA Friction Avoided:</span>
                <span className="font-bold font-mono text-slate-900">+Rs. {rmaRecovery.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Ad Spend Reallocated:</span>
                <span className="font-bold font-mono text-slate-900">+Rs. {adRecovery.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="pt-2">
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div className="bg-blue-600 h-full w-[39%]" />
              <div className="bg-[#046a4e] h-full w-[36%]" />
              <div className="bg-indigo-600 h-full w-[25%]" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1.5">
              <span className="text-blue-700 font-semibold">Freight 39%</span>
              <span className="text-[#046a4e] font-semibold">Returns 36%</span>
              <span className="text-indigo-700 font-semibold">Ads 25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

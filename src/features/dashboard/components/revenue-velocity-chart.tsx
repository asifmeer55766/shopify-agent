'use client';

import React, { useState } from 'react';

export const RevenueVelocityChart: React.FC = () => {
  const [period, setPeriod] = useState<'Daily' | '7D Rolling' | 'Hourly'>('Daily');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              30-Day Revenue Velocity &amp; Gross Margin Dynamics
            </h3>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200">
              DUAL HORIZON
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Daily Net Sales pacing against prior period baseline with mapped gross margin yield
          </p>
        </div>

        {/* Legend & Period Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#046a4e]" />
              Oct 2024 Net Sales
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
              Sep 2024 Baseline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Gross Profit (Rs.)
            </span>
          </div>

          <div className="flex items-center p-0.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px]">
            {(['Daily', '7D Rolling', 'Hourly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPeriod(mode)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  period === mode
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Chart Canvas with Tooltip */}
      <div className="relative w-full h-64 pt-2">
        {/* Tooltip Card anchored around Oct 24 (68% across) */}
        <div className="absolute top-2 right-[18%] z-10 w-60 p-3 rounded-xl bg-white border border-slate-200 shadow-lg text-xs space-y-1.5 pointer-events-none">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="font-bold text-slate-900">Thursday, Oct 24, 2024</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-100 text-[#046a4e]">
              PEAK SALE DAY
            </span>
          </div>
          <div className="space-y-0.5 text-[11px] font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#046a4e]" /> Net Sales:
              </span>
              <strong className="text-slate-900 font-bold">Rs. 24,880.00</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Gross Profit:
              </span>
              <strong className="text-blue-700 font-bold">Rs. 11,480.00 (46%)</strong>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
            <div>Orders / AOV: 214 orders • Rs. 115.98</div>
            <div className="text-[#046a4e] font-semibold">vs Prior Thursday: +68.4% Net Sales</div>
          </div>
        </div>

        {/* SVG Drawing */}
        <svg className="w-full h-48 overflow-visible" viewBox="0 0 900 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="netSalesArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#046a4e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#046a4e" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="grossProfitArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="30" x2="900" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="80" x2="900" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="130" x2="900" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

          {/* Y Axis Guide Text */}
          <text x="0" y="28" fill="#cbd5e1" fontSize="9" fontFamily="monospace">Rs. 30k</text>
          <text x="0" y="78" fill="#cbd5e1" fontSize="9" fontFamily="monospace">Rs. 20k</text>
          <text x="0" y="128" fill="#cbd5e1" fontSize="9" fontFamily="monospace">Rs. 10k</text>
          <text x="0" y="175" fill="#cbd5e1" fontSize="9" fontFamily="monospace">Rs. 0</text>

          {/* Baseline Sep 2024 (Dashed Gray) */}
          <path
            d="M 30 140 C 150 135, 250 130, 350 120 C 450 115, 550 125, 650 95 C 720 140, 780 120, 880 75"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Oct 2024 Net Sales Area Fill (Green) */}
          <path
            d="M 30 150 C 120 140, 200 130, 300 125 C 400 120, 500 100, 600 85 C 680 40, 720 160, 780 90 C 820 40, 860 30, 880 35 L 880 180 L 30 180 Z"
            fill="url(#netSalesArea)"
          />

          {/* Oct 2024 Net Sales Main Line (Green) */}
          <path
            d="M 30 150 C 120 140, 200 130, 300 125 C 400 120, 500 100, 600 85 C 680 40, 720 160, 780 90 C 820 40, 860 30, 880 35"
            fill="none"
            stroke="#046a4e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Gross Profit Line (Blue) */}
          <path
            d="M 30 165 C 120 160, 200 155, 300 150 C 400 145, 500 130, 600 120 C 680 95, 720 170, 780 135 C 820 100, 860 90, 880 95"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Tooltip Anchor Line & Marker */}
          <line x1="680" y1="20" x2="680" y2="180" stroke="#046a4e" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="680" cy="40" r="4" fill="#046a4e" stroke="#ffffff" strokeWidth="2" />
          <circle cx="680" cy="95" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
        </svg>

        {/* X Axis Timestamps */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-100">
          <span>Oct 01</span>
          <span>Oct 06</span>
          <span>Oct 11</span>
          <span>Oct 16</span>
          <span>Oct 21</span>
          <span className="text-[#046a4e] font-bold">Oct 26 (Peak Event)</span>
          <span>Oct 28</span>
          <span>Oct 30</span>
        </div>
      </div>
    </div>
  );
};

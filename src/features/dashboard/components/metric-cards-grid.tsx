'use client';

import React from 'react';
import { BusinessOverviewMetrics } from '@/types/analytics';

interface MetricCardsGridProps {
  metrics?: BusinessOverviewMetrics;
}

export const MetricCardsGrid: React.FC<MetricCardsGridProps> = ({ metrics }) => {
  const netSalesDisplay = metrics?.netSales?.value
    ? `Rs. ${Math.round(metrics.netSales.value).toLocaleString('en-US')}`
    : 'Rs. 482,910';
  const netSalesDelta = metrics?.netSales?.percentageChange
    ? `${metrics.netSales.percentageChange > 0 ? '+' : ''}${metrics.netSales.percentageChange}%`
    : '+14.2%';

  const grossProfitDisplay = metrics?.grossProfit?.value
    ? `Rs. ${Math.round(metrics.grossProfit.value).toLocaleString('en-US')}`
    : 'Rs. 217,310';
  const marginPctDisplay = metrics?.grossMarginPercentage?.value
    ? `${metrics.grossMarginPercentage.value}%`
    : '45.0%';

  const ordersCountDisplay = metrics?.totalOrders?.value
    ? metrics.totalOrders.value.toLocaleString('en-US')
    : '4,192';
  const ordersDelta = metrics?.totalOrders?.percentageChange
    ? `${metrics.totalOrders.percentageChange > 0 ? '+' : ''}${metrics.totalOrders.percentageChange}%`
    : '+8.4%';

  const aovDisplay = metrics?.averageOrderValue?.value
    ? `Rs. ${Math.round(metrics.averageOrderValue.value).toLocaleString('en-US')}`
    : 'Rs. 2,450';
  const aovDelta = metrics?.averageOrderValue?.percentageChange
    ? `${metrics.averageOrderValue.percentageChange > 0 ? '+' : ''}${metrics.averageOrderValue.percentageChange}%`
    : '+5.3%';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Net Sales Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Net Sales</span>
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              💳
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {netSalesDisplay}
          </div>
          <div className="flex items-center gap-1.5 text-xs mt-1">
            <span className="font-bold text-[#046a4e] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 text-[11px]">
              ↑ {netSalesDelta}
            </span>
            <span className="text-slate-400 text-[11px]">+Rs. 59,820 vs prior 30d</span>
          </div>
        </div>

        {/* Bottom Decomposition */}
        <div className="pt-2.5 border-t border-slate-100">
          <div className="flex items-end gap-1 h-6 mb-1.5">
            <div className="w-1.5 h-3 bg-emerald-400 rounded-xs" />
            <div className="w-1.5 h-4 bg-emerald-500 rounded-xs" />
            <div className="w-1.5 h-5 bg-emerald-600 rounded-xs" />
            <div className="w-1.5 h-6 bg-[#046a4e] rounded-xs" />
            <div className="w-1.5 h-4 bg-emerald-500 rounded-xs" />
            <div className="w-1.5 h-5 bg-emerald-600 rounded-xs" />
            <div className="w-1.5 h-6 bg-[#046a4e] rounded-xs" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Gross: Rs. 528k</span>
            <span>Ret: -Rs. 34k</span>
            <span>Disc: -Rs. 11k</span>
          </div>
        </div>
      </div>

      {/* 2. Gross Profit & Margin Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Gross Profit &amp; Margin</span>
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              📊
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{grossProfitDisplay}</span>
            <span className="text-sm font-bold text-slate-500 font-mono">{marginPctDisplay}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs mt-1">
            <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200/60 text-[11px]">
              ↓ -2.8%
            </span>
            <span className="text-slate-400 text-[11px]">COGS Surcharge impact</span>
          </div>
        </div>

        {/* Bottom Target Details */}
        <div className="pt-2.5 border-t border-slate-100 space-y-1 text-[10px] font-mono">
          <div className="flex justify-between text-slate-500">
            <span>COGS: Rs. 265,600</span>
            <span>Target: 48.0%</span>
          </div>
          <div className="flex justify-between text-rose-600 font-semibold">
            <span>-Rs. 14.0k Freight</span>
            <span>Target Gap: -3.0%</span>
          </div>
        </div>
      </div>

      {/* 3. Total Orders Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Total Orders</span>
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              🛒
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {ordersCountDisplay}
          </div>
          <div className="flex items-center gap-1.5 text-xs mt-1">
            <span className="font-bold text-[#046a4e] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 text-[11px]">
              ↑ {ordersDelta}
            </span>
            <span className="text-slate-400 text-[11px]">140/day avg</span>
          </div>
        </div>

        {/* Bottom Customer Split */}
        <div className="pt-2.5 border-t border-slate-100 space-y-1 text-[10px]">
          <div className="flex justify-between text-slate-700 font-semibold">
            <span>68% Repeat Customers</span>
            <span className="text-[#046a4e]">+4.1% MoM</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div className="bg-[#046a4e] h-full w-[68%]" />
            <div className="bg-slate-300 h-full w-[32%]" />
          </div>
          <div className="flex justify-between text-slate-400 font-mono text-[9px]">
            <span>2,850 Returning</span>
            <span>1,342 First-time</span>
          </div>
        </div>
      </div>

      {/* 4. Average Order Value (AOV) Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Average Order Value (AOV)</span>
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              🏷️
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {aovDisplay}
          </div>
          <div className="flex items-center gap-1.5 text-xs mt-1">
            <span className="font-bold text-[#046a4e] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 text-[11px]">
              ↑ {aovDelta}
            </span>
            <span className="text-slate-400 text-[11px]">Prior: Rs. 2,240</span>
          </div>
        </div>

        {/* Bottom Basket Details */}
        <div className="pt-2.5 border-t border-slate-100 space-y-1 text-[10px]">
          <div className="flex justify-between text-slate-700 font-semibold">
            <span>2.84 Units / Basket</span>
            <span className="text-[#046a4e] font-mono">+1.4 units via bundles</span>
          </div>
          <div className="text-slate-500 text-[10px] leading-tight truncate">
            Fleece + Hoodie Bundle: 34%
          </div>
          <div className="text-slate-400 text-[9px] truncate">
            Cross-sell conversion peaked in Lahore &amp; Karachi
          </div>
        </div>
      </div>
    </div>
  );
};

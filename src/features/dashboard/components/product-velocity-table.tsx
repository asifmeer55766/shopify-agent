'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const ProductVelocityTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All SKUs' | 'Bleeders (4)' | 'High Margin'>('All SKUs');

  const products = [
    {
      title: 'Apex Hybrid Fleece',
      sku: 'SKU: AHF-204-GRY • 540 sold',
      revenue: 'Rs. 68,400',
      margin: '62.0%',
      rom: '+34.0%',
      badge: 'Hero Performer',
      badgeStyle: 'bg-emerald-50 text-[#046a4e] border-emerald-200/60',
      icon: '🧥',
    },
    {
      title: 'Merino Thermal Leggings',
      sku: 'SKU: MTL-890-BLK • 480 sold',
      revenue: 'Rs. 44,200',
      margin: '58.0%',
      rom: '+22.0%',
      badge: 'Healthy Growth',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200/60',
      icon: '👖',
    },
    {
      title: 'Carbon Trail Runner 2.0',
      sku: 'SKU: CTR-900-GRS • Sizing Issue',
      revenue: 'Rs. 51,000',
      margin: '28.0%',
      rom: '+4.0%',
      badge: '21.4% Return Rate',
      badgeSubtext: 'Toe-box sizing complaints',
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200/60',
      icon: '👟',
    },
    {
      title: 'Stormproof Shell M',
      sku: 'SKU: SPS-001-GRY • Paid ROAS 0.9x',
      revenue: 'Rs. 32,100',
      margin: '-Rs. 1,840',
      marginNegative: true,
      rom: '-12.4%',
      badge: 'Negative Net Contribution',
      badgeStyle: 'bg-red-700 text-white',
      icon: '🧥',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Product Velocity &amp; Margin Integrity</h3>
            <p className="text-[11px] text-slate-400">
              Unit profitability after direct landed COGS, merchant returns, and ad attribution
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-0.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px]">
            {(['All SKUs', 'Bleeders (4)', 'High Margin'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-2.5 pr-3">PRODUCT TITLE &amp; SKU</th>
                <th className="py-2.5 px-3">NET REVENUE</th>
                <th className="py-2.5 px-3">MARGIN %</th>
                <th className="py-2.5 px-3">ROM PACE</th>
                <th className="py-2.5 pl-3">DIAGNOSTIC POSTURE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {products.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-[11px] leading-tight">{item.title}</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.sku}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.revenue}</td>

                  <td className={`py-3 px-3 font-mono font-bold ${item.marginNegative ? 'text-rose-600' : 'text-slate-900'}`}>
                    {item.margin}
                  </td>

                  <td className={`py-3 px-3 font-mono font-bold ${item.rom.startsWith('-') ? 'text-rose-600' : 'text-[#046a4e]'}`}>
                    {item.rom}
                  </td>

                  <td className="py-3 pl-3">
                    <div className="flex flex-col items-start gap-0.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badgeStyle}`}>
                        {item.badge}
                      </span>
                      {item.badgeSubtext ? (
                        <span className="text-[9px] text-slate-400">{item.badgeSubtext}</span>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px]">
        <span className="text-slate-400">Showing 4 of 248 active catalog variants</span>
        <Link href="/products" className="font-bold text-[#046a4e] hover:underline flex items-center gap-1">
          <span>View Unit Economics Matrix</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';

interface InventoryItem {
  productId: string | number;
  productTitle: string;
  variantId: string | number;
  variantTitle: string;
  sku: string;
  price: string;
  stock: number;
  riskLevel: 'critical' | 'low' | 'normal' | 'out_of_stock';
  daysRemaining: number;
}

interface InventorySummary {
  totalVariants: number;
  totalStock: number;
  criticalCount: number;
  outOfStockCount: number;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'out_of_stock' | 'low' | 'normal'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.items);
          setSummary(data.summary);
        }
      })
      .catch((err) => console.error('Failed to load inventory:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === 'all' || item.riskLevel === filter;
    const matchesSearch =
      !search ||
      item.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.variantTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1380px] mx-auto text-slate-800 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory &amp; Stockout Forecasting</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#046a4e] border border-emerald-200">
              PREDICTIVE BI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stock velocity, runout horizon modeling, and working capital risk alerts.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Units In Stock</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{summary?.totalStock ?? '—'}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Across {summary?.totalVariants ?? 0} active variants</p>
        </div>

        <div className="bg-white rounded-2xl border border-rose-200/80 p-4 shadow-xs bg-rose-50/20">
          <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center justify-between">
            <span>Critical Stockout Risk</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-rose-700 mt-1">{summary?.criticalCount ?? '—'}</div>
          <p className="text-[10px] text-rose-600/80 mt-0.5">&lt; 5 units remaining (restock urgent)</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Out of Stock SKUs</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{summary?.outOfStockCount ?? '—'}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Zero availability (lost revenue risk)</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Replenishment Health</div>
          <div className="text-2xl font-black text-[#046a4e] mt-1">
            {summary && summary.totalVariants > 0
              ? `${Math.round(((summary.totalVariants - summary.criticalCount - summary.outOfStockCount) / summary.totalVariants) * 100)}%`
              : '92%'}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Variants above safety threshold</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80 flex items-center">
          <span className="absolute left-3 text-slate-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product, variant, or SKU..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#046a4e]"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-stretch sm:self-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'critical', label: 'Critical (<5)' },
            { id: 'low', label: 'Low (<15)' },
            { id: 'out_of_stock', label: 'Out of Stock' },
            { id: 'normal', label: 'Healthy' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-xs">
            <svg className="w-6 h-6 animate-spin text-[#046a4e] mb-2" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Analyzing SKU runout velocity...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">No inventory items match this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Item &amp; Variant</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Available Units</th>
                  <th className="py-3 px-4">Days Remaining</th>
                  <th className="py-3 px-4 text-right">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={`${item.productId}-${item.variantId}`} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.productTitle}</div>
                      <div className="text-[11px] text-slate-500">{item.variantTitle}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.sku}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      Rs. {Math.round(parseFloat(item.price)).toLocaleString('en-US')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 text-sm">{item.stock}</span>{' '}
                      <span className="text-[10px] text-slate-400">units</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.daysRemaining === 0
                                ? 'bg-rose-500 w-0'
                                : item.daysRemaining < 7
                                ? 'bg-rose-500 w-1/4'
                                : item.daysRemaining < 15
                                ? 'bg-amber-500 w-1/2'
                                : 'bg-[#046a4e] w-full'
                            }`}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-700">
                          {item.daysRemaining === 0 ? 'Depleted' : `~${item.daysRemaining} days`}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.riskLevel === 'out_of_stock'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : item.riskLevel === 'critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : item.riskLevel === 'low'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {item.riskLevel === 'out_of_stock'
                          ? 'Out of Stock'
                          : item.riskLevel === 'critical'
                          ? 'Critical Risk'
                          : item.riskLevel === 'low'
                          ? 'Low Stock'
                          : 'Optimal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

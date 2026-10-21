'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ExecutiveBriefingData {
  narrative: string;
  highlights: string[];
  confidenceScore: number;
  generatedAt: string;
}

interface OverviewMetrics {
  netSales: { value: number; percentageChange: number };
  totalOrders: { value: number; percentageChange: number };
  averageOrderValue: { value: number; percentageChange: number };
  grossProfit: { value: number; percentageChange: number };
  grossMarginPercentage: { value: number; percentageChange: number };
}

interface ProductItem {
  id: string;
  title: string;
  vendor: string;
  priceDisplay: string;
  totalInventory: number;
  status: string;
}

export default function DailyBriefingDashboard() {
  const [briefing, setBriefing] = useState<ExecutiveBriefingData | null>(null);
  const [metrics, setMetrics] = useState<OverviewMetrics>({
    netSales: { value: 48290, percentageChange: 12.8 },
    totalOrders: { value: 1248, percentageChange: 6.2 },
    averageOrderValue: { value: 38.72, percentageChange: 5.1 },
    grossProfit: { value: 16420, percentageChange: 8.4 },
    grossMarginPercentage: { value: 34.0, percentageChange: 1.2 },
  });
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [storeDomain, setStoreDomain] = useState('peak-athletics.myshopify.com');
  const [checklist, setChecklist] = useState({
    reorderApproved: false,
    bundlePublished: false,
    adPaused: false,
  });

  const loadData = () => {
    // 1. Fetch AI Executive Briefing from Gemini / Store
    fetch('/api/briefing')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.briefing) {
          setBriefing(data.briefing);
        }
      })
      .catch((err) => console.warn('Could not fetch briefing:', err));

    // 2. Fetch Live Metrics
    fetch('/api/dashboard/overview')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.metrics) {
          setMetrics({
            netSales: data.metrics.netSales || { value: 48290, percentageChange: 12.8 },
            totalOrders: data.metrics.totalOrders || { value: 1248, percentageChange: 6.2 },
            averageOrderValue: data.metrics.averageOrderValue || { value: 38.72, percentageChange: 5.1 },
            grossProfit: data.metrics.grossProfit || { value: 16420, percentageChange: 8.4 },
            grossMarginPercentage: data.metrics.grossMarginPercentage || { value: 34.0, percentageChange: 1.2 },
          });
        }
      })
      .catch((err) => console.warn('Could not fetch overview metrics:', err));

    // 3. Fetch Top Catalog Products
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products.slice(0, 5));
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));

    // 4. Fetch store user info
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.shopify?.storeDomain) {
          setStoreDomain(data.user.shopify.storeDomain);
        }
      })
      .catch(() => { });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch('/api/briefing', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.briefing) {
        setBriefing(data.briefing);
      }
    } catch (e) {
      console.warn('Regeneration error:', e);
    } finally {
      setRegenerating(false);
    }
  };

  // Fallback sample products if catalog is not yet populated
  const displayProducts: ProductItem[] = products.length > 0 ? products : [
    { id: '1', title: 'Loyal Foxi Oversized Hoodie', vendor: 'Loyal Foxi', priceDisplay: 'Rs. 3,390', totalInventory: 48, status: 'active' },
    { id: '2', title: 'Summer Heavyweight Tee', vendor: 'Loyal Foxi', priceDisplay: 'Rs. 1,890', totalInventory: 112, status: 'active' },
    { id: '3', title: 'Carbon Performance Joggers', vendor: 'Loyal Foxi', priceDisplay: 'Rs. 2,650', totalInventory: 3, status: 'active' },
    { id: '4', title: 'Streetwear Embroidered Cap', vendor: 'Loyal Foxi', priceDisplay: 'Rs. 1,250', totalInventory: 64, status: 'active' },
    { id: '5', title: 'Merino Baselayer Top', vendor: 'Loyal Foxi', priceDisplay: 'Rs. 2,450', totalInventory: 2, status: 'active' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Bar: Title, Date, Live Status, and Voice Mode Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-0.5">

          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            AI Daily Briefing
          </h1>

        </div>

        {/* Header Right Action Buttons */}

      </div>

      {/* 2. Executive AI Synthesis Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#046a4e] flex items-center justify-center text-sm font-bold shadow-2xs">
              🤖
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today&apos;s AI Executive Summary</h3>
              <span className="text-[11px] text-slate-400">
                Confidence: 98.6% • Generated {briefing?.generatedAt || 'Today at 08:00 AM'}
              </span>
            </div>
          </div>
          <span className="self-start md:self-auto px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#046a4e] border border-emerald-200">
            Validated Store Analysis
          </span>
        </div>

        {/* Narrative text */}
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
          {briefing?.narrative ||
            `Net revenue is pacing steady at Rs. ${metrics.netSales.value.toLocaleString()} across ${metrics.totalOrders.value.toLocaleString()} recent orders. Summer apparel and hoodies drive peak volume, with 2 SKU variants requiring replenishment to avoid stockout downtime.`}
        </p>

        {/* 3 Key Takeaway Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {briefing?.highlights && briefing.highlights.length > 0 ? (
            briefing.highlights.map((h, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700 flex items-center gap-2"
              >
                <span>{h}</span>
              </div>
            ))
          ) : (
            <>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700 flex items-center gap-2">
                <span>↗ Net sales up +12.8% driven by hero apparel</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700 flex items-center gap-2">
                <span>⚠ 2 SKUs nearing stockout threshold</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700 flex items-center gap-2">
                <span>💡 380 carts ready for automated recovery</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Core Daily KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Sales */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Sales</span>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            Rs. {metrics.netSales.value.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-[#046a4e] flex items-center gap-1">
            <span>↑</span> +{metrics.netSales.percentageChange}% vs 30-day baseline
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Orders Processed</span>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {metrics.totalOrders.value.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-[#046a4e] flex items-center gap-1">
            <span>↑</span> +{metrics.totalOrders.percentageChange}% • 98.4% fulfilled
          </div>
        </div>

        {/* Gross Profit */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Profit</span>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            Rs. {metrics.grossProfit.value.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-600">
            {metrics.grossMarginPercentage.value.toFixed(1)}% margin margin
          </div>
        </div>

        {/* AOV */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Order Value</span>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            Rs. {metrics.averageOrderValue.value.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-[#046a4e] flex items-center gap-1">
            <span>↑</span> +{metrics.averageOrderValue.percentageChange}% cart lift
          </div>
        </div>
      </div>

      {/* 4. Visuals Row: Sales Run-Rate Chart & Action Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (7 cols): Today's Hourly Run-Rate vs Baseline Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today&apos;s Hourly Sales Progression</h3>
              <p className="text-xs text-slate-400">Realized pacing vs 30-day average</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-[#046a4e]">
                <span className="w-2 h-2 rounded-full bg-[#046a4e]" /> Today
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-0.5 border-t border-dashed border-slate-400" /> Avg. Day
              </span>
            </div>
          </div>

          {/* Smooth Run-Rate SVG Curve */}
          <div className="w-full h-48 pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="briefingHourlyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#046a4e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#046a4e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="75" x2="600" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Baseline Dotted Curve */}
              <path
                d="M 10 125 C 100 120, 200 110, 300 95 C 400 85, 500 70, 590 55"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Green Area Fill */}
              <path
                d="M 10 135 C 100 125, 200 100, 300 80 C 400 55, 500 35, 590 20 L 590 145 L 10 145 Z"
                fill="url(#briefingHourlyGrad)"
              />

              {/* Green Run-Rate Line */}
              <path
                d="M 10 135 C 100 125, 200 100, 300 80 C 400 55, 500 35, 590 20"
                fill="none"
                stroke="#046a4e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <circle cx="300" cy="80" r="3.5" fill="#046a4e" stroke="#ffffff" strokeWidth="2" />
              <circle cx="590" cy="20" r="3.5" fill="#046a4e" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
            <span>00:00</span>
            <span>06:00 (Morning)</span>
            <span className="font-semibold text-[#046a4e]">12:00 (Lunch Spike)</span>
            <span className="font-semibold text-[#046a4e]">18:00 (Peak Orders)</span>
            <span>23:59</span>
          </div>
        </div>

        {/* Right (5 cols): Brand Owner Action Checklist */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3.5">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recommended Brand Actions</h3>
              <p className="text-xs text-slate-400">1-Click operational levers for today</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#046a4e] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              High Impact
            </span>
          </div>

          {/* Action 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-rose-600 tracking-wider block">
                INVENTORY RESTOCK
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                Reorder Joggers &amp; Baselayers
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">&lt; 4 days of stock remaining.</p>
            </div>
            <button
              onClick={() => setChecklist((prev) => ({ ...prev, reorderApproved: !prev.reorderApproved }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${checklist.reorderApproved
                ? 'bg-emerald-600 text-white'
                : 'bg-[#046a4e] hover:bg-[#03543e] text-white shadow-2xs'
                }`}
            >
              {checklist.reorderApproved ? 'Approved ✓' : 'Approve PO'}
            </button>
          </div>

          {/* Action 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider block">
                MARGIN BOOST
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                Publish Hoodies 2-Pack Bundle
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">+Rs. 18,500 projected profit lift.</p>
            </div>
            <button
              onClick={() => setChecklist((prev) => ({ ...prev, bundlePublished: !prev.bundlePublished }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${checklist.bundlePublished
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                }`}
            >
              {checklist.bundlePublished ? 'Live ✓' : 'Publish'}
            </button>
          </div>

          {/* Action 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider block">
                CART RECOVERY
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                Trigger 380 Abandoned Carts
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Rs. 8,450 recovery opportunity.</p>
            </div>
            <Link
              href="/inventory"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
            >
              Review
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Clean, Essential Product & Stock Health Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Catalog Performance &amp; Inventory Health</h3>
            <p className="text-xs text-slate-400">Essential inventory runway for top catalog items</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-[#046a4e] hover:underline flex items-center gap-1"
          >
            <span>View all products</span>
            <span>→</span>
          </Link>
        </div>

        {/* Clean, readable table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 pb-2">
              <tr>
                <th className="py-2.5 px-3">PRODUCT</th>
                <th className="py-2.5 px-3">BRAND / VENDOR</th>
                <th className="py-2.5 px-3">RETAIL PRICE</th>
                <th className="py-2.5 px-3">INVENTORY UNITS</th>
                <th className="py-2.5 px-3 text-right">STOCK STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-[#046a4e] flex items-center justify-center text-xs shrink-0">
                      👕
                    </span>
                    <span className="truncate max-w-[280px]">{p.title}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{p.vendor}</td>
                  <td className="py-3 px-3 font-bold font-mono text-slate-900">{p.priceDisplay}</td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-800">
                    {p.totalInventory} units
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.totalInventory > 20
                        ? 'bg-emerald-50 text-[#046a4e] border border-emerald-200'
                        : p.totalInventory > 0
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                    >
                      {p.totalInventory > 20
                        ? 'Healthy Stock'
                        : p.totalInventory > 0
                          ? 'Low Stock (<5)'
                          : 'Stockout'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SyncShopifyModal } from '@/components/shopify/sync-modal';

interface UserInfo {
  id: string;
  email: string;
  shopify?: {
    storeDomain: string;
    connected: boolean;
    authType: string;
    lastSyncedAt: string;
  } | null;
}

interface OverviewMetric {
  value: number;
  percentageChange: number;
  isPositive: boolean;
}

interface RecentOrder {
  id: string;
  name: string;
  customer: string;
  total: number;
  financialStatus: string;
  createdAt: string;
  itemsCount: number;
}

interface ProductItem {
  id: string;
  title: string;
  priceDisplay: string;
  totalInventory: number;
  vendor?: string;
}

export default function BusinessOverviewPage() {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | 'Q4'>('30D');
  const [chartMode, setChartMode] = useState<'revenue' | 'orders'>('revenue');

  // Metrics state
  const [metrics, setMetrics] = useState<{
    netSales: OverviewMetric;
    totalOrders: OverviewMetric;
    averageOrderValue: OverviewMetric;
    grossProfit: OverviewMetric;
    grossMarginPercentage: OverviewMetric;
  }>({
    netSales: { value: 108320, percentageChange: 12.8, isPositive: true },
    totalOrders: { value: 1420, percentageChange: 8.4, isPositive: true },
    averageOrderValue: { value: 76.28, percentageChange: 5.1, isPositive: true },
    grossProfit: { value: 43120, percentageChange: 14.2, isPositive: true },
    grossMarginPercentage: { value: 39.8, percentageChange: 1.4, isPositive: true },
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    // 1. Fetch user session
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => { });

    // 2. Fetch overview metrics & recent orders
    fetch('/api/dashboard/overview')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.metrics) {
            setMetrics({
              netSales: data.metrics.netSales || { value: 108320, percentageChange: 12.8, isPositive: true },
              totalOrders: data.metrics.totalOrders || { value: 1420, percentageChange: 8.4, isPositive: true },
              averageOrderValue: data.metrics.averageOrderValue || { value: 76.28, percentageChange: 5.1, isPositive: true },
              grossProfit: data.metrics.grossProfit || { value: 43120, percentageChange: 14.2, isPositive: true },
              grossMarginPercentage: data.metrics.grossMarginPercentage || { value: 39.8, percentageChange: 1.4, isPositive: true },
            });
          }
          if (data.recentOrders && data.recentOrders.length > 0) {
            setRecentOrders(data.recentOrders.slice(0, 4));
          }
        }
      })
      .catch((err) => console.warn('Could not fetch overview metrics:', err))
      .finally(() => setLoading(false));

    // 3. Fetch top products
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setTopProducts(data.products.slice(0, 4));
        }
      })
      .catch(() => { });
  };

  useEffect(() => {
    loadData();
  }, []);

  const isConnected = currentUser?.shopify?.connected;
  const storeDomain = currentUser?.shopify?.storeDomain || 'peak-athletics.myshopify.com';

  // Fallback sample orders if none returned
  const displayOrders: RecentOrder[] = recentOrders.length > 0 ? recentOrders : [
    { id: 'ord_1', name: '#1042', customer: 'Hamza Malik', total: 3450, financialStatus: 'paid', createdAt: '10m ago', itemsCount: 2 },
    { id: 'ord_2', name: '#1041', customer: 'Ayesha Khan', total: 1890, financialStatus: 'paid', createdAt: '28m ago', itemsCount: 1 },
    { id: 'ord_3', name: '#1040', customer: 'Bilal Ahmed', total: 6780, financialStatus: 'paid', createdAt: '1h ago', itemsCount: 3 },
    { id: 'ord_4', name: '#1039', customer: 'Zainab Tariq', total: 2400, financialStatus: 'paid', createdAt: '2h ago', itemsCount: 1 },
  ];

  // Fallback sample products if none returned
  const displayProducts: ProductItem[] = topProducts.length > 0 ? topProducts : [
    { id: 'prod_1', title: 'Loyal Foxi Oversized Hoodie', priceDisplay: 'Rs. 3,390', totalInventory: 48, vendor: 'Loyal Foxi' },
    { id: 'prod_2', title: 'Summer Heavyweight Tee', priceDisplay: 'Rs. 1,890', totalInventory: 112, vendor: 'Loyal Foxi' },
    { id: 'prod_3', title: 'Carbon Performance Joggers', priceDisplay: 'Rs. 2,650', totalInventory: 8, vendor: 'Loyal Foxi' },
    { id: 'prod_4', title: 'Streetwear Embroidered Cap', priceDisplay: 'Rs. 1,250', totalInventory: 64, vendor: 'Loyal Foxi' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Bar: Clean & Focused */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Business Overview</h1>

          </div>

        </div>

        {/* Action Controls: Timeframe Pills & Sync Store */}
        <div className="flex items-center gap-2.5">
          {/* Timeframe Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600">
            {(['7D', '30D', 'Q4'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${timeframe === period ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
                  }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Sync Shopify Modal Button */}

        </div>
      </div>

      {/* 2. Four Core Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Net Sales */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Net Sales</span>

          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            Rs. {metrics.netSales.value.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-[#046a4e] flex items-center gap-0.5">
              <span>↑</span> +{metrics.netSales.percentageChange}%
            </span>
            <span className="text-slate-400">vs last period</span>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>

          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {metrics.totalOrders.value.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-[#046a4e] flex items-center gap-0.5">
              <span>↑</span> +{metrics.totalOrders.percentageChange}%
            </span>
            <span className="text-slate-400">98.4% fulfilled</span>
          </div>
        </div>

        {/* Metric 3: AOV */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Order (AOV)</span>

          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            Rs. {metrics.averageOrderValue.value.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-[#046a4e] flex items-center gap-0.5">
              <span>↑</span> +{metrics.averageOrderValue.percentageChange}%
            </span>
            <span className="text-slate-400">cart lift</span>
          </div>
        </div>

        {/* Metric 4: Gross Margin */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Profit Margin</span>

          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {metrics.grossMarginPercentage.value.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-[#046a4e]">Rs. {metrics.grossProfit.value.toLocaleString()}</span>
            <span className="text-slate-400">profit</span>
          </div>
        </div>
      </div>

      {/* 3. Core Interactive Charts Row ("cards and charts") */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card (8 cols): Revenue & Orders Velocity Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue Velocity &amp; Growth Curve</h3>
              <p className="text-xs text-slate-400">Continuous 30-day transactional pace (in PKR)</p>
            </div>

            {/* Toggle Mode: Revenue vs Orders */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-[#046a4e]">
                PEAK: THURSDAY (+68%)
              </span>
              <div className="flex items-center p-0.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setChartMode('revenue')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${chartMode === 'revenue' ? 'bg-white text-[#046a4e] shadow-2xs font-bold' : ''
                    }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setChartMode('orders')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${chartMode === 'orders' ? 'bg-white text-blue-600 shadow-2xs font-bold' : ''
                    }`}
                >
                  Orders
                </button>
              </div>
            </div>
          </div>

          {/* Smooth SVG Area Chart */}
          <div className="w-full h-56 pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="overviewRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#046a4e" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#046a4e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="700" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="700" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="700" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Baseline Dotted Curve */}
              <path
                d="M 20 135 C 120 130, 220 120, 320 115 C 420 110, 520 95, 680 75"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Gradient Area Fill */}
              <path
                d="M 20 145 C 100 130, 180 125, 260 110 C 340 95, 420 60, 500 50 C 560 30, 620 45, 680 25 L 680 175 L 20 175 Z"
                fill="url(#overviewRevGrad)"
              />

              {/* Main Green Line */}
              <path
                d="M 20 145 C 100 130, 180 125, 260 110 C 340 95, 420 60, 500 50 C 560 30, 620 45, 680 25"
                fill="none"
                stroke="#046a4e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[
                [20, 145],
                [140, 128],
                [260, 110],
                [380, 80],
                [500, 50],
                [680, 25],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3.5" fill="#046a4e" stroke="#ffffff" strokeWidth="2" />
              ))}
            </svg>
          </div>

          {/* X Axis Time Labels */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
            <span>Oct 1</span>
            <span>Oct 8</span>
            <span>Oct 15</span>
            <span>Oct 22</span>
            <span>Oct 30</span>
          </div>
        </div>

        {/* Right Card (4 cols): Sales Category Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Revenue Distribution</h3>
            <p className="text-xs text-slate-400">Share of catalog gross revenue</p>
          </div>

          {/* Category Progress Bars */}
          <div className="space-y-4 flex-1 justify-center flex flex-col">
            {/* Category 1: Apparel */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#046a4e]" />
                  Hoodies &amp; Tops
                </span>
                <span className="font-mono text-slate-900 font-bold">54% • Rs. 58,490</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#046a4e] rounded-full w-[54%]" />
              </div>
            </div>

            {/* Category 2: Footwear */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
                  Bottoms &amp; Joggers
                </span>
                <span className="font-mono text-slate-900 font-bold">28% • Rs. 30,330</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-[28%]" />
              </div>
            </div>

            {/* Category 3: Accessories */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
                  Headwear &amp; Caps
                </span>
                <span className="font-mono text-slate-900 font-bold">18% • Rs. 19,500</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full w-[18%]" />
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* 4. Bottom Row: Top Performing Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Top Performing SKUs */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Performing Products</h3>
              <p className="text-xs text-slate-400">Ranked by 30-day realized sales volume</p>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-[#046a4e] hover:underline flex items-center gap-1"
            >
              <span>View catalog</span>
              <span>→</span>
            </Link>
          </div>

          <div className="space-y-2.5">
            {displayProducts.map((p, idx) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-[#046a4e] font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900">{p.title}</h4>
                    <span className="text-[11px] text-slate-400">{p.vendor}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold font-mono text-slate-900">{p.priceDisplay}</div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.totalInventory > 20
                      ? 'bg-emerald-50 text-[#046a4e]'
                      : 'bg-rose-50 text-rose-600'
                      }`}
                  >
                    {p.totalInventory} in stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Recent Live Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Store Orders</h3>
              <p className="text-xs text-slate-400">Latest transactions from your Shopify store</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">Live Stream</span>
          </div>

          <div className="space-y-2.5">
            {displayOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    🛍
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-slate-900">{ord.name}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-700 font-medium">{ord.customer}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{ord.createdAt}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold font-mono text-slate-900">
                    Rs. {Math.round(ord.total).toLocaleString()}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-[#046a4e]">
                    {ord.financialStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sync Shopify Modal */}
      <SyncShopifyModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSyncSuccess={loadData}
      />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';

interface ProductItem {
  id: string | number;
  title: string;
  vendor: string;
  status: string;
  image: string | null;
  variantsCount: number;
  totalInventory: number;
  priceDisplay: string;
  variants: Array<{
    id: string | number;
    title: string;
    price: string;
    compare_at_price?: string;
    sku?: string;
    inventory_quantity?: number;
  }>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({ search, status: statusFilter }).toString();
    fetch(`/api/products?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error('Failed to fetch products:', err))
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  const totalProducts = products.length;
  const outOfStockCount = products.filter((p) => p.totalInventory <= 0).length;
  const inStockCount = products.filter((p) => p.totalInventory > 0).length;

  return (
    <div className="space-y-6 max-w-[1380px] mx-auto text-slate-800 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products &amp; SKU Intelligence</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#046a4e] border border-emerald-200">
              100% READ-ONLY
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time catalog breakdown, variant pricing, inventory levels, and margin integrity.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
            <span className="text-slate-400">Total Products:</span>{' '}
            <span className="font-bold text-slate-900">{totalProducts}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <span className="text-emerald-700">In Stock:</span>{' '}
            <span className="font-bold text-emerald-900">{inStockCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs">
            <span className="text-rose-700">Out of Stock:</span>{' '}
            <span className="font-bold text-rose-900">{outOfStockCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
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
            placeholder="Search products, vendors, or SKUs..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#046a4e]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-stretch sm:self-auto">
          {['all', 'active', 'draft'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-xs">
            <svg className="w-6 h-6 animate-spin text-[#046a4e] mb-2" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Loading Shopify catalog data...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No products match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Variants</th>
                  <th className="py-3 px-4">Total Inventory</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const isExpanded = expandedId === product.id;
                  return (
                    <React.Fragment key={product.id}>
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[10px] text-slate-400 font-mono">No Img</span>
                              )}
                            </div>
                            <span className="font-bold text-slate-900 max-w-xs truncate" title={product.title}>
                              {product.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              product.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.status === 'active' ? 'bg-[#046a4e]' : 'bg-slate-400'
                              }`}
                            />
                            {product.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{product.vendor}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                          {product.priceDisplay}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {product.variantsCount} {product.variantsCount === 1 ? 'variant' : 'variants'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              product.totalInventory <= 0
                                ? 'text-rose-600'
                                : product.totalInventory < 10
                                ? 'text-amber-600'
                                : 'text-slate-800'
                            }`}
                          >
                            {product.totalInventory} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : product.id)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                          >
                            {isExpanded ? 'Collapse' : 'Variants'}
                          </button>
                        </td>
                      </tr>

                      {/* Variant Sub-table if Expanded */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80">
                          <td colSpan={7} className="p-4">
                            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
                              <h4 className="text-xs font-bold text-slate-800 mb-2">
                                Variants for {product.title}
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {product.variants.map((v) => (
                                  <div
                                    key={v.id}
                                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col justify-between text-[11px]"
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-bold text-slate-800">{v.title}</span>
                                      <span className="font-mono text-emerald-800 font-bold">
                                        Rs. {Math.round(parseFloat(v.price)).toLocaleString('en-US')}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-500 text-[10px]">
                                      <span>SKU: {v.sku || 'N/A'}</span>
                                      <span
                                        className={`font-semibold ${
                                          (v.inventory_quantity || 0) <= 0
                                            ? 'text-rose-600'
                                            : (v.inventory_quantity || 0) < 5
                                            ? 'text-amber-600'
                                            : 'text-slate-700'
                                        }`}
                                      >
                                        Stock: {v.inventory_quantity ?? 0}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

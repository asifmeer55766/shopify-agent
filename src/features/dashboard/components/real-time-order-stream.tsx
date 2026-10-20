'use client';

import React, { useState } from 'react';

export const RealTimeOrderStream: React.FC = () => {
  const [filterText, setFilterText] = useState('');

  const orders = [
    {
      orderId: '#PK-10948',
      time: '3 mins ago • Direct Checkout',
      customerName: 'Marcus Vance',
      customerBadge: 'VIP (Rs. 45k LTV)',
      customerBadgeColor: 'bg-emerald-50 text-[#046a4e] border-emerald-200/60',
      email: 'marcus.v@summitcap.com',
      itemsTitle: 'Apex Hybrid Fleece (L), Carbon Runner (11)',
      itemsSubtext: '2 SKUs • Bundle Discount Applied',
      orderTotal: 'Rs. 4,890',
      netMargin: 'Rs. 2,750',
      netMarginPercent: '55.7% Margin',
      isMarginGood: true,
      fulfillment: 'Warehouse SLC - Queued',
      fulfillmentColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
    },
    {
      orderId: '#PK-10947',
      time: '11 mins ago • Google Shopping',
      customerName: 'Elena Rostova',
      customerBadge: 'First-Time',
      customerBadgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      email: 'e.rostova@designworks.io',
      itemsTitle: 'Merino Thermal Baselayer 3-Pack (S)',
      itemsSubtext: '1 SKU • Seasonal Promo',
      orderTotal: 'Rs. 2,490',
      netMargin: 'Rs. 1,620',
      netMarginPercent: '65.1% Margin',
      isMarginGood: true,
      fulfillment: 'Shipped (TCS Express)',
      fulfillmentColor: 'bg-emerald-50 text-[#046a4e] border-emerald-200/60',
    },
    {
      orderId: '#PK-10946',
      time: '19 mins ago • Instagram Retargeting',
      customerName: 'David Chen',
      customerBadge: 'Repeat (3rd Order)',
      customerBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
      email: 'dchen92@gmail.com',
      itemsTitle: 'Apex Puffer Jacket (XL, Obsidian)',
      itemsSubtext: '1 SKU • Low Stock Flag',
      orderTotal: 'Rs. 3,890',
      netMargin: 'Rs. 1,290',
      netMarginPercent: '33.2% Margin',
      isMarginGood: false,
      fulfillment: 'Processing • Hub Lahore',
      fulfillmentColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Real-Time Enterprise Order Stream</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-400">
            Verified Shopify Plus line items with immediate net margin attribution
          </p>
        </div>

        {/* Filter and Export */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter order # or customer..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#046a4e] w-48 sm:w-56"
            />
            <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
          </div>

          <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto pt-1">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
            <tr>
              <th className="py-2.5 pr-3">ORDER &amp; TIMESTAMP</th>
              <th className="py-2.5 px-3">CUSTOMER TIER</th>
              <th className="py-2.5 px-3">ITEMS PURCHASED</th>
              <th className="py-2.5 px-3">ORDER TOTAL</th>
              <th className="py-2.5 px-3">NET MARGIN</th>
              <th className="py-2.5 px-3">FULFILLMENT</th>
              <th className="py-2.5 pl-3 text-right">AUDIT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {orders.map((ord, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                {/* Order & Time */}
                <td className="py-3 pr-3">
                  <div className="font-bold text-slate-900 font-mono text-[11px]">{ord.orderId}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{ord.time}</div>
                </td>

                {/* Customer */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{ord.customerName}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${ord.customerBadgeColor}`}>
                      {ord.customerBadge}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ord.email}</div>
                </td>

                {/* Items */}
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-800">{ord.itemsTitle}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ord.itemsSubtext}</div>
                </td>

                {/* Total */}
                <td className="py-3 px-3 font-bold font-mono text-slate-900">{ord.orderTotal}</td>

                {/* Margin */}
                <td className="py-3 px-3 font-mono">
                  <div className="font-bold text-slate-900">{ord.netMargin}</div>
                  <div className={`text-[10px] font-semibold ${ord.isMarginGood ? 'text-[#046a4e]' : 'text-rose-600'}`}>
                    {ord.netMarginPercent}
                  </div>
                </td>

                {/* Fulfillment */}
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${ord.fulfillmentColor}`}>
                    {ord.fulfillment}
                  </span>
                </td>

                {/* Audit Arrow */}
                <td className="py-3 pl-3 text-right">
                  <button className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer">
                    &gt;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

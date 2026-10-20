'use client';

import React, { useState } from 'react';

export interface AgentQueryBarProps {
  initialQuery?: string;
  onSynthesize?: (query: string) => void;
}

export const AgentQueryBar: React.FC<AgentQueryBarProps> = ({
  initialQuery = 'Why did net profit margin drop 2.8% this week despite gross revenue growing +14%?',
  onSynthesize,
}) => {
  const [query, setQuery] = useState(initialQuery);

  const suggestedQueries = [
    { icon: '🔍', text: 'Which SKUs have negative unit contribution?' },
    { icon: '🔍', text: 'Why did footwear returns double in Europe?' },
    { icon: '📈', text: 'Analyze ROAS decay on Meta retargeting' },
  ];

  const handleRun = () => {
    onSynthesize?.(query);
  };

  return (
    <div className="space-y-2.5">
      {/* Main Search Input Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2 shadow-xs flex items-center gap-2">
        <div className="flex items-center gap-2.5 flex-1 pl-2">
          <span className="text-[#046a4e]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
            placeholder="Ask a question or enter hypothesis to investigate across Shopify ledger..."
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-2 py-1 rounded text-[11px] font-mono text-slate-400 bg-slate-100 border border-slate-200">
            Run
          </span>
          <button
            onClick={handleRun}
            className="px-4 py-2 rounded-lg bg-[#046a4e] hover:bg-[#03543e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <span>✦</span>
            <span>Synthesize Lakehouse</span>
          </button>
        </div>
      </div>

      {/* Suggested Queries Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          SUGGESTED QUERIES:
        </span>
        {suggestedQueries.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setQuery(item.text)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

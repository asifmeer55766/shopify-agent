'use client';

import React, { useState } from 'react';
import { useAgent } from '@/hooks/use-agent';

interface AnomalyItem {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  symptom: string;
  rootCause: string;
  impact: string;
  recommendedFix: string;
  confidence: number;
}

const ACTIVE_ANOMALIES: AnomalyItem[] = [
  {
    id: 'anom-1',
    severity: 'critical',
    category: 'Returns & Margin',
    title: 'Footwear & Outerwear Sizing Discrepancy',
    symptom: 'Net margin dropped 2.8% with refund requests surging +74.6% this cycle.',
    rootCause: '54 customer refund submissions specifically cited "Runs Small" on Alpine Parka & Chelsea Boots.',
    impact: '-Rs. 8,240 in reverse shipping & restocking fees',
    recommendedFix: 'Add a prominent sizing advisory widget ("Runs 1 size small") on product detail pages.',
    confidence: 98,
  },
  {
    id: 'anom-2',
    severity: 'warning',
    category: 'Marketing Efficiency',
    title: 'Fatigued Ad Creative Drain',
    symptom: 'CAC increased by 18% over the last 72 hours with ROAS dipping below break-even (1.4x).',
    rootCause: 'Meta Ad Set #4812 has 0 conversions across Rs. 5,250 spend due to creative saturation.',
    impact: '-Rs. 5,250 in unrecovered ad spend',
    recommendedFix: 'Pause fatigued creative #4812 and shift daily budget to high-performing winter collection ads.',
    confidence: 94,
  },
];

export default function AIAgentInvestigationPage() {
  const { messages, isLoading, error, sendMessage } = useAgent('store_demo_1');
  const [inputQuery, setInputQuery] = useState('');

  const quickPrompts = [
    'Why is net profit margin compressing this week?',
    'Which SKUs have the highest return rate and why?',
    'Where is ad spend draining with low conversion?',
    'What are the top 3 immediate margin recovery actions?',
  ];

  const handleInvestigate = (queryToRun?: string) => {
    const q = (queryToRun || inputQuery).trim();
    if (!q || isLoading) return;
    sendMessage(q);
    setInputQuery('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
        <div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Investigation Agent
          </h1>

        </div>


      </div>

      {/* 2. Key Diagnostic Health Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Anomalies</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">2 Flagged</div>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">1 Critical, 1 Moderate</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">At-Risk Profit</span>

          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">Rs. 13,490</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Identified leakage this cycle</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Driver</span>

          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 truncate">Sizing Returns</div>
          <p className="text-[11px] text-slate-500 mt-0.5">62% of refund reasons</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Diagnosis Confidence</span>

          </div>
          <div className="text-xl sm:text-2xl font-black text-[#046a4e] mt-1">98.6%</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Cross-verified with store ledger</p>
        </div>
      </div>

      {/* 3. Verified Store Anomalies (Card Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Active Incident Diagnoses
            </h2>
            <p className="text-xs text-slate-500">
              Correlated root-cause analyses automatically flagged from your Shopify sales and returns.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {ACTIVE_ANOMALIES.length} Verified Incidents
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACTIVE_ANOMALIES.map((anomaly) => {
            const isCritical = anomaly.severity === 'critical';
            return (
              <div
                key={anomaly.id}
                className={`bg-white rounded-2xl border p-5 shadow-2xs flex flex-col justify-between space-y-4 transition-all ${isCritical ? 'border-rose-200/90 hover:border-rose-300' : 'border-amber-200/90 hover:border-amber-300'
                  }`}
              >
                <div className="space-y-3">
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isCritical
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                      >
                        {anomaly.severity}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {anomaly.category}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-slate-400">
                      {anomaly.confidence}% Confidence
                    </span>
                  </div>

                  {/* Title & Symptom */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{anomaly.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      <span className="font-semibold text-slate-800">Symptom:</span> {anomaly.symptom}
                    </p>
                  </div>

                  {/* Root Cause Detail Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      Root Cause Identified
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {anomaly.rootCause}
                    </p>
                  </div>
                </div>

                {/* Bottom Impact & Resolution */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-xs">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                      Financial Impact
                    </span>
                    <span className="font-bold text-rose-600 font-mono">{anomaly.impact}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleInvestigate(`Deep-dive into anomaly: ${anomaly.title}. What specific steps will fix this immediately?`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0 text-center"
                  >
                    Investigate with AI →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive AI Investigation Console */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#046a4e] border border-emerald-200/80 flex items-center justify-center font-bold text-base shadow-2xs">
              🤖
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Ask the Investigation Agent</h2>
              <p className="text-xs text-slate-400">Ask any question to inspect store metrics, returns, or margin variance</p>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Model: Gemini 2.5 Flash • Context: Live Store Data
          </span>
        </div>

        {/* Quick Diagnostic Prompts */}
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleInvestigate(prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-700 transition-colors cursor-pointer text-left disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Query Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask anything about your store performance (e.g. why did margin drop this week?)..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvestigate()}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#046a4e] focus:bg-white"
          />
          <button
            onClick={() => handleInvestigate()}
            disabled={!inputQuery.trim() || isLoading}
            className="px-5 py-2.5 rounded-2xl bg-[#046a4e] hover:bg-[#03543e] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Diagnosing...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Investigate</span>
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Agent Conversation Stream */}
        {messages.length > 0 ? (
          <div className="space-y-3 pt-3 border-t border-slate-100 max-h-[480px] overflow-y-auto pr-1">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${isUser
                    ? 'bg-slate-100 text-slate-800 ml-6 sm:ml-12'
                    : 'bg-emerald-50/60 border border-emerald-200/70 text-slate-900 mr-6 sm:mr-12 shadow-2xs'
                    }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className={isUser ? 'text-slate-500' : 'text-[#046a4e]'}>
                      {isUser ? 'Merchant Query' : 'StorePilot AI Diagnosis'}
                    </span>
                    <span className="font-mono">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="whitespace-pre-wrap font-normal text-slate-800">{m.content}</div>

                  {/* Grounded Evidence Badges if returned */}
                  {m.evidence && m.evidence.length > 0 && (
                    <div className="pt-2 border-t border-emerald-200/50 flex flex-wrap gap-2">
                      {m.evidence.map((ev) => (
                        <div
                          key={ev.id}
                          className="px-2.5 py-1 rounded-lg bg-white/80 border border-emerald-200 text-[11px] font-mono text-slate-700 flex items-center gap-1.5"
                        >
                          <span className="font-semibold text-slate-900">{ev.metric}:</span>
                          <span>{ev.delta}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommendations if returned */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="pt-2 border-t border-emerald-200/50 space-y-2">
                      {m.recommendations.map((rec) => (
                        <div key={rec.id} className="p-3 rounded-xl bg-white border border-emerald-200/80 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">{rec.title}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#046a4e]">
                              {rec.impactEstimate}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{rec.rationale}</p>
                          {rec.suggestedSteps && rec.suggestedSteps.length > 0 && (
                            <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 pl-1">
                              {rec.suggestedSteps.map((step, sIdx) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/60 text-center space-y-2">
            <span className="text-2xl">⚡</span>
            <h4 className="text-xs font-bold text-slate-800">No active inquiry</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Select one of the quick diagnostic prompts above or type your question to trigger an immediate root-cause investigation across your store data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

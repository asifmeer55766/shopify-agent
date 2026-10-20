'use client';

import React from 'react';
import {
  AgentHeader,
  AgentQueryBar,
  RootCauseBanner,
  MarginWaterfallCard,
  TraceableEvidenceChain,
  WhatIfSandbox,
  ExecutionFooter,
} from '@/features/agent';
import { useAgent } from '@/hooks/use-agent';

export default function AIAgentInvestigationPage() {
  // Retain existing hook logic for interactive AI investigation
  const { sendMessage } = useAgent('store_demo_1');

  const handleSynthesize = (query: string) => {
    sendMessage(query);
  };

  return (
    <div className="space-y-5 max-w-[1380px] mx-auto text-slate-800 pb-12">
      {/* 1. Header Section */}
      <AgentHeader
        onReplayAudit={() => alert('Replaying audit trail verification...')}
        onConfigureWeights={() => alert('Configure Lakehouse Bayesian weights modal')}
      />

      {/* 2. Query Search & Hypothesis Bar */}
      <AgentQueryBar onSynthesize={handleSynthesize} />

      {/* 3. Root Cause Determined Alert & Financial Leakage Summary */}
      <RootCauseBanner
        grossRevenue={176150}
        netMargin={45.0}
        marginDrop={2.8}
        dollarLeakage={13490}
        recoverablePotential={10840}
      />

      {/* 4. Decomposition Waterfall & Traceable Evidence Chain (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (7 Cols): Margin Decomposition Waterfall */}
        <div className="lg:col-span-7">
          <MarginWaterfallCard />
        </div>

        {/* Right (5 Cols): Traceable Evidence Chain */}
        <div className="lg:col-span-5">
          <TraceableEvidenceChain />
        </div>
      </div>

      {/* 5. What-If Counterfactual Sandbox (Monte Carlo Engine) */}
      <WhatIfSandbox />

      {/* 6. Execution & Action Deployment Footer */}
      <ExecutionFooter
        onExportPdf={() => alert('Generating CFO Briefing PDF...')}
        onFollowUpReport={() => alert('Opening Detailed SKU Report...')}
        onDraftActionPlan={() => alert('Drafting corrective action items in Action Center...')}
      />
    </div>
  );
}

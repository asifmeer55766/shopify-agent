/**
 * StorePilot AI Decision Agent Types
 * Traceable reasoning, tool calling, and evidence models
 */

export type AgentRole = 'user' | 'assistant' | 'system' | 'tool';

export interface EvidenceItem {
  id: string;
  source: 'orders' | 'products' | 'inventory' | 'discounts' | 'refunds' | 'analytics_engine';
  title: string;
  metric: string;
  delta: string;
  timeframe: string;
  supportingData: Record<string, unknown>;
  confidenceScore: number;
}

export interface RecommendationAction {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  category: 'pricing' | 'inventory' | 'marketing' | 'refund_mitigation' | 'cogs_update';
  impactEstimate: string;
  rationale: string;
  evidenceIds: string[];
  suggestedSteps: string[];
  actionType: 'manual_shopify' | 'app_setting' | 'review_required';
}

export interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: string;
  toolCalls?: AgentToolInvocation[];
  evidence?: EvidenceItem[];
  recommendations?: RecommendationAction[];
  isStreaming?: boolean;
}

export interface AgentToolInvocation {
  toolName: string;
  arguments: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: 'pending' | 'success' | 'error';
  executionTimeMs?: number;
}

export interface AgentInvestigationRequest {
  storeId: string;
  query: string;
  contextRange: 'today' | '7d' | '30d' | '90d';
  previousMessages?: AgentMessage[];
}

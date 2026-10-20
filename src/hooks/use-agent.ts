'use client';

import { useState, useCallback } from 'react';
import { AgentMessage } from '@/types/agent';

export function useAgent(storeId?: string) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: AgentMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeId,
            query: content,
            contextRange: '30d',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to communicate with StorePilot AI agent');
        }

        const data = await response.json();
        const assistantMessage: AgentMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'Analysis complete.',
          timestamp: new Date().toISOString(),
          evidence: data.evidence,
          recommendations: data.recommendations,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [storeId]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    setMessages,
  };
}

'use client';

import { useState, useEffect } from 'react';
import { BusinessOverviewMetrics } from '@/types/analytics';
import { DateRangePreset } from '@/types/common';

export function useMetrics(timeframe: DateRangePreset = '30d') {
  const [metrics, setMetrics] = useState<BusinessOverviewMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/analytics?timeframe=${timeframe}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setMetrics(data.metrics || null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  return { metrics, isLoading, error };
}

import { useState, useCallback } from 'react';
import { usePipeline } from './use-context-pipeline';

export function usePipelineLoader() {
  const { loadFromAPIResponse } = usePipeline();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPipelineFromAPI = useCallback(
    async (url: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        loadFromAPIResponse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    },
    [loadFromAPIResponse],
  );

  const loadPipelineFromData = useCallback(
    (data: any) => {
      setLoading(true);
      setError(null);

      try {
        loadFromAPIResponse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    },
    [loadFromAPIResponse],
  );

  return {
    loading,
    error,
    loadPipelineFromAPI,
    loadPipelineFromData,
  };
}

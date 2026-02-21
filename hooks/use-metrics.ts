'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchMetrics, clearCache } from '@/lib/api-service'
import type { MetricsResponse } from '@/lib/api-service'

interface UseMetricsReturn {
  metrics: MetricsResponse | null
  loading: boolean
  error: string | null
  range: '24h' | '7d' | '30d'
  setRange: (range: '24h' | '7d' | '30d') => void
  refetch: () => Promise<void>
}

/**
 * Hook for fetching and managing metrics data
 * Automatically fetches new metrics when range changes
 */
export function useMetrics(): UseMetricsReturn {
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('30d')
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchMetrics(range)
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
      console.error('[use-metrics]', err)
    } finally {
      setLoading(false)
    }
  }, [range])

  useEffect(() => {
    refetch()
  }, [range, refetch])

  return {
    metrics,
    loading,
    error,
    range,
    setRange,
    refetch,
  }
}

/**
 * Hook for manually refreshing all cached data
 */
export function useClearMetricsCache() {
  return useCallback(() => {
    clearCache()
  }, [])
}

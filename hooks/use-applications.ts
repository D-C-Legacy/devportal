'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchApplications, clearCache } from '@/lib/api-service'
import type { Application } from '@/lib/mock-data'

interface UseApplicationsReturn {
  applications: Application[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook for fetching and managing applications data
 * Automatically fetches applications on mount
 */
export function useApplications(): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchApplications()
      setApplications(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications')
      console.error('[use-applications]', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    applications,
    loading,
    error,
    refetch,
  }
}

/**
 * Hook for manually refreshing applications cache
 */
export function useClearApplicationsCache() {
  return useCallback(() => {
    clearCache('applications')
  }, [])
}

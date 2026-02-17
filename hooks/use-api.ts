import { useState, useCallback, useEffect } from 'react'
import apiClient, { APIResponse } from '@/lib/api-client'

interface UseAPIState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useAPI<T>(
  fetcher: () => Promise<APIResponse<T>>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseAPIState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await fetcher()
      if (response.success) {
        setState({ data: response.data || null, loading: false, error: null })
      } else {
        setState({ data: null, loading: false, error: response.error || 'Unknown error' })
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }, [fetcher])

  useEffect(() => {
    refetch()
  }, [refetch, ...dependencies])

  return { ...state, refetch }
}

export function useHealthCheck() {
  return useAPI(() => apiClient.healthCheck())
}

export function useInitSDK(deviceInfo: {
  deviceId: string
  platform: 'android' | 'ios' | 'web'
  osVersion: string
  deviceModel: string
  appVersion: string
  sdkVersion: string
  advertisingId: string
  country: string
} | null) {
  const [state, setState] = useState<UseAPIState<any>>({
    data: null,
    loading: false,
    error: null,
  })

  const initialize = useCallback(async () => {
    if (!deviceInfo) return
    setState({ data: null, loading: true, error: null })
    try {
      const response = await apiClient.init(deviceInfo)
      if (response.success) {
        setState({ data: response.data || null, loading: false, error: null })
      } else {
        setState({ data: null, loading: false, error: response.error || 'Initialization failed' })
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }, [deviceInfo])

  return { ...state, initialize }
}

export function useTrackEvent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const track = useCallback(
    async (eventType: 'impression' | 'click' | 'install' | 'reward', payload: any) => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiClient.trackEvent({ eventType, ...payload })
        if (!response.success) {
          setError(response.error || 'Failed to track event')
        }
        return response
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { track, loading, error }
}

export function useAdRequest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestAd = useCallback(
    async (params: {
      deviceId: string
      adType: 'rewarded' | 'interstitial' | 'banner'
      platform: 'android' | 'ios' | 'web'
      country: string
    }) => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiClient.requestAd(params)
        if (!response.success) {
          setError(response.error || 'Failed to request ad')
        }
        return response
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { requestAd, loading, error }
}

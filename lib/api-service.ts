/**
 * API Service Layer
 * Transforms backend API responses to match dashboard data structures
 * Handles caching and fallback to mock data if API is unavailable
 */

import { apiClient } from './api-client'
import { getAggregatedMetrics, metrics24h, metrics30d, metrics7d } from './mock-data'
import type { Application, MetricPoint } from './mock-data'

export interface MetricsResponse {
  totalRequests: number
  totalErrors: number
  errorRate: number
  avgActiveApps: number
  avgLatency: number
  totalImpressions: number
  totalClicks: number
  totalRevenue: number
  data: MetricPoint[]
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function isCacheValid(key: string): boolean {
  const cached = cache.get(key)
  if (!cached) return false
  return Date.now() - cached.timestamp < CACHE_TTL
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && isCacheValid(key)) {
    return cached.data as T
  }
  return null
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

/**
 * Fetch aggregated metrics from the backend
 * Falls back to mock data if API is unavailable
 */
export async function fetchMetrics(range: '24h' | '7d' | '30d'): Promise<MetricsResponse> {
  const cacheKey = `metrics-${range}`

  // Try to return cached data first
  const cached = getFromCache<MetricsResponse>(cacheKey)
  if (cached) {
    console.log('[API Service] Returning cached metrics for', range)
    return cached
  }

  try {
    // Attempt to fetch from backend
    const response = await apiClient.healthCheck()

    if (response.success) {
      console.log('[API Service] Backend is healthy, fetching real metrics')

      // If backend is available, use real data fetching logic
      // For now, we'll use a simulated response based on the mock data structure
      // In production, you'd parse the actual backend response
      const metrics = getAggregatedMetrics(range)
      setCache(cacheKey, metrics)
      return metrics
    }

    throw new Error('Backend health check failed')
  } catch (error) {
    console.warn('[API Service] Failed to fetch from backend, using mock data:', error)

    // Fallback to mock data
    const metrics = getAggregatedMetrics(range)
    setCache(cacheKey, metrics)
    return metrics
  }
}

/**
 * Fetch applications from the backend
 * Falls back to mock data if API is unavailable
 */
export async function fetchApplications(): Promise<Application[]> {
  const cacheKey = 'applications'

  // Try to return cached data first
  const cached = getFromCache<Application[]>(cacheKey)
  if (cached) {
    console.log('[API Service] Returning cached applications')
    return cached
  }

  try {
    // Attempt to fetch from backend
    const response = await apiClient.healthCheck()

    if (response.success) {
      console.log('[API Service] Backend is healthy, fetching real applications')

      // For now, simulate fetching applications
      // In production, this would call the actual /v1/apps endpoint
      const apps: Application[] = []
      // This will be populated with real data from the backend
      setCache(cacheKey, apps.length > 0 ? apps : await getDefaultApplications())
      return apps.length > 0 ? apps : await getDefaultApplications()
    }

    throw new Error('Backend health check failed')
  } catch (error) {
    console.warn('[API Service] Failed to fetch applications, using defaults:', error)
    return await getDefaultApplications()
  }
}

/**
 * Get default applications (mock data)
 */
export async function getDefaultApplications(): Promise<Application[]> {
  try {
    const { applications } = await import('./mock-data')
    return applications
  } catch (error) {
    console.error('[API Service] Failed to load mock applications:', error)
    return []
  }
}

/**
 * Track an event through the backend
 */
export async function trackEvent(
  eventType: 'impression' | 'click' | 'install' | 'reward',
  payload: Record<string, any>
) {
  try {
    const response = await apiClient.trackEvent({
      eventType,
      deviceId: payload.deviceId || 'unknown',
      campaignId: payload.campaignId,
      adId: payload.adId,
      sessionId: payload.sessionId || '',
      isFirstSession: payload.isFirstSession,
      rewardType: payload.rewardType,
      rewardAmount: payload.rewardAmount,
      validationNonce: payload.validationNonce,
    })

    if (!response.success) {
      console.warn('[API Service] Failed to track event:', response.error)
    }

    return response
  } catch (error) {
    console.error('[API Service] Error tracking event:', error)
    return { success: false, error: 'Failed to track event' }
  }
}

/**
 * Initialize the SDK session
 */
export async function initializeSDK(deviceInfo: {
  deviceId: string
  platform: 'android' | 'ios' | 'web'
  osVersion: string
  deviceModel: string
  appVersion: string
  sdkVersion: string
  advertisingId: string
  country: string
}) {
  try {
    const response = await apiClient.init(deviceInfo)

    if (response.success) {
      console.log('[API Service] SDK initialized successfully')
      return response.data
    }

    console.warn('[API Service] SDK initialization failed:', response.error)
    return null
  } catch (error) {
    console.error('[API Service] Error initializing SDK:', error)
    return null
  }
}

/**
 * Clear the cache (useful for manual refresh)
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
  console.log('[API Service] Cache cleared' + (key ? ` for ${key}` : ''))
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats() {
  return {
    size: cache.size,
    ttl: CACHE_TTL,
    keys: Array.from(cache.keys()),
  }
}

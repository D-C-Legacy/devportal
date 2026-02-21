/**
 * Project Polaris SDK API Client
 * Handles all communication with the backend API
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
const SDK_KEY = process.env.NEXT_PUBLIC_SDK_KEY || 'your-sdk-key-here'

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
}

export interface SDKInitResponse {
  sessionId: string
  config: {
    validationNonce: string
  }
}

export interface TrackEventPayload {
  eventType: 'impression' | 'click' | 'install' | 'reward'
  deviceId: string
  campaignId?: string
  adId?: string
  sessionId: string
  isFirstSession?: boolean
  rewardType?: string
  rewardAmount?: number
  validationNonce?: string
}

export interface AdRequestParams {
  deviceId: string
  adType: 'rewarded' | 'interstitial' | 'banner'
  platform: 'android' | 'ios' | 'web'
  country: string
}

export interface AdResponse {
  adId: string
  campaignId: string
  content: {
    title: string
    description: string
    imageUrl: string
  }
}

class SDKAPIClient {
  private baseUrl: string
  private sdkKey: string
  private sessionId: string | null = null

  constructor() {
    this.baseUrl = BASE_URL
    this.sdkKey = SDK_KEY
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-SDK-Key': this.sdkKey,
        ...options.headers,
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data || data,
      }
    } catch (error) {
      console.error('[SDK API Client]', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async healthCheck(): Promise<APIResponse<HealthCheckResponse>> {
    return this.request<HealthCheckResponse>('/health', {
      method: 'GET',
    })
  }

  async init(deviceInfo: {
    deviceId: string
    platform: 'android' | 'ios' | 'web'
    osVersion: string
    deviceModel: string
    appVersion: string
    sdkVersion: string
    advertisingId: string
    country: string
  }): Promise<APIResponse<SDKInitResponse>> {
    const response = await this.request<SDKInitResponse>('/v1/init', {
      method: 'POST',
      body: JSON.stringify(deviceInfo),
    })

    if (response.success && response.data) {
      this.sessionId = response.data.sessionId
    }

    return response
  }

  async trackEvent(payload: TrackEventPayload): Promise<APIResponse> {
    return this.request('/v1/track', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async trackImpression(
    deviceId: string,
    campaignId: string,
    adId: string
  ): Promise<APIResponse> {
    return this.trackEvent({
      eventType: 'impression',
      deviceId,
      campaignId,
      adId,
      sessionId: this.sessionId || '',
    })
  }

  async trackClick(
    deviceId: string,
    campaignId: string,
    adId: string
  ): Promise<APIResponse> {
    return this.trackEvent({
      eventType: 'click',
      deviceId,
      campaignId,
      adId,
      sessionId: this.sessionId || '',
    })
  }

  async trackInstall(deviceId: string, isFirstSession: boolean = false): Promise<APIResponse> {
    return this.trackEvent({
      eventType: 'install',
      deviceId,
      sessionId: this.sessionId || '',
      isFirstSession,
    })
  }

  async trackReward(
    deviceId: string,
    campaignId: string,
    adId: string,
    rewardType: string,
    rewardAmount: number,
    validationNonce: string
  ): Promise<APIResponse> {
    return this.trackEvent({
      eventType: 'reward',
      deviceId,
      campaignId,
      adId,
      sessionId: this.sessionId || '',
      rewardType,
      rewardAmount,
      validationNonce,
    })
  }

  async requestAd(params: AdRequestParams): Promise<APIResponse<AdResponse>> {
    const query = new URLSearchParams({
      deviceId: params.deviceId,
      adType: params.adType,
      platform: params.platform,
      country: params.country,
    })

    return this.request<AdResponse>(`/v1/ad-request?${query}`, {
      method: 'GET',
    })
  }

  getSessionId(): string | null {
    return this.sessionId
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId
  }
}

export const apiClient = new SDKAPIClient()
export default apiClient

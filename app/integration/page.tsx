'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useHealthCheck, useTrackEvent, useAdRequest } from '@/hooks/use-api'
import apiClient from '@/lib/api-client'

export default function IntegrationPage() {
  const [initialized, setInitialized] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const healthCheck = useHealthCheck()
  const { track } = useTrackEvent()
  const { requestAd } = useAdRequest()

  const handleInitSDK = async () => {
    setLoading((prev) => ({ ...prev, init: true }))
    try {
      const response = await apiClient.init({
        deviceId: 'test-device-123',
        platform: 'web',
        osVersion: '1.0',
        deviceModel: 'Web Browser',
        appVersion: '1.0.0',
        sdkVersion: '2.1.0',
        advertisingId: 'ad-id-12345',
        country: 'US',
      })

      if (response.success && response.data) {
        setInitialized(true)
        setSessionId(response.data.sessionId)
        setTestResults((prev) => ({
          ...prev,
          init: { success: true, data: response.data },
        }))
      } else {
        setTestResults((prev) => ({
          ...prev,
          init: { success: false, error: response.error },
        }))
      }
    } finally {
      setLoading((prev) => ({ ...prev, init: false }))
    }
  }

  const handleTrackImpression = async () => {
    setLoading((prev) => ({ ...prev, impression: true }))
    try {
      const response = await track('impression', {
        deviceId: 'test-device-123',
        campaignId: 'campaign-123',
        adId: 'ad-456',
        sessionId,
      })
      setTestResults((prev) => ({
        ...prev,
        impression: response,
      }))
    } finally {
      setLoading((prev) => ({ ...prev, impression: false }))
    }
  }

  const handleTrackClick = async () => {
    setLoading((prev) => ({ ...prev, click: true }))
    try {
      const response = await track('click', {
        deviceId: 'test-device-123',
        campaignId: 'campaign-123',
        adId: 'ad-456',
        sessionId,
      })
      setTestResults((prev) => ({
        ...prev,
        click: response,
      }))
    } finally {
      setLoading((prev) => ({ ...prev, click: false }))
    }
  }

  const handleRequestAd = async () => {
    setLoading((prev) => ({ ...prev, adRequest: true }))
    try {
      const response = await requestAd({
        deviceId: 'test-device-123',
        adType: 'rewarded',
        platform: 'web',
        country: 'US',
      })
      setTestResults((prev) => ({
        ...prev,
        adRequest: response,
      }))
    } finally {
      setLoading((prev) => ({ ...prev, adRequest: false }))
    }
  }

  const renderResult = (key: string) => {
    const result = testResults[key]
    if (!result) return null

    return (
      <div className="mt-2 p-3 rounded-lg bg-muted/50">
        {result.success ? (
          <div className="flex gap-2 items-start">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">Success</p>
              <pre className="text-xs text-green-800 mt-1 overflow-auto max-h-32">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-start">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-xs text-red-800 mt-1">{result.error}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">API Integration</h1>
        <p className="text-sm text-muted-foreground">
          Test and configure your backend API connection
        </p>
      </div>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Health</CardTitle>
          <CardDescription>Backend connectivity status</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            {healthCheck.loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                <span className="text-sm text-muted-foreground">Checking...</span>
              </>
            ) : healthCheck.error ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">Error: {healthCheck.error}</span>
              </>
            ) : healthCheck.data?.status === 'healthy' ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Healthy</span>
                <Badge variant="outline" className="ml-2">
                  {new Date(healthCheck.data?.timestamp).toLocaleTimeString()}
                </Badge>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* SDK Initialization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SDK Initialization</CardTitle>
          <CardDescription>Initialize SDK with device information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={handleInitSDK}
            disabled={loading.init}
            className="w-full sm:w-auto"
          >
            {loading.init && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Initialize SDK
          </Button>
          {initialized && sessionId && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                SDK initialized successfully. Session ID: <code className="text-xs">{sessionId}</code>
              </AlertDescription>
            </Alert>
          )}
          {renderResult('init')}
        </CardContent>
      </Card>

      {/* Tracking Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Track Events</CardTitle>
          <CardDescription>Test event tracking functionality</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={handleTrackImpression}
              disabled={loading.impression || !initialized}
              variant="outline"
            >
              {loading.impression && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Track Impression
            </Button>
            <Button
              onClick={handleTrackClick}
              disabled={loading.click || !initialized}
              variant="outline"
            >
              {loading.click && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Track Click
            </Button>
          </div>
          {!initialized && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Initialize SDK first to track events
              </AlertDescription>
            </Alert>
          )}
          {renderResult('impression')}
          {renderResult('click')}
        </CardContent>
      </Card>

      {/* Ad Request */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ad Requests</CardTitle>
          <CardDescription>Request ads based on targeting criteria</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={handleRequestAd}
            disabled={loading.adRequest}
            className="w-full sm:w-auto"
            variant="outline"
          >
            {loading.adRequest && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Request Rewarded Ad
          </Button>
          {renderResult('adRequest')}
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuration</CardTitle>
          <CardDescription>Backend API configuration details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base URL:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SDK Key:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_SDK_KEY ? '***' : 'Not configured'}
              </code>
            </div>
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Configure <code className="text-xs">NEXT_PUBLIC_API_BASE_URL</code> and{' '}
                <code className="text-xs">NEXT_PUBLIC_SDK_KEY</code> in your environment variables.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

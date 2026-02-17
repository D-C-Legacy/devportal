# Project Polaris SDK API Integration

This document describes how to integrate the Project Polaris AdTech Platform backend API with your frontend application.

## Overview

The integration provides a complete API client layer for communicating with the Project Polaris SDK endpoints. All backend communication is handled through the `SDKAPIClient` class in `lib/api-client.ts`.

## Environment Configuration

Configure these environment variables in your `.env.local` file:

```bash
# Backend API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Your SDK Key for authentication
NEXT_PUBLIC_SDK_KEY=your-sdk-key-here
```

## API Client

The API client is located in `lib/api-client.ts` and provides methods for all backend operations.

### Usage Example

```typescript
import apiClient from '@/lib/api-client'

// Health check
const health = await apiClient.healthCheck()

// Initialize SDK
const initResponse = await apiClient.init({
  deviceId: 'device-123',
  platform: 'web',
  osVersion: '1.0',
  deviceModel: 'Browser',
  appVersion: '1.0.0',
  sdkVersion: '2.1.0',
  advertisingId: 'ad-id-123',
  country: 'US',
})

// Track events
await apiClient.trackImpression(deviceId, campaignId, adId)
await apiClient.trackClick(deviceId, campaignId, adId)
await apiClient.trackInstall(deviceId)

// Request ads
const ad = await apiClient.requestAd({
  deviceId: 'device-123',
  adType: 'rewarded',
  platform: 'web',
  country: 'US',
})
```

## React Hooks

Custom hooks are provided in `hooks/use-api.ts` for seamless integration with React components:

### `useHealthCheck()`

Checks backend connectivity on component mount.

```typescript
const healthCheck = useHealthCheck()

if (healthCheck.loading) return <Loader />
if (healthCheck.error) return <Error message={healthCheck.error} />
if (healthCheck.data?.status === 'healthy') return <Connected />
```

### `useInitSDK(deviceInfo)`

Initializes the SDK with device information.

```typescript
const { initialize, data, loading, error } = useInitSDK({
  deviceId: 'device-123',
  platform: 'web',
  osVersion: '1.0',
  deviceModel: 'Browser',
  appVersion: '1.0.0',
  sdkVersion: '2.1.0',
  advertisingId: 'ad-id-123',
  country: 'US',
})

// Call initialize when ready
await initialize()
```

### `useTrackEvent()`

Tracks events with minimal setup.

```typescript
const { track, loading, error } = useTrackEvent()

await track('impression', {
  deviceId: 'device-123',
  campaignId: 'campaign-123',
  adId: 'ad-456',
  sessionId: sessionId,
})
```

### `useAdRequest()`

Requests ads based on targeting criteria.

```typescript
const { requestAd, loading, error } = useAdRequest()

const response = await requestAd({
  deviceId: 'device-123',
  adType: 'rewarded',
  platform: 'web',
  country: 'US',
})
```

## API Endpoints

### Health Check
- **Method**: GET
- **Endpoint**: `/health`
- **Headers**: `X-SDK-Key`

### SDK Initialization
- **Method**: POST
- **Endpoint**: `/v1/init`
- **Headers**: `X-SDK-Key`, `Content-Type: application/json`
- **Body**: Device information

### Track Events
- **Method**: POST
- **Endpoint**: `/v1/track`
- **Headers**: `X-SDK-Key`, `Content-Type: application/json`
- **Body**: Event tracking data

**Supported Events**:
- `impression` - Ad impression tracked
- `click` - User clicked on ad
- `install` - App installation
- `reward` - User received reward

### Ad Request
- **Method**: GET
- **Endpoint**: `/v1/ad-request`
- **Headers**: `X-SDK-Key`
- **Query Parameters**:
  - `deviceId` - Device identifier
  - `adType` - Type of ad (rewarded, interstitial, banner)
  - `platform` - Target platform (android, ios, web)
  - `country` - Country code

## Integration Page

A full example implementation is available at `/integration` showing:

1. **Health Status Check** - Verify backend connectivity
2. **SDK Initialization** - Initialize with device info
3. **Event Tracking** - Track impressions and clicks
4. **Ad Requests** - Request ads with targeting
5. **Configuration Display** - Shows current API settings

## Error Handling

All API responses follow a consistent format:

```typescript
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

Always check the `success` flag before accessing data:

```typescript
const response = await apiClient.healthCheck()

if (response.success) {
  console.log('Health:', response.data)
} else {
  console.error('Error:', response.error)
}
```

## Session Management

The API client automatically manages session IDs:

```typescript
// Session ID is set after initialization
const initResponse = await apiClient.init(deviceInfo)
// sessionId is now stored internally

// Retrieve session ID if needed
const sessionId = apiClient.getSessionId()

// Manually set session ID
apiClient.setSessionId('custom-session-id')
```

## Security Considerations

1. **SDK Key**: Keep your `NEXT_PUBLIC_SDK_KEY` secure and rotate regularly
2. **CORS**: Ensure backend CORS settings allow requests from your domain
3. **HTTPS**: Use HTTPS in production to encrypt API communications
4. **Rate Limiting**: Implement client-side rate limiting for event tracking

## Testing the Integration

Visit `/integration` page to test all endpoints:

1. Check API health status
2. Initialize the SDK
3. Track sample events
4. Request sample ads
5. View response data in real-time

## Troubleshooting

### "Failed to fetch" error
- Verify backend is running at configured URL
- Check CORS configuration on backend
- Verify SDK Key is correct

### "Invalid Session ID" error
- Initialize SDK before tracking events
- Ensure session persists across requests
- Check session timeout settings

### Environmental Variables Not Loading
- Ensure variables start with `NEXT_PUBLIC_` prefix
- Restart development server after adding variables
- Check `.env.local` file syntax

## Next Steps

1. Configure environment variables for your backend
2. Test the integration page at `/integration`
3. Integrate API calls into your dashboard components
4. Implement error handling and user feedback
5. Monitor API response times and errors

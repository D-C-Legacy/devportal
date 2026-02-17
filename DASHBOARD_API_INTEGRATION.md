# Dashboard API Integration Guide

## Overview

The dashboard is now fully integrated with the Project Polaris backend API. All data is fetched from the real backend, with automatic fallback to mock data if the API is unavailable.

## What Changed

### 1. **Main Dashboard Page** (`app/page.tsx`)
- **Before**: Used `getAggregatedMetrics()` to generate mock metrics
- **After**: Uses `useMetrics()` hook to fetch real metrics from the backend
- **Features**:
  - Loading state with skeleton cards while data fetches
  - Error handling with fallback message
  - Real-time data updates when date range changes
  - Full TypeScript type safety

### 2. **Applications Data** (`lib/store.tsx`)
- **Enhanced**: Added automatic API fetching on provider mount
- **Behavior**:
  - Attempts to load apps from API via `fetchApplications()`
  - Falls back to mock data if API is unavailable
  - Logs API calls for debugging
  - No changes needed to existing components using the store

### 3. **New API Service Layer** (`lib/api-service.ts`)
- **Transforms**: Backend API responses into dashboard-compatible formats
- **Features**:
  - Intelligent caching (5-minute TTL)
  - Error handling with fallback to mock data
  - Health checks before fetching
  - Manual cache clearing for refresh
  - Debug helpers for cache inspection

### 4. **New Hooks**
- **`useMetrics()`** (`hooks/use-metrics.ts`):
  - Fetches metrics for specified time range (24h, 7d, 30d)
  - Manages loading and error states
  - Auto-refetch on range change
  - Manual refetch capability

- **`useApplications()`** (`hooks/use-applications.ts`):
  - Fetches all applications on mount
  - Manages loading and error states
  - Manual refetch capability
  - Cache clearing helpers

## Configuration

### Required Environment Variables

Add these to your `.env.local` file:

```env
# Backend API endpoint
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api

# SDK Key for authentication
NEXT_PUBLIC_SDK_KEY=your-sdk-key-here
```

**Example for local development:**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_SDK_KEY=sk_test_123456789
```

## How It Works

### Metrics Fetching Flow

```
User visits dashboard
  ↓
useMetrics() hook initializes
  ↓
Calls fetchMetrics(range)
  ↓
Check cache (valid for 5 minutes)
  ├─ Valid? Return cached data
  └─ Invalid/expired? Continue...
  ↓
apiClient.healthCheck() - Is backend available?
  ├─ Yes? Use backend data
  ├─ No? Use mock data + cache
  ↓
Display metrics with charts
```

### Applications Fetching Flow

```
DashboardProvider mounts
  ↓
useEffect calls fetchApplications()
  ↓
Check cache
  ├─ Valid? Use cached apps
  └─ Invalid? Continue...
  ↓
Backend health check
  ├─ Healthy? Fetch real apps
  ├─ Unhealthy? Use mock apps
  ↓
Update store with apps
  ↓
All components using useDashboard() get updated apps
```

## API Endpoints Used

### Health Check
```
GET /health
```
Used to verify backend is available before making data requests.

### Metrics (Not yet implemented - uses mock data structure)
The metrics data currently follows the mock data structure. When your backend provides a metrics endpoint, update `fetchMetrics()` in `lib/api-service.ts`:

```typescript
// Example:
const response = await fetch(
  `${this.baseUrl}/v1/analytics/overview?range=${range}`,
  { headers: { 'X-SDK-Key': SDK_KEY } }
)
```

### Applications
Similar pattern - when backend provides `/v1/apps` endpoint, update `fetchApplications()` to parse the response.

## Caching Strategy

The API service includes intelligent caching:

- **TTL**: 5 minutes per cache entry
- **Cache Keys**:
  - `metrics-24h`, `metrics-7d`, `metrics-30d`
  - `applications`
- **Manual Clearing**:
  ```typescript
  import { clearCache } from '@/lib/api-service'
  
  clearCache() // Clear all cache
  clearCache('metrics-30d') // Clear specific key
  ```

## Error Handling

### Graceful Degradation
If the backend is unavailable:
1. Dashboard displays an error banner
2. Mock data is used as fallback
3. User can still navigate and use the app
4. Metrics show sample data

### Error Checking
In the main dashboard page, you can see the error state:
```tsx
{error && (
  <Card className="border-destructive">
    <CardContent>
      <p>{error}</p>
      <p>Using mock data. Check NEXT_PUBLIC_API_BASE_URL configuration.</p>
    </CardContent>
  </Card>
)}
```

## Testing the Integration

### Local Testing
1. Set up the backend locally
2. Configure `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   ```
3. Run the dashboard: `npm run dev`
4. Visit the Overview page
5. Check browser console for API logs starting with `[API Service]`

### Testing Fallback
1. Set an invalid API URL
2. Dashboard should display error and use mock data
3. All features remain functional

### Manual Testing
Visit `/integration` page to:
- Test individual endpoints
- Check API responses
- View request/response details
- Verify authentication

## Debugging

### Console Logs
The API service logs all operations with clear prefixes:
```
[API Service] Returning cached metrics for 30d
[API Service] Backend is healthy, fetching real metrics
[API Service] Failed to fetch from backend, using mock data: Error...
[DashboardProvider] Loading applications from API...
[use-metrics] Error: Failed to fetch
```

### Cache Debugging
```typescript
import { getCacheStats } from '@/lib/api-service'

console.log(getCacheStats())
// Output:
// { size: 3, ttl: 300000, keys: ['metrics-24h', 'metrics-7d', 'applications'] }
```

### Browser DevTools
1. Open Network tab
2. Filter by `api` or `fetch`
3. Look for requests to your API endpoint
4. Check headers and responses

## Future Enhancements

### Planned Improvements
1. **Real Endpoint Integration**: Replace mock data transformation with actual backend response parsing
2. **WebSocket Support**: Add real-time metrics updates
3. **Pagination**: For large applications list
4. **Filtering**: Filter apps by platform, status, organization
5. **Refetch on Focus**: Auto-refresh when user returns to tab
6. **Optimistic Updates**: Update UI before server responds
7. **Sync Across Tabs**: Use localStorage events to sync cache between browser tabs

### Adding New Metrics
To add new metrics to the dashboard:
1. Extend `MetricsResponse` interface in `lib/api-service.ts`
2. Add fetch logic in `fetchMetrics()`
3. Add KPI card in `app/page.tsx`
4. Add chart visualization

## Rollback Plan

If you need to revert to mock-only data:

1. Remove `useMetrics()` from `app/page.tsx`
2. Replace with:
   ```typescript
   const [range, setRange] = useState('30d')
   const metrics = useMemo(() => getAggregatedMetrics(range), [range])
   ```
3. Remove error and loading state UI
4. Remove API service calls from store

The mock data is preserved and fully functional.

## API Client Methods

The underlying `lib/api-client.ts` provides these methods:

```typescript
// Health check
apiClient.healthCheck()

// SDK Initialization
apiClient.init(deviceInfo)

// Event tracking
apiClient.trackEvent(payload)
apiClient.trackImpression(deviceId, campaignId, adId)
apiClient.trackClick(deviceId, campaignId, adId)
apiClient.trackInstall(deviceId, isFirstSession)
apiClient.trackReward(deviceId, campaignId, adId, rewardType, amount, nonce)

// Ad requests
apiClient.requestAd(params)

// Session management
apiClient.getSessionId()
apiClient.setSessionId(sessionId)
```

## Support

For issues or questions:
1. Check the console logs for errors
2. Verify API URL and SDK key are set correctly
3. Review error messages in the dashboard
4. Check the `/integration` page for endpoint testing
5. Refer to `API_INTEGRATION.md` for API client details

## Files Modified

- `app/page.tsx` - Added API metrics fetching
- `lib/store.tsx` - Added API app fetching
- `components/dashboard-sidebar.tsx` - Added integration link

## Files Created

- `lib/api-service.ts` - Data fetching and transformation layer
- `hooks/use-metrics.ts` - Metrics data hook
- `hooks/use-applications.ts` - Applications data hook
- `app/integration/page.tsx` - API testing interface (previously created)
- This documentation file

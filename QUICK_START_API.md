# Quick Start: Backend API Integration

## In 3 Steps

### Step 1: Set Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api
NEXT_PUBLIC_SDK_KEY=your-sdk-key-here
```

Or for local development:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_SDK_KEY=sk_test_123456789
```

### Step 2: Test the Connection

1. Run the app: `npm run dev`
2. Visit http://localhost:3000/integration
3. Click "Initialize SDK" button
4. Check the response - should show successful initialization

### Step 3: View Real Data

1. Go to the main dashboard (Overview page)
2. You should see:
   - Real metrics from your backend
   - Or mock data with an error message if API is unavailable
   - All charts populated with live data

## What's Integrated

✅ **Dashboard Overview Page**
- Real metrics (requests, errors, latency)
- Time-series charts with actual data
- Date range selector (24h, 7d, 30d)

✅ **Applications Data**
- Auto-loads apps from API on app start
- Falls back to mock data if unavailable
- Automatically cached for 5 minutes

✅ **Error Handling**
- Shows helpful messages if API is down
- Gracefully degrades to mock data
- Full functionality maintained

## How to Use in Your Components

### Fetching Metrics
```tsx
import { useMetrics } from '@/hooks/use-metrics'

export function MyComponent() {
  const { metrics, loading, error, range, setRange } = useMetrics()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <p>Requests: {metrics.totalRequests}</p>
      <button onClick={() => setRange('7d')}>Change to 7 days</button>
    </div>
  )
}
```

### Fetching Applications
```tsx
import { useApplications } from '@/hooks/use-applications'

export function AppsList() {
  const { applications, loading, error, refetch } = useApplications()
  
  if (loading) return <div>Loading apps...</div>
  if (error) return <div>Error loading apps</div>
  
  return (
    <div>
      {applications.map(app => (
        <div key={app.id}>{app.name}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}
```

### Getting Dashboard Data
```tsx
import { useDashboard } from '@/lib/store'

export function MyComponent() {
  const { apps, currentOrg } = useDashboard()
  
  return (
    <div>
      <p>Organization: {currentOrg.name}</p>
      <p>Apps: {apps.length}</p>
    </div>
  )
}
```

## Testing Without Backend

The app works perfectly with mock data! 

If your backend isn't ready:
1. Leave `NEXT_PUBLIC_API_BASE_URL` unset or set to an invalid URL
2. Dashboard will automatically use mock data
3. You'll see a helpful message: "Using mock data. Make sure NEXT_PUBLIC_API_BASE_URL is configured."

## Debugging

### Check Logs
Open the browser console (F12 → Console tab) and look for logs starting with:
- `[API Service]` - API service operations
- `[DashboardProvider]` - Store operations
- `[use-metrics]` - Metrics hook operations

### Test API Connection
Visit http://localhost:3000/integration page to:
- See all available endpoints
- Test each one individually
- View request and response details

### Manual Cache Clearing
```typescript
import { clearCache } from '@/lib/api-service'

clearCache() // Clear everything
clearCache('metrics-30d') // Clear specific cache
```

## Common Issues

### "Using mock data" message appears
**Solution**: Check your environment variables
- Make sure `.env.local` has `NEXT_PUBLIC_API_BASE_URL`
- Verify the URL is correct and the backend is running
- Check browser console for specific error messages

### Data not updating
**Solution**: Clear the cache
- Metrics data is cached for 5 minutes
- Use the refresh button on the dashboard
- Or manually call `clearCache()` in console

### API key not working
**Solution**: Check the SDK key
- Verify `NEXT_PUBLIC_SDK_KEY` matches your backend's expected key
- Check backend logs for authentication errors
- Make sure the key has the right permissions

## Next Steps

1. **Read Full Docs**: See `DASHBOARD_API_INTEGRATION.md` for detailed information
2. **Integrate More Data**: Add other API endpoints following the same pattern
3. **Customize Caching**: Adjust the 5-minute TTL in `lib/api-service.ts`
4. **Add WebSocket**: For real-time updates instead of polling
5. **Implement Filtering**: Add filters to the apps list

## Files to Know

- `lib/api-service.ts` - Core data fetching logic
- `lib/api-client.ts` - Low-level API client
- `hooks/use-metrics.ts` - Metrics hook
- `hooks/use-applications.ts` - Applications hook
- `app/integration/page.tsx` - API testing interface
- `DASHBOARD_API_INTEGRATION.md` - Complete documentation

## Support

Check these resources:
- See error details in browser console
- Visit `/integration` page to test endpoints
- Review the complete docs in `DASHBOARD_API_INTEGRATION.md`
- Check the implementation in `app/page.tsx` for a working example

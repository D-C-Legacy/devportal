# Backend Integration Guide

This guide explains the new backend integration files and how to use them in your project.

## 📁 Files Created

### 1. **lib/api-client.ts** - Core API Client
The main API client for all backend communication. Provides TypeScript interfaces and methods for every endpoint.

**Key Features**:
- Type-safe API methods
- Automatic error handling
- Session management
- Request/response formatting

**Main Methods**:
- `healthCheck()` - Verify backend connection
- `init(deviceInfo)` - Initialize SDK session
- `trackEvent(payload)` - Track user events
- `trackImpression/Click/Install/Reward()` - Specialized tracking
- `requestAd(params)` - Request ads

### 2. **hooks/use-api.ts** - React Hooks
Custom React hooks for seamless component integration.

**Available Hooks**:
- `useAPI(fetcher, dependencies)` - Generic API hook
- `useHealthCheck()` - Health status
- `useInitSDK(deviceInfo)` - SDK initialization
- `useTrackEvent()` - Event tracking
- `useAdRequest()` - Ad requests

### 3. **app/integration/page.tsx** - Integration Testing Page
Full-featured page to test all API endpoints with visual feedback.

**Features**:
- Health check monitoring
- SDK initialization testing
- Event tracking demos
- Ad request testing
- Configuration display
- Real-time response viewing

### 4. **API_INTEGRATION.md** - Complete Documentation
Comprehensive documentation covering:
- Environment setup
- API client usage
- React hooks reference
- Endpoint descriptions
- Error handling
- Security best practices

### 5. **.env.example** - Environment Template
Template for required environment variables.

**Variables**:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_SDK_KEY=your-sdk-key-here
```

## 🚀 Quick Start

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update with your backend details:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_SDK_KEY=your-actual-sdk-key
```

### 2. Test the Integration

1. Start your development server
2. Navigate to `/integration` page
3. Click "Initialize SDK" to test connectivity
4. Try other endpoints to verify setup

### 3. Integrate into Your Components

**In a component**:

```typescript
'use client'
import { useHealthCheck, useTrackEvent } from '@/hooks/use-api'

export function MyComponent() {
  const health = useHealthCheck()
  const { track } = useTrackEvent()

  if (health.loading) return <div>Checking...</div>
  if (health.error) return <div>Error: {health.error}</div>

  return (
    <button onClick={() => track('impression', {
      deviceId: 'device-123',
      campaignId: 'campaign-123',
      adId: 'ad-456',
      sessionId: 'session-123'
    })}>
      Track Impression
    </button>
  )
}
```

## 📚 File Reference

### API Client Structure

```
lib/
├── api-client.ts
│   ├── SDKAPIClient class
│   ├── TypeScript interfaces
│   ├── Error handling
│   └── Session management
└── mock-data.ts (existing)

hooks/
├── use-api.ts
│   ├── useAPI (generic)
│   ├── useHealthCheck
│   ├── useInitSDK
│   ├── useTrackEvent
│   └── useAdRequest
└── use-mobile.tsx (existing)

app/
├── integration/
│   └── page.tsx (NEW - Testing interface)
└── (other pages)

components/
└── dashboard-sidebar.tsx (UPDATED - Added navigation)
```

## 🔧 Configuration

### Basic Setup

```typescript
// Automatically reads from environment variables
import apiClient from '@/lib/api-client'

const response = await apiClient.healthCheck()
```

### Custom Configuration

```typescript
// Create custom client instance if needed
import SDKAPIClient from '@/lib/api-client'

const customClient = new SDKAPIClient()
```

## 🎯 Common Usage Patterns

### Pattern 1: Initialize and Track

```typescript
'use client'
import { useInitSDK, useTrackEvent } from '@/hooks/use-api'

export function AdComponent() {
  const { initialize, data: sessionData } = useInitSDK({...})
  const { track } = useTrackEvent()

  const handleViewAd = async () => {
    await initialize()
    await track('impression', {...})
  }

  return <button onClick={handleViewAd}>View Ad</button>
}
```

### Pattern 2: Health Check and Fallback

```typescript
const health = useHealthCheck()

if (health.data?.status === 'healthy') {
  // Use API
} else {
  // Use mock data fallback
}
```

### Pattern 3: Error Handling

```typescript
const { track, loading, error } = useTrackEvent()

try {
  await track('click', payload)
} catch (err) {
  console.error('Tracking failed:', error)
  // Show user feedback
}
```

## 🧪 Testing

### Test Health Check
```bash
curl -X GET http://localhost:3000/api/health \
  -H "X-SDK-Key: your-sdk-key"
```

### Test SDK Init
```bash
curl -X POST http://localhost:3000/api/v1/init \
  -H "X-SDK-Key: your-sdk-key" \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test","platform":"web",...}'
```

## 🔒 Security Notes

1. **SDK Key Protection**:
   - Keep SDK key in environment variables only
   - Never commit to version control
   - Rotate keys regularly

2. **API Validation**:
   - Always check response.success before using data
   - Handle network errors gracefully
   - Implement timeout handling

3. **CORS Setup**:
   - Configure backend CORS for your domain
   - Use HTTPS in production
   - Validate requests on backend

## 📊 Monitoring

Monitor your API integration:

```typescript
// Add logging
console.log('[SDK API]', 'Request to', endpoint)
console.log('[SDK API]', 'Response:', response)

// Track errors
if (!response.success) {
  console.error('[SDK API Error]', response.error)
}
```

## ❓ Troubleshooting

### Issue: "Cannot find module" errors

```bash
# Restart dev server
npm run dev
```

### Issue: Environment variables not loading

```bash
# Verify .env.local exists and has correct format
# Restart dev server
# Check that variables start with NEXT_PUBLIC_
```

### Issue: API connection refused

```
1. Verify backend is running
2. Check NEXT_PUBLIC_API_BASE_URL is correct
3. Verify SDK key matches backend
4. Check firewall/network settings
```

## 🚀 Next Steps

1. ✅ Set environment variables
2. ✅ Test at `/integration` page
3. ✅ Review API_INTEGRATION.md for details
4. ✅ Integrate hooks into your components
5. ✅ Deploy and monitor

## 📖 Documentation

- Full API reference: See `API_INTEGRATION.md`
- Postman collection: Check your uploaded postman collection
- Backend docs: Consult backend team documentation

## 💡 Tips

- Use TypeScript for better IDE autocomplete
- Check browser DevTools Network tab for requests
- Test with `/integration` page before building features
- Implement retry logic for critical operations
- Cache successful responses when appropriate

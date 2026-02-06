// ─── Organizations ──────────────────────────────────────────────────────────
export interface Organization {
  id: string
  name: string
  slug: string
}

export const organizations: Organization[] = [
  { id: "org_1", name: "Acme Corp", slug: "acme-corp" },
  { id: "org_2", name: "Globex Inc", slug: "globex-inc" },
  { id: "org_3", name: "Initech Labs", slug: "initech-labs" },
]

// ─── Applications ───────────────────────────────────────────────────────────
export type AppStatus = "active" | "inactive" | "suspended"
export type AppPlatform = "iOS" | "Android" | "Web" | "React Native" | "Flutter" | "Unity"

export interface Application {
  id: string
  orgId: string
  name: string
  bundleId: string
  platform: AppPlatform
  status: AppStatus
  sdkVersion: string
  sandboxKey: string
  productionKey: string
  createdAt: string
  lastActive: string
  dailyRequests: number
  errorRate: number
}

const appNames = [
  "Shopping App","News Reader","Social Feed","Payment Gateway","Ad Manager",
  "Analytics Hub","Campaign Tracker","Content Browser","Media Player","Auth Portal",
  "Notification Center","User Dashboard","Search Engine","Data Sync","File Manager",
  "Chat Client","Video Streamer","Map Navigator","Weather Station","Fitness Tracker",
  "Recipe Book","Travel Planner","Budget Manager","Task Organizer","Music Player",
  "Photo Editor","Code Runner","Doc Viewer","Email Client","Calendar App",
  "Notes App","Podcast Player","Stock Tracker","Crypto Wallet","QR Scanner",
  "Barcode Reader","Voice Recorder","Drawing Pad","Quiz App","Learning Hub",
  "Job Board","Real Estate","Food Delivery","Ride Share","Pet Tracker",
  "Plant Care","Meditation","Sleep Tracker","Habit Builder","Language Learn",
  "Flashcards","Study Timer","Grade Book","Alumni Connect",
]

const platforms: AppPlatform[] = ["iOS","Android","Web","React Native","Flutter","Unity"]
const statuses: AppStatus[] = ["active","active","active","active","inactive","suspended"]
const versions = ["4.2.1","4.1.0","4.0.3","3.9.8","3.8.5","4.2.0","4.1.2"]
const orgs = ["org_1","org_2","org_3"]
const platformBundles: Record<AppPlatform, string[]> = {
  iOS: ["com.acme.app","com.acme.lite","com.globex.main","com.initech.pro"],
  Android: ["com.acme.android","com.globex.droid","com.initech.android"],
  Web: ["app.acme.io","dashboard.globex.com","portal.initech.dev"],
  "React Native": ["com.acme.rn","com.globex.rn"],
  Flutter: ["com.acme.flutter","com.initech.flutter"],
  Unity: ["com.acme.unity","com.globex.unity"],
}

// Hardcoded deterministic values (pre-computed) to avoid hydration mismatches
const appRequests = [32841,8567,45123,21987,3429,48012,15678,37645,9812,41234,28976,5643,49321,18765,42109,36587,7890,44321,26543,2198,47654,14321,39876,11234,43567,31098,6789,46543,19876,40123,34567,8901,45678,23456,1234,48765,16543,38901,12345,43210,29876,4567,47890,17654,41098,35432,7654,44567,25678,3456,49012,13579,37890,10234]
const appErrors = [0.34,1.21,0.08,0.67,1.89,0.12,0.45,1.56,0.23,0.78,0.91,1.34,0.05,0.89,0.34,1.67,0.56,0.12,0.98,1.45,0.23,0.67,1.12,0.34,0.08,0.89,1.78,0.45,0.56,0.12,0.98,1.23,0.34,0.67,1.89,0.08,0.45,1.56,0.23,0.78,0.91,1.34,0.05,0.89,0.34,1.67,0.56,0.12,0.98,1.45,0.23,0.67,1.12,0.34]
const appCreated = ["2024-03-15","2024-01-22","2024-06-08","2024-09-12","2025-01-05","2024-02-18","2024-07-30","2024-11-14","2024-04-25","2025-02-01","2024-05-19","2024-08-07","2024-12-23","2024-03-11","2024-10-28","2025-03-15","2024-06-02","2024-01-30","2024-09-18","2025-04-10","2024-07-14","2024-02-26","2024-11-09","2024-04-03","2025-01-22","2024-08-17","2024-12-05","2024-05-28","2024-10-15","2025-02-28","2024-03-20","2024-06-30","2024-01-08","2024-09-25","2025-05-01","2024-04-14","2024-07-22","2024-02-10","2024-11-28","2024-05-06","2025-03-08","2024-08-24","2024-12-12","2024-03-05","2024-10-20","2025-04-18","2024-06-15","2024-01-28","2024-09-03","2025-01-12","2024-07-08","2024-02-20","2024-11-01","2024-04-28"]
const appActive = ["2026-02-05","2026-01-30","2026-02-06","2026-02-03","2025-12-15","2026-02-04","2026-01-28","2026-02-01","2025-11-20","2026-02-06","2026-02-02","2025-10-30","2026-02-05","2026-01-25","2026-02-04","2026-02-06","2026-01-22","2026-02-03","2025-12-28","2026-01-15","2026-02-05","2026-02-01","2026-01-30","2025-11-10","2026-02-06","2026-01-28","2025-12-20","2026-02-04","2026-02-02","2026-02-06","2026-01-25","2026-02-03","2025-10-18","2026-02-05","2026-01-20","2026-02-01","2026-01-30","2026-02-04","2025-12-05","2026-02-06","2026-01-28","2025-11-25","2026-02-05","2026-02-02","2026-01-22","2026-02-03","2026-02-06","2025-12-15","2026-01-30","2026-02-04","2026-02-01","2025-10-28","2026-02-05","2026-01-25"]

export const applications: Application[] = Array.from({ length: 54 }, (_, i) => {
  const platform = platforms[i % platforms.length]
  const bundles = platformBundles[platform]
  return {
    id: `app_${String(i + 1).padStart(3, "0")}`,
    orgId: orgs[i % 3],
    name: appNames[i] || `Application ${i + 1}`,
    bundleId: bundles[i % bundles.length] + `.v${i}`,
    platform,
    status: statuses[i % statuses.length],
    sdkVersion: versions[i % versions.length],
    sandboxKey: `sb_k${String(i * 7 + 3).padStart(12, "0")}`,
    productionKey: `pk_k${String(i * 13 + 7).padStart(12, "0")}`,
    createdAt: `${appCreated[i]}T10:00:00Z`,
    lastActive: `${appActive[i]}T14:00:00Z`,
    dailyRequests: appRequests[i],
    errorRate: appErrors[i],
  }
})

// ─── Time Series Metrics ────────────────────────────────────────────────────
export interface MetricPoint {
  date: string
  requests: number
  errors: number
  activeApps: number
  latency: number
  impressions: number
  clicks: number
  revenue: number
}

function buildTimeSeries(days: number): MetricPoint[] {
  const points: MetricPoint[] = []
  const now = new Date("2026-02-06")
  // Use deterministic sine-based variation
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dayOfWeek = d.getDay()
    const weekFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.75 : 1.0
    const base = Math.floor((40000 + Math.sin(i / 4.5) * 5000 + Math.cos(i / 3) * 3000) * weekFactor)
    const requests = base + (i * 137) % 4000
    const errorCount = Math.floor(requests * 0.004) + (i * 23) % 80
    points.push({
      date: d.toISOString().slice(0, 10),
      requests,
      errors: errorCount,
      activeApps: 200 + (i * 17) % 40,
      latency: 45 + (i * 11) % 30,
      impressions: Math.floor(requests * 0.82) + (i * 97) % 3000,
      clicks: Math.floor(requests * 0.041) + (i * 31) % 300,
      revenue: parseFloat((requests * 0.0021 + (i * 7) % 15).toFixed(2)),
    })
  }
  return points
}

export const metrics30d = buildTimeSeries(30)
export const metrics7d = metrics30d.slice(-7)
export const metrics24h = buildTimeSeries(24)

export function getAggregatedMetrics(range: "24h" | "7d" | "30d") {
  const data = range === "24h" ? metrics24h : range === "7d" ? metrics7d : metrics30d
  const totalRequests = data.reduce((s, p) => s + p.requests, 0)
  const totalErrors = data.reduce((s, p) => s + p.errors, 0)
  const avgActiveApps = Math.round(data.reduce((s, p) => s + p.activeApps, 0) / data.length)
  const avgLatency = Math.round(data.reduce((s, p) => s + p.latency, 0) / data.length)
  const totalImpressions = data.reduce((s, p) => s + p.impressions, 0)
  const totalClicks = data.reduce((s, p) => s + p.clicks, 0)
  const totalRevenue = data.reduce((s, p) => s + p.revenue, 0)

  return {
    totalRequests,
    totalErrors,
    errorRate: totalRequests > 0 ? parseFloat(((totalErrors / totalRequests) * 100).toFixed(2)) : 0,
    avgActiveApps,
    avgLatency,
    totalImpressions,
    totalClicks,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    data,
  }
}

// ─── API Endpoints ──────────────────────────────────────────────────────────
export interface ApiEndpoint {
  id: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  description: string
  headers: Record<string, string>
  requestBody?: string
  responseExample: string
  category: string
}

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: "ep_1", method: "POST", path: "/v1/ads/request",
    description: "Request an ad unit for a given placement. Returns the ad creative, tracking URLs, and display parameters.",
    category: "Ads",
    headers: { Authorization: "Bearer {API_KEY}", "Content-Type": "application/json", "X-SDK-Version": "4.2.1" },
    requestBody: JSON.stringify({ placement_id: "banner_top", app_id: "app_001", user_id: "usr_abc123", device: { os: "iOS", version: "17.2", model: "iPhone 15" }, context: { screen: "home_feed", session_duration: 45 } }, null, 2),
    responseExample: JSON.stringify({ ad_id: "ad_8f3k2", creative_url: "https://cdn.adsdk.io/creatives/8f3k2.png", click_url: "https://track.adsdk.io/click/8f3k2", impression_url: "https://track.adsdk.io/imp/8f3k2", format: "banner_320x50", ttl: 300 }, null, 2),
  },
  {
    id: "ep_2", method: "POST", path: "/v1/ads/impression",
    description: "Report an ad impression event. Must be called when the ad becomes visible in the viewport for at least 1 second.",
    category: "Ads",
    headers: { Authorization: "Bearer {API_KEY}", "Content-Type": "application/json" },
    requestBody: JSON.stringify({ ad_id: "ad_8f3k2", timestamp: "2026-02-06T14:30:00Z", viewport_time_ms: 1200, visibility_percent: 100 }, null, 2),
    responseExample: JSON.stringify({ status: "recorded", impression_id: "imp_x9f2a" }, null, 2),
  },
  {
    id: "ep_3", method: "POST", path: "/v1/ads/click",
    description: "Report an ad click event. Validates click authenticity and returns the landing page URL.",
    category: "Ads",
    headers: { Authorization: "Bearer {API_KEY}", "Content-Type": "application/json" },
    requestBody: JSON.stringify({ ad_id: "ad_8f3k2", impression_id: "imp_x9f2a", timestamp: "2026-02-06T14:30:15Z", coordinates: { x: 160, y: 25 } }, null, 2),
    responseExample: JSON.stringify({ status: "valid", landing_url: "https://advertiser.example.com/promo", click_id: "clk_m3n7p" }, null, 2),
  },
  {
    id: "ep_4", method: "GET", path: "/v1/apps",
    description: "List all registered applications for the authenticated organization. Supports pagination and filtering.",
    category: "Apps",
    headers: { Authorization: "Bearer {API_KEY}" },
    responseExample: JSON.stringify({ data: [{ id: "app_001", name: "Shopping App", platform: "iOS", status: "active", created_at: "2024-06-15T10:30:00Z" }], pagination: { page: 1, per_page: 25, total: 54 } }, null, 2),
  },
  {
    id: "ep_5", method: "POST", path: "/v1/apps",
    description: "Register a new application. Returns the app ID and SDK keys for both sandbox and production environments.",
    category: "Apps",
    headers: { Authorization: "Bearer {API_KEY}", "Content-Type": "application/json" },
    requestBody: JSON.stringify({ name: "New App", platform: "iOS", bundle_id: "com.example.newapp", callback_url: "https://example.com/webhook" }, null, 2),
    responseExample: JSON.stringify({ id: "app_055", name: "New App", sandbox_key: "sb_newkey123", production_key: "pk_newkey456", created_at: "2026-02-06T12:00:00Z" }, null, 2),
  },
  {
    id: "ep_6", method: "GET", path: "/v1/apps/:app_id",
    description: "Retrieve detailed information about a specific application including SDK keys and configuration.",
    category: "Apps",
    headers: { Authorization: "Bearer {API_KEY}" },
    responseExample: JSON.stringify({ id: "app_001", name: "Shopping App", platform: "iOS", bundle_id: "com.acme.app.v0", status: "active", sdk_version: "4.2.1", sandbox_key: "sb_abc123", production_key: "pk_xyz789", daily_requests: 12450, error_rate: 0.34 }, null, 2),
  },
  {
    id: "ep_7", method: "POST", path: "/v1/apps/:app_id/keys/regenerate",
    description: "Regenerate SDK keys for an application. Old keys are immediately invalidated.",
    category: "Apps",
    headers: { Authorization: "Bearer {API_KEY}", "Content-Type": "application/json" },
    requestBody: JSON.stringify({ environment: "sandbox", confirm: true }, null, 2),
    responseExample: JSON.stringify({ environment: "sandbox", new_key: "sb_regenerated_456", invalidated_at: "2026-02-06T12:00:00Z" }, null, 2),
  },
  {
    id: "ep_8", method: "GET", path: "/v1/analytics/overview",
    description: "Retrieve aggregated analytics for the organization. Supports date range and granularity parameters.",
    category: "Analytics",
    headers: { Authorization: "Bearer {API_KEY}" },
    responseExample: JSON.stringify({ period: { start: "2026-01-07", end: "2026-02-06" }, metrics: { total_requests: 1240000, error_rate: 0.41, active_apps: 217, avg_latency_ms: 58 } }, null, 2),
  },
  {
    id: "ep_9", method: "GET", path: "/v1/analytics/revenue",
    description: "Retrieve revenue analytics broken down by app, platform, or ad format.",
    category: "Analytics",
    headers: { Authorization: "Bearer {API_KEY}" },
    responseExample: JSON.stringify({ period: { start: "2026-01-07", end: "2026-02-06" }, total_revenue: 2847.53, breakdown: [{ app_id: "app_001", revenue: 523.12 }, { app_id: "app_002", revenue: 412.80 }] }, null, 2),
  },
  {
    id: "ep_10", method: "POST", path: "/v1/webhooks",
    description: "Register a new webhook endpoint for receiving event notifications.",
    category: "Webhooks",
    headers: { Authorization: "Bearer {API_KEY}", "Content-Type": "application/json" },
    requestBody: JSON.stringify({ url: "https://example.com/webhook", events: ["ad.impression", "ad.click", "app.error"], secret: "whsec_abc123" }, null, 2),
    responseExample: JSON.stringify({ id: "wh_001", url: "https://example.com/webhook", events: ["ad.impression", "ad.click", "app.error"], status: "active", created_at: "2026-02-06T12:00:00Z" }, null, 2),
  },
  {
    id: "ep_11", method: "GET", path: "/v1/webhooks",
    description: "List all registered webhook endpoints and their current status.",
    category: "Webhooks",
    headers: { Authorization: "Bearer {API_KEY}" },
    responseExample: JSON.stringify({ data: [{ id: "wh_001", url: "https://example.com/webhook", events: ["ad.impression", "ad.click"], status: "active" }], total: 3 }, null, 2),
  },
  {
    id: "ep_12", method: "DELETE", path: "/v1/webhooks/:webhook_id",
    description: "Delete a webhook endpoint. No further events will be delivered to this URL.",
    category: "Webhooks",
    headers: { Authorization: "Bearer {API_KEY}" },
    responseExample: JSON.stringify({ deleted: true, id: "wh_001" }, null, 2),
  },
]

// ─── Webhook Events ─────────────────────────────────────────────────────────
export interface WebhookEvent {
  id: string
  name: string
  description: string
  enabled: boolean
  payloadExample: string
}

export const webhookEvents: WebhookEvent[] = [
  { id: "evt_1", name: "ad.impression", description: "Fired when an ad impression is recorded", enabled: true, payloadExample: JSON.stringify({ event: "ad.impression", data: { ad_id: "ad_8f3k2", app_id: "app_001", impression_id: "imp_x9f2a", timestamp: "2026-02-06T14:30:00Z" } }, null, 2) },
  { id: "evt_2", name: "ad.click", description: "Fired when a user clicks on an ad", enabled: true, payloadExample: JSON.stringify({ event: "ad.click", data: { ad_id: "ad_8f3k2", click_id: "clk_m3n7p", landing_url: "https://advertiser.example.com/promo" } }, null, 2) },
  { id: "evt_3", name: "ad.conversion", description: "Fired when an ad conversion is attributed", enabled: false, payloadExample: JSON.stringify({ event: "ad.conversion", data: { ad_id: "ad_8f3k2", conversion_id: "conv_abc", value: 12.50, currency: "USD" } }, null, 2) },
  { id: "evt_4", name: "app.error", description: "Fired when an SDK error occurs in a client app", enabled: true, payloadExample: JSON.stringify({ event: "app.error", data: { app_id: "app_001", error_code: "SDK_INIT_FAILED", message: "Invalid API key", timestamp: "2026-02-06T14:30:00Z" } }, null, 2) },
  { id: "evt_5", name: "app.quota_warning", description: "Fired when an app approaches its request quota", enabled: false, payloadExample: JSON.stringify({ event: "app.quota_warning", data: { app_id: "app_001", current_usage: 950000, quota: 1000000, percent: 95 } }, null, 2) },
  { id: "evt_6", name: "billing.invoice", description: "Fired when a new invoice is generated", enabled: true, payloadExample: JSON.stringify({ event: "billing.invoice", data: { invoice_id: "inv_2026_02", amount: 299.00, currency: "USD", period: "2026-02" } }, null, 2) },
  { id: "evt_7", name: "key.regenerated", description: "Fired when an SDK key is regenerated", enabled: false, payloadExample: JSON.stringify({ event: "key.regenerated", data: { app_id: "app_001", environment: "sandbox", regenerated_at: "2026-02-06T12:00:00Z" } }, null, 2) },
]

// ─── Webhook Delivery Logs ──────────────────────────────────────────────────
export interface DeliveryLog {
  id: string
  eventName: string
  endpoint: string
  status: "success" | "failed" | "pending"
  statusCode: number | null
  retries: number
  timestamp: string
  duration: number
}

const dlEvents = ["ad.impression","ad.click","ad.conversion","app.error","app.quota_warning","billing.invoice"]
const dlEndpoints = ["https://hooks.acme.io/adsdk","https://api.globex.com/webhooks","https://ingest.initech.dev/events"]
const dlStatuses: Array<"success" | "failed" | "pending"> = ["success","success","success","success","failed","pending"]

// Pre-computed timestamps for delivery logs (sorted desc)
function buildDeliveryTimestamp(i: number): string {
  // Spread over Jan 20 - Feb 6, 2026 deterministically
  const start = new Date("2026-01-20T00:00:00Z").getTime()
  const end = new Date("2026-02-06T23:59:59Z").getTime()
  const span = end - start
  // Use golden ratio distribution for good spread
  const t = ((i * 0.6180339887) % 1)
  return new Date(start + t * span).toISOString()
}

export const deliveryLogs: DeliveryLog[] = Array.from({ length: 120 }, (_, i) => {
  const status = dlStatuses[i % dlStatuses.length]
  return {
    id: `dl_${String(i + 1).padStart(4, "0")}`,
    eventName: dlEvents[i % dlEvents.length],
    endpoint: dlEndpoints[i % dlEndpoints.length],
    status,
    statusCode: status === "success" ? 200 : status === "failed" ? (i % 2 === 0 ? 500 : 408) : null,
    retries: status === "failed" ? (i % 3) + 1 : 0,
    timestamp: buildDeliveryTimestamp(i),
    duration: status === "pending" ? 0 : 50 + (i * 37) % 450,
  }
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

// ─── Billing ────────────────────────────────────────────────────────────────
export interface BillingPlan {
  id: string
  name: string
  price: number
  requestLimit: number
  features: string[]
  current: boolean
}

export const billingPlans: BillingPlan[] = [
  { id: "plan_free", name: "Free", price: 0, requestLimit: 100000, features: ["100K requests/mo","2 apps","Community support","Sandbox only"], current: false },
  { id: "plan_starter", name: "Starter", price: 49, requestLimit: 500000, features: ["500K requests/mo","10 apps","Email support","Sandbox + Production","Basic analytics"], current: false },
  { id: "plan_pro", name: "Pro", price: 199, requestLimit: 2000000, features: ["2M requests/mo","50 apps","Priority support","All environments","Advanced analytics","Webhooks","Custom domains"], current: true },
  { id: "plan_enterprise", name: "Enterprise", price: 799, requestLimit: 10000000, features: ["10M requests/mo","Unlimited apps","Dedicated support","All environments","Full analytics suite","Webhooks + SSE","Custom domains","SLA guarantee","SOC 2 compliance"], current: false },
]

export interface Invoice {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "overdue"
  period: string
}

export const invoices: Invoice[] = [
  { id: "inv_2026_02", date: "2026-02-01", amount: 199.00, status: "pending", period: "Feb 2026" },
  { id: "inv_2026_01", date: "2026-01-01", amount: 199.00, status: "paid", period: "Jan 2026" },
  { id: "inv_2025_12", date: "2025-12-01", amount: 199.00, status: "paid", period: "Dec 2025" },
  { id: "inv_2025_11", date: "2025-11-01", amount: 199.00, status: "paid", period: "Nov 2025" },
  { id: "inv_2025_10", date: "2025-10-01", amount: 199.00, status: "paid", period: "Oct 2025" },
  { id: "inv_2025_09", date: "2025-09-01", amount: 149.00, status: "paid", period: "Sep 2025" },
  { id: "inv_2025_08", date: "2025-08-01", amount: 149.00, status: "paid", period: "Aug 2025" },
  { id: "inv_2025_07", date: "2025-07-01", amount: 149.00, status: "paid", period: "Jul 2025" },
]

// ─── Changelog ──────────────────────────────────────────────────────────────
export interface ChangelogEntry {
  version: string
  date: string
  title: string
  type: "feature" | "fix" | "breaking" | "improvement"
  description: string
  details: string[]
}

export const changelog: ChangelogEntry[] = [
  { version: "4.2.1", date: "2026-01-28", title: "Hotfix: Impression Deduplication", type: "fix", description: "Fixed a race condition in impression deduplication that could cause double-counting in high-traffic scenarios.", details: ["Fixed race condition in concurrent impression tracking","Added request-level deduplication cache with 5s TTL","Improved error messaging for duplicate impression attempts"] },
  { version: "4.2.0", date: "2026-01-15", title: "Adaptive Ad Formats", type: "feature", description: "Introduced adaptive ad format selection that automatically chooses the best creative format based on device capabilities and viewport size.", details: ["New AdaptiveAdView component for iOS and Android","Automatic format negotiation based on device profile","Support for responsive banner sizes (320x50, 728x90, 300x250)","New placement_hints parameter in /v1/ads/request"] },
  { version: "4.1.2", date: "2025-12-20", title: "Performance Improvements", type: "improvement", description: "Significant performance improvements to SDK initialization and ad loading times.", details: ["Reduced SDK init time by 40% through lazy module loading","Implemented connection pooling for ad requests","Added prefetch API for proactive ad loading","Reduced memory footprint by 25% on mobile devices"] },
  { version: "4.1.0", date: "2025-11-30", title: "Webhook Retry Policies", type: "feature", description: "Added configurable retry policies for webhook deliveries with exponential backoff.", details: ["Configurable max retry count (1-10)","Exponential backoff with jitter","Dead letter queue for permanently failed deliveries","New webhook health dashboard endpoint"] },
  { version: "4.0.3", date: "2025-11-10", title: "Security Patch", type: "fix", description: "Patched a potential SSRF vulnerability in the webhook URL validation.", details: ["Stricter URL validation for webhook endpoints","Blocked internal/private IP ranges","Added allowlist support for webhook domains","Updated TLS requirements to TLS 1.3 minimum"] },
  { version: "4.0.0", date: "2025-10-01", title: "SDK v4 - Major Release", type: "breaking", description: "Major version release with a redesigned API surface, improved type safety, and breaking changes to initialization flow.", details: ["New AdSDK.configure() initialization method replaces AdSDK.init()","All callback-based APIs now return Promises","Removed deprecated v2 ad format constants","New TypeScript-first API design","Minimum iOS 15 / Android API 28 required","Migration guide available in documentation"] },
  { version: "3.9.8", date: "2025-09-15", title: "Legacy Compatibility Fix", type: "fix", description: "Fixed compatibility issues with older Android WebView implementations.", details: ["Fixed JavaScript bridge initialization on Android 10","Added fallback rendering for legacy WebView","Improved error recovery in low-memory conditions"] },
  { version: "3.8.5", date: "2025-08-01", title: "Analytics Enhancements", type: "improvement", description: "Enhanced analytics with real-time event streaming and improved data granularity.", details: ["Real-time event streaming via Server-Sent Events","Per-minute granularity for analytics queries","New cohort analysis endpoints","Improved data export in CSV and JSON formats"] },
]

// ─── Notifications ──────────────────────────────────────────────────────────
export interface Notification {
  id: string
  type: "warning" | "error" | "info" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
}

export const notifications: Notification[] = [
  { id: "n_1", type: "warning", title: "Quota Warning", message: "Shopping App is at 85% of its monthly request quota.", timestamp: "2026-02-06T10:30:00Z", read: false },
  { id: "n_2", type: "error", title: "Webhook Failure", message: "Webhook endpoint hooks.acme.io returned 500 for 3 consecutive deliveries.", timestamp: "2026-02-06T09:15:00Z", read: false },
  { id: "n_3", type: "info", title: "SDK Update Available", message: "Version 4.2.1 is now available. Includes impression deduplication fix.", timestamp: "2026-02-05T16:00:00Z", read: false },
  { id: "n_4", type: "success", title: "Invoice Paid", message: "Invoice for January 2026 ($199.00) has been paid successfully.", timestamp: "2026-02-01T08:00:00Z", read: true },
  { id: "n_5", type: "warning", title: "High Error Rate", message: "News Reader app error rate exceeded 2% threshold in the last hour.", timestamp: "2026-01-31T14:22:00Z", read: true },
  { id: "n_6", type: "info", title: "New Feature", message: "Adaptive Ad Formats are now available. Check the changelog for details.", timestamp: "2026-01-15T10:00:00Z", read: true },
]

// ─── Support / Troubleshooting ──────────────────────────────────────────────
export interface SupportArticle {
  id: string
  title: string
  category: string
  errorCode?: string
  description: string
  solution: string
  relatedDocs: string[]
}

export const supportArticles: SupportArticle[] = [
  { id: "sa_1", title: "SDK_INIT_FAILED: Invalid API Key", category: "Initialization", errorCode: "SDK_INIT_FAILED", description: "The SDK fails to initialize and throws SDK_INIT_FAILED with an 'Invalid API key' message.", solution: "Verify that you are using the correct API key for the environment (sandbox vs production). Ensure the key has not been regenerated since it was embedded. Check that the key is passed to AdSDK.configure() and not the deprecated AdSDK.init() method.", relatedDocs: ["Getting Started","SDK Management"] },
  { id: "sa_2", title: "AD_LOAD_TIMEOUT: Request timed out", category: "Ad Loading", errorCode: "AD_LOAD_TIMEOUT", description: "Ad requests are timing out after the default 10-second timeout period.", solution: "Check the device network connectivity. Consider increasing the timeout via AdSDK.configure({ requestTimeout: 15000 }). If using a proxy or VPN, ensure ad network domains are not blocked. Verify the placement ID is valid and active.", relatedDocs: ["API Reference","Documentation"] },
  { id: "sa_3", title: "IMPRESSION_DUPLICATE: Already recorded", category: "Tracking", errorCode: "IMPRESSION_DUPLICATE", description: "The impression tracking endpoint returns a 409 conflict with IMPRESSION_DUPLICATE error.", solution: "This occurs when the same impression is reported multiple times. Ensure your impression tracking logic fires only once per ad view. If using the SDK, update to v4.2.1 which includes a deduplication fix. For REST API users, implement client-side deduplication using the impression_id.", relatedDocs: ["API Reference","Changelog"] },
  { id: "sa_4", title: "WEBHOOK_SIGNATURE_INVALID", category: "Webhooks", errorCode: "WEBHOOK_SIGNATURE_INVALID", description: "Webhook signature validation fails when processing incoming events.", solution: "Ensure you are using the correct webhook secret. The signature is computed as HMAC-SHA256 of the raw request body using your secret. Do not parse or modify the body before verification. Check that your framework is not altering the raw body (e.g., adding whitespace).", relatedDocs: ["Webhooks & Events","API Reference"] },
  { id: "sa_5", title: "RATE_LIMIT_EXCEEDED", category: "Rate Limiting", errorCode: "RATE_LIMIT_EXCEEDED", description: "API requests are being rejected with a 429 status code and RATE_LIMIT_EXCEEDED error.", solution: "The default rate limit is 1000 requests/second per API key. Implement exponential backoff in your retry logic. Consider batching requests where possible. Contact support to increase limits for Enterprise plans. Use the X-RateLimit-Remaining header to track your current quota.", relatedDocs: ["API Reference","Billing & Plans"] },
  { id: "sa_6", title: "SDK crashes on Android 10", category: "Compatibility", description: "The SDK throws a NullPointerException during initialization on Android 10 devices.", solution: "Update to SDK v3.9.8 or later which includes a compatibility fix for Android 10 WebView initialization. If you cannot update, add a null check before calling AdSDK.configure() and ensure the Activity context is fully initialized.", relatedDocs: ["Changelog","Documentation"] },
  { id: "sa_7", title: "No fill rate is very high", category: "Ad Loading", description: "The SDK is returning 'no fill' for a large percentage of ad requests.", solution: "No fill typically occurs when there are no matching ad campaigns for the request parameters. Verify that your placement IDs are correctly configured. Check that your app category and content ratings are accurately set. Enable test mode to verify the integration is working correctly before going live.", relatedDocs: ["Documentation","Analytics"] },
  { id: "sa_8", title: "Revenue discrepancy between dashboard and reports", category: "Analytics", description: "The revenue numbers in the real-time dashboard do not match the downloaded reports.", solution: "Real-time dashboard data may have up to a 4-hour delay for revenue attribution. Download reports are generated from finalized data which includes post-processing for fraud detection and invalid traffic filtering. Wait 24 hours for data to be fully reconciled before comparing.", relatedDocs: ["Analytics","Billing & Plans"] },
]

// ─── Getting Started Steps ──────────────────────────────────────────────────
export interface GettingStartedStep {
  id: string
  title: string
  description: string
  completed: boolean
}

export const defaultGettingStartedSteps: GettingStartedStep[] = [
  { id: "gs_1", title: "Create your first application", description: "Register an app in the SDK Management page to get your API keys.", completed: false },
  { id: "gs_2", title: "Install the SDK", description: "Add the AdSDK package to your project using your preferred package manager.", completed: false },
  { id: "gs_3", title: "Configure the SDK", description: "Initialize the SDK with your API key and configure your preferences.", completed: false },
  { id: "gs_4", title: "Request your first ad", description: "Use the SDK to request and display an ad in your application.", completed: false },
  { id: "gs_5", title: "Implement impression tracking", description: "Add impression tracking to accurately measure ad performance.", completed: false },
  { id: "gs_6", title: "Set up webhooks", description: "Configure webhook endpoints to receive real-time event notifications.", completed: false },
  { id: "gs_7", title: "Test in sandbox", description: "Verify your integration works correctly in the sandbox environment.", completed: false },
  { id: "gs_8", title: "Go live", description: "Switch to production keys and launch your ad integration.", completed: false },
]

// ─── Documentation Sections ─────────────────────────────────────────────────
export interface DocSection {
  id: string
  title: string
  content: Record<string, string>
  description: string
}

export const docSections: DocSection[] = [
  {
    id: "doc_1",
    title: "Installation",
    description: "Install the AdSDK package using your preferred package manager or build tool.",
    content: {
      JavaScript: `// npm\nnpm install @adsdk/web-sdk@4.2.1\n\n// yarn\nyarn add @adsdk/web-sdk@4.2.1\n\n// pnpm\npnpm add @adsdk/web-sdk@4.2.1`,
      Kotlin: `// build.gradle.kts\ndependencies {\n    implementation("io.adsdk:android-sdk:4.2.1")\n}\n\n// settings.gradle.kts\ndependencyResolutionManagement {\n    repositories {\n        maven { url = uri("https://maven.adsdk.io/releases") }\n    }\n}`,
      Swift: `// Package.swift\ndependencies: [\n    .package(\n        url: "https://github.com/adsdk/ios-sdk.git",\n        from: "4.2.1"\n    )\n]\n\n// Or via CocoaPods\npod 'AdSDK', '~> 4.2.1'`,
      REST: `# No installation required for REST API\n# Base URL: https://api.adsdk.io\n# Authentication: Bearer token in Authorization header\n\ncurl -H "Authorization: Bearer {YOUR_API_KEY}" \\\n     https://api.adsdk.io/v1/apps`,
    },
  },
  {
    id: "doc_2",
    title: "SDK Initialization",
    description: "Initialize the SDK with your API key before making any ad requests. Configuration must happen before any other SDK calls.",
    content: {
      JavaScript: `import { AdSDK } from '@adsdk/web-sdk';\n\n// Initialize with configuration\nawait AdSDK.configure({\n  apiKey: 'your_api_key_here',\n  environment: 'sandbox',\n  appId: 'app_001',\n  options: {\n    requestTimeout: 10000,\n    enableLogging: true,\n    retryPolicy: {\n      maxRetries: 3,\n      backoffMultiplier: 1.5,\n    },\n  },\n});\n\n// Verify initialization\nconst status = AdSDK.getStatus();\nconsole.log('SDK Status:', status.initialized);`,
      Kotlin: `import io.adsdk.AdSDK\nimport io.adsdk.AdConfig\nimport io.adsdk.Environment\n\nclass MyApplication : Application() {\n    override fun onCreate() {\n        super.onCreate()\n        AdSDK.configure(\n            AdConfig.Builder()\n                .apiKey("your_api_key_here")\n                .environment(Environment.SANDBOX)\n                .appId("app_001")\n                .requestTimeout(10_000)\n                .enableLogging(BuildConfig.DEBUG)\n                .build()\n        )\n    }\n}`,
      Swift: `import AdSDK\n\n@main\nstruct MyApp: App {\n    init() {\n        AdSDK.configure(\n            apiKey: "your_api_key_here",\n            environment: .sandbox,\n            appId: "app_001",\n            options: AdSDK.Options(\n                requestTimeout: 10,\n                enableLogging: true,\n                retryPolicy: .exponential(maxRetries: 3)\n            )\n        )\n    }\n\n    var body: some Scene {\n        WindowGroup {\n            ContentView()\n        }\n    }\n}`,
      REST: `# No initialization required for REST API\n# Include your API key in every request\n\ncurl -X GET https://api.adsdk.io/v1/status \\\n     -H "Authorization: Bearer your_api_key_here" \\\n     -H "X-SDK-Version: 4.2.1"`,
    },
  },
  {
    id: "doc_3",
    title: "Requesting Ads",
    description: "Request ad creatives by specifying a placement ID. The SDK handles format selection, caching, and fallback logic automatically.",
    content: {
      JavaScript: `import { AdSDK } from '@adsdk/web-sdk';\n\nconst ad = await AdSDK.requestAd({\n  placementId: 'banner_top',\n  format: 'banner_320x50',\n  context: {\n    screen: 'home_feed',\n    sessionDuration: 45,\n    userSegments: ['premium', 'tech'],\n  },\n});\n\nif (ad) {\n  const container = document.getElementById('ad-container');\n  ad.render(container);\n  console.log('Ad loaded:', ad.id, ad.format);\n} else {\n  console.log('No fill for this placement');\n}`,
      Kotlin: `import io.adsdk.AdSDK\nimport io.adsdk.AdRequest\nimport io.adsdk.AdView\n\nclass HomeFragment : Fragment() {\n    private lateinit var adView: AdView\n\n    override fun onViewCreated(view: View, savedState: Bundle?) {\n        adView = view.findViewById(R.id.adView)\n        val request = AdRequest.Builder()\n            .placementId("banner_top")\n            .format(AdFormat.BANNER_320x50)\n            .build()\n\n        AdSDK.loadAd(request) { result ->\n            result.onSuccess { ad -> adView.displayAd(ad) }\n                .onFailure { e -> Log.e("AdSDK", "Failed: \${e.message}") }\n        }\n    }\n}`,
      Swift: `import AdSDK\n\nstruct HomeView: View {\n    @StateObject private var adLoader = AdLoader()\n\n    var body: some View {\n        VStack {\n            AdBannerView(loader: adLoader)\n                .frame(height: 50)\n        }\n        .onAppear {\n            adLoader.loadAd(\n                request: AdRequest(\n                    placementId: "banner_top",\n                    format: .banner320x50\n                )\n            )\n        }\n    }\n}`,
      REST: `curl -X POST https://api.adsdk.io/v1/ads/request \\\n     -H "Authorization: Bearer your_api_key_here" \\\n     -H "Content-Type: application/json" \\\n     -d '{\n       "placement_id": "banner_top",\n       "app_id": "app_001",\n       "user_id": "usr_abc123"\n     }'`,
    },
  },
  {
    id: "doc_4",
    title: "Impression & Click Tracking",
    description: "Track ad impressions and clicks to measure performance. The SDK handles this automatically when using the built-in ad views.",
    content: {
      JavaScript: `import { AdSDK } from '@adsdk/web-sdk';\n\nawait AdSDK.trackImpression({\n  adId: 'ad_8f3k2',\n  viewportTimeMs: 1200,\n  visibilityPercent: 100,\n});\n\nawait AdSDK.trackClick({\n  adId: 'ad_8f3k2',\n  impressionId: 'imp_x9f2a',\n  coordinates: { x: 160, y: 25 },\n});\n\nAdSDK.on('impression:recorded', (data) => {\n  console.log('Impression ID:', data.impressionId);\n});`,
      Kotlin: `import io.adsdk.AdSDK\n\nAdSDK.trackImpression(\n    adId = "ad_8f3k2",\n    viewportTimeMs = 1200,\n    visibilityPercent = 100f\n) { result ->\n    result.onSuccess { data ->\n        Log.d("AdSDK", "Impression: \${data.impressionId}")\n    }\n}\n\nAdSDK.trackClick(\n    adId = "ad_8f3k2",\n    impressionId = "imp_x9f2a"\n) { result ->\n    result.onSuccess { data ->\n        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(data.landingUrl)))\n    }\n}`,
      Swift: `import AdSDK\n\ntry await AdSDK.trackImpression(\n    adId: "ad_8f3k2",\n    viewportTime: .milliseconds(1200),\n    visibilityPercent: 1.0\n)\n\nlet clickResult = try await AdSDK.trackClick(\n    adId: "ad_8f3k2",\n    impressionId: "imp_x9f2a"\n)\n\nif let url = URL(string: clickResult.landingUrl) {\n    await UIApplication.shared.open(url)\n}`,
      REST: `# Track impression\ncurl -X POST https://api.adsdk.io/v1/ads/impression \\\n     -H "Authorization: Bearer your_api_key_here" \\\n     -H "Content-Type: application/json" \\\n     -d '{ "ad_id": "ad_8f3k2", "viewport_time_ms": 1200 }'\n\n# Track click\ncurl -X POST https://api.adsdk.io/v1/ads/click \\\n     -H "Authorization: Bearer your_api_key_here" \\\n     -H "Content-Type: application/json" \\\n     -d '{ "ad_id": "ad_8f3k2", "impression_id": "imp_x9f2a" }'`,
    },
  },
  {
    id: "doc_5",
    title: "Error Handling",
    description: "Handle SDK errors gracefully with structured error types and recovery strategies.",
    content: {
      JavaScript: `import { AdSDK, AdSDKError, ErrorCode } from '@adsdk/web-sdk';\n\ntry {\n  const ad = await AdSDK.requestAd({ placementId: 'banner_top' });\n} catch (error) {\n  if (error instanceof AdSDKError) {\n    switch (error.code) {\n      case ErrorCode.SDK_INIT_FAILED:\n        console.error('SDK not initialized.');\n        break;\n      case ErrorCode.AD_LOAD_TIMEOUT:\n        console.error('Request timed out.');\n        break;\n      case ErrorCode.RATE_LIMIT_EXCEEDED:\n        await delay(error.retryAfter);\n        break;\n      case ErrorCode.NO_FILL:\n        showFallbackContent();\n        break;\n    }\n  }\n}\n\nAdSDK.onError((error) => {\n  analytics.track('sdk_error', { code: error.code });\n});`,
      Kotlin: `import io.adsdk.AdSDKException\nimport io.adsdk.ErrorCode\n\ntry {\n    val ad = AdSDK.requestAd(request)\n    adView.displayAd(ad)\n} catch (e: AdSDKException) {\n    when (e.code) {\n        ErrorCode.SDK_INIT_FAILED -> Log.e("AdSDK", "Init failed")\n        ErrorCode.AD_LOAD_TIMEOUT -> Log.w("AdSDK", "Timeout")\n        ErrorCode.RATE_LIMIT_EXCEEDED -> delay(e.retryAfterMs)\n        ErrorCode.NO_FILL -> showFallbackContent()\n    }\n}\n\nAdSDK.setErrorHandler { error ->\n    crashlytics.recordException(error)\n}`,
      Swift: `import AdSDK\n\ndo {\n    let ad = try await AdSDK.requestAd(request)\n    adView.display(ad)\n} catch let error as AdSDKError {\n    switch error.code {\n    case .sdkInitFailed: logger.error("Not initialized")\n    case .adLoadTimeout: logger.warning("Timeout")\n    case .rateLimitExceeded:\n        try await Task.sleep(for: error.retryAfter)\n    case .noFill: showFallbackContent()\n    default: logger.error("\\(error.localizedDescription)")\n    }\n}\n\nAdSDK.onError { error in\n    Analytics.track("sdk_error", properties: ["code": error.code.rawValue])\n}`,
      REST: `# API errors return structured JSON\n\n# 400 Bad Request\n# { "error": { "code": "INVALID_REQUEST", "message": "Missing field" } }\n\n# 401 Unauthorized\n# { "error": { "code": "UNAUTHORIZED", "message": "Invalid API key" } }\n\n# 429 Rate Limited (check Retry-After header)\n# { "error": { "code": "RATE_LIMIT_EXCEEDED", "retry_after": 30 } }\n\n# Implement exponential backoff:\n# Attempt 1: wait 1s, Attempt 2: wait 2s, Attempt 3: wait 4s`,
    },
  },
]

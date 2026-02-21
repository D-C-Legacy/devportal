"use client"

import { useState, useMemo } from "react"
import { Activity, AlertTriangle, AppWindow, Clock, TrendingUp, Zap, Loader2 } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "@/lib/store"
import { useMetrics } from "@/hooks/use-metrics"

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export default function OverviewPage() {
  const { apps } = useDashboard()
  const { metrics, loading, error, range, setRange } = useMetrics()

  const kpis = metrics ? [
    {
      title: "Total Requests",
      value: formatNumber(metrics.totalRequests),
      description: `${range} total`,
      icon: Activity,
      trend: "+12.3%",
    },
    {
      title: "Error Rate",
      value: `${metrics.errorRate}%`,
      description: `${metrics.totalErrors.toLocaleString("en-US")} errors`,
      icon: AlertTriangle,
      trend: "-0.08%",
    },
    {
      title: "Active Apps",
      value: metrics.avgActiveApps.toString(),
      description: `of ${apps.length} registered`,
      icon: AppWindow,
      trend: "+5",
    },
    {
      title: "Avg Latency",
      value: `${metrics.avgLatency}ms`,
      description: "p50 response time",
      icon: Clock,
      trend: "-3ms",
    },
    {
      title: "Impressions",
      value: formatNumber(metrics.totalImpressions),
      description: `${range} total`,
      icon: TrendingUp,
      trend: "+8.7%",
    },
    {
      title: "Revenue",
      value: `$${formatNumber(metrics.totalRevenue)}`,
      description: `${range} total`,
      icon: Zap,
      trend: "+15.2%",
    },
  ] : []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your SDK performance and key metrics.
          </p>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as "24h" | "7d" | "30d")}>
          <TabsList>
            <TabsTrigger value="24h" disabled={loading}>24h</TabsTrigger>
            <TabsTrigger value="7d" disabled={loading}>7d</TabsTrigger>
            <TabsTrigger value="30d" disabled={loading}>30d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Loading State */}
      {loading && !metrics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-7 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-destructive">Error Loading Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">Using mock data. Make sure NEXT_PUBLIC_API_BASE_URL is configured.</p>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      {metrics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                  <span className="text-xs font-medium text-chart-2">{kpi.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts */}
      {metrics && (
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">API Requests</CardTitle>
            <CardDescription>Request volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={metrics.data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={formatNumber}
                  className="text-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--popover-foreground))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [value.toLocaleString(), "Requests"]}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="hsl(var(--foreground))"
                  fill="hsl(var(--foreground) / 0.1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Error Rate</CardTitle>
            <CardDescription>Errors as percentage of requests</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={metrics.data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={[0, "auto"]}
                  className="text-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--popover-foreground))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [value, "Errors"]}
                />
                <Line
                  type="monotone"
                  dataKey="errors"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Applications</CardTitle>
            <CardDescription>Daily active app count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={metrics.data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                  className="text-muted-foreground"
                />
                <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--popover-foreground))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [value, "Apps"]}
                />
                <Bar
                  dataKey="activeApps"
                  fill="hsl(var(--foreground))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Latency (ms)</CardTitle>
            <CardDescription>Average response time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={metrics.data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                  className="text-muted-foreground"
                />
                <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--popover-foreground))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}ms`, "Latency"]}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  )
}

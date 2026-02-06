"use client"

import React, { createContext, useContext, useState, useCallback, useMemo } from "react"
import {
  type Organization,
  type Application,
  type Notification,
  type WebhookEvent,
  type GettingStartedStep,
  organizations,
  applications as initialApps,
  notifications as initialNotifications,
  webhookEvents as initialWebhookEvents,
  defaultGettingStartedSteps,
  billingPlans as initialBillingPlans,
  type BillingPlan,
} from "./mock-data"

export type Environment = "sandbox" | "production"

interface DashboardState {
  // Organization
  currentOrg: Organization
  setCurrentOrg: (org: Organization) => void
  organizations: Organization[]

  // Environment
  environment: Environment
  setEnvironment: (env: Environment) => void

  // Applications
  apps: Application[]
  addApp: (app: Application) => void
  regenerateKey: (appId: string, env: Environment) => void

  // Notifications
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  unreadCount: number

  // Webhook Events
  webhookEvents: WebhookEvent[]
  toggleWebhookEvent: (id: string) => void

  // Getting Started
  gettingStartedSteps: GettingStartedStep[]
  toggleStep: (id: string) => void

  // Billing
  billingPlans: BillingPlan[]
  changePlan: (planId: string) => void
  currentPlan: BillingPlan

  // Theme
  theme: "light" | "dark"
  toggleTheme: () => void
}

const DashboardContext = createContext<DashboardState | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [currentOrg, setCurrentOrg] = useState<Organization>(organizations[0])
  const [environment, setEnvironment] = useState<Environment>("sandbox")
  const [apps, setApps] = useState<Application[]>(initialApps)
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications)
  const [whEvents, setWhEvents] = useState<WebhookEvent[]>(initialWebhookEvents)
  const [steps, setSteps] = useState<GettingStartedStep[]>(defaultGettingStartedSteps)
  const [plans, setPlans] = useState<BillingPlan[]>(initialBillingPlans)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const addApp = useCallback((app: Application) => {
    setApps((prev) => [app, ...prev])
  }, [])

  const regenerateKey = useCallback((appId: string, env: Environment) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app
        const newKey = `${env === "sandbox" ? "sb" : "pk"}_${Math.random().toString(36).slice(2, 18)}`
        return env === "sandbox"
          ? { ...app, sandboxKey: newKey }
          : { ...app, productionKey: newKey }
      })
    )
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const unreadCount = useMemo(() => notifs.filter((n) => !n.read).length, [notifs])

  const toggleWebhookEvent = useCallback((id: string) => {
    setWhEvents((prev) => prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e)))
  }, [])

  const toggleStep = useCallback((id: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)))
  }, [])

  const changePlan = useCallback((planId: string) => {
    setPlans((prev) =>
      prev.map((p) => ({
        ...p,
        current: p.id === planId,
      }))
    )
  }, [])

  const currentPlan = useMemo(() => plans.find((p) => p.current) || plans[2], [plans])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light"
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next === "dark")
      }
      return next
    })
  }, [])

  const filteredApps = useMemo(
    () => apps.filter((app) => app.orgId === currentOrg.id),
    [apps, currentOrg.id]
  )

  const value = useMemo<DashboardState>(
    () => ({
      currentOrg,
      setCurrentOrg,
      organizations,
      environment,
      setEnvironment,
      apps: filteredApps,
      addApp,
      regenerateKey,
      notifications: notifs,
      markNotificationRead,
      unreadCount,
      webhookEvents: whEvents,
      toggleWebhookEvent,
      gettingStartedSteps: steps,
      toggleStep,
      billingPlans: plans,
      changePlan,
      currentPlan,
      theme,
      toggleTheme,
    }),
    [
      currentOrg,
      environment,
      filteredApps,
      addApp,
      regenerateKey,
      notifs,
      markNotificationRead,
      unreadCount,
      whEvents,
      toggleWebhookEvent,
      steps,
      toggleStep,
      plans,
      changePlan,
      currentPlan,
      theme,
      toggleTheme,
    ]
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider")
  return ctx
}

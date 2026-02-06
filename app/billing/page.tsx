"use client"

import { useState } from "react"
import { Check, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDashboard } from "@/lib/store"
import { invoices, getAggregatedMetrics } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const invoiceStatusStyles: Record<string, string> = {
  paid: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  pending: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  overdue: "bg-destructive/15 text-destructive border-destructive/30",
}

export default function BillingPage() {
  const { billingPlans, changePlan, currentPlan } = useDashboard()
  const [changePlanOpen, setChangePlanOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const metrics = getAggregatedMetrics("30d")
  const usagePercent = Math.min(
    Math.round((metrics.totalRequests / currentPlan.requestLimit) * 100),
    100
  )

  const handleChangePlan = () => {
    if (selectedPlanId) {
      changePlan(selectedPlanId)
    }
    setChangePlanOpen(false)
    setSelectedPlanId(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Billing & Plans</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and view invoices.
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Current Plan</CardTitle>
              <CardDescription>You are on the {currentPlan.name} plan.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setChangePlanOpen(true)}>
              Change Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">
              ${currentPlan.price}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Request Usage</span>
              <span className="font-medium text-foreground">
                {metrics.totalRequests.toLocaleString("en-US")} / {currentPlan.requestLimit.toLocaleString("en-US")}
              </span>
            </div>
            <Progress value={usagePercent} className="h-2" />
            <p className="text-xs text-muted-foreground">{usagePercent}% of monthly quota used</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {currentPlan.features.map((f) => (
              <Badge key={f} variant="secondary" className="text-xs">
                {f}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoices</CardTitle>
          <CardDescription>Your billing history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium">Invoice</TableHead>
                <TableHead className="text-xs font-medium">Period</TableHead>
                <TableHead className="text-xs font-medium">Amount</TableHead>
                <TableHead className="text-xs font-medium">Status</TableHead>
                <TableHead className="text-xs font-medium w-20">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs text-foreground">{inv.id}</TableCell>
                  <TableCell className="text-sm text-foreground">{inv.period}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">${inv.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs capitalize", invoiceStatusStyles[inv.status])}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled title="Download unavailable">
                      <Download className="h-3.5 w-3.5" />
                      <span className="sr-only">Download invoice</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Change Plan Dialog */}
      <Dialog open={changePlanOpen} onOpenChange={setChangePlanOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
            <DialogDescription>
              Select a plan that fits your needs. Changes take effect immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            {billingPlans.map((plan) => (
              <button
                type="button"
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  "flex flex-col rounded-lg border p-4 text-left transition-colors",
                  selectedPlanId === plan.id
                    ? "border-foreground bg-accent"
                    : plan.current
                      ? "border-border bg-muted/50"
                      : "border-border hover:border-foreground/30"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{plan.name}</span>
                  {plan.current && (
                    <Badge variant="secondary" className="text-[10px]">Current</Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-0.5 mb-3">
                  <span className="text-2xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
                <ul className="flex flex-col gap-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-chart-2 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePlanOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleChangePlan}
              disabled={!selectedPlanId || selectedPlanId === billingPlans.find((p) => p.current)?.id}
            >
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

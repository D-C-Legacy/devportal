"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useDashboard } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function GettingStartedPage() {
  const { gettingStartedSteps, toggleStep } = useDashboard()
  const completedCount = gettingStartedSteps.filter((s) => s.completed).length
  const totalCount = gettingStartedSteps.length
  const progress = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Getting Started</h1>
        <p className="text-sm text-muted-foreground">
          Complete these steps to set up your AdSDK integration.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Setup Progress</CardTitle>
          <CardDescription>
            {completedCount} of {totalCount} steps completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
          <p className="text-sm font-medium text-foreground mt-2">{progress}% complete</p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {gettingStartedSteps.map((step, i) => (
          <button
            type="button"
            key={step.id}
            onClick={() => toggleStep(step.id)}
            className={cn(
              "flex items-start gap-4 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent",
              step.completed && "bg-muted/50"
            )}
          >
            <div className="mt-0.5">
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5 text-chart-2" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium text-foreground",
                    step.completed && "line-through text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

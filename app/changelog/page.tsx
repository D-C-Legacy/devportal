"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { changelog } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const typeBadge: Record<string, string> = {
  feature: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  fix: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  breaking: "bg-destructive/15 text-destructive border-destructive/30",
  improvement: "bg-chart-3/15 text-chart-3 border-chart-3/30",
}

export default function ChangelogPage() {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    new Set([changelog[0].version])
  )

  const toggle = (version: string) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev)
      if (next.has(version)) {
        next.delete(version)
      } else {
        next.add(version)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Changelog</h1>
        <p className="text-sm text-muted-foreground">
          SDK releases, updates, and breaking changes.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {changelog.map((entry) => {
          const isExpanded = expandedVersions.has(entry.version)
          return (
            <Card key={entry.version}>
              <CardHeader
                className="cursor-pointer py-3"
                onClick={() => toggle(entry.version)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    <code className="text-sm font-mono font-semibold text-foreground">
                      v{entry.version}
                    </code>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] capitalize", typeBadge[entry.type])}
                    >
                      {entry.type}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">{entry.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {entry.description}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {entry.details.map((detail) => (
                      <li key={detail} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-muted-foreground mt-1.5 h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

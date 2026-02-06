"use client"

import { useState, useMemo } from "react"
import { Search, AlertCircle, ChevronDown, ChevronRight, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { supportArticles } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const categoryColors: Record<string, string> = {
  Initialization: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  "Ad Loading": "bg-chart-2/15 text-chart-2 border-chart-2/30",
  Tracking: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  Webhooks: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  "Rate Limiting": "bg-chart-5/15 text-chart-5 border-chart-5/30",
  Compatibility: "bg-muted text-muted-foreground border-border",
  Analytics: "bg-chart-2/15 text-chart-2 border-chart-2/30",
}

export default function SupportPage() {
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search) return supportArticles
    const lower = search.toLowerCase()
    return supportArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        a.description.toLowerCase().includes(lower) ||
        a.category.toLowerCase().includes(lower) ||
        (a.errorCode && a.errorCode.toLowerCase().includes(lower))
    )
  }, [search])

  const categories = useMemo(
    () => [...new Set(supportArticles.map((a) => a.category))],
    []
  )

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Support</h1>
        <p className="text-sm text-muted-foreground">
          Common SDK errors and troubleshooting guides.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search errors, categories, or descriptions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setSearch("")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            !search
              ? "bg-foreground text-background border-foreground"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setSearch(cat)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              search === cat
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No troubleshooting articles found matching your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((article) => {
            const isExpanded = expandedId === article.id
            return (
              <Card key={article.id}>
                <CardHeader
                  className="cursor-pointer py-3"
                  onClick={() => setExpandedId(isExpanded ? null : article.id)}
                >
                  <div className="flex items-start gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {article.errorCode && (
                          <code className="text-xs font-mono font-semibold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                            {article.errorCode}
                          </code>
                        )}
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            categoryColors[article.category] || "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          {article.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm">{article.title}</CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        {article.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0 pl-10">
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-chart-2 shrink-0" />
                        <h4 className="text-sm font-medium text-foreground">Solution</h4>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {article.solution}
                      </p>
                    </div>
                    {article.relatedDocs.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Related Documentation
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {article.relatedDocs.map((doc) => (
                            <Badge key={doc} variant="secondary" className="text-xs">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Check, Copy, Play, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiEndpoints } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const methodColors: Record<string, string> = {
  GET: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  POST: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  PUT: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  DELETE: "bg-destructive/15 text-destructive border-destructive/30",
  PATCH: "bg-chart-5/15 text-chart-5 border-chart-5/30",
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 shrink-0"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span className="sr-only">Copy</span>
    </Button>
  )
}

function TryRequestButton({ endpoint }: { endpoint: (typeof apiEndpoints)[0] }) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  const handleTry = () => {
    setLoading(true)
    setResponse(null)
    // Simulate network delay
    setTimeout(() => {
      setResponse(endpoint.responseExample)
      setLoading(false)
    }, 800 + Math.random() * 700)
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleTry}
        disabled={loading}
        className="self-start gap-2 bg-transparent"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
        Try Request
      </Button>
      {response && (
        <div className="rounded-md border border-border bg-muted">
          <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">Response</span>
              <Badge variant="outline" className="text-[10px] bg-chart-2/15 text-chart-2 border-chart-2/30">
                200 OK
              </Badge>
            </div>
            <CopyBtn text={response} />
          </div>
          <pre className="overflow-x-auto p-3 text-xs font-mono leading-relaxed text-foreground">
            {response}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function ApiReferencePage() {
  const [selectedId, setSelectedId] = useState<string>(apiEndpoints[0].id)
  const selectedEndpoint = apiEndpoints.find((e) => e.id === selectedId) || apiEndpoints[0]

  const categories = [...new Set(apiEndpoints.map((e) => e.category))]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">API Reference</h1>
        <p className="text-sm text-muted-foreground">
          Explore and test API endpoints.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Endpoint List */}
        <div className="flex flex-col gap-4">
          {categories.map((cat) => (
            <div key={cat}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                {cat}
              </p>
              <div className="flex flex-col gap-1">
                {apiEndpoints
                  .filter((e) => e.category === cat)
                  .map((ep) => (
                    <button
                      type="button"
                      key={ep.id}
                      onClick={() => setSelectedId(ep.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                        selectedId === ep.id
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-mono px-1.5 shrink-0", methodColors[ep.method])}
                      >
                        {ep.method}
                      </Badge>
                      <span className="truncate font-mono text-xs">{ep.path}</span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Endpoint Detail */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn("text-xs font-mono", methodColors[selectedEndpoint.method])}
              >
                {selectedEndpoint.method}
              </Badge>
              <CardTitle className="text-base font-mono">{selectedEndpoint.path}</CardTitle>
            </div>
            <CardDescription>{selectedEndpoint.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Headers */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Headers</h3>
              <div className="rounded-md border border-border bg-muted p-3">
                {Object.entries(selectedEndpoint.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-xs font-mono">
                    <span className="text-foreground">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Body */}
            {selectedEndpoint.requestBody && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-foreground">Request Body</h3>
                  <CopyBtn text={selectedEndpoint.requestBody} />
                </div>
                <pre className="rounded-md border border-border bg-muted p-3 text-xs font-mono leading-relaxed overflow-x-auto text-foreground">
                  {selectedEndpoint.requestBody}
                </pre>
              </div>
            )}

            {/* Response Example */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground">Response Example</h3>
                <CopyBtn text={selectedEndpoint.responseExample} />
              </div>
              <pre className="rounded-md border border-border bg-muted p-3 text-xs font-mono leading-relaxed overflow-x-auto text-foreground">
                {selectedEndpoint.responseExample}
              </pre>
            </div>

            {/* Try Request */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Test</h3>
              <TryRequestButton endpoint={selectedEndpoint} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDashboard } from "@/lib/store"
import { deliveryLogs } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const statusBadge: Record<string, string> = {
  success: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  failed: "bg-destructive/15 text-destructive border-destructive/30",
  pending: "bg-chart-4/15 text-chart-4 border-chart-4/30",
}



export default function WebhooksPage() {
  const { webhookEvents, toggleWebhookEvent } = useDashboard()
  const [expandedPayload, setExpandedPayload] = useState<string | null>(null)
  const [logPage, setLogPage] = useState(1)
  const logPageSize = 15

  const pagedLogs = useMemo(() => {
    const start = (logPage - 1) * logPageSize
    return deliveryLogs.slice(start, start + logPageSize)
  }, [logPage])

  const totalLogPages = Math.ceil(deliveryLogs.length / logPageSize)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Webhooks & Events</h1>
        <p className="text-sm text-muted-foreground">
          Manage event subscriptions and monitor webhook deliveries.
        </p>
      </div>

      {/* Event Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Subscriptions</CardTitle>
          <CardDescription>Toggle which events trigger webhook deliveries.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {webhookEvents.map((evt) => (
              <div key={evt.id} className="flex flex-col rounded-lg border border-border">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Switch
                      checked={evt.enabled}
                      onCheckedChange={() => toggleWebhookEvent(evt.id)}
                    />
                    <div className="min-w-0">
                      <code className="text-sm font-mono font-medium text-foreground">{evt.name}</code>
                      <p className="text-xs text-muted-foreground">{evt.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() =>
                      setExpandedPayload(expandedPayload === evt.id ? null : evt.id)
                    }
                  >
                    {expandedPayload === evt.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle payload preview</span>
                  </Button>
                </div>
                {expandedPayload === evt.id && (
                  <div className="border-t border-border bg-muted p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Payload Preview</p>
                    <pre className="text-xs font-mono leading-relaxed overflow-x-auto text-foreground">
                      {evt.payloadExample}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Delivery Log
            <Badge variant="secondary" className="ml-2 text-xs">
              {deliveryLogs.length}
            </Badge>
          </CardTitle>
          <CardDescription>Recent webhook delivery attempts and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium">Event</TableHead>
                <TableHead className="text-xs font-medium">Endpoint</TableHead>
                <TableHead className="text-xs font-medium">Status</TableHead>
                <TableHead className="text-xs font-medium">Code</TableHead>
                <TableHead className="text-xs font-medium">Retries</TableHead>
                <TableHead className="text-xs font-medium">Duration</TableHead>
                <TableHead className="text-xs font-medium">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <code className="text-xs font-mono text-foreground">{log.eventName}</code>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {log.endpoint}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs capitalize", statusBadge[log.status])}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-foreground">
                    {log.statusCode ?? "-"}
                  </TableCell>
                  <TableCell className="text-xs text-foreground">{log.retries}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {log.duration > 0 ? `${log.duration}ms` : "-"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toISOString().slice(0, 16).replace("T", " ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalLogPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
              <p className="text-xs text-muted-foreground">
                Page {logPage} of {totalLogPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 bg-transparent"
                  onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                  disabled={logPage === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 bg-transparent"
                  onClick={() => setLogPage((p) => Math.min(totalLogPages, p + 1))}
                  disabled={logPage === totalLogPages}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

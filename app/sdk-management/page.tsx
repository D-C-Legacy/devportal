"use client"

import { useState, useMemo } from "react"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDashboard, type Environment } from "@/lib/store"
import type { AppPlatform, AppStatus } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const statusStyles: Record<AppStatus, string> = {
  active: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  inactive: "bg-muted text-muted-foreground border-border",
  suspended: "bg-destructive/15 text-destructive border-destructive/30",
}

type SortKey = "name" | "platform" | "status" | "dailyRequests" | "createdAt"

function KeyDisplay({ label, value }: { label: string; value: string }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}:</span>
      <code className="text-xs font-mono truncate text-foreground">
        {visible ? value : `${"*".repeat(8)}...${value.slice(-4)}`}
      </code>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={() => setVisible(!visible)}
      >
        {visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        <span className="sr-only">{visible ? "Hide" : "Show"} key</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={() => {
          navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        <span className="sr-only">Copy key</span>
      </Button>
    </div>
  )
}

export default function SdkManagementPage() {
  const { apps, addApp, regenerateKey, environment, currentOrg } = useDashboard()
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [newAppName, setNewAppName] = useState("")
  const [newAppPlatform, setNewAppPlatform] = useState<AppPlatform>("iOS")
  const [newAppBundle, setNewAppBundle] = useState("")
  const pageSize = 10

  const filtered = useMemo(() => {
    let result = apps
    if (search) {
      const lower = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(lower) ||
          a.bundleId.toLowerCase().includes(lower) ||
          a.platform.toLowerCase().includes(lower)
      )
    }
    result.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortAsc ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
    })
    return result
  }, [apps, search, sortKey, sortAsc])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const handleCreate = () => {
    if (!newAppName.trim()) return
    const id = `app_${Date.now()}`
    addApp({
      id,
      orgId: currentOrg.id,
      name: newAppName.trim(),
      bundleId: newAppBundle || `com.example.${newAppName.toLowerCase().replace(/\s+/g, "")}`,
      platform: newAppPlatform,
      status: "active",
      sdkVersion: "4.2.1",
      sandboxKey: `sb_${Math.random().toString(36).slice(2, 18)}`,
      productionKey: `pk_${Math.random().toString(36).slice(2, 18)}`,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      dailyRequests: 0,
      errorRate: 0,
    })
    setNewAppName("")
    setNewAppBundle("")
    setNewAppPlatform("iOS")
    setCreateOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">SDK Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage your applications and SDK keys.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New App
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Application</DialogTitle>
              <DialogDescription>
                Register a new application to get SDK keys.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="app-name">App Name</Label>
                <Input
                  id="app-name"
                  placeholder="My App"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="app-platform">Platform</Label>
                <Select value={newAppPlatform} onValueChange={(v) => setNewAppPlatform(v as AppPlatform)}>
                  <SelectTrigger id="app-platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["iOS", "Android", "Web", "React Native", "Flutter", "Unity"] as AppPlatform[]).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="app-bundle">Bundle ID</Label>
                <Input
                  id="app-bundle"
                  placeholder="com.example.myapp"
                  value={newAppBundle}
                  onChange={(e) => setNewAppBundle(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!newAppName.trim()}>
                Create App
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">
              Applications
              <Badge variant="secondary" className="ml-2 text-xs">
                {filtered.length}
              </Badge>
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search apps..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9 h-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {([
                  ["name", "Name"],
                  ["platform", "Platform"],
                  ["status", "Status"],
                  ["dailyRequests", "Daily Requests"],
                  ["createdAt", "Created"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <TableHead key={key}>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs font-medium"
                      onClick={() => toggleSort(key)}
                    >
                      {label}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                ))}
                <TableHead className="text-xs font-medium">Key</TableHead>
                <TableHead className="text-xs font-medium w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No applications found.
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <span className="text-sm font-medium text-foreground">{app.name}</span>
                        <p className="text-xs text-muted-foreground font-mono">{app.bundleId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{app.platform}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs capitalize", statusStyles[app.status])}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-foreground">
                      {app.dailyRequests.toLocaleString("en-US")}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(app.createdAt).toISOString().slice(0, 10)}
                    </TableCell>
                    <TableCell>
                      <KeyDisplay
                        label={environment === "sandbox" ? "SB" : "PK"}
                        value={environment === "sandbox" ? app.sandboxKey : app.productionKey}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => regenerateKey(app.id, environment as Environment)}
                        title="Regenerate key"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span className="sr-only">Regenerate key</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of{" "}
                {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 bg-transparent"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Previous page</span>
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                  const p = start + i
                  if (p > totalPages) return null
                  return (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="icon"
                      className="h-7 w-7 text-xs"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 bg-transparent"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

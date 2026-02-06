"use client"

import { Bell, Check, ChevronDown, Moon, Sun, User } from "lucide-react"
import { useDashboard } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function DashboardTopbar() {
  const {
    currentOrg,
    setCurrentOrg,
    organizations: orgs,
    environment,
    setEnvironment,
    notifications,
    markNotificationRead,
    unreadCount,
    theme,
    toggleTheme,
  } = useDashboard()

  return (
    <header className="flex h-14 items-center border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-3 h-5" />

      {/* Org Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 font-medium">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-foreground text-background text-[10px] font-bold">
              {currentOrg.name.charAt(0)}
            </div>
            <span className="hidden sm:inline">{currentOrg.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {orgs.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => setCurrentOrg(org)}
              className="gap-2"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded bg-foreground text-background text-[10px] font-bold">
                {org.name.charAt(0)}
              </div>
              {org.name}
              {org.id === currentOrg.id && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Environment Toggle */}
      <div className="ml-3 flex items-center rounded-md border border-border">
        <button
          type="button"
          onClick={() => setEnvironment("sandbox")}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-l-md transition-colors",
            environment === "sandbox"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Sandbox
        </button>
        <button
          type="button"
          onClick={() => setEnvironment("production")}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-r-md transition-colors",
            environment === "production"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Production
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1">
        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.slice(0, 5).map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex flex-col items-start gap-1 py-2.5"
                onClick={() => markNotificationRead(n.id)}
              >
                <div className="flex w-full items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      n.type === "error" && "bg-destructive",
                      n.type === "warning" && "bg-chart-4",
                      n.type === "info" && "bg-chart-1",
                      n.type === "success" && "bg-chart-2"
                    )}
                  />
                  <span className={cn("text-sm font-medium", !n.read && "text-foreground")}>
                    {n.title}
                  </span>
                  {!n.read && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground pl-4">{n.message}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <User className="h-4 w-4" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Developer</span>
                <span className="text-xs text-muted-foreground">dev@{currentOrg.slug}.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>API Keys</DropdownMenuItem>
            <DropdownMenuItem>Team Members</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

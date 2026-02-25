"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCheck,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  AlertTriangle,
  Package,
  Shield,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useNotifications, useMarkRead, useMarkAllRead } from "@/lib/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// --- Notification helpers ---

function notifIcon(type: string) {
  switch (type) {
    case "BREAKDOWN":
      return <AlertTriangle className="size-4 text-orange-500" />;
    case "ORDER":
      return <Package className="size-4 text-blue-500" />;
    case "DISPUTE":
      return <Shield className="size-4 text-red-500" />;
    case "MECHANIC":
      return <Wrench className="size-4 text-green-500" />;
    default:
      return <Bell className="size-4 text-muted-foreground" />;
  }
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { data: notifData } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = (notifData as { notifications?: Array<{ id: string; type: string; title: string; message: string; isRead: boolean; createdAt: string }> } | undefined)?.notifications ?? [];
  const unreadCount = (notifData as { unreadCount?: number } | undefined)?.unreadCount ?? 0;
  const displayName = user?.name || user?.role || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Quick search navigation
  const searchRoutes = [
    { label: "Dashboard", path: "/dashboard", keywords: "home overview stats" },
    { label: "Breakdowns", path: "/breakdowns", keywords: "breakdown emergency requests" },
    { label: "Mechanics", path: "/mechanics", keywords: "mechanic technician" },
    { label: "Workshops", path: "/workshops", keywords: "workshop store parts" },
    { label: "Marketplace", path: "/marketplace", keywords: "marketplace spare parts buy" },
    { label: "Orders", path: "/orders", keywords: "order purchase" },
    { label: "Disputes", path: "/disputes", keywords: "dispute complaint" },
    { label: "Analytics", path: "/analytics", keywords: "analytics reports chart" },
    { label: "Settings", path: "/settings", keywords: "settings config" },
  ];

  const filteredRoutes = searchQuery
    ? searchRoutes.filter(
        (r) =>
          r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.keywords.includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="bg-background/80 border-border sticky top-0 z-40 flex h-16 items-center gap-4 border-b px-4 backdrop-blur-sm md:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={onMobileMenuToggle}
      >
        <Menu className="size-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {/* Search */}
      <Popover open={searchOpen && searchQuery.length > 0} onOpenChange={setSearchOpen}>
        <PopoverTrigger asChild>
          <div className="relative flex-1 md:max-w-sm lg:max-w-md">
            <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Search pages..."
              className="h-9 pl-9 pr-12"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredRoutes.length > 0) {
                  router.push(filteredRoutes[0].path);
                  setSearchQuery("");
                  setSearchOpen(false);
                }
              }}
            />
            <kbd className="bg-muted text-muted-foreground pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] font-medium select-none sm:inline-block">
              Ctrl+K
            </kbd>
          </div>
        </PopoverTrigger>
        {filteredRoutes.length > 0 && (
          <PopoverContent className="w-[--radix-popover-trigger-width] p-1" align="start">
            {filteredRoutes.map((route) => (
              <button
                key={route.path}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors text-left"
                onClick={() => {
                  router.push(route.path);
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
              >
                <Search className="size-3.5 text-muted-foreground" />
                {route.label}
              </button>
            ))}
          </PopoverContent>
        )}
      </Popover>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center p-0 text-[10px]"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h4 className="text-sm font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-xs gap-1"
                  onClick={() => markAllRead.mutate()}
                  disabled={markAllRead.isPending}
                >
                  <CheckCheck className="size-3.5" />
                  Mark all read
                </Button>
              )}
            </div>
            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Bell className="size-8 mb-2 opacity-40" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.slice(0, 20).map((notif) => (
                    <button
                      key={notif.id}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-accent transition-colors ${
                        !notif.isRead ? "bg-accent/50" : ""
                      }`}
                      onClick={() => {
                        if (!notif.isRead) markRead.mutate(notif.id);
                      }}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notifIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notif.isRead ? "font-medium" : ""}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {timeAgo(notif.createdAt)}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Separator orientation="vertical" className="mx-1 hidden h-6 md:block" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 gap-2 px-2"
            >
              <Avatar size="sm">
                <AvatarImage src={user?.avatarUrl || ""} alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline-block">
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-muted-foreground text-xs leading-none">
                  {user?.email || `+91 ${user?.phone || ""}`}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  Wrench,
  Store,
  Package,
  ShoppingCart,
  Shield,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/auth-store";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Breakdowns",
    href: "/breakdowns",
    icon: AlertTriangle,
  },
  {
    title: "Mechanics",
    href: "/mechanics",
    icon: Wrench,
  },
  {
    title: "Workshops",
    href: "/workshops",
    icon: Store,
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Disputes",
    href: "/disputes",
    icon: Shield,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const displayName = user?.name || user?.role || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground border-sidebar-border flex h-full flex-col border-r transition-all duration-300",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4">
        <div className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
          <Wrench className="text-primary-foreground size-4" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">
            RepairAssist
          </span>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground/70",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon
                  className={cn(
                    "size-5 shrink-0",
                    isActive && "text-primary"
                  )}
                />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Collapse Toggle */}
      <div className="flex items-center justify-end px-3 py-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleCollapse}
          className="text-sidebar-foreground/50 hover:text-sidebar-foreground"
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
          <span className="sr-only">
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </Button>
      </div>

      {/* User Section */}
      <div
        className={cn(
          "border-sidebar-border flex items-center gap-3 border-t px-4 py-3",
          collapsed && "justify-center px-2"
        )}
      >
        <Avatar size="sm">
          <AvatarImage src={user?.avatarUrl || ""} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">{displayName}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user?.email || `+91 ${user?.phone || ""}`}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

/**
 * Mobile-specific sidebar content (rendered inside Sheet).
 * Always expanded, handles its own link clicks.
 */
export function MobileSidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4">
        <div className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
          <Wrench className="text-primary-foreground size-4" />
        </div>
        <span className="text-lg font-bold tracking-tight">RepairAssist</span>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground/70"
                )}
              >
                <item.icon
                  className={cn(
                    "size-5 shrink-0",
                    isActive && "text-primary"
                  )}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User Section */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar size="sm">
          <AvatarImage src="/avatars/admin.png" alt="Admin" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium">Admin User</span>
          <span className="text-muted-foreground truncate text-xs">
            admin@repairassist.com
          </span>
        </div>
      </div>
    </div>
  );
}

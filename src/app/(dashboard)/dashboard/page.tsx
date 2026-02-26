"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  AlertTriangle,
  Wrench,
  IndianRupee,
  Package,
  TrendingUp,
  TrendingDown,
  Star,
  UserPlus,
  Scale,
  FileDown,
  Settings,
  Clock,
  RefreshCw,
  MapPin,
  Radio,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats, useActiveBreakdowns } from "@/lib/hooks/use-admin";
import { MapView } from "@/components/shared/map-view";
import { useAuthStore } from "@/lib/store/auth-store";
import { useWorkshopDashboard } from "@/lib/hooks/use-workshop";

// --- Helpers ---

function formatEnumLabel(val: string) {
  return val
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getInitials(name: string | null | undefined) {
  const safeName = name ?? "Unknown";
  return safeName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function mapStatusToLabel(status: string): string {
  switch (status) {
    case "PENDING":
    case "SEARCHING":
      return "Pending";
    case "ACCEPTED":
    case "EN_ROUTE":
    case "ARRIVED":
    case "DIAGNOSING":
    case "IN_PROGRESS":
      return "Active";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return formatEnumLabel(status);
  }
}

// --- Zone Classification ---

const ZONES = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Delhi NCR", lat: 28.6139, lng: 77.209 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
];

function classifyZone(lat: number, lng: number): string {
  let nearest = "Other";
  let minDist = 150; // max 150km to belong to a zone
  for (const zone of ZONES) {
    const dLat = lat - zone.lat;
    const dLng = lng - zone.lng;
    // Approximate distance in km (1 degree ~ 111km)
    const dist = Math.sqrt(dLat * dLat + dLng * dLng) * 111;
    if (dist < minDist) {
      minDist = dist;
      nearest = zone.name;
    }
  }
  return nearest;
}

function getZoneCounts(breakdowns: Array<{ latitude: number; longitude: number }>): Array<{ zone: string; count: number }> {
  const counts: Record<string, number> = {};
  for (const bd of breakdowns) {
    const zone = classifyZone(bd.latitude, bd.longitude);
    counts[zone] = (counts[zone] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([zone, count]) => ({ zone, count }))
    .sort((a, b) => b.count - a.count);
}

// --- Static Chart Data ---

// TODO: Replace with analytics API
const breakdownData = [
  { day: "Mon", requests: 42 },
  { day: "Tue", requests: 58 },
  { day: "Wed", requests: 35 },
  { day: "Thu", requests: 67 },
  { day: "Fri", requests: 52 },
  { day: "Sat", requests: 73 },
  { day: "Sun", requests: 61 },
];

// TODO: Replace with analytics API
const revenueData = [
  { category: "Labour", amount: 45000 },
  { category: "Parts", amount: 32000 },
  { category: "Towing", amount: 18000 },
  { category: "Emergency", amount: 28000 },
  { category: "Subscription", amount: 15000 },
];


// --- Animated Number Counter ---

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 1500,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  const formatted =
    target >= 1000
      ? count.toLocaleString("en-IN")
      : count.toString();

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// --- Status Badge ---

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string }> = {
    Active: { className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
    Completed: { className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
    Pending: { className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" },
    Cancelled: { className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  };

  return (
    <Badge variant="secondary" className={config[status]?.className}>
      {status}
    </Badge>
  );
}

// --- Star Rating ---

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : star - 0.5 <= rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-muted-foreground">{rating}</span>
    </div>
  );
}

// --- Skeleton Components ---

function KpiCardSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="relative pt-0">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-11 w-11 rounded-xl" />
        </div>
        <div className="mt-2 flex items-center gap-1">
          <Skeleton className="h-3.5 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pr-4"><Skeleton className="h-4 w-16" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-4 w-24" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-4 w-24" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-4 w-20" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
      <td className="py-3"><Skeleton className="h-4 w-16" /></td>
    </tr>
  );
}

function MechanicSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="text-right space-y-1">
        <Skeleton className="h-4 w-8 ml-auto" />
        <Skeleton className="h-3 w-6 ml-auto" />
      </div>
    </div>
  );
}

// --- Workshop Dashboard ---

function WorkshopDashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useWorkshopDashboard();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-lg font-semibold">Failed to load dashboard</h2>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          {(error as Error)?.message || "Something went wrong. Please try again."}
        </p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const stats = data?.stats;
  const recentOrders = data?.recentOrders ?? [];
  const lowStockParts = data?.lowStockParts ?? [];
  const inventoryByCondition = data?.inventoryByCondition ?? [];

  const kpiCards = [
    {
      title: "Total Parts",
      value: stats?.totalParts ?? 0,
      trend: `${stats?.activeParts ?? 0} active`,
      icon: Package,
      gradient: "from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Stock",
      value: stats?.totalStock ?? 0,
      trend: `${stats?.lowStockCount ?? 0} low stock`,
      icon: Package,
      gradient: "from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      trend: `${stats?.monthlyOrders ?? 0} this month`,
      icon: Clock,
      gradient: "from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Revenue This Month",
      value: stats?.monthlyRevenue ?? 0,
      prefix: "\u20B9",
      trend: `\u20B9${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")} total`,
      icon: IndianRupee,
      gradient: "from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
  ];

  const conditionLabels: Record<string, string> = {
    USED_GOOD: "Used (Good)",
    REFURBISHED: "Refurbished",
    LIKE_NEW: "Like New",
    OEM_SURPLUS: "OEM Surplus",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Workshop Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Your inventory, orders, and performance at a glance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
          : kpiCards.map((kpi) => (
              <Card key={kpi.title} className="relative overflow-hidden hover:shadow-md transition-shadow cursor-default group">
                <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
                <CardContent className="relative pt-0">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
                      <p className="text-2xl font-bold tracking-tight">
                        <AnimatedCounter target={kpi.value} prefix={kpi.prefix || ""} />
                      </p>
                    </div>
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/80 shadow-sm ${kpi.iconColor}`}>
                      <kpi.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs font-medium text-muted-foreground">{kpi.trend}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Orders</CardTitle>
              <CardDescription>Latest orders received for your parts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="pb-3 pr-4 text-left font-medium">Part</th>
                      <th className="pb-3 pr-4 text-left font-medium">Buyer</th>
                      <th className="pb-3 pr-4 text-right font-medium">Amount</th>
                      <th className="pb-3 pr-4 text-left font-medium">Status</th>
                      <th className="pb-3 text-left font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading
                      ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
                      : recentOrders.map((order: any) => (
                          <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="py-3 pr-4 font-medium">{order.part?.name ?? "Unknown"}</td>
                            <td className="py-3 pr-4 text-muted-foreground">{order.buyer?.name ?? "Unknown"}</td>
                            <td className="py-3 pr-4 text-right font-medium">
                              {"\u20B9"}{order.totalAmount?.toLocaleString("en-IN") ?? 0}
                            </td>
                            <td className="py-3 pr-4">
                              <StatusBadge status={mapStatusToLabel(order.orderStatus)} />
                            </td>
                            <td className="py-3 text-muted-foreground text-xs flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {timeAgo(order.createdAt)}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
                {!isLoading && recentOrders.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-2 py-12">
                    <Package className="size-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No orders yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts + Inventory by Condition */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="size-4 text-orange-500" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>Parts with stock below 5 units</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : lowStockParts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-6">
                  <CheckCircle2 className="size-8 text-green-500/60" />
                  <p className="text-xs text-muted-foreground text-center">All parts are well stocked</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {lowStockParts.map((part: any) => (
                    <div
                      key={part.id}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/30"
                    >
                      <div>
                        <p className="text-sm font-medium">{part.name}</p>
                        <p className="text-xs text-muted-foreground">{part.brand}</p>
                      </div>
                      <span className={`text-sm font-bold ${part.stock === 0 ? "text-red-600" : "text-yellow-600"}`}>
                        {part.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inventory Summary</CardTitle>
              <CardDescription>Stock breakdown by condition</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded-lg" />
                  ))}
                </div>
              ) : inventoryByCondition.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No inventory data</p>
              ) : (
                <div className="space-y-2">
                  {inventoryByCondition.map((item: any) => (
                    <div key={item.condition} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {conditionLabels[item.condition] ?? item.condition}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{item.count} parts</span>
                        <span className="font-semibold">{item.totalStock} units</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/my-inventory">
              <Button variant="outline" className="w-full justify-start h-11 gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">My Inventory</span>
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" className="w-full justify-start h-11 gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                  <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="font-medium">View Orders</span>
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="w-full justify-start h-11 gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium">Marketplace</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="w-full justify-start h-11 gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                  <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium">Workshop Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Admin Page Component ---

function AdminDashboard() {
  const {
    data: adminData,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats,
  } = useAdminStats();

  // Show error toasts
  useEffect(() => {
    if (isStatsError && statsError) {
      toast.error("Failed to load dashboard data", {
        description: statsError.message || "Please try again later.",
      });
    }
  }, [isStatsError, statsError]);

  const {
    data: activeBreakdownData,
    isLoading: isActiveLoading,
    isError: isActiveError,
  } = useActiveBreakdowns();

  const stats = adminData?.stats;
  const recentBreakdowns = adminData?.recentBreakdowns ?? [];
  const topMechanics = adminData?.topMechanics ?? [];

  // Build map markers from active breakdowns
  const activeBreakdowns = (activeBreakdownData as { breakdowns?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    emergencyType: string;
    status: string;
    rider?: { name: string };
    locationAddress?: string;
  }> })?.breakdowns ?? [];

  const mapMarkers = activeBreakdowns.map((bd) => ({
    id: bd.id,
    lat: bd.latitude,
    lng: bd.longitude,
    label: `${formatEnumLabel(bd.emergencyType)} — ${bd.rider?.name ?? "Unknown"} (${formatEnumLabel(bd.status)})`,
    type: "breakdown" as const,
  }));

  // Build KPI cards from real API data
  const kpiCards = [
    {
      title: "Active Breakdowns",
      value: stats?.activeBreakdowns ?? 0,
      trend: `+${stats?.pendingBreakdowns ?? 0} pending`,
      trendUp: true,
      icon: AlertTriangle,
      gradient: "from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Mechanics Online",
      value: stats?.onlineMechanics ?? 0,
      trend: `+${stats?.totalMechanics ?? 0} total`,
      trendUp: true,
      icon: Wrench,
      gradient: "from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Revenue Today",
      value: stats?.revenueToday ?? 0,
      prefix: "\u20B9",
      trend: `+${stats?.completedToday ?? 0} completed`,
      trendUp: true,
      icon: IndianRupee,
      gradient: "from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Parts Sold",
      value: stats?.totalParts ?? 0,
      trend: `+${stats?.totalOrders ?? 0} orders`,
      trendUp: true,
      icon: Package,
      gradient: "from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  // Error state
  if (isStatsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-lg font-semibold">Failed to load dashboard</h2>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          {statsError?.message || "Something went wrong while fetching dashboard data. Please try again."}
        </p>
        <Button onClick={() => refetchStats()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Platform overview and real-time metrics
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isStatsLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <motion.div key={`kpi-skeleton-${index}`} variants={itemVariants}>
                <KpiCardSkeleton />
              </motion.div>
            ))
          : kpiCards.map((kpi) => (
              <motion.div key={kpi.title} variants={itemVariants}>
                <Card className="relative overflow-hidden hover:shadow-md transition-shadow cursor-default group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  <CardContent className="relative pt-0">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground font-medium">
                          {kpi.title}
                        </p>
                        <p className="text-2xl font-bold tracking-tight">
                          <AnimatedCounter
                            target={kpi.value}
                            prefix={kpi.prefix || ""}
                          />
                        </p>
                      </div>
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/80 shadow-sm ${kpi.iconColor}`}>
                        <kpi.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {kpi.trendUp ? (
                        <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          kpi.trendUp
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {kpi.trend}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Live SOS Map + Zone Summary */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Radio className="size-4 text-red-500" />
                Live SOS Map
              </CardTitle>
              <CardDescription>
                {isActiveLoading
                  ? "Loading active breakdowns..."
                  : `${mapMarkers.length} active SOS request${mapMarkers.length !== 1 ? "s" : ""} across all zones`}
              </CardDescription>
            </div>
            {!isActiveLoading && mapMarkers.length > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 animate-pulse">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-red-500" />
                Live
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Map */}
              <div className="lg:col-span-3">
                {isActiveLoading ? (
                  <Skeleton className="h-[420px] w-full rounded-lg" />
                ) : isActiveError ? (
                  <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed bg-muted/30">
                    <div className="text-center">
                      <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                      <p className="text-sm text-muted-foreground">Failed to load active breakdowns</p>
                    </div>
                  </div>
                ) : (
                  <MapView
                    markers={mapMarkers}
                    height="420px"
                    zoom={5}
                  />
                )}
              </div>

              {/* Zone-wise Summary */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="size-4 text-primary" />
                  Zone-wise Active SOS
                </div>

                {isActiveLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                  </div>
                ) : (() => {
                  const zoneCounts = getZoneCounts(activeBreakdowns);
                  if (zoneCounts.length === 0) {
                    return (
                      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/20 p-4">
                        <CheckCircle2 className="size-8 text-green-500/60" />
                        <p className="text-xs text-muted-foreground text-center">
                          No active SOS requests
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div className="flex flex-col gap-2 max-h-[370px] overflow-y-auto pr-1">
                      {zoneCounts.map((z) => (
                        <div
                          key={z.zone}
                          className="flex items-center justify-between rounded-lg border bg-background p-3 transition-colors hover:bg-muted/30"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`size-2.5 rounded-full ${z.count >= 5 ? "bg-red-500 animate-pulse" : z.count >= 2 ? "bg-orange-500" : "bg-yellow-500"}`} />
                            <span className="text-sm font-medium">{z.zone}</span>
                          </div>
                          <Badge
                            className={`border-0 text-xs tabular-nums ${
                              z.count >= 5
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                : z.count >= 2
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                            }`}
                          >
                            {z.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Breakdown Requests (Last 7 Days)</CardTitle>
              <CardDescription>Daily incoming breakdown requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={breakdownData}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="day"
                      className="text-xs"
                      tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="oklch(0.55 0.2 250)"
                      strokeWidth={2}
                      fill="url(#colorRequests)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by service category (INR)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="category"
                      className="text-xs"
                      tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                      tickFormatter={(value) =>
                        `${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [
                        `\u20B9${Number(value).toLocaleString("en-IN")}`,
                        "Revenue",
                      ]}
                    />
                    <Bar
                      dataKey="amount"
                      fill="oklch(0.55 0.2 250)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Breakdowns + Top Mechanics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Breakdowns Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Breakdowns</CardTitle>
              <CardDescription>Latest breakdown requests across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="pb-3 pr-4 text-left font-medium">ID</th>
                      <th className="pb-3 pr-4 text-left font-medium">Rider</th>
                      <th className="pb-3 pr-4 text-left font-medium">Mechanic</th>
                      <th className="pb-3 pr-4 text-left font-medium">Type</th>
                      <th className="pb-3 pr-4 text-left font-medium">Status</th>
                      <th className="pb-3 text-left font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isStatsLoading
                      ? Array.from({ length: 6 }).map((_, index) => (
                          <TableRowSkeleton key={`table-skeleton-${index}`} />
                        ))
                      : recentBreakdowns.map((bd: {
                          id: string;
                          displayId: string;
                          rider: { name: string };
                          mechanic: { user: { name: string } } | null;
                          mechanicId: string | null;
                          emergencyType: string;
                          status: string;
                          createdAt: string;
                        }) => (
                          <tr
                            key={bd.id}
                            className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                          >
                            <td className="py-3 pr-4 font-mono text-xs font-medium">
                              {bd.displayId}
                            </td>
                            <td className="py-3 pr-4">{bd.rider?.name ?? "Unknown"}</td>
                            <td className="py-3 pr-4 text-muted-foreground">
                              {bd.mechanic?.user?.name ?? "Pending"}
                            </td>
                            <td className="py-3 pr-4">{formatEnumLabel(bd.emergencyType)}</td>
                            <td className="py-3 pr-4">
                              <StatusBadge status={mapStatusToLabel(bd.status)} />
                            </td>
                            <td className="py-3 text-muted-foreground text-xs flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {timeAgo(bd.createdAt)}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Mechanics */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Mechanics</CardTitle>
              <CardDescription>Highest rated this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isStatsLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <MechanicSkeleton key={`mech-skeleton-${index}`} />
                    ))
                  : topMechanics.map(
                      (
                        mech: {
                          id: string;
                          userId: string;
                          user: { name: string; avatarUrl: string | null };
                          rating: number;
                          totalJobs: number;
                        },
                        index: number
                      ) => (
                        <div
                          key={mech.id}
                          className="flex items-center gap-3 group"
                        >
                          <span className="text-xs font-bold text-muted-foreground w-4">
                            {index + 1}
                          </span>
                          <Avatar size="default">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                              {getInitials(mech.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {mech.user.name ?? "Unknown"}
                            </p>
                            <StarRating rating={mech.rating} />
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold">{mech.totalJobs}</p>
                            <p className="text-xs text-muted-foreground">jobs</p>
                          </div>
                        </div>
                      )
                    )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Common administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/mechanics">
                  <Button variant="outline" className="w-full justify-start h-11 gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                      <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium">Add Mechanic</span>
                  </Button>
                </Link>
                <Link href="/disputes">
                  <Button variant="outline" className="w-full justify-start h-11 gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                      <Scale className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="font-medium">View Disputes</span>
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full justify-start h-11 gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                      <FileDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium">Export Report</span>
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start h-11 gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                      <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium">Platform Settings</span>
                  </Button>
                </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// --- Route Export ---

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  if (user?.role === "WORKSHOP") {
    return <WorkshopDashboard />;
  }

  return <AdminDashboard />;
}

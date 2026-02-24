"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Wrench,
  IndianRupee,
  Package,
  TrendingUp,
  TrendingDown,
  Star,
  MapPin,
  UserPlus,
  Scale,
  FileDown,
  Settings,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
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

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// --- Mock Data ---

const breakdownData = [
  { day: "Mon", requests: 42 },
  { day: "Tue", requests: 58 },
  { day: "Wed", requests: 35 },
  { day: "Thu", requests: 67 },
  { day: "Fri", requests: 52 },
  { day: "Sat", requests: 73 },
  { day: "Sun", requests: 61 },
];

const revenueData = [
  { category: "Labour", amount: 45000 },
  { category: "Parts", amount: 32000 },
  { category: "Towing", amount: 18000 },
  { category: "Emergency", amount: 28000 },
  { category: "Subscription", amount: 15000 },
];

const recentBreakdowns = [
  { id: "BR-2401", rider: "Arjun Mehta", mechanic: "Ravi Sharma", type: "Flat Tyre", status: "Active", time: "12 min ago" },
  { id: "BR-2402", rider: "Priya Singh", mechanic: "Suresh Kumar", type: "Engine Stall", status: "Completed", time: "25 min ago" },
  { id: "BR-2403", rider: "Vikram Reddy", mechanic: "Pending", type: "Battery Dead", status: "Pending", time: "3 min ago" },
  { id: "BR-2404", rider: "Neha Gupta", mechanic: "Deepak Yadav", type: "Chain Break", status: "Active", time: "18 min ago" },
  { id: "BR-2405", rider: "Rohit Patel", mechanic: "Amit Tiwari", type: "Fuel Empty", status: "Completed", time: "45 min ago" },
  { id: "BR-2406", rider: "Anjali Nair", mechanic: "Pending", type: "Brake Failure", status: "Pending", time: "1 min ago" },
];

const topMechanics = [
  { name: "Ravi Sharma", rating: 4.9, jobs: 342, initials: "RS" },
  { name: "Suresh Kumar", rating: 4.8, jobs: 298, initials: "SK" },
  { name: "Deepak Yadav", rating: 4.7, jobs: 267, initials: "DY" },
  { name: "Amit Tiwari", rating: 4.6, jobs: 234, initials: "AT" },
  { name: "Manoj Verma", rating: 4.5, jobs: 201, initials: "MV" },
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

// --- KPI Card ---

const kpiCards = [
  {
    title: "Active Breakdowns",
    value: 23,
    trend: "+12%",
    trendUp: true,
    icon: AlertTriangle,
    gradient: "from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Mechanics Online",
    value: 147,
    trend: "+5%",
    trendUp: true,
    icon: Wrench,
    gradient: "from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Revenue Today",
    value: 84500,
    prefix: "\u20B9",
    trend: "+18%",
    trendUp: true,
    icon: IndianRupee,
    gradient: "from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Parts Sold",
    value: 56,
    trend: "-3%",
    trendUp: false,
    icon: Package,
    gradient: "from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

// --- Heatmap Regions ---

const heatmapRegions: { name: string; x: string; y: string; intensity: "high" | "medium" | "low" }[] = [
  { name: "Connaught Place", x: "35%", y: "25%", intensity: "high" },
  { name: "Andheri", x: "55%", y: "45%", intensity: "high" },
  { name: "Koramangala", x: "65%", y: "65%", intensity: "medium" },
  { name: "Banjara Hills", x: "45%", y: "55%", intensity: "medium" },
  { name: "Salt Lake", x: "78%", y: "30%", intensity: "low" },
  { name: "Aundh", x: "30%", y: "50%", intensity: "low" },
];

// --- Page Component ---

export default function DashboardPage() {
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
        {kpiCards.map((kpi, index) => (
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
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

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
                    {recentBreakdowns.map((bd) => (
                      <tr
                        key={bd.id}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 pr-4 font-mono text-xs font-medium">
                          {bd.id}
                        </td>
                        <td className="py-3 pr-4">{bd.rider}</td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {bd.mechanic}
                        </td>
                        <td className="py-3 pr-4">{bd.type}</td>
                        <td className="py-3 pr-4">
                          <StatusBadge status={bd.status} />
                        </td>
                        <td className="py-3 text-muted-foreground text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {bd.time}
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
                {topMechanics.map((mech, index) => (
                  <div
                    key={mech.name}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-xs font-bold text-muted-foreground w-4">
                      {index + 1}
                    </span>
                    <Avatar size="default">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                        {mech.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {mech.name}
                      </p>
                      <StarRating rating={mech.rating} />
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">{mech.jobs}</p>
                      <p className="text-xs text-muted-foreground">jobs</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Heatmap + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Breakdown Heatmap Placeholder */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Breakdown Heatmap</CardTitle>
              <CardDescription>Breakdown density across major Indian cities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-[280px] rounded-lg bg-muted/30 border border-dashed overflow-hidden">
                {/* Mock map background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>

                {/* Heatmap blobs */}
                {heatmapRegions.map((region) => {
                  const sizeMap = { high: "w-20 h-20", medium: "w-14 h-14", low: "w-10 h-10" };
                  const colorMap = {
                    high: "bg-red-500/30 border-red-500/40",
                    medium: "bg-yellow-500/30 border-yellow-500/40",
                    low: "bg-green-500/30 border-green-500/40",
                  };
                  return (
                    <motion.div
                      key={region.name}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
                      transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
                      className={`absolute rounded-full blur-sm border ${sizeMap[region.intensity]} ${colorMap[region.intensity]}`}
                      style={{
                        left: region.x,
                        top: region.y,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  );
                })}

                {/* Labels */}
                {heatmapRegions.map((region) => (
                  <div
                    key={`label-${region.name}`}
                    className="absolute flex items-center gap-1"
                    style={{
                      left: region.x,
                      top: region.y,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <MapPin className="h-3.5 w-3.5 text-foreground/70" />
                    <span className="text-xs font-medium text-foreground/70 whitespace-nowrap">
                      {region.name}
                    </span>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-3 right-3 flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1.5 border text-xs">
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" /> High
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" /> Medium
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" /> Low
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
              <CardDescription>Common administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-start h-11 gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">Add Mechanic</span>
                </Button>
                <Button variant="outline" className="justify-start h-11 gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                    <Scale className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="font-medium">View Disputes</span>
                </Button>
                <Button variant="outline" className="justify-start h-11 gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                    <FileDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium">Export Report</span>
                </Button>
                <Button variant="outline" className="justify-start h-11 gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                    <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium">Platform Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

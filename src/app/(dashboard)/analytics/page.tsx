"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  IndianRupee,
  Wrench,
  Package,
  Star,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  Mail,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/lib/hooks/use-admin";
import { toast } from "sonner";

// ---------- Helpers ----------

function formatRevenue(value: number): string {
  if (value >= 100000) {
    return `\u20B9${(value / 100000).toFixed(1)}L`;
  }
  return `\u20B9${value.toLocaleString("en-IN")}`;
}

// ---------- Animation ----------

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

// ---------- Loading Skeleton ----------

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-96" />
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-3 pt-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2 skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Row 3 skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-44" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Row 4 skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 flex-1" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-7 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------- Error State ----------

function AnalyticsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="size-8 text-destructive" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">Failed to load analytics</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Something went wrong while fetching analytics data. Please try again.
        </p>
      </div>
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </div>
  );
}

// ---------- Empty State ----------

function EmptyChartState({ message = "No data available" }: { message?: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center">
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

// ---------- Component ----------

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("this-week");
  const { data, isLoading, isError, refetch } = useAnalytics(dateRange);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (isError) {
    return (
      <AnalyticsError
        onRetry={() => {
          toast.info("Retrying...");
          refetch();
        }}
      />
    );
  }

  const stats = data?.stats;
  const breakdownTrends = data?.breakdownTrends ?? [];
  const breakdownTypes = data?.breakdownTypes ?? [];
  const revenueByMonth = data?.revenueByMonth ?? [];
  const mechanicPerformance = data?.mechanicPerformance ?? [];
  const cityBreakdowns = data?.cityBreakdowns ?? [];
  const topParts = data?.topParts ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Analytics &amp; Reports
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor platform performance and key metrics
          </p>
        </div>

        <Tabs value={dateRange} onValueChange={setDateRange}>
          <TabsList>
            <TabsTrigger value="this-week">This Week</TabsTrigger>
            <TabsTrigger value="this-month">This Month</TabsTrigger>
            <TabsTrigger value="3-months">Last 3 Months</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Row 1 - KPI Summary Cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        {...fadeInUp}
      >
        <StatCard
          title="Total Breakdowns"
          value={
            stats?.totalBreakdowns != null
              ? stats.totalBreakdowns.toLocaleString("en-IN")
              : "--"
          }
          icon={AlertTriangle}
          trend={15}
          trendLabel="vs last period"
        />
        <StatCard
          title="Avg Response Time"
          value={stats?.avgResponseTime ?? "--"}
          icon={Clock}
          trend={-8}
          trendLabel="improved"
        />
        <StatCard
          title="Total Revenue"
          value={
            stats?.totalRevenue != null
              ? formatRevenue(stats.totalRevenue)
              : "--"
          }
          icon={IndianRupee}
          trend={22}
          trendLabel="vs last period"
        />
        <StatCard
          title="Active Mechanics"
          value={
            stats?.activeMechanics != null
              ? stats.activeMechanics.toLocaleString("en-IN")
              : "--"
          }
          icon={Wrench}
          trend={5}
          trendLabel="new joined"
        />
        <StatCard
          title="Parts Sold"
          value={
            stats?.partsSold != null
              ? stats.partsSold.toLocaleString("en-IN")
              : "--"
          }
          icon={Package}
          trend={18}
          trendLabel="vs last period"
        />
        <StatCard
          title="Customer Satisfaction"
          value={stats?.customerSatisfaction ?? "--"}
          icon={Star}
          trend={3}
          trendLabel="improving"
        />
      </motion.div>

      {/* Row 2 - Breakdown Requests + Types Distribution */}
      <motion.div
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Area Chart - Breakdown Requests Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Breakdown Requests Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {breakdownTrends.length === 0 ? (
              <EmptyChartState message="No breakdown trend data available" />
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={breakdownTrends}>
                    <defs>
                      <linearGradient
                        id="breakdownGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4f46e5"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4f46e5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="resolvedGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#06b6d4"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#06b6d4"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="breakdowns"
                      stroke="#4f46e5"
                      fill="url(#breakdownGradient)"
                      strokeWidth={2}
                      name="Breakdowns"
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      stroke="#06b6d4"
                      fill="url(#resolvedGradient)"
                      strokeWidth={2}
                      name="Resolved"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart - Breakdown Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Breakdown Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {breakdownTypes.length === 0 ? (
              <EmptyChartState message="No breakdown type data available" />
            ) : (
              <div className="flex h-[300px] items-center gap-6">
                <div className="h-full flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={breakdownTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {breakdownTypes.map(
                          (entry: { name: string; value: number; color: string }, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid hsl(var(--border))",
                        }}
                        formatter={(value) => [`${value}%`, "Share"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex shrink-0 flex-col gap-3">
                  {breakdownTypes.map(
                    (item: { name: string; value: number; color: string }) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                        <span className="text-muted-foreground ml-auto text-sm font-medium">
                          {item.value}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Row 3 - Revenue + Mechanic Performance */}
      <motion.div
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Bar Chart - Revenue: Services vs Parts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Revenue: Services vs Parts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByMonth.length === 0 ? (
              <EmptyChartState message="No revenue data available" />
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) =>
                        `\u20B9${(v / 1000).toFixed(0)}K`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                      }}
                      formatter={(value) => [
                        `\u20B9${Number(value).toLocaleString("en-IN")}`,
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="services"
                      name="Services"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                      stackId="revenue"
                    />
                    <Bar
                      dataKey="parts"
                      name="Parts"
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                      stackId="revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Mechanic Performance (Top Mechanics by Total Jobs) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mechanic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {mechanicPerformance.length === 0 ? (
              <EmptyChartState message="No mechanic performance data available" />
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mechanicPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                      }}
                      formatter={(value, name) => [value, name]}
                    />
                    <Legend />
                    <Bar
                      dataKey="totalJobs"
                      name="Total Jobs"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Row 4 - City Heatmap + Top Parts */}
      <motion.div
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {/* Breakdown Heatmap by City */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Breakdown Heatmap by City
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cityBreakdowns.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  No city breakdown data available
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cityBreakdowns.map(
                  (city: { city: string; count: number; percentage: number }) => (
                    <div
                      key={city.city}
                      className="flex items-center gap-4"
                    >
                      <span className="w-24 shrink-0 text-sm font-medium">
                        {city.city}
                      </span>
                      <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="flex h-full items-center rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-700"
                          style={{ width: `${city.percentage}%` }}
                        >
                          <span className="pl-3 text-xs font-medium text-primary-foreground">
                            {city.count.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <span className="text-muted-foreground w-10 shrink-0 text-right text-sm">
                        {city.percentage}%
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Demanded Parts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Demanded Parts</CardTitle>
          </CardHeader>
          <CardContent>
            {topParts.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  No parts data available
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topParts.map(
                  (
                    part: { name: string; demand: number; trend: number },
                    index: number
                  ) => (
                    <div
                      key={part.name}
                      className="flex items-center gap-3"
                    >
                      <span className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{part.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {part.demand} units
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {part.trend >= 0 ? (
                          <TrendingUp className="size-3.5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="size-3.5 text-red-500" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            part.trend >= 0
                              ? "text-emerald-500"
                              : "text-red-500"
                          }`}
                        >
                          {part.trend >= 0 ? "+" : ""}
                          {part.trend}%
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Row 5 - Export Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Export Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="text-muted-foreground flex-1 text-sm">
                Download analytics data or share reports with your team.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    // Build CSV from stats data
                    const rows = [
                      ["Metric", "Value"],
                      ["Total Breakdowns", String(stats?.totalBreakdowns ?? 0)],
                      ["Avg Response Time", String(stats?.avgResponseTime ?? "N/A")],
                      ["Total Revenue", String(stats?.totalRevenue ?? 0)],
                      ["Active Mechanics", String(stats?.activeMechanics ?? 0)],
                      ["Parts Sold", String(stats?.partsSold ?? 0)],
                      ["Customer Satisfaction", String(stats?.customerSatisfaction ?? "N/A")],
                    ];
                    // Add city breakdown data
                    if (cityBreakdowns.length > 0) {
                      rows.push([], ["City", "Count", "Percentage"]);
                      cityBreakdowns.forEach((c: { city: string; count: number; percentage: number }) => {
                        rows.push([c.city, String(c.count), `${c.percentage}%`]);
                      });
                    }
                    const csv = rows.map((r) => r.join(",")).join("\n");
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `repair-assist-analytics-${dateRange}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("CSV downloaded");
                  }}
                >
                  <Download className="size-4" />
                  Download CSV
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    // Print the page as PDF
                    window.print();
                    toast.success("Print dialog opened — save as PDF");
                  }}
                >
                  <FileText className="size-4" />
                  Download PDF
                </Button>
                <Button
                  className="gap-2"
                  onClick={() => {
                    // Copy a summary to clipboard for sharing
                    const summary = [
                      `RepairAssist Analytics Report (${dateRange})`,
                      `Total Breakdowns: ${stats?.totalBreakdowns ?? 0}`,
                      `Avg Response Time: ${stats?.avgResponseTime ?? "N/A"}`,
                      `Total Revenue: ${stats?.totalRevenue != null ? formatRevenue(stats.totalRevenue) : "N/A"}`,
                      `Active Mechanics: ${stats?.activeMechanics ?? 0}`,
                      `Parts Sold: ${stats?.partsSold ?? 0}`,
                      `Customer Satisfaction: ${stats?.customerSatisfaction ?? "N/A"}`,
                    ].join("\n");
                    navigator.clipboard.writeText(summary).then(() => {
                      toast.success("Report summary copied to clipboard — paste into email");
                    }).catch(() => {
                      toast.error("Failed to copy to clipboard");
                    });
                  }}
                >
                  <Mail className="size-4" />
                  Email Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

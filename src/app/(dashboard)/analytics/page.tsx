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
} from "lucide-react";
import {
  LineChart,
  Line,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatCard } from "@/components/shared/stat-card";

// ---------- Mock Data ----------

const breakdownOverTimeData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    date: `${day} Jan`,
    breakdowns: Math.floor(40 + Math.random() * 60),
    resolved: Math.floor(30 + Math.random() * 50),
  };
});

const breakdownTypesData = [
  { name: "Puncture", value: 35, color: "#4f46e5" },
  { name: "Engine", value: 25, color: "#06b6d4" },
  { name: "Electrical", value: 20, color: "#f59e0b" },
  { name: "Accident", value: 10, color: "#ef4444" },
  { name: "Other", value: 10, color: "#8b5cf6" },
];

const revenueData = [
  { month: "Aug", services: 320000, parts: 180000 },
  { month: "Sep", services: 380000, parts: 220000 },
  { month: "Oct", services: 410000, parts: 190000 },
  { month: "Nov", services: 360000, parts: 240000 },
  { month: "Dec", services: 450000, parts: 280000 },
  { month: "Jan", services: 420000, parts: 260000 },
];

const mechanicPerformanceData = [
  { week: "W1", avgResponse: 18, avgRating: 4.2 },
  { week: "W2", avgResponse: 16, avgRating: 4.3 },
  { week: "W3", avgResponse: 14, avgRating: 4.4 },
  { week: "W4", avgResponse: 12, avgRating: 4.5 },
  { week: "W5", avgResponse: 13, avgRating: 4.4 },
  { week: "W6", avgResponse: 11, avgRating: 4.6 },
  { week: "W7", avgResponse: 10, avgRating: 4.6 },
  { week: "W8", avgResponse: 12, avgRating: 4.5 },
];

const cityBreakdownData = [
  { city: "Mumbai", count: 1240, percentage: 22 },
  { city: "Delhi", count: 1080, percentage: 19 },
  { city: "Bangalore", count: 890, percentage: 16 },
  { city: "Pune", count: 620, percentage: 11 },
  { city: "Chennai", count: 540, percentage: 10 },
  { city: "Hyderabad", count: 480, percentage: 9 },
  { city: "Kolkata", count: 410, percentage: 7 },
  { city: "Ahmedabad", count: 340, percentage: 6 },
];

const topPartsData = [
  { name: "Brake Pads", demand: 892, trend: 12 },
  { name: "Spark Plugs", demand: 756, trend: 8 },
  { name: "Air Filter", demand: 634, trend: -3 },
  { name: "Chain Set", demand: 521, trend: 15 },
  { name: "Battery", demand: 489, trend: 5 },
  { name: "Headlight Assembly", demand: 367, trend: -2 },
];

// ---------- Component ----------

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("this-week");

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
          value="5,620"
          icon={AlertTriangle}
          trend={15}
          trendLabel="vs last period"
        />
        <StatCard
          title="Avg Response Time"
          value="12 min"
          icon={Clock}
          trend={-8}
          trendLabel="improved"
        />
        <StatCard
          title="Total Revenue"
          value={"\u20B94,52,300"}
          icon={IndianRupee}
          trend={22}
          trendLabel="vs last period"
        />
        <StatCard
          title="Active Mechanics"
          value="348"
          icon={Wrench}
          trend={5}
          trendLabel="new joined"
        />
        <StatCard
          title="Parts Sold"
          value="3,659"
          icon={Package}
          trend={18}
          trendLabel="vs last period"
        />
        <StatCard
          title="Customer Satisfaction"
          value="4.6 / 5.0"
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
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={breakdownOverTimeData}>
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
            <div className="flex h-[300px] items-center gap-6">
              <div className="h-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdownTypesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {breakdownTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
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
                {breakdownTypesData.map((item) => (
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
                ))}
              </div>
            </div>
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
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
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
                    tickFormatter={(v) =>
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
          </CardContent>
        </Card>

        {/* Line Chart - Mechanic Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mechanic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mechanicPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    label={{
                      value: "Avg Response (min)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11 },
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[3, 5]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    label={{
                      value: "Avg Rating",
                      angle: 90,
                      position: "insideRight",
                      style: { fontSize: 11 },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="avgResponse"
                    name="Avg Response (min)"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgRating"
                    name="Avg Rating"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
            <div className="space-y-3">
              {cityBreakdownData.map((city) => (
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Demanded Parts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Demanded Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPartsData.map((part, index) => (
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
              ))}
            </div>
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
                <Button variant="outline" className="gap-2">
                  <Download className="size-4" />
                  Download CSV
                </Button>
                <Button variant="outline" className="gap-2">
                  <FileText className="size-4" />
                  Download PDF
                </Button>
                <Button className="gap-2">
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

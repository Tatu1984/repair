"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Activity,
  MapPin,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// --- Mock Data ---

const breakdowns = [
  {
    id: "BR-2401",
    rider: "Arjun Mehta",
    phone: "+91 98765 43210",
    location: "MG Road, Bengaluru",
    type: "Flat Tyre",
    mechanic: "Ravi Sharma",
    status: "Active",
    requestedAt: "24 Feb, 10:32 AM",
    vehicle: "Honda Activa 6G",
  },
  {
    id: "BR-2402",
    rider: "Priya Singh",
    phone: "+91 87654 32109",
    location: "Connaught Place, Delhi",
    type: "Engine Stall",
    mechanic: "Suresh Kumar",
    status: "Completed",
    requestedAt: "24 Feb, 10:15 AM",
    vehicle: "Royal Enfield Classic 350",
  },
  {
    id: "BR-2403",
    rider: "Vikram Reddy",
    phone: "+91 76543 21098",
    location: "Banjara Hills, Hyderabad",
    type: "Battery Dead",
    mechanic: "Unassigned",
    status: "Pending",
    requestedAt: "24 Feb, 10:45 AM",
    vehicle: "TVS Jupiter",
  },
  {
    id: "BR-2404",
    rider: "Neha Gupta",
    phone: "+91 65432 10987",
    location: "Andheri West, Mumbai",
    type: "Chain Break",
    mechanic: "Deepak Yadav",
    status: "Active",
    requestedAt: "24 Feb, 09:58 AM",
    vehicle: "Bajaj Pulsar 150",
  },
  {
    id: "BR-2405",
    rider: "Rohit Patel",
    phone: "+91 54321 09876",
    location: "Navrangpura, Ahmedabad",
    type: "Fuel Empty",
    mechanic: "Amit Tiwari",
    status: "Completed",
    requestedAt: "24 Feb, 09:30 AM",
    vehicle: "Hero Splendor Plus",
  },
  {
    id: "BR-2406",
    rider: "Anjali Nair",
    phone: "+91 43210 98765",
    location: "Koramangala, Bengaluru",
    type: "Brake Failure",
    mechanic: "Unassigned",
    status: "Pending",
    requestedAt: "24 Feb, 10:50 AM",
    vehicle: "Ola S1 Pro",
  },
  {
    id: "BR-2407",
    rider: "Sanjay Mishra",
    phone: "+91 32109 87654",
    location: "Salt Lake, Kolkata",
    type: "Puncture",
    mechanic: "Rajesh Das",
    status: "Completed",
    requestedAt: "24 Feb, 08:45 AM",
    vehicle: "Suzuki Access 125",
  },
  {
    id: "BR-2408",
    rider: "Kavita Deshmukh",
    phone: "+91 21098 76543",
    location: "Aundh, Pune",
    type: "Clutch Issue",
    mechanic: "Manoj Verma",
    status: "Cancelled",
    requestedAt: "24 Feb, 08:20 AM",
    vehicle: "KTM Duke 200",
  },
  {
    id: "BR-2409",
    rider: "Deepika Iyer",
    phone: "+91 10987 65432",
    location: "T. Nagar, Chennai",
    type: "Self-Start Fail",
    mechanic: "Karthik R.",
    status: "Active",
    requestedAt: "24 Feb, 10:55 AM",
    vehicle: "Yamaha FZ-S V3",
  },
  {
    id: "BR-2410",
    rider: "Manish Joshi",
    phone: "+91 99887 76655",
    location: "Civil Lines, Jaipur",
    type: "Overheating",
    mechanic: "Unassigned",
    status: "Pending",
    requestedAt: "24 Feb, 11:02 AM",
    vehicle: "Ather 450X",
  },
];

// --- Status Badge ---

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string; icon: React.ReactNode }> = {
    Pending: {
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      icon: <Clock className="h-3 w-3" />,
    },
    Active: {
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      icon: <Activity className="h-3 w-3" />,
    },
    Completed: {
      className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    Cancelled: {
      className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
      icon: <XCircle className="h-3 w-3" />,
    },
  };

  const { className, icon } = config[status] || config.Pending;

  return (
    <Badge variant="secondary" className={`gap-1 ${className}`}>
      {icon}
      {status}
    </Badge>
  );
}

// --- Emergency Type Badge ---

function EmergencyBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    "Flat Tyre": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "Engine Stall": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    "Battery Dead": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "Chain Break": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Fuel Empty": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    "Brake Failure": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    Puncture: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "Clutch Issue": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    "Self-Start Fail": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    Overheating: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  return (
    <Badge variant="secondary" className={colorMap[type] || "bg-muted text-muted-foreground"}>
      {type}
    </Badge>
  );
}

// --- Page Component ---

export default function BreakdownsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredBreakdowns = breakdowns.filter((bd) => {
    const matchesStatus =
      statusFilter === "all" || bd.status.toLowerCase() === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      bd.rider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bd.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bd.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bd.mechanic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBreakdowns.length / itemsPerPage);
  const paginatedBreakdowns = filteredBreakdowns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: breakdowns.length,
    active: breakdowns.filter((b) => b.status === "Active").length,
    completed: breakdowns.filter((b) => b.status === "Completed").length,
    cancelled: breakdowns.filter((b) => b.status === "Cancelled").length,
    pending: breakdowns.filter((b) => b.status === "Pending").length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Breakdown Requests</h1>
          <p className="text-muted-foreground text-sm">
            Manage and track all breakdown assistance requests
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by rider, ID, location..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Stats Bar */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-0">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">{stats.total}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.active}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cancelled</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.cancelled}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-3 pr-4 text-left font-medium">Request ID</th>
                    <th className="pb-3 pr-4 text-left font-medium">Rider Name</th>
                    <th className="pb-3 pr-4 text-left font-medium">Location</th>
                    <th className="pb-3 pr-4 text-left font-medium">Emergency Type</th>
                    <th className="pb-3 pr-4 text-left font-medium">Assigned Mechanic</th>
                    <th className="pb-3 pr-4 text-left font-medium">Status</th>
                    <th className="pb-3 pr-4 text-left font-medium">Requested At</th>
                    <th className="pb-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBreakdowns.map((bd, index) => (
                    <motion.tr
                      key={bd.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 pr-4 font-mono text-xs font-semibold">
                        {bd.id}
                      </td>
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium">{bd.rider}</p>
                          <p className="text-xs text-muted-foreground">{bd.vehicle}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="text-xs">{bd.location}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <EmergencyBadge type={bd.type} />
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {bd.mechanic === "Unassigned" ? (
                          <span className="text-xs italic text-muted-foreground/60">
                            Unassigned
                          </span>
                        ) : (
                          bd.mechanic
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={bd.status} />
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">
                        {bd.requestedAt}
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="xs">
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBreakdowns.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">No breakdowns found</p>
                <p className="text-xs">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-6 py-4">
              <p className="text-xs text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredBreakdowns.length)} of{" "}
                {filteredBreakdowns.length} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="icon-xs"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserPlus,
  Star,
  Phone,
  MapPin,
  LayoutGrid,
  List,
  Shield,
  ShieldCheck,
  ShieldX,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle2,
  XCircle,
  Zap,
  Wrench,
  Clock,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Mock Data ---

const mechanics = [
  {
    id: "MEC-001",
    name: "Ravi Sharma",
    phone: "+91 98765 43210",
    location: "Lajpat Nagar, Delhi",
    skills: ["2W", "4W"],
    rating: 4.9,
    totalJobs: 342,
    completedToday: 5,
    status: "Online",
    verified: true,
    joinedDate: "Jan 2024",
    initials: "RS",
    earnings: 48500,
  },
  {
    id: "MEC-002",
    name: "Suresh Kumar",
    phone: "+91 87654 32109",
    location: "Andheri East, Mumbai",
    skills: ["2W", "EV"],
    rating: 4.8,
    totalJobs: 298,
    completedToday: 3,
    status: "Busy",
    verified: true,
    joinedDate: "Mar 2024",
    initials: "SK",
    earnings: 42000,
  },
  {
    id: "MEC-003",
    name: "Deepak Yadav",
    phone: "+91 76543 21098",
    location: "Koramangala, Bengaluru",
    skills: ["2W", "4W", "EV"],
    rating: 4.7,
    totalJobs: 267,
    completedToday: 4,
    status: "Online",
    verified: true,
    joinedDate: "Feb 2024",
    initials: "DY",
    earnings: 39800,
  },
  {
    id: "MEC-004",
    name: "Amit Tiwari",
    phone: "+91 65432 10987",
    location: "Aundh, Pune",
    skills: ["2W"],
    rating: 4.6,
    totalJobs: 234,
    completedToday: 2,
    status: "Offline",
    verified: true,
    joinedDate: "Apr 2024",
    initials: "AT",
    earnings: 35200,
  },
  {
    id: "MEC-005",
    name: "Karthik Rajan",
    phone: "+91 54321 09876",
    location: "T. Nagar, Chennai",
    skills: ["2W", "4W"],
    rating: 4.3,
    totalJobs: 45,
    completedToday: 0,
    status: "Online",
    verified: false,
    joinedDate: "Feb 2025",
    initials: "KR",
    earnings: 12800,
  },
  {
    id: "MEC-006",
    name: "Manoj Verma",
    phone: "+91 43210 98765",
    location: "Salt Lake, Kolkata",
    skills: ["2W", "EV"],
    rating: 4.5,
    totalJobs: 201,
    completedToday: 3,
    status: "Busy",
    verified: true,
    joinedDate: "May 2024",
    initials: "MV",
    earnings: 31500,
  },
];

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

// --- Status Indicator ---

function OnlineStatus({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    Online: { color: "bg-green-500", label: "Online" },
    Offline: { color: "bg-gray-400", label: "Offline" },
    Busy: { color: "bg-orange-500", label: "Busy" },
  };

  const { color, label } = config[status] || config.Offline;

  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color} animate-pulse`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

// --- Skill Badge ---

function SkillBadge({ skill }: { skill: string }) {
  const config: Record<string, { className: string; icon: React.ReactNode }> = {
    "2W": {
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      icon: <Wrench className="h-2.5 w-2.5" />,
    },
    "4W": {
      className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      icon: <Wrench className="h-2.5 w-2.5" />,
    },
    EV: {
      className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      icon: <Zap className="h-2.5 w-2.5" />,
    },
  };

  const { className, icon } = config[skill] || { className: "bg-muted", icon: null };

  return (
    <Badge variant="secondary" className={`gap-1 text-xs py-0 ${className}`}>
      {icon}
      {skill}
    </Badge>
  );
}

// --- Page Component ---

export default function MechanicsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mechanics.filter((m) => {
    const matchesSearch =
      searchQuery === "" ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && m.verified) ||
      (statusFilter === "pending" && !m.verified) ||
      (statusFilter === "online" && m.status === "Online") ||
      (statusFilter === "offline" && m.status === "Offline");

    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-2xl font-bold tracking-tight">Mechanics</h1>
          <p className="text-muted-foreground text-sm">
            Manage and monitor registered mechanics
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Mechanic
        </Button>
      </motion.div>

      {/* Controls */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search mechanics..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Mechanics</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending Verification</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-md border p-0.5">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon-xs"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="icon-xs"
            onClick={() => setViewMode("table")}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>

      {/* Grid View */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map((mech, index) => (
              <motion.div
                key={mech.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="pt-0">
                    {/* Top row: avatar + name + actions */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar size="lg">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {mech.initials}
                            </AvatarFallback>
                          </Avatar>
                          {/* Online status dot */}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${
                              mech.status === "Online"
                                ? "bg-green-500"
                                : mech.status === "Busy"
                                ? "bg-orange-500"
                                : "bg-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-sm">{mech.name}</h3>
                            {mech.verified && (
                              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                            )}
                          </div>
                          <OnlineStatus status={mech.status} />
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          {!mech.verified && (
                            <>
                              <DropdownMenuItem>
                                <CheckCircle2 className="h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="destructive">
                                <XCircle className="h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive">
                            <Ban className="h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Info */}
                    <div className="mt-4 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {mech.phone}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {mech.location}
                      </div>
                      <StarRating rating={mech.rating} />
                    </div>

                    {/* Skills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {mech.skills.map((skill) => (
                        <SkillBadge key={skill} skill={skill} />
                      ))}
                      {!mech.verified && (
                        <Badge variant="outline" className="gap-1 text-xs py-0 border-yellow-500/50 text-yellow-600 dark:text-yellow-400">
                          <Clock className="h-2.5 w-2.5" />
                          Pending
                        </Badge>
                      )}
                    </div>

                    {/* Stats footer */}
                    <div className="mt-4 flex items-center justify-between border-t pt-3">
                      <div className="text-center">
                        <p className="text-sm font-bold">{mech.totalJobs}</p>
                        <p className="text-xs text-muted-foreground">Total Jobs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">{mech.completedToday}</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">
                          {"\u20B9"}
                          {(mech.earnings / 1000).toFixed(1)}k
                        </p>
                        <p className="text-xs text-muted-foreground">Earnings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Table View */
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="pb-3 pr-4 text-left font-medium">Mechanic</th>
                        <th className="pb-3 pr-4 text-left font-medium">Phone</th>
                        <th className="pb-3 pr-4 text-left font-medium">Location</th>
                        <th className="pb-3 pr-4 text-left font-medium">Skills</th>
                        <th className="pb-3 pr-4 text-left font-medium">Rating</th>
                        <th className="pb-3 pr-4 text-left font-medium">Jobs</th>
                        <th className="pb-3 pr-4 text-left font-medium">Status</th>
                        <th className="pb-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((mech) => (
                        <tr
                          key={mech.id}
                          className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <Avatar size="sm">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                  {mech.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{mech.name}</span>
                                  {mech.verified && (
                                    <ShieldCheck className="h-3 w-3 text-blue-500" />
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {mech.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-xs text-muted-foreground">
                            {mech.phone}
                          </td>
                          <td className="py-3 pr-4 text-xs text-muted-foreground">
                            {mech.location}
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex gap-1">
                              {mech.skills.map((s) => (
                                <SkillBadge key={s} skill={s} />
                              ))}
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <StarRating rating={mech.rating} />
                          </td>
                          <td className="py-3 pr-4 font-medium">{mech.totalJobs}</td>
                          <td className="py-3 pr-4">
                            <OnlineStatus status={mech.status} />
                          </td>
                          <td className="py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-xs">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                {!mech.verified && (
                                  <>
                                    <DropdownMenuItem>
                                      <CheckCircle2 className="h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive">
                                      <ShieldX className="h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive">
                                  <Ban className="h-4 w-4" />
                                  Suspend
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-muted-foreground"
        >
          <Search className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm font-medium">No mechanics found</p>
          <p className="text-xs">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}
    </motion.div>
  );
}

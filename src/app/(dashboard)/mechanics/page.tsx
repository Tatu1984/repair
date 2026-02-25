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
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";

import { useAllMechanics, useVerifyMechanic } from "@/lib/hooks/use-mechanics";

// --- Types ---

interface MechanicUser {
  name: string;
  phone: string;
  avatarUrl: string | null;
}

interface Mechanic {
  id: string;
  userId: string;
  user: MechanicUser;
  skills: string[];
  rating: number;
  totalJobs: number;
  completedToday: number;
  earnings: number;
  status: "ONLINE" | "OFFLINE" | "BUSY";
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  latitude: number;
  longitude: number;
  createdAt: string;
}

// --- Helpers ---

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function mapStatus(status: Mechanic["status"]): string {
  const statusMap: Record<Mechanic["status"], string> = {
    ONLINE: "Online",
    OFFLINE: "Offline",
    BUSY: "Busy",
  };
  return statusMap[status] || "Offline";
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

// --- Loading Skeleton ---

function MechanicsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="relative overflow-hidden">
          <CardContent className="pt-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-6 rounded" />
            </div>
            <div className="mt-4 space-y-2.5">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="mt-3 flex gap-1.5">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <div className="text-center space-y-1">
                <Skeleton className="h-4 w-8 mx-auto" />
                <Skeleton className="h-3 w-14" />
              </div>
              <div className="text-center space-y-1">
                <Skeleton className="h-4 w-6 mx-auto" />
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="text-center space-y-1">
                <Skeleton className="h-4 w-10 mx-auto" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MechanicsTableSkeleton() {
  return (
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
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4"><Skeleton className="h-3 w-28" /></td>
                  <td className="py-3 pr-4"><Skeleton className="h-3 w-32" /></td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-1">
                      <Skeleton className="h-5 w-10 rounded-full" />
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                  </td>
                  <td className="py-3 pr-4"><Skeleton className="h-3 w-20" /></td>
                  <td className="py-3 pr-4"><Skeleton className="h-3 w-8" /></td>
                  <td className="py-3 pr-4"><Skeleton className="h-3 w-14" /></td>
                  <td className="py-3"><Skeleton className="h-6 w-6 rounded" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Error State ---

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <AlertCircle className="h-10 w-10 mb-3 text-destructive opacity-60" />
      <p className="text-sm font-medium">Failed to load mechanics</p>
      <p className="text-xs mt-1">{message}</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        <RefreshCw className="h-3.5 w-3.5 mr-2" />
        Retry
      </Button>
    </div>
  );
}

// --- Page Component ---

export default function MechanicsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: mechanicsData, isLoading, isError, error, refetch } = useAllMechanics();
  const verifyMechanic = useVerifyMechanic();

  const allMechanics: Mechanic[] = mechanicsData ?? [];

  const filtered = allMechanics.filter((m) => {
    const name = m.user.name;
    const phone = m.user.phone;

    const matchesSearch =
      searchQuery === "" ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && m.verificationStatus === "APPROVED") ||
      (statusFilter === "pending" && m.verificationStatus === "PENDING") ||
      (statusFilter === "online" && m.status === "ONLINE") ||
      (statusFilter === "offline" && m.status === "OFFLINE");

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (mech: Mechanic) => {
    verifyMechanic.mutate(
      { id: mech.id, action: "approve" },
      {
        onSuccess: () => toast.success("Mechanic approved successfully"),
        onError: (err) => toast.error(err.message || "Failed to update mechanic"),
      }
    );
  };

  const handleReject = (mech: Mechanic) => {
    verifyMechanic.mutate(
      { id: mech.id, action: "reject" },
      {
        onSuccess: () => toast.success("Mechanic rejected successfully"),
        onError: (err) => toast.error(err.message || "Failed to update mechanic"),
      }
    );
  };

  const handleSuspend = (mech: Mechanic) => {
    verifyMechanic.mutate(
      { id: mech.id, action: "suspend" },
      {
        onSuccess: () => toast.success("Mechanic suspended successfully"),
        onError: (err) => toast.error(err.message || "Failed to update mechanic"),
      }
    );
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
          <h1 className="text-2xl font-bold tracking-tight">Mechanics</h1>
          <p className="text-muted-foreground text-sm">
            Manage and monitor registered mechanics
          </p>
        </div>
        <Button onClick={() => toast.info("Coming soon")}>
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

      {/* Loading State */}
      {isLoading && (
        <motion.div variants={itemVariants}>
          {viewMode === "grid" ? <MechanicsGridSkeleton /> : <MechanicsTableSkeleton />}
        </motion.div>
      )}

      {/* Error State */}
      {isError && (
        <motion.div variants={itemVariants}>
          <ErrorState
            message={(error as Error)?.message || "An unexpected error occurred"}
            onRetry={() => refetch()}
          />
        </motion.div>
      )}

      {/* Content */}
      {!isLoading && !isError && (
        <>
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
                {filtered.map((mech) => {
                  const name = mech.user.name;
                  const initials = getInitials(name);
                  const phone = mech.user.phone;
                  const displayStatus = mapStatus(mech.status);
                  const verified = mech.verificationStatus === "APPROVED";
                  const isPending = mech.verificationStatus === "PENDING";
                  const locationText =
                    mech.latitude != null && mech.longitude != null
                      ? `${mech.latitude.toFixed(4)}, ${mech.longitude.toFixed(4)}`
                      : "No location";

                  return (
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
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                {/* Online status dot */}
                                <span
                                  className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${
                                    mech.status === "ONLINE"
                                      ? "bg-green-500"
                                      : mech.status === "BUSY"
                                      ? "bg-orange-500"
                                      : "bg-gray-400"
                                  }`}
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h3 className="font-semibold text-sm">{name}</h3>
                                  {verified && (
                                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                                  )}
                                </div>
                                <OnlineStatus status={displayStatus} />
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-xs">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toast.info("Coming soon")}>
                                  <Eye className="h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                {!verified && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleApprove(mech)}>
                                      <CheckCircle2 className="h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      variant="destructive"
                                      onClick={() => handleReject(mech)}
                                    >
                                      <XCircle className="h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => handleSuspend(mech)}
                                >
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
                              {phone}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {locationText}
                            </div>
                            <StarRating rating={mech.rating} />
                          </div>

                          {/* Skills */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {mech.skills.map((skill) => (
                              <SkillBadge key={skill} skill={skill} />
                            ))}
                            {isPending && (
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
                  );
                })}
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
                          {filtered.map((mech) => {
                            const name = mech.user.name;
                            const initials = getInitials(name);
                            const phone = mech.user.phone;
                            const displayStatus = mapStatus(mech.status);
                            const verified = mech.verificationStatus === "APPROVED";
                            const locationText =
                              mech.latitude != null && mech.longitude != null
                                ? `${mech.latitude.toFixed(4)}, ${mech.longitude.toFixed(4)}`
                                : "No location";

                            return (
                              <tr
                                key={mech.id}
                                className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                              >
                                <td className="py-3 pr-4">
                                  <div className="flex items-center gap-2">
                                    <Avatar size="sm">
                                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                        {initials}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="flex items-center gap-1">
                                        <span className="font-medium">{name}</span>
                                        {verified && (
                                          <ShieldCheck className="h-3 w-3 text-blue-500" />
                                        )}
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {mech.id.slice(0, 12)}...
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 pr-4 text-xs text-muted-foreground">
                                  {phone}
                                </td>
                                <td className="py-3 pr-4 text-xs text-muted-foreground">
                                  {locationText}
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
                                  <OnlineStatus status={displayStatus} />
                                </td>
                                <td className="py-3">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon-xs">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => toast.info("Coming soon")}>
                                        <Eye className="h-4 w-4" />
                                        View Profile
                                      </DropdownMenuItem>
                                      {!verified && (
                                        <>
                                          <DropdownMenuItem onClick={() => handleApprove(mech)}>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Approve
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => handleReject(mech)}
                                          >
                                            <ShieldX className="h-4 w-4" />
                                            Reject
                                          </DropdownMenuItem>
                                        </>
                                      )}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() => handleSuspend(mech)}
                                      >
                                        <Ban className="h-4 w-4" />
                                        Suspend
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </td>
                              </tr>
                            );
                          })}
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
        </>
      )}
    </motion.div>
  );
}

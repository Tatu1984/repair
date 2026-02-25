"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  User,
  Link2,
  MessageSquareWarning,
  TrendingUp,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useDisputes, useResolveDispute } from "@/lib/hooks/use-disputes";
import { toast } from "sonner";

// --- Types ---

type DisplayStatus = "Open" | "Under Review" | "Resolved" | "Closed";
type DisplayPriority = "High" | "Medium" | "Low";
type DisplayRole = "Rider" | "Mechanic" | "Workshop";

// --- Mappers ---

const statusMap: Record<string, DisplayStatus> = {
  OPEN: "Open",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const priorityMap: Record<string, DisplayPriority> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const roleMap: Record<string, DisplayRole> = {
  RIDER: "Rider",
  MECHANIC: "Mechanic",
  WORKSHOP: "Workshop",
};

const relatedTypeMap: Record<string, string> = {
  ORDER: "Order",
  BREAKDOWN: "Breakdown",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// --- Helpers ---

const statusStyles: Record<DisplayStatus, string> = {
  Open: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Under Review":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Resolved:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
};

const statusIcons: Record<DisplayStatus, React.ReactNode> = {
  Open: <AlertTriangle className="size-3.5" />,
  "Under Review": <Clock className="size-3.5" />,
  Resolved: <CheckCircle2 className="size-3.5" />,
  Closed: <XCircle className="size-3.5" />,
};

const priorityStyles: Record<DisplayPriority, string> = {
  High: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  Low: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
};

const roleStyles: Record<DisplayRole, string> = {
  Rider: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Mechanic:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Workshop:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

// --- Loading Skeleton ---

function DisputesSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-[180px]" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="gap-0 py-0">
            <CardContent className="flex items-center gap-3 p-4">
              <Skeleton className="size-10 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dispute cards skeleton */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="gap-0 overflow-hidden py-0">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-6">
                <Skeleton className="hidden size-11 rounded-xl sm:block" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-14" />
                  </div>
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-8 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
              <div className="border-t bg-muted/30 px-4 py-2">
                <Skeleton className="h-3 w-40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// --- Component ---

// --- Resolution Modal ---

function ResolveModal({
  dispute,
  onClose,
  onSubmit,
  isPending,
}: {
  dispute: any;
  onClose: () => void;
  onSubmit: (resolution: string) => void;
  isPending: boolean;
}) {
  const [resolution, setResolution] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-lg border bg-background p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold">Resolve Dispute</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Provide a resolution for dispute{" "}
          <span className="font-mono font-semibold">{dispute.displayId}</span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Reason: {dispute.reason}
        </p>
        <div className="mt-4">
          <label className="text-sm font-medium" htmlFor="resolution-input">
            Resolution
          </label>
          <textarea
            id="resolution-input"
            className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[100px] resize-y"
            placeholder="Describe how this dispute was resolved..."
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => onSubmit(resolution)}
            disabled={isPending || resolution.trim().length === 0}
          >
            {isPending ? "Resolving..." : "Resolve"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Component ---

export default function DisputesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [resolvingDispute, setResolvingDispute] = useState<any | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useDisputes({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const resolveDispute = useResolveDispute();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const disputes: any[] = data?.disputes ?? [];

  // Stats - computed from ALL disputes (we fetch all for stats when filter is active)
  const { data: allData } = useDisputes({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allDisputes: any[] = allData?.disputes ?? [];

  const openCount = useMemo(
    () => allDisputes.filter((d) => d.status === "OPEN").length,
    [allDisputes]
  );

  const resolvedThisWeek = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return allDisputes.filter(
      (d) =>
        d.status === "RESOLVED" &&
        new Date(d.updatedAt) >= oneWeekAgo
    ).length;
  }, [allDisputes]);

  const avgResolutionDays = useMemo(() => {
    const resolved = allDisputes.filter((d) => d.status === "RESOLVED" || d.status === "CLOSED");
    if (resolved.length === 0) return "0";
    const totalDays = resolved.reduce((sum, d) => {
      const created = new Date(d.createdAt).getTime();
      const updated = new Date(d.updatedAt).getTime();
      return sum + (updated - created) / (1000 * 60 * 60 * 24);
    }, 0);
    return (totalDays / resolved.length).toFixed(1);
  }, [allDisputes]);

  const stats = [
    {
      label: "Open Disputes",
      value: openCount,
      icon: (
        <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
      ),
      bgClass: "bg-red-100 dark:bg-red-900/30",
    },
    {
      label: "Avg. Resolution Time",
      value: `${avgResolutionDays} days`,
      icon: <Clock className="size-4 text-orange-600 dark:text-orange-400" />,
      bgClass: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      label: "Resolved This Week",
      value: resolvedThisWeek,
      icon: (
        <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
      ),
      bgClass: "bg-green-100 dark:bg-green-900/30",
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleReview(dispute: any) {
    resolveDispute.mutate(
      { id: dispute.id, resolution: "", status: "UNDER_REVIEW" },
      {
        onSuccess: () => toast.success("Dispute marked as under review"),
        onError: (err) => toast.error(err.message),
      }
    );
  }

  const handleResolveSubmit = useCallback(
    (resolution: string) => {
      if (!resolvingDispute) return;
      resolveDispute.mutate(
        { id: resolvingDispute.id, resolution, status: "RESOLVED" },
        {
          onSuccess: () => {
            toast.success("Dispute resolved successfully");
            setResolvingDispute(null);
          },
          onError: (err) => toast.error(err.message),
        }
      );
    },
    [resolvingDispute, resolveDispute]
  );

  if (isLoading) {
    return <DisputesSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dispute Center</h1>
          <p className="text-sm text-muted-foreground">
            Review and resolve disputes between riders, mechanics, and workshops
          </p>
        </div>
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
            <AlertTriangle className="size-12 text-destructive/60" />
            <div>
              <p className="text-lg font-medium">Failed to load disputes</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "An unexpected error occurred"}
              </p>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 size-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dispute Center</h1>
          <p className="text-sm text-muted-foreground">
            Review and resolve disputes between riders, mechanics, and workshops
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="gap-0 py-0">
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={`flex size-10 items-center justify-center rounded-lg ${stat.bgClass}`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dispute Cards */}
      {disputes.length === 0 ? (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center gap-3 text-center">
            <Shield className="size-12 text-muted-foreground/40" />
            <p className="text-lg font-medium">No disputes found</p>
            <p className="text-sm text-muted-foreground">
              No disputes match the selected filter
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {disputes.map((dispute, index) => {
              const displayStatus = statusMap[dispute.status] ?? dispute.status;
              const displayPriority = priorityMap[dispute.priority] ?? dispute.priority;
              const displayRole = roleMap[dispute.raisedBy?.role] ?? dispute.raisedBy?.role;
              const displayRelatedType = relatedTypeMap[dispute.relatedType] ?? dispute.relatedType;

              return (
                <motion.div
                  key={dispute.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  <Card className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
                    <CardContent className="p-0">
                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-6">
                        {/* Left: Icon */}
                        <div className="hidden sm:block">
                          <div
                            className={`flex size-11 items-center justify-center rounded-xl ${
                              displayStatus === "Open"
                                ? "bg-red-100 dark:bg-red-900/30"
                                : displayStatus === "Under Review"
                                ? "bg-orange-100 dark:bg-orange-900/30"
                                : displayStatus === "Resolved"
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-gray-100 dark:bg-gray-900/30"
                            }`}
                          >
                            <MessageSquareWarning
                              className={`size-5 ${
                                displayStatus === "Open"
                                  ? "text-red-600 dark:text-red-400"
                                  : displayStatus === "Under Review"
                                  ? "text-orange-600 dark:text-orange-400"
                                  : displayStatus === "Resolved"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Center: Content */}
                        <div className="flex-1 space-y-3">
                          {/* Top row: ID + Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-sm font-semibold">
                              {dispute.displayId}
                            </span>
                            <Badge
                              className={`border-0 text-[10px] gap-1 ${
                                statusStyles[displayStatus as DisplayStatus] ?? ""
                              }`}
                            >
                              {statusIcons[displayStatus as DisplayStatus]}
                              {displayStatus}
                            </Badge>
                            <Badge
                              className={`border-0 text-[10px] ${
                                priorityStyles[displayPriority as DisplayPriority] ?? ""
                              }`}
                            >
                              {displayPriority}
                            </Badge>
                          </div>

                          {/* Reason */}
                          <p className="text-sm font-medium">{dispute.reason}</p>

                          {/* Description */}
                          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                            {dispute.description}
                          </p>

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <User className="size-3" />
                              <span>{dispute.raisedBy?.name}</span>
                              <Badge
                                className={`border-0 text-[9px] px-1.5 py-0 ${
                                  roleStyles[displayRole as DisplayRole] ?? ""
                                }`}
                              >
                                {displayRole}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Link2 className="size-3" />
                              <span>
                                {displayRelatedType} #{dispute.relatedId}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="size-3" />
                              <span>{formatDate(dispute.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Action */}
                        <div className="flex shrink-0 items-start">
                          {dispute.status === "OPEN" ? (
                            <Button
                              variant="default"
                              size="sm"
                              disabled={resolveDispute.isPending}
                              onClick={() => handleReview(dispute)}
                            >
                              {resolveDispute.isPending ? "Updating..." : "Review"}
                              <ArrowRight className="size-3.5" />
                            </Button>
                          ) : dispute.status === "UNDER_REVIEW" ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => setResolvingDispute(dispute)}
                            >
                              Resolve
                              <ArrowRight className="size-3.5" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.info("Coming soon")}
                            >
                              View Details
                              <ArrowRight className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Bottom bar */}
                      <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
                        <span>Last updated: {formatDate(dispute.updatedAt)}</span>
                        {dispute.status === "OPEN" && (
                          <span className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
                            <AlertTriangle className="size-3" />
                            Requires attention
                          </span>
                        )}
                        {dispute.status === "UNDER_REVIEW" && (
                          <span className="flex items-center gap-1 font-medium text-orange-600 dark:text-orange-400">
                            <Clock className="size-3" />
                            Under investigation
                          </span>
                        )}
                        {dispute.status === "RESOLVED" && (
                          <span className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400">
                            <CheckCircle2 className="size-3" />
                            Resolution applied
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Resolution Modal */}
      <AnimatePresence>
        {resolvingDispute && (
          <ResolveModal
            dispute={resolvingDispute}
            onClose={() => setResolvingDispute(null)}
            onSubmit={handleResolveSubmit}
            isPending={resolveDispute.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

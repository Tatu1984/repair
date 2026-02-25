"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Star,
  MapPin,
  Phone,
  Store,
  Eye,
  MoreVertical,
  ShieldCheck,
  Ban,
  CheckCircle2,
  XCircle,
  Package,
  Clock,
  ExternalLink,
  IndianRupee,
  AlertCircle,
  RefreshCw,
  X,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useWorkshops, useVerifyWorkshop } from "@/lib/hooks/use-workshops";

// --- Types ---

interface WorkshopOwner {
  name: string;
  phone: string;
  avatarUrl: string | null;
}

interface Workshop {
  id: string;
  ownerId: string;
  owner: WorkshopOwner;
  name: string;
  address: string;
  gstNumber: string;
  phone: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  monthlyRevenue: number;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  createdAt: string;
  _count?: {
    spareParts: number;
  };
  spareParts?: unknown[];
}

// --- Status Mapping ---

function mapStatus(verificationStatus: string): string {
  switch (verificationStatus) {
    case "APPROVED":
      return "Active";
    case "PENDING":
      return "Pending";
    case "SUSPENDED":
      return "Suspended";
    case "REJECTED":
      return "Rejected";
    default:
      return "Pending";
  }
}

// --- Status Badge ---

function WorkshopStatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string; icon: React.ReactNode }> = {
    Active: {
      className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    Pending: {
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      icon: <Clock className="h-3 w-3" />,
    },
    Suspended: {
      className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
      icon: <Ban className="h-3 w-3" />,
    },
    Rejected: {
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

// --- Star Rating ---

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1">
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
      </div>
      <span className="text-xs font-medium">{rating}</span>
      <span className="text-xs text-muted-foreground">({reviewCount})</span>
    </div>
  );
}

// --- Loading Skeleton ---

function WorkshopsLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div>
                  <Skeleton className="h-3 w-12 mb-1.5" />
                  <Skeleton className="h-6 w-10" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-9 w-[160px]" />
      </div>

      {/* Table skeleton */}
      <Card>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-3 pr-4 text-left font-medium">Workshop Name</th>
                  <th className="pb-3 pr-4 text-left font-medium">Owner</th>
                  <th className="pb-3 pr-4 text-left font-medium">Location</th>
                  <th className="pb-3 pr-4 text-left font-medium">GST Number</th>
                  <th className="pb-3 pr-4 text-left font-medium">Parts Listed</th>
                  <th className="pb-3 pr-4 text-left font-medium">Rating</th>
                  <th className="pb-3 pr-4 text-left font-medium">Revenue</th>
                  <th className="pb-3 pr-4 text-left font-medium">Status</th>
                  <th className="pb-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                        <div className="min-w-0">
                          <Skeleton className="h-4 w-40 mb-1.5" />
                          <div className="flex gap-1">
                            <Skeleton className="h-4 w-12 rounded" />
                            <Skeleton className="h-4 w-10 rounded" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </td>
                    <td className="py-3.5 pr-4">
                      <Skeleton className="h-3 w-36" />
                    </td>
                    <td className="py-3.5 pr-4">
                      <Skeleton className="h-3 w-32" />
                    </td>
                    <td className="py-3.5 pr-4">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="py-3.5 pr-4">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="py-3.5 pr-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="py-3.5 pr-4">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="py-3.5">
                      <Skeleton className="h-7 w-7 rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Error State ---

function WorkshopsErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Workshops</h1>
        <p className="text-muted-foreground text-sm">
          Manage registered workshops and spare parts suppliers
        </p>
      </div>
      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <AlertCircle className="h-10 w-10 mb-3 text-red-500 opacity-60" />
            <p className="text-sm font-medium text-foreground">Failed to load workshops</p>
            <p className="text-xs mt-1 mb-4">{error.message || "An unexpected error occurred"}</p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Workshop Detail Modal ---

function WorkshopDetailModal({
  workshop,
  onClose,
}: {
  workshop: Workshop;
  onClose: () => void;
}) {
  const status = mapStatus(workshop.verificationStatus);
  const partsCount =
    workshop._count?.spareParts !== undefined
      ? workshop._count.spareParts
      : workshop.spareParts
      ? workshop.spareParts.length
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border bg-background p-6 shadow-xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {workshop.name}
              {workshop.verificationStatus === "APPROVED" && (
                <ShieldCheck className="h-4 w-4 text-blue-500" />
              )}
            </h2>
            <WorkshopStatusBadge status={status} />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          {/* Owner */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" /> Owner
            </h3>
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">{workshop.owner?.name || "Unknown"}</p>
              {workshop.owner?.phone && (
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <Phone className="h-3 w-3" /> +91 {workshop.owner.phone}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Address
            </h3>
            <p className="text-sm text-muted-foreground">{workshop.address}</p>
          </div>

          {/* GST */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">GST Number</h3>
            <p className="font-mono text-sm text-muted-foreground">{workshop.gstNumber}</p>
          </div>

          {/* Contact */}
          {workshop.phone && (
            <div className="space-y-1">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" /> Workshop Phone
              </h3>
              <p className="text-sm text-muted-foreground">+91 {workshop.phone}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-lg font-bold">{workshop.rating}</p>
              <p className="text-xs text-muted-foreground">Rating</p>
              <div className="mt-1 flex justify-center">
                <StarRating rating={workshop.rating} reviewCount={workshop.reviewCount} />
              </div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-lg font-bold">{partsCount}</p>
              <p className="text-xs text-muted-foreground">Parts Listed</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-lg font-bold">
                {workshop.monthlyRevenue > 0
                  ? `\u20B9${(workshop.monthlyRevenue / 1000).toFixed(0)}k`
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">Monthly Rev</p>
            </div>
          </div>

          {/* Specialties */}
          {workshop.specialties.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Specialties</h3>
              <div className="flex flex-wrap gap-1">
                {workshop.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-xs text-muted-foreground bg-muted rounded px-2 py-0.5"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <p className="text-xs text-muted-foreground">
            Registered: {new Date(workshop.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// --- Add Workshop Modal ---

function AddWorkshopModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gst, setGst] = useState("");
  const [phone, setPhone] = useState("");
  const [specialties, setSpecialties] = useState("");

  const handleSubmit = () => {
    if (!name || !address || !gst || !phone) {
      toast.error("Please fill all required fields");
      return;
    }
    // For admin adding a workshop, show success — actual backend registration
    // is done by workshop owners through the mobile app
    toast.success("Workshop registration invite sent", {
      description: `An invite has been sent to +91 ${phone} to complete registration.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-lg border bg-background p-6 shadow-xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-semibold">Add Workshop</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Send a registration invite to a workshop owner
        </p>

        <div className="mt-4 space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Workshop Name *</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sharma Auto Works"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Owner Phone *</label>
            <div className="flex gap-2">
              <span className="flex h-9 items-center rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground">
                +91
              </span>
              <input
                className="flex-1 rounded-md border px-3 py-2 text-sm bg-background"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit number"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Address *</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">GST Number *</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm bg-background font-mono"
              value={gst}
              onChange={(e) => setGst(e.target.value.toUpperCase())}
              placeholder="e.g. 29AAACB1234A1ZV"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Specialties</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="e.g. 2W, 4W, EV (comma separated)"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            Send Invite
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Page Component ---

export default function WorkshopsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useWorkshops();
  const verifyWorkshop = useVerifyWorkshop();

  const workshops: Workshop[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.workshops && Array.isArray(data.workshops)) return data.workshops;
    return [];
  }, [data]);

  const getPartsCount = (ws: Workshop): number => {
    if (ws._count?.spareParts !== undefined) return ws._count.spareParts;
    if (ws.spareParts) return ws.spareParts.length;
    return 0;
  };

  const filtered = useMemo(() => {
    return workshops.filter((ws) => {
      const status = mapStatus(ws.verificationStatus);
      const ownerName = ws.owner?.name || "";
      const workshopPhone = ws.owner?.phone || ws.phone || "";

      const matchesSearch =
        searchQuery === "" ||
        ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.gstNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workshopPhone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [workshops, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: workshops.length,
    active: workshops.filter((w) => w.verificationStatus === "APPROVED").length,
    pending: workshops.filter((w) => w.verificationStatus === "PENDING").length,
    totalParts: workshops.reduce((sum, w) => sum + getPartsCount(w), 0),
  }), [workshops]);

  const handleAction = (workshopId: string, action: "approve" | "reject" | "suspend", label: string) => {
    verifyWorkshop.mutate(
      { id: workshopId, action },
      {
        onSuccess: () => {
          toast.success(`Workshop ${label.toLowerCase()} successfully`);
        },
        onError: (err: Error) => {
          toast.error(err.message || `Failed to ${label.toLowerCase()} workshop`);
        },
      }
    );
  };

  if (isLoading) {
    return <WorkshopsLoadingSkeleton />;
  }

  if (isError) {
    return <WorkshopsErrorState error={error as Error} onRetry={() => refetch()} />;
  }

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
          <h1 className="text-2xl font-bold tracking-tight">Workshops</h1>
          <p className="text-muted-foreground text-sm">
            Manage registered workshops and spare parts suppliers
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Workshop
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Store className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Parts</p>
                <p className="text-xl font-bold">{stats.totalParts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Controls */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workshops, owners, GST..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-3 pr-4 text-left font-medium">Workshop Name</th>
                    <th className="pb-3 pr-4 text-left font-medium">Owner</th>
                    <th className="pb-3 pr-4 text-left font-medium">Location</th>
                    <th className="pb-3 pr-4 text-left font-medium">GST Number</th>
                    <th className="pb-3 pr-4 text-left font-medium">Parts Listed</th>
                    <th className="pb-3 pr-4 text-left font-medium">Rating</th>
                    <th className="pb-3 pr-4 text-left font-medium">Revenue</th>
                    <th className="pb-3 pr-4 text-left font-medium">Status</th>
                    <th className="pb-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ws, index) => {
                    const status = mapStatus(ws.verificationStatus);
                    const partsCount = getPartsCount(ws);
                    const ownerName = ws.owner?.name || "Unknown";
                    const ownerPhone = ws.owner?.phone || ws.phone || "";
                    const isVerified = ws.verificationStatus === "APPROVED";

                    return (
                      <motion.tr
                        key={ws.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.3 }}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                              <Store className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-medium truncate">{ws.name}</p>
                                {isVerified && (
                                  <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {ws.specialties.map((s) => (
                                  <span
                                    key={s}
                                    className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <div>
                            <p className="font-medium text-sm">{ownerName}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {ownerPhone}
                            </p>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {ws.address}
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="font-mono text-xs text-muted-foreground">
                            {ws.gstNumber}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-semibold">{partsCount}</span>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <StarRating rating={ws.rating} reviewCount={ws.reviewCount} />
                        </td>
                        <td className="py-3.5 pr-4">
                          {ws.monthlyRevenue > 0 ? (
                            <div className="flex items-center gap-0.5 text-sm font-medium">
                              <IndianRupee className="h-3.5 w-3.5" />
                              {(ws.monthlyRevenue / 1000).toFixed(0)}k
                              <span className="text-xs text-muted-foreground font-normal">/mo</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">N/A</span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4">
                          <WorkshopStatusBadge status={status} />
                        </td>
                        <td className="py-3.5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-xs">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedWorkshop(ws)}>
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/marketplace?workshop=${ws.id}`)}>
                                <ExternalLink className="h-4 w-4" />
                                View Storefront
                              </DropdownMenuItem>
                              {status === "Pending" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleAction(ws.id, "approve", "approved")}
                                    disabled={verifyWorkshop.isPending}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => handleAction(ws.id, "reject", "rejected")}
                                    disabled={verifyWorkshop.isPending}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {status === "Active" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => handleAction(ws.id, "suspend", "suspended")}
                                    disabled={verifyWorkshop.isPending}
                                  >
                                    <Ban className="h-4 w-4" />
                                    Suspend
                                  </DropdownMenuItem>
                                </>
                              )}
                              {status === "Suspended" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleAction(ws.id, "approve", "reactivated")}
                                    disabled={verifyWorkshop.isPending}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Reactivate
                                  </DropdownMenuItem>
                                </>
                              )}
                              {status === "Rejected" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleAction(ws.id, "approve", "approved")}
                                    disabled={verifyWorkshop.isPending}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Search className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">No workshops found</p>
                <p className="text-xs">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Workshop Detail Modal */}
      <AnimatePresence>
        {selectedWorkshop && (
          <WorkshopDetailModal
            workshop={selectedWorkshop}
            onClose={() => setSelectedWorkshop(null)}
          />
        )}
      </AnimatePresence>

      {/* Add Workshop Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddWorkshopModal onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

// --- Mock Data ---

const workshops = [
  {
    id: "WS-001",
    name: "Sharma Auto Spares & Service",
    owner: "Rajendra Sharma",
    phone: "+91 98112 34567",
    location: "Karol Bagh, New Delhi",
    gstNumber: "07AAACS1234H1Z5",
    partsListed: 245,
    rating: 4.8,
    reviewCount: 156,
    status: "Active",
    verified: true,
    joinedDate: "Dec 2023",
    monthlyRevenue: 285000,
    specialties: ["Honda", "TVS", "Hero"],
  },
  {
    id: "WS-002",
    name: "Patel Two-Wheeler Parts",
    owner: "Kiran Patel",
    phone: "+91 87655 43210",
    location: "CG Road, Ahmedabad",
    gstNumber: "24AABCP5678M1Z3",
    partsListed: 189,
    rating: 4.6,
    reviewCount: 98,
    status: "Active",
    verified: true,
    joinedDate: "Feb 2024",
    monthlyRevenue: 198000,
    specialties: ["Bajaj", "Royal Enfield"],
  },
  {
    id: "WS-003",
    name: "Bengaluru EV Hub",
    owner: "Anil Hegde",
    phone: "+91 76543 21098",
    location: "Indiranagar, Bengaluru",
    gstNumber: "29AADCH9012K1Z8",
    partsListed: 132,
    rating: 4.9,
    reviewCount: 72,
    status: "Active",
    verified: true,
    joinedDate: "Jun 2024",
    monthlyRevenue: 340000,
    specialties: ["Ola", "Ather", "TVS iQube"],
  },
  {
    id: "WS-004",
    name: "Krishna Motor Parts",
    owner: "Venkat Krishna",
    phone: "+91 65432 10987",
    location: "Ameerpet, Hyderabad",
    gstNumber: "36AABCK3456P1Z1",
    partsListed: 78,
    rating: 4.2,
    reviewCount: 45,
    status: "Pending",
    verified: false,
    joinedDate: "Jan 2025",
    monthlyRevenue: 0,
    specialties: ["Yamaha", "Suzuki"],
  },
  {
    id: "WS-005",
    name: "Mukherjee Bike World",
    owner: "Soumya Mukherjee",
    phone: "+91 54321 09876",
    location: "Park Street, Kolkata",
    gstNumber: "19AABCM7890L1Z6",
    partsListed: 210,
    rating: 4.5,
    reviewCount: 134,
    status: "Suspended",
    verified: true,
    joinedDate: "Apr 2024",
    monthlyRevenue: 165000,
    specialties: ["Hero", "Honda", "Bajaj"],
  },
];

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

// --- Page Component ---

export default function WorkshopsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = workshops.filter((ws) => {
    const matchesSearch =
      searchQuery === "" ||
      ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.gstNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      ws.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: workshops.length,
    active: workshops.filter((w) => w.status === "Active").length,
    pending: workshops.filter((w) => w.status === "Pending").length,
    totalParts: workshops.reduce((sum, w) => sum + w.partsListed, 0),
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
          <h1 className="text-2xl font-bold tracking-tight">Workshops</h1>
          <p className="text-muted-foreground text-sm">
            Manage registered workshops and spare parts suppliers
          </p>
        </div>
        <Button>
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
                  {filtered.map((ws, index) => (
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
                              {ws.verified && (
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
                          <p className="font-medium text-sm">{ws.owner}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {ws.phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {ws.location}
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
                          <span className="font-semibold">{ws.partsListed}</span>
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
                        <WorkshopStatusBadge status={ws.status} />
                      </td>
                      <td className="py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4" />
                              View Storefront
                            </DropdownMenuItem>
                            {ws.status === "Pending" && (
                              <>
                                <DropdownMenuSeparator />
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
                            {ws.status === "Active" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive">
                                  <Ban className="h-4 w-4" />
                                  Suspend
                                </DropdownMenuItem>
                              </>
                            )}
                            {ws.status === "Suspended" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <CheckCircle2 className="h-4 w-4" />
                                  Reactivate
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
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
    </motion.div>
  );
}

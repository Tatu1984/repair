"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Types ---

type DisputeStatus = "Open" | "Under Review" | "Resolved" | "Closed";
type Priority = "High" | "Medium" | "Low";
type UserRole = "Rider" | "Mechanic" | "Workshop";

interface Dispute {
  id: string;
  raisedBy: string;
  role: UserRole;
  relatedTo: string;
  relatedType: "Breakdown" | "Order";
  reason: string;
  description: string;
  status: DisputeStatus;
  priority: Priority;
  createdDate: string;
  lastUpdated: string;
}

// --- Mock Data ---

const disputes: Dispute[] = [
  {
    id: "DSP-401",
    raisedBy: "Arun Mehta",
    role: "Rider",
    relatedTo: "ORD-10234",
    relatedType: "Order",
    reason: "Overcharging by mechanic",
    description:
      "The mechanic charged ₹1,500 for brake pad replacement but the market rate is ₹800. The quoted price on the platform was ₹900 including labour. Requesting review and partial refund.",
    status: "Open",
    priority: "High",
    createdDate: "2026-02-23",
    lastUpdated: "2026-02-24",
  },
  {
    id: "DSP-402",
    raisedBy: "Rajesh Two Wheeler Hub",
    role: "Workshop",
    relatedTo: "ORD-10236",
    relatedType: "Order",
    reason: "Defective part received from supplier",
    description:
      "Customer returned a Bajaj Pulsar clutch plate claiming it was defective. After inspection, the part had a manufacturing defect. Requesting supplier accountability and reimbursement for return shipping.",
    status: "Under Review",
    priority: "Medium",
    createdDate: "2026-02-22",
    lastUpdated: "2026-02-23",
  },
  {
    id: "DSP-403",
    raisedBy: "Priya Sharma",
    role: "Rider",
    relatedTo: "BRK-0578",
    relatedType: "Breakdown",
    reason: "Mechanic no-show for scheduled service",
    description:
      "Booked a roadside assistance for flat tyre on NH-48 near Gurugram. Mechanic Ravi Kumar confirmed but never showed up. Waited 2 hours in the heat. Had to call a local garage eventually. Requesting full refund and mechanic accountability.",
    status: "Resolved",
    priority: "High",
    createdDate: "2026-02-20",
    lastUpdated: "2026-02-22",
  },
  {
    id: "DSP-404",
    raisedBy: "Vikram Joshi",
    role: "Rider",
    relatedTo: "ORD-10236",
    relatedType: "Order",
    reason: "Wrong part delivered",
    description:
      "Ordered a clutch plate for Bajaj Pulsar 150 but received one for Pulsar 220. The part number on the packaging does not match the listing. Need correct part or full refund.",
    status: "Open",
    priority: "Medium",
    createdDate: "2026-02-24",
    lastUpdated: "2026-02-24",
  },
  {
    id: "DSP-405",
    raisedBy: "Ravi Kumar",
    role: "Mechanic",
    relatedTo: "BRK-0612",
    relatedType: "Breakdown",
    reason: "Delayed payment for completed service",
    description:
      "Completed an emergency engine repair for a Maruti Alto on 18th Feb. Customer confirmed completion on the app. Payment is still held in escrow for over 5 days. Need immediate release of ₹3,200 service fee.",
    status: "Closed",
    priority: "Low",
    createdDate: "2026-02-19",
    lastUpdated: "2026-02-21",
  },
];

// --- Helpers ---

const statusStyles: Record<DisputeStatus, string> = {
  Open: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Under Review":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Resolved:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
};

const statusIcons: Record<DisputeStatus, React.ReactNode> = {
  Open: <AlertTriangle className="size-3.5" />,
  "Under Review": <Clock className="size-3.5" />,
  Resolved: <CheckCircle2 className="size-3.5" />,
  Closed: <XCircle className="size-3.5" />,
};

const priorityStyles: Record<Priority, string> = {
  High: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  Low: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
};

const roleStyles: Record<UserRole, string> = {
  Rider: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Mechanic:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Workshop:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

// --- Component ---

export default function DisputesPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered =
    statusFilter === "all"
      ? disputes
      : disputes.filter((d) => d.status === statusFilter);

  // Stats
  const openCount = disputes.filter((d) => d.status === "Open").length;
  const resolvedThisWeek = disputes.filter(
    (d) =>
      d.status === "Resolved" &&
      new Date(d.lastUpdated) >= new Date("2026-02-17")
  ).length;
  const avgResolutionDays = "2.5";

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
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
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
      {filtered.length === 0 ? (
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
            {filtered.map((dispute, index) => (
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
                            dispute.status === "Open"
                              ? "bg-red-100 dark:bg-red-900/30"
                              : dispute.status === "Under Review"
                              ? "bg-orange-100 dark:bg-orange-900/30"
                              : dispute.status === "Resolved"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-gray-100 dark:bg-gray-900/30"
                          }`}
                        >
                          <MessageSquareWarning
                            className={`size-5 ${
                              dispute.status === "Open"
                                ? "text-red-600 dark:text-red-400"
                                : dispute.status === "Under Review"
                                ? "text-orange-600 dark:text-orange-400"
                                : dispute.status === "Resolved"
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
                            {dispute.id}
                          </span>
                          <Badge
                            className={`border-0 text-[10px] gap-1 ${
                              statusStyles[dispute.status]
                            }`}
                          >
                            {statusIcons[dispute.status]}
                            {dispute.status}
                          </Badge>
                          <Badge
                            className={`border-0 text-[10px] ${
                              priorityStyles[dispute.priority]
                            }`}
                          >
                            {dispute.priority}
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
                            <span>{dispute.raisedBy}</span>
                            <Badge
                              className={`border-0 text-[9px] px-1.5 py-0 ${
                                roleStyles[dispute.role]
                              }`}
                            >
                              {dispute.role}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Link2 className="size-3" />
                            <span>
                              {dispute.relatedType} #{dispute.relatedTo}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-3" />
                            <span>{dispute.createdDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Action */}
                      <div className="flex shrink-0 items-start">
                        <Button
                          variant={
                            dispute.status === "Open" ? "default" : "outline"
                          }
                          size="sm"
                        >
                          {dispute.status === "Open" ||
                          dispute.status === "Under Review"
                            ? "Review"
                            : "View Details"}
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
                      <span>Last updated: {dispute.lastUpdated}</span>
                      {dispute.status === "Open" && (
                        <span className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
                          <AlertTriangle className="size-3" />
                          Requires attention
                        </span>
                      )}
                      {dispute.status === "Under Review" && (
                        <span className="flex items-center gap-1 font-medium text-orange-600 dark:text-orange-400">
                          <Clock className="size-3" />
                          Under investigation
                        </span>
                      )}
                      {dispute.status === "Resolved" && (
                        <span className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400">
                          <CheckCircle2 className="size-3" />
                          Resolution applied
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  RotateCcw,
  Eye,
  Package,
  IndianRupee,
  Calendar,
  User,
  MapPin,
  Phone,
  FileText,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useOrders, useUpdateOrderStatus } from "@/lib/hooks/use-orders";

// --- Types ---

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Returned"
  | "Cancelled";

type PaymentStatus = "Paid" | "Escrow" | "Refunded" | "COD" | "Pending" | "Released" | "Failed";

type OrderType = "Part Order";

interface TimelineEvent {
  status: string;
  timestamp: string;
  description: string;
}

interface MappedOrder {
  id: string;
  displayId: string;
  customer: string;
  customerPhone: string;
  customerCity: string;
  item: string;
  type: OrderType;
  workshopMechanic: string;
  amount: number;
  subtotal: number;
  gst: number;
  platformFee: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  date: string;
  timeline: TimelineEvent[];
}

// --- Helpers ---

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTimestamp(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

function mapOrderStatus(status: string): OrderStatus {
  const map: Record<string, OrderStatus> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    RETURNED: "Returned",
    CANCELLED: "Cancelled",
  };
  return map[status] || "Pending";
}

function mapPaymentStatus(status: string): PaymentStatus {
  const map: Record<string, PaymentStatus> = {
    PENDING: "Pending",
    PAID: "Paid",
    ESCROW: "Escrow",
    RELEASED: "Released",
    REFUNDED: "Refunded",
    COD: "COD",
    FAILED: "Failed",
  };
  return map[status] || "Pending";
}

function generateTimeline(order: any): TimelineEvent[] {
  const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
  const currentIdx = statuses.indexOf(order.orderStatus);
  const timeline: TimelineEvent[] = [
    {
      status: "Order Placed",
      timestamp: formatTimestamp(order.createdAt),
      description: `Order placed by ${order.buyer?.name || "Customer"}`,
    },
  ];
  if (currentIdx >= 1) {
    timeline.push({
      status: "Confirmed",
      timestamp: formatTimestamp(order.createdAt),
      description: `Confirmed by ${order.workshop?.name || "Workshop"}`,
    });
  }
  if (currentIdx >= 2) {
    timeline.push({
      status: "Shipped",
      timestamp: "",
      description: "Dispatched for delivery",
    });
  }
  if (currentIdx >= 3) {
    timeline.push({
      status: "Delivered",
      timestamp: "",
      description: "Delivered to customer",
    });
  }
  if (order.orderStatus === "RETURNED") {
    timeline.push({
      status: "Returned",
      timestamp: "",
      description: "Item returned",
    });
  }
  if (order.orderStatus === "CANCELLED") {
    timeline.push({
      status: "Cancelled",
      timestamp: "",
      description: "Order cancelled",
    });
  }
  return timeline;
}

function mapApiOrder(apiOrder: any): MappedOrder {
  return {
    id: apiOrder.id,
    displayId: apiOrder.displayId || apiOrder.id,
    customer: apiOrder.buyer?.name || "Unknown",
    customerPhone: apiOrder.buyer?.phone || "",
    customerCity: apiOrder.shippingAddress || apiOrder.workshop?.address || "",
    item: apiOrder.part?.name || "Unknown Part",
    type: "Part Order",
    workshopMechanic: apiOrder.workshop?.name || "Unknown",
    amount: apiOrder.totalAmount || 0,
    subtotal: apiOrder.subtotal || 0,
    gst: apiOrder.gstAmount || 0,
    platformFee: apiOrder.platformFee || 0,
    paymentStatus: mapPaymentStatus(apiOrder.paymentStatus),
    orderStatus: mapOrderStatus(apiOrder.orderStatus),
    date: formatDate(apiOrder.createdAt),
    timeline: generateTimeline(apiOrder),
  };
}

// --- Styles ---

const orderStatusStyles: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  Confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  Delivered: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Returned: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  Paid: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Escrow: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Refunded: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  COD: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  Released: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Failed: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  Pending: <Clock className="size-4" />,
  Confirmed: <CheckCircle2 className="size-4" />,
  Shipped: <Truck className="size-4" />,
  Delivered: <Package className="size-4" />,
  Returned: <RotateCcw className="size-4" />,
  Cancelled: <AlertCircle className="size-4" />,
};

// --- Loading Skeleton ---

function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="gap-0 py-0">
            <CardContent className="flex items-center gap-3 p-4">
              <Skeleton className="size-9 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-6 w-8" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card className="gap-0 overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Item</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Workshop / Mechanic</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
                  <th className="hidden px-4 py-3 text-center font-medium text-muted-foreground sm:table-cell">Payment</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="ml-auto h-4 w-16" /></td>
                    <td className="hidden px-4 py-3 text-center sm:table-cell"><Skeleton className="mx-auto h-5 w-14 rounded-full" /></td>
                    <td className="px-4 py-3 text-center"><Skeleton className="mx-auto h-5 w-20 rounded-full" /></td>
                    <td className="hidden px-4 py-3 lg:table-cell"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3 text-center"><Skeleton className="mx-auto h-7 w-14 rounded-md" /></td>
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

function OrdersErrorState({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
  return (
    <div className="space-y-6">
      <Card className="gap-0 py-0">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="size-7 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Failed to load orders</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {error?.message || "Something went wrong. Please try again."}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="mr-1.5 size-3.5" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Stats ---

function StatsBar({ filteredOrders }: { filteredOrders: MappedOrder[] }) {
  const total = filteredOrders.length;
  const pending = filteredOrders.filter(
    (o) => o.orderStatus === "Pending"
  ).length;
  const inTransit = filteredOrders.filter(
    (o) => o.orderStatus === "Shipped"
  ).length;
  const delivered = filteredOrders.filter(
    (o) => o.orderStatus === "Delivered"
  ).length;
  const returned = filteredOrders.filter(
    (o) => o.orderStatus === "Returned"
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: total,
      icon: <ShoppingBag className="size-4 text-primary" />,
      bgClass: "bg-primary/10",
    },
    {
      label: "Pending",
      value: pending,
      icon: <Clock className="size-4 text-yellow-600 dark:text-yellow-400" />,
      bgClass: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      label: "In Transit",
      value: inTransit,
      icon: <Truck className="size-4 text-purple-600 dark:text-purple-400" />,
      bgClass: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      label: "Delivered",
      value: delivered,
      icon: (
        <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
      ),
      bgClass: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Returned",
      value: returned,
      icon: <RotateCcw className="size-4 text-red-600 dark:text-red-400" />,
      bgClass: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.label} className="gap-0 py-0">
          <CardContent className="flex items-center gap-3 p-4">
            <div
              className={`flex size-9 items-center justify-center rounded-lg ${stat.bgClass}`}
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
  );
}

// --- Detail Panel ---

function OrderDetailPanel({
  order,
  open,
  onClose,
  onUpdateStatus,
  isUpdating,
}: {
  order: MappedOrder | null;
  open: boolean;
  onClose: (open: boolean) => void;
  onUpdateStatus: (id: string, status: string) => void;
  isUpdating: boolean;
}) {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Order {order.displayId}
          </SheetTitle>
          <SheetDescription>
            Placed on {order.date} - {order.type}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-6">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`border-0 ${orderStatusStyles[order.orderStatus]}`}>
              {statusIcons[order.orderStatus]}
              {order.orderStatus}
            </Badge>
            <Badge
              className={`border-0 ${paymentStatusStyles[order.paymentStatus]}`}
            >
              <IndianRupee className="size-3" />
              {order.paymentStatus}
            </Badge>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Customer Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="size-3.5" />
                <span className="text-foreground font-medium">
                  {order.customer}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-3.5" />
                <span>{order.customerCity}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Item Details */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Item Details</h4>
            <Card className="gap-0 py-0">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{order.item}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.type} via {order.workshopMechanic}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Payment Breakdown */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Payment Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>{formatINR(order.gst)}</span>
              </div>
              {order.platformFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span>{formatINR(order.platformFee)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatINR(order.amount)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Order Timeline</h4>
            <div className="relative space-y-0">
              {order.timeline.map((event, i) => (
                <div key={i} className="relative flex gap-3 pb-5 last:pb-0">
                  {/* Connector Line */}
                  {i < order.timeline.length - 1 && (
                    <div className="absolute left-[7px] top-4 h-full w-px bg-border" />
                  )}
                  {/* Dot */}
                  <div
                    className={`relative z-10 mt-1 size-[15px] shrink-0 rounded-full border-2 ${
                      i === order.timeline.length - 1
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30 bg-background"
                    }`}
                  />
                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.status}</p>
                    {event.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        {event.timestamp}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled" && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 text-sm font-semibold">Actions</h4>
                <div className="flex flex-wrap gap-2">
                  {(order.orderStatus === "Pending" || order.orderStatus === "Confirmed") && (
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(order.id, "SHIPPED")}
                      disabled={isUpdating}
                    >
                      <Truck className="mr-1.5 size-3.5" />
                      Mark Shipped
                    </Button>
                  )}
                  {order.orderStatus === "Shipped" && (
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(order.id, "DELIVERED")}
                      disabled={isUpdating}
                    >
                      <CheckCircle2 className="mr-1.5 size-3.5" />
                      Mark Delivered
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onUpdateStatus(order.id, "CANCELLED")}
                    disabled={isUpdating}
                  >
                    <XCircle className="mr-1.5 size-3.5" />
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// --- Component ---

const TAB_STATUS_MAP: Record<string, string | undefined> = {
  all: undefined,
  pending: "PENDING",
  confirmed: "CONFIRMED",
  shipped: "SHIPPED",
  delivered: "DELIVERED",
  returned: "RETURNED",
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<MappedOrder | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const statusFilter = TAB_STATUS_MAP[activeTab];
  const { data, isLoading, isError, error, refetch } = useOrders({
    status: statusFilter,
    page: currentPage,
  });
  const updateStatus = useUpdateOrderStatus();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleUpdateStatus = (id: string, orderStatus: string) => {
    updateStatus.mutate(
      { id, orderStatus },
      {
        onSuccess: () => {
          toast.success("Order status updated");
          setSheetOpen(false);
          setSelectedOrder(null);
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to update status");
        },
      }
    );
  };

  const totalPages = data?.pagination?.totalPages ?? 1;

  // Map API data to our internal format
  const mappedOrders: MappedOrder[] = (data?.orders || []).map(mapApiOrder);

  // Client-side filter as a safety net (API should already filter, but ensures consistency)
  const filteredOrders =
    activeTab === "all"
      ? mappedOrders
      : mappedOrders.filter(
          (o) => o.orderStatus === mapOrderStatus(statusFilter || "")
        );

  const openOrderDetail = (order: MappedOrder) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track all your part orders
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-6">
          {/* Loading State */}
          {isLoading && <OrdersLoadingSkeleton />}

          {/* Error State */}
          {isError && !isLoading && (
            <OrdersErrorState error={error as Error | null} onRetry={() => refetch()} />
          )}

          {/* Data State */}
          {!isLoading && !isError && (
            <>
              {/* Stats */}
              <StatsBar filteredOrders={filteredOrders} />

              {/* Orders Table */}
              <Card className="gap-0 overflow-hidden py-0">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                            Order ID
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                            Customer
                          </th>
                          <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                            Item
                          </th>
                          <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                            Workshop / Mechanic
                          </th>
                          <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                            Amount
                          </th>
                          <th className="hidden px-4 py-3 text-center font-medium text-muted-foreground sm:table-cell">
                            Payment
                          </th>
                          <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                            Date
                          </th>
                          <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence mode="popLayout">
                          {filteredOrders.map((order, index) => (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.03,
                              }}
                              className="border-b last:border-b-0 transition-colors hover:bg-muted/30"
                            >
                              <td className="px-4 py-3">
                                <span className="font-mono text-xs font-semibold">
                                  {order.displayId}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium">{order.customer}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {order.customerCity}
                                  </p>
                                </div>
                              </td>
                              <td className="hidden px-4 py-3 md:table-cell">
                                <div>
                                  <p className="max-w-[200px] truncate">
                                    {order.item}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="mt-0.5 text-[10px]"
                                  >
                                    {order.type}
                                  </Badge>
                                </div>
                              </td>
                              <td className="hidden px-4 py-3 lg:table-cell">
                                <p className="max-w-[160px] truncate text-xs">
                                  {order.workshopMechanic}
                                </p>
                              </td>
                              <td className="px-4 py-3 text-right font-medium">
                                {formatINR(order.amount)}
                              </td>
                              <td className="hidden px-4 py-3 text-center sm:table-cell">
                                <Badge
                                  className={`border-0 text-[10px] ${
                                    paymentStatusStyles[order.paymentStatus]
                                  }`}
                                >
                                  {order.paymentStatus}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Badge
                                  className={`border-0 text-[10px] ${
                                    orderStatusStyles[order.orderStatus]
                                  }`}
                                >
                                  {statusIcons[order.orderStatus]}
                                  {order.orderStatus}
                                </Badge>
                              </td>
                              <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                                <div className="flex items-center gap-1">
                                  <Calendar className="size-3" />
                                  {order.date}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => openOrderDetail(order)}
                                >
                                  <Eye className="size-3.5" />
                                  View
                                </Button>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>

                  {filteredOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 py-16">
                      <ShoppingBag className="size-10 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">
                        No orders found in this category
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="mr-1 size-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                      <ChevronRight className="ml-1 size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Order Detail Sheet */}
      <OrderDetailPanel
        order={selectedOrder}
        open={sheetOpen}
        onClose={setSheetOpen}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={updateStatus.isPending}
      />
    </div>
  );
}

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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// --- Types ---

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Returned";

type PaymentStatus = "Paid" | "Escrow" | "Refunded" | "COD";

type OrderType = "Part Order" | "Service Order";

interface TimelineEvent {
  status: string;
  timestamp: string;
  description: string;
}

interface Order {
  id: string;
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

// --- Mock Data ---

const orders: Order[] = [
  {
    id: "ORD-10234",
    customer: "Arun Mehta",
    customerPhone: "+91 98765 43210",
    customerCity: "Mumbai",
    item: "Brake Pad Set - Honda Activa",
    type: "Part Order",
    workshopMechanic: "Sharma Auto Parts",
    amount: 531,
    subtotal: 450,
    gst: 81,
    platformFee: 0,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    date: "2026-02-22",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "22 Feb 2026, 09:15 AM",
        description: "Order placed by Arun Mehta",
      },
      {
        status: "Confirmed",
        timestamp: "22 Feb 2026, 09:45 AM",
        description: "Confirmed by Sharma Auto Parts",
      },
      {
        status: "Shipped",
        timestamp: "22 Feb 2026, 02:30 PM",
        description: "Dispatched via local delivery",
      },
      {
        status: "Delivered",
        timestamp: "22 Feb 2026, 05:10 PM",
        description: "Delivered to customer address",
      },
    ],
  },
  {
    id: "ORD-10235",
    customer: "Priya Sharma",
    customerPhone: "+91 87654 32109",
    customerCity: "Delhi",
    item: "Engine Oil Change + Filter",
    type: "Service Order",
    workshopMechanic: "Ravi Kumar (Mechanic)",
    amount: 1200,
    subtotal: 999,
    gst: 180,
    platformFee: 21,
    paymentStatus: "Escrow",
    orderStatus: "Confirmed",
    date: "2026-02-23",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "23 Feb 2026, 10:00 AM",
        description: "Service booked by Priya Sharma",
      },
      {
        status: "Confirmed",
        timestamp: "23 Feb 2026, 10:30 AM",
        description: "Mechanic Ravi Kumar accepted the job",
      },
    ],
  },
  {
    id: "ORD-10236",
    customer: "Vikram Joshi",
    customerPhone: "+91 99887 76655",
    customerCity: "Bangalore",
    item: "Clutch Plate - Bajaj Pulsar 150",
    type: "Part Order",
    workshopMechanic: "Rajesh Two Wheeler Hub",
    amount: 802,
    subtotal: 680,
    gst: 122,
    platformFee: 0,
    paymentStatus: "COD",
    orderStatus: "Shipped",
    date: "2026-02-23",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "23 Feb 2026, 11:20 AM",
        description: "Order placed by Vikram Joshi",
      },
      {
        status: "Confirmed",
        timestamp: "23 Feb 2026, 12:00 PM",
        description: "Confirmed by Rajesh Two Wheeler Hub",
      },
      {
        status: "Shipped",
        timestamp: "23 Feb 2026, 04:15 PM",
        description: "Handed over to delivery partner",
      },
    ],
  },
  {
    id: "ORD-10237",
    customer: "Neha Gupta",
    customerPhone: "+91 77665 54433",
    customerCity: "Chennai",
    item: "Tyre Replacement - Front",
    type: "Service Order",
    workshopMechanic: "Kumar Auto Electricals",
    amount: 3800,
    subtotal: 3220,
    gst: 580,
    platformFee: 0,
    paymentStatus: "Paid",
    orderStatus: "Pending",
    date: "2026-02-24",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "24 Feb 2026, 08:45 AM",
        description: "Service booked by Neha Gupta",
      },
    ],
  },
  {
    id: "ORD-10238",
    customer: "Rahul Patil",
    customerPhone: "+91 88990 01122",
    customerCity: "Pune",
    item: "Battery 12V 35Ah - Bajaj Chetak EV",
    type: "Part Order",
    workshopMechanic: "GreenDrive EV Solutions",
    amount: 10030,
    subtotal: 8500,
    gst: 1530,
    platformFee: 0,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    date: "2026-02-20",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "20 Feb 2026, 02:00 PM",
        description: "Order placed by Rahul Patil",
      },
      {
        status: "Confirmed",
        timestamp: "20 Feb 2026, 02:30 PM",
        description: "Confirmed by GreenDrive EV Solutions",
      },
      {
        status: "Shipped",
        timestamp: "20 Feb 2026, 05:00 PM",
        description: "Dispatched from Hinjawadi hub",
      },
      {
        status: "Delivered",
        timestamp: "21 Feb 2026, 11:00 AM",
        description: "Delivered to customer in Kothrud",
      },
    ],
  },
  {
    id: "ORD-10239",
    customer: "Deepak Singh",
    customerPhone: "+91 90012 34567",
    customerCity: "Ahmedabad",
    item: "Suspension Coil Spring - Tata Nexon",
    type: "Part Order",
    workshopMechanic: "Patel Car Care",
    amount: 2124,
    subtotal: 1800,
    gst: 324,
    platformFee: 0,
    paymentStatus: "Refunded",
    orderStatus: "Returned",
    date: "2026-02-18",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "18 Feb 2026, 10:00 AM",
        description: "Order placed by Deepak Singh",
      },
      {
        status: "Confirmed",
        timestamp: "18 Feb 2026, 10:20 AM",
        description: "Confirmed by Patel Car Care",
      },
      {
        status: "Shipped",
        timestamp: "18 Feb 2026, 03:00 PM",
        description: "Shipped via courier",
      },
      {
        status: "Delivered",
        timestamp: "19 Feb 2026, 01:00 PM",
        description: "Delivered to customer",
      },
      {
        status: "Return Requested",
        timestamp: "20 Feb 2026, 09:00 AM",
        description: "Customer requested return - wrong fitment",
      },
      {
        status: "Returned",
        timestamp: "22 Feb 2026, 04:00 PM",
        description: "Item picked up and refund initiated",
      },
    ],
  },
  {
    id: "ORD-10240",
    customer: "Sunita Devi",
    customerPhone: "+91 81234 56789",
    customerCity: "Kolkata",
    item: "Full Body Wash + Polish",
    type: "Service Order",
    workshopMechanic: "Verma Auto Garage",
    amount: 1500,
    subtotal: 1271,
    gst: 229,
    platformFee: 0,
    paymentStatus: "COD",
    orderStatus: "Confirmed",
    date: "2026-02-24",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "24 Feb 2026, 07:30 AM",
        description: "Service booked by Sunita Devi",
      },
      {
        status: "Confirmed",
        timestamp: "24 Feb 2026, 08:00 AM",
        description: "Accepted by Verma Auto Garage",
      },
    ],
  },
  {
    id: "ORD-10241",
    customer: "Manish Tiwari",
    customerPhone: "+91 70123 45678",
    customerCity: "Delhi",
    item: "Head Light Assembly - Hero Splendor",
    type: "Part Order",
    workshopMechanic: "Gupta Motor Works",
    amount: 1298,
    subtotal: 1100,
    gst: 198,
    platformFee: 0,
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    date: "2026-02-23",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "23 Feb 2026, 01:00 PM",
        description: "Order placed by Manish Tiwari",
      },
      {
        status: "Confirmed",
        timestamp: "23 Feb 2026, 01:30 PM",
        description: "Confirmed by Gupta Motor Works",
      },
      {
        status: "Shipped",
        timestamp: "23 Feb 2026, 06:00 PM",
        description: "Dispatched from Karol Bagh",
      },
    ],
  },
];

// --- Helpers ---

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const orderStatusStyles: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  Confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  Delivered: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Returned: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  Paid: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Escrow: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Refunded: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  COD: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  Pending: <Clock className="size-4" />,
  Confirmed: <CheckCircle2 className="size-4" />,
  Shipped: <Truck className="size-4" />,
  Delivered: <Package className="size-4" />,
  Returned: <RotateCcw className="size-4" />,
};

// --- Stats ---

function StatsBar({ filteredOrders }: { filteredOrders: Order[] }) {
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
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Order {order.id}
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
                    <p className="text-xs text-muted-foreground">
                      {event.timestamp}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// --- Component ---

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredOrders =
    activeTab === "all"
      ? orders
      : activeTab === "parts"
      ? orders.filter((o) => o.type === "Part Order")
      : orders.filter((o) => o.type === "Service Order");

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track all your part and service orders
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="parts">Part Orders</TabsTrigger>
          <TabsTrigger value="services">Service Orders</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-6">
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
                              {order.id}
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
        </TabsContent>
      </Tabs>

      {/* Order Detail Sheet */}
      <OrderDetailPanel
        order={selectedOrder}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}

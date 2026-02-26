"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useWorkshopInventory } from "@/lib/hooks/use-workshop";
import {
  useCreatePart,
  useUpdatePart,
  useDeletePart,
} from "@/lib/hooks/use-marketplace";

// --- Constants ---

const conditionMap: Record<string, string> = {
  USED_GOOD: "Used - Good",
  REFURBISHED: "Refurbished",
  LIKE_NEW: "Like New",
  OEM_SURPLUS: "OEM Surplus",
};

const conditionColor: Record<string, string> = {
  USED_GOOD: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  REFURBISHED: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  LIKE_NEW: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  OEM_SURPLUS: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// --- Add / Edit Part Dialog ---

interface PartFormData {
  name: string;
  vehicleType: string;
  brand: string;
  model: string;
  category: string;
  serialNumber: string;
  condition: string;
  price: string;
  marketPrice: string;
  stock: string;
  description: string;
}

const emptyForm: PartFormData = {
  name: "",
  vehicleType: "2W",
  brand: "",
  model: "",
  category: "",
  serialNumber: "",
  condition: "USED_GOOD",
  price: "",
  marketPrice: "",
  stock: "",
  description: "",
};

function PartFormDialog({
  open,
  onClose,
  editPart,
}: {
  open: boolean;
  onClose: () => void;
  editPart?: any;
}) {
  const isEdit = !!editPart;
  const createPart = useCreatePart();
  const updatePart = useUpdatePart();
  const isPending = createPart.isPending || updatePart.isPending;

  const [form, setForm] = useState<PartFormData>(() => {
    if (editPart) {
      return {
        name: editPart.name || "",
        vehicleType: editPart.vehicleType || "2W",
        brand: editPart.brand || "",
        model: editPart.model || "",
        category: editPart.category || "",
        serialNumber: editPart.serialNumber || "",
        condition: editPart.condition || "USED_GOOD",
        price: String(editPart.price || ""),
        marketPrice: String(editPart.marketPrice || ""),
        stock: String(editPart.stock || ""),
        description: editPart.description || "",
      };
    }
    return emptyForm;
  });

  const setField = (field: keyof PartFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.name || !form.brand || !form.price || !form.stock) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      name: form.name,
      vehicleType: form.vehicleType,
      brand: form.brand,
      model: form.model || undefined,
      category: form.category || undefined,
      serialNumber: form.serialNumber || undefined,
      condition: form.condition,
      price: Number(form.price),
      marketPrice: form.marketPrice ? Number(form.marketPrice) : undefined,
      stock: Number(form.stock),
      description: form.description || undefined,
    };

    if (isEdit) {
      updatePart.mutate(
        { id: editPart.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Part updated");
            onClose();
          },
          onError: (err: Error) => toast.error(err.message || "Failed to update"),
        }
      );
    } else {
      createPart.mutate(payload, {
        onSuccess: () => {
          toast.success("Part added to inventory");
          onClose();
        },
        onError: (err: Error) => toast.error(err.message || "Failed to add part"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Part" : "Add New Part"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details for this spare part."
              : "Add a new spare part to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Part Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Brake Pad Set"
              />
            </div>
            <div className="space-y-2">
              <Label>Brand *</Label>
              <Input
                value={form.brand}
                onChange={(e) => setField("brand", e.target.value)}
                placeholder="e.g. Honda"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <Select value={form.vehicleType} onValueChange={(v) => setField("vehicleType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2W">2 Wheeler</SelectItem>
                  <SelectItem value="4W">4 Wheeler</SelectItem>
                  <SelectItem value="EV">Electric Vehicle</SelectItem>
                  <SelectItem value="UNIVERSAL">Universal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={form.condition} onValueChange={(v) => setField("condition", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USED_GOOD">Used - Good</SelectItem>
                  <SelectItem value="REFURBISHED">Refurbished</SelectItem>
                  <SelectItem value="LIKE_NEW">Like New</SelectItem>
                  <SelectItem value="OEM_SURPLUS">OEM Surplus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Model</Label>
              <Input
                value={form.model}
                onChange={(e) => setField("model", e.target.value)}
                placeholder="e.g. Activa 6G"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setField("category", v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="engine">Engine</SelectItem>
                  <SelectItem value="suspension">Suspension</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="body">Body</SelectItem>
                  <SelectItem value="brakes">Brakes</SelectItem>
                  <SelectItem value="transmission">Transmission</SelectItem>
                  <SelectItem value="exhaust">Exhaust</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Price (INR) *</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Market Price</Label>
              <Input
                type="number"
                value={form.marketPrice}
                onChange={(e) => setField("marketPrice", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Stock *</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setField("stock", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Serial Number</Label>
            <Input
              value={form.serialNumber}
              onChange={(e) => setField("serialNumber", e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Describe the part condition, compatibility, etc."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Part"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Loading Skeleton ---

function InventoryLoadingSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Part</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Brand</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Condition</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Stock</th>
              <th className="hidden px-4 py-3 text-center font-medium text-muted-foreground lg:table-cell">Status</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                <td className="hidden px-4 py-3 md:table-cell"><Skeleton className="h-4 w-20" /></td>
                <td className="hidden px-4 py-3 sm:table-cell"><Skeleton className="h-5 w-20 rounded-full" /></td>
                <td className="px-4 py-3"><Skeleton className="ml-auto h-4 w-16" /></td>
                <td className="px-4 py-3"><Skeleton className="mx-auto h-4 w-8" /></td>
                <td className="hidden px-4 py-3 lg:table-cell"><Skeleton className="mx-auto h-5 w-14 rounded-full" /></td>
                <td className="px-4 py-3"><Skeleton className="mx-auto h-7 w-20" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// --- Page ---

export default function MyInventoryPage() {
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPart, setEditPart] = useState<any>(null);

  const filters = {
    search: search || undefined,
    condition: conditionFilter !== "all" ? conditionFilter : undefined,
    stockStatus: stockFilter !== "all" ? stockFilter : undefined,
    page: currentPage,
    limit: 20,
  };

  const { data, isLoading, isError, error, refetch } = useWorkshopInventory(filters);
  const deletePart = useDeletePart();
  const updatePart = useUpdatePart();

  const parts = data?.parts ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const openAdd = () => {
    setEditPart(null);
    setDialogOpen(true);
  };

  const openEdit = (part: any) => {
    setEditPart(part);
    setDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Deactivate "${name}"? It will be hidden from the marketplace.`)) return;
    deletePart.mutate(id, {
      onSuccess: () => toast.success("Part deactivated"),
      onError: (err: Error) => toast.error(err.message || "Failed to deactivate"),
    });
  };

  const handleToggleActive = (part: any) => {
    updatePart.mutate(
      { id: part.id, data: { isActive: !part.isActive } },
      {
        onSuccess: () =>
          toast.success(part.isActive ? "Part deactivated" : "Part reactivated"),
        onError: (err: Error) => toast.error(err.message || "Failed to update"),
      }
    );
  };

  // Error state
  if (isError && !isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage your spare parts listings</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="size-7 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Failed to load inventory</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {(error as Error)?.message || "Please try again."}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-1.5 size-3.5" />
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
          <h1 className="text-2xl font-bold tracking-tight">My Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Manage your spare parts listings
            {pagination && ` \u2022 ${pagination.total} parts total`}
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="size-4" />
          Add Part
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search parts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={conditionFilter}
          onValueChange={(v) => {
            setConditionFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="USED_GOOD">Used - Good</SelectItem>
            <SelectItem value="REFURBISHED">Refurbished</SelectItem>
            <SelectItem value="LIKE_NEW">Like New</SelectItem>
            <SelectItem value="OEM_SURPLUS">OEM Surplus</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={stockFilter}
          onValueChange={(v) => {
            setStockFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <InventoryLoadingSkeleton />
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Part</th>
                    <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Brand</th>
                    <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Condition</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Stock</th>
                    <th className="hidden px-4 py-3 text-center font-medium text-muted-foreground lg:table-cell">Status</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {parts.map((part: any, index: number) => (
                      <motion.tr
                        key={part.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, delay: index * 0.02 }}
                        className={`border-b last:border-b-0 transition-colors hover:bg-muted/30 ${
                          !part.isActive ? "opacity-60" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{part.name}</p>
                            {part.model && (
                              <p className="text-xs text-muted-foreground">{part.model}</p>
                            )}
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 md:table-cell text-muted-foreground">
                          {part.brand}
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell">
                          <Badge className={`border-0 text-[10px] ${conditionColor[part.condition] ?? ""}`}>
                            {conditionMap[part.condition] ?? part.condition}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatINR(part.price)}
                          {part.marketPrice && part.marketPrice > part.price && (
                            <p className="text-[10px] text-muted-foreground line-through">
                              {formatINR(part.marketPrice)}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`font-semibold ${
                              part.stock === 0
                                ? "text-red-600"
                                : part.stock < 5
                                ? "text-yellow-600"
                                : "text-foreground"
                            }`}
                          >
                            {part.stock}
                          </span>
                        </td>
                        <td className="hidden px-4 py-3 text-center lg:table-cell">
                          <Badge
                            variant="secondary"
                            className={
                              part.isActive
                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }
                          >
                            {part.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openEdit(part)}
                              title="Edit"
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleToggleActive(part)}
                              title={part.isActive ? "Deactivate" : "Activate"}
                            >
                              {part.isActive ? (
                                <ToggleRight className="size-3.5 text-green-600" />
                              ) : (
                                <ToggleLeft className="size-3.5 text-muted-foreground" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDelete(part.id, part.name)}
                              title="Delete"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {parts.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <Package className="size-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No parts found</p>
                <Button variant="outline" size="sm" onClick={openAdd}>
                  <Plus className="mr-1.5 size-3.5" />
                  Add your first part
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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

      {/* Add / Edit Dialog */}
      {dialogOpen && (
        <PartFormDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditPart(null);
          }}
          editPart={editPart}
        />
      )}
    </div>
  );
}

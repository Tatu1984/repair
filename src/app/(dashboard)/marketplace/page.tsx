"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Plus,
  Star,
  MapPin,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpareParts, useCreatePart } from "@/lib/hooks/use-marketplace";
import { useVehicleMaster } from "@/lib/hooks/use-vehicle-master";
import { toast } from "sonner";

// --- Constants ---

const conditionMap: Record<string, string> = {
  USED_GOOD: "Used - Good",
  REFURBISHED: "Refurbished",
  LIKE_NEW: "Like New",
  OEM_SURPLUS: "OEM Surplus",
};

const conditionColor: Record<string, string> = {
  "Used - Good":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Refurbished:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Like New":
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "OEM Surplus":
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

const gradients = [
  "from-blue-500 to-cyan-400",
  "from-orange-500 to-amber-400",
  "from-purple-500 to-pink-400",
  "from-green-500 to-emerald-400",
  "from-red-500 to-rose-400",
  "from-indigo-500 to-violet-400",
  "from-teal-500 to-green-400",
  "from-yellow-500 to-orange-400",
  "from-sky-500 to-blue-400",
];

const staticBrands = [
  "Honda",
  "Bajaj",
  "Hero",
  "Maruti",
  "Hyundai",
  "Tata",
  "TVS",
  "Royal Enfield",
  "Mahindra",
  "Suzuki",
];

// --- Helpers ---

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
              ? "fill-amber-400/50 text-amber-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">({count})</span>
    </div>
  );
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// --- Skeleton Components ---

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="gap-0 overflow-hidden py-0">
          <Skeleton className="h-40 w-full rounded-none" />
          <CardContent className="flex flex-col gap-3 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Separator />
            <div className="flex items-start gap-2">
              <Skeleton className="size-3 mt-0.5 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="mt-1 h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="gap-0 overflow-hidden py-0">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <Skeleton className="h-20 w-full shrink-0 rounded-lg sm:h-24 sm:w-28" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- Add Listing Modal ---

const VEHICLE_TYPES = ["2-Wheeler", "4-Wheeler", "EV", "Truck"];
const CONDITIONS = [
  { value: "USED_GOOD", label: "Used - Good" },
  { value: "REFURBISHED", label: "Refurbished" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "OEM_SURPLUS", label: "OEM Surplus" },
];

const emptyForm = {
  name: "",
  vehicleType: "",
  brand: "",
  model: "",
  condition: "",
  price: "",
  marketPrice: "",
  stock: "1",
  description: "",
};

function AddListingModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createPart = useCreatePart();
  const { data: vmData } = useVehicleMaster();
  const grouped = vmData?.grouped ?? {};
  const vehicleTypes = Object.keys(grouped);

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Part name is required";
    if (!form.vehicleType) e.vehicleType = "Vehicle type is required";
    if (!form.brand.trim()) e.brand = "Brand is required";
    if (!form.condition) e.condition = "Condition is required";
    if (!form.price || Number(form.price) <= 0) e.price = "Valid price is required";
    if (form.marketPrice && Number(form.marketPrice) <= 0) e.marketPrice = "Must be positive";
    if (form.stock && (isNaN(Number(form.stock)) || Number(form.stock) < 0))
      e.stock = "Must be 0 or more";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      vehicleType: form.vehicleType,
      brand: form.brand.trim(),
      condition: form.condition,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
    };
    if (form.model.trim()) payload.model = form.model.trim();
    if (form.marketPrice) payload.marketPrice = Number(form.marketPrice);
    if (form.description.trim()) payload.description = form.description.trim();

    createPart.mutate(payload, {
      onSuccess: () => {
        toast.success("Listing created successfully");
        setForm(emptyForm);
        setErrors({});
        onOpenChange(false);
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to create listing");
      },
    });
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setForm(emptyForm);
      setErrors({});
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Listing</DialogTitle>
          <DialogDescription>
            List a spare part on the marketplace for buyers to discover.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          {/* Part Name */}
          <div className="space-y-1.5">
            <Label htmlFor="part-name">
              Part Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="part-name"
              placeholder="e.g. Brake Pad Set - Front"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Cascading: Vehicle Type → Brand → Model */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>
                Vehicle Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.vehicleType}
                onValueChange={(v) => {
                  set("vehicleType", v);
                  set("brand", "");
                  set("model", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.length > 0 ? (
                    vehicleTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))
                  ) : (
                    VEHICLE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.vehicleType && (
                <p className="text-xs text-destructive">{errors.vehicleType}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Brand <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.brand}
                onValueChange={(v) => {
                  set("brand", v);
                  set("model", "");
                }}
                disabled={!form.vehicleType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {form.vehicleType && grouped[form.vehicleType] ? (
                    Object.keys(grouped[form.vehicleType]).map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__placeholder__" disabled>Select type first</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.brand && (
                <p className="text-xs text-destructive">{errors.brand}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Model</Label>
              <Select
                value={form.model}
                onValueChange={(v) => set("model", v)}
                disabled={!form.brand}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {form.vehicleType && form.brand && grouped[form.vehicleType]?.[form.brand] ? (
                    grouped[form.vehicleType][form.brand]
                      .filter((m) => m.model)
                      .map((m) => (
                        <SelectItem key={m.id} value={m.model!}>{m.model}</SelectItem>
                      ))
                  ) : (
                    <SelectItem value="__placeholder__" disabled>Select brand first</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-1.5">
            <Label>
              Condition <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.condition}
              onValueChange={(v) => set("condition", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.condition && (
              <p className="text-xs text-destructive">{errors.condition}</p>
            )}
          </div>

          {/* Price + Market Price + Stock */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="part-price">
                Price (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="part-price"
                type="number"
                min="1"
                placeholder="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="part-market-price">Market Price (₹)</Label>
              <Input
                id="part-market-price"
                type="number"
                min="1"
                placeholder="MRP"
                value={form.marketPrice}
                onChange={(e) => set("marketPrice", e.target.value)}
              />
              {errors.marketPrice && (
                <p className="text-xs text-destructive">{errors.marketPrice}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="part-stock">Stock</Label>
              <Input
                id="part-stock"
                type="number"
                min="0"
                placeholder="0"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
              />
              {errors.stock && (
                <p className="text-xs text-destructive">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="part-desc">Description</Label>
            <Textarea
              id="part-desc"
              placeholder="Any additional details about the part..."
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={createPart.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createPart.isPending}>
              {createPart.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create Listing
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Component ---

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleType, setVehicleType] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [addListingOpen, setAddListingOpen] = useState(false);

  const { data: vmData } = useVehicleMaster();
  const vmGrouped = vmData?.grouped ?? {};
  const vmVehicleTypes = Object.keys(vmGrouped);
  // Get all unique brands from vehicle master (or filter by selected type)
  const vmBrands = vehicleType !== "all" && vmGrouped[vehicleType]
    ? Object.keys(vmGrouped[vehicleType])
    : [...new Set(Object.values(vmGrouped).flatMap((b) => Object.keys(b)))];

  const itemsPerPage = 6;

  const { data, isLoading, isError, error, refetch } = useSpareParts({
    search: searchQuery,
    vehicleType,
    brand: brandFilter,
    condition: conditionFilter,
    minPrice: priceMin,
    maxPrice: priceMax,
    page: currentPage,
    limit: itemsPerPage,
  });

  const parts = data?.parts ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: itemsPerPage,
    total: 0,
    totalPages: 1,
  };

  const totalPages = pagination.totalPages;
  const totalParts = pagination.total;

  // Extract unique brands from current results, fallback to static list
  const apiBrands = [
    ...new Set(
      parts.map(
        (p: { brand: string }) => p.brand
      )
    ),
  ] as string[];
  const brands = apiBrands.length > 0 ? apiBrands : staticBrands;

  // Map API parts to display-ready objects
  const displayParts = parts.map(
    (
      part: {
        id: string;
        name: string;
        vehicleType: string;
        brand: string;
        condition: string;
        price: number;
        marketPrice: number;
        stock: number;
        images: string[];
        description: string;
        isActive: boolean;
        createdAt: string;
        workshop: {
          name: string;
          address: string;
          rating: number;
          reviewCount: number;
        };
      },
      index: number
    ) => ({
      id: part.id,
      name: part.name,
      vehicleType: part.vehicleType,
      brand: part.brand,
      condition: conditionMap[part.condition] ?? part.condition,
      price: part.price,
      marketPrice: part.marketPrice,
      workshopName: part.workshop.name,
      location: part.workshop.address,
      rating: part.workshop.rating,
      reviewCount: part.workshop.reviewCount,
      inStock: part.stock > 0,
      stockQty: part.stock,
      gradient: gradients[index % gradients.length],
    })
  );

  const clearFilters = () => {
    setSearchQuery("");
    setVehicleType("all");
    setBrandFilter("all");
    setConditionFilter("all");
    setPriceMin("");
    setPriceMax("");
    setCurrentPage(1);
  };

  const handleRetry = () => {
    toast.info("Retrying...");
    refetch();
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Spare Parts Marketplace
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse and purchase quality spare parts from verified workshops
          </p>
        </div>
        <Button className="w-fit" onClick={() => setAddListingOpen(true)}>
          <Plus className="size-4" />
          Add Listing
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card className="gap-0 py-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search Row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search parts, brands, workshops..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="size-4" />
                  Filters
                </Button>
                <Separator
                  orientation="vertical"
                  className="h-6 hidden sm:block"
                />
                <div className="flex items-center rounded-md border p-0.5">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon-xs"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="size-3.5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon-xs"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <List className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filter Row (collapsible) */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Separator className="mb-4" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <Select
                      value={vehicleType}
                      onValueChange={(v) => {
                        setVehicleType(v);
                        setBrandFilter("all");
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Vehicle Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Vehicles</SelectItem>
                        {vmVehicleTypes.length > 0 ? (
                          vmVehicleTypes.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="2-Wheeler">2-Wheeler</SelectItem>
                            <SelectItem value="4-Wheeler">4-Wheeler</SelectItem>
                            <SelectItem value="EV">EV</SelectItem>
                            <SelectItem value="Truck">Truck</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>

                    <Select
                      value={brandFilter}
                      onValueChange={(v) => {
                        setBrandFilter(v);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {(vmBrands.length > 0 ? vmBrands : brands).map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={conditionFilter}
                      onValueChange={(v) => {
                        setConditionFilter(v);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        <SelectItem value="USED_GOOD">Used - Good</SelectItem>
                        <SelectItem value="REFURBISHED">
                          Refurbished
                        </SelectItem>
                        <SelectItem value="LIKE_NEW">Like New</SelectItem>
                        <SelectItem value="OEM_SURPLUS">
                          OEM Surplus
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      placeholder="Min Price (₹)"
                      value={priceMin}
                      onChange={(e) => {
                        setPriceMin(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Max Price (₹)"
                      value={priceMax}
                      onChange={(e) => {
                        setPriceMax(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading parts..."
            : `Showing ${displayParts.length} of ${totalParts} parts`}
        </p>
      </div>

      {/* Error State */}
      {isError && (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center gap-3 text-center">
            <AlertCircle className="size-12 text-destructive/60" />
            <p className="text-lg font-medium">Failed to load parts</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Something went wrong. Please try again."}
            </p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCw className="size-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading Skeleton */}
      {isLoading &&
        (viewMode === "grid" ? <GridSkeleton /> : <ListSkeleton />)}

      {/* Parts Grid / List */}
      {!isLoading && !isError && displayParts.length === 0 ? (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center gap-3 text-center">
            <Package className="size-12 text-muted-foreground/40" />
            <p className="text-lg font-medium">No parts found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : !isLoading && !isError && viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {displayParts.map(
              (
                part: {
                  id: string;
                  name: string;
                  vehicleType: string;
                  brand: string;
                  condition: string;
                  price: number;
                  marketPrice: number;
                  workshopName: string;
                  location: string;
                  rating: number;
                  reviewCount: number;
                  inStock: boolean;
                  stockQty: number;
                  gradient: string;
                },
                index: number
              ) => (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="group gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
                    {/* Image Placeholder */}
                    <div
                      className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${part.gradient}`}
                    >
                      <Package className="size-12 text-white/60" />
                      {/* Stock indicator */}
                      <div className="absolute right-2 top-2">
                        {part.inStock ? (
                          <Badge className="bg-green-600/90 text-white text-[10px] gap-1 border-0">
                            <CheckCircle2 className="size-3" />
                            In Stock ({part.stockQty})
                          </Badge>
                        ) : (
                          <Badge className="bg-red-600/90 text-white text-[10px] gap-1 border-0">
                            <AlertCircle className="size-3" />
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      {/* Condition badge */}
                      <div className="absolute left-2 top-2">
                        <Badge
                          className={`text-[10px] border-0 ${
                            conditionColor[part.condition] ?? ""
                          }`}
                        >
                          {part.condition}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="flex flex-col gap-3 p-4">
                      {/* Part Name */}
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                        {part.name}
                      </h3>

                      {/* Rating */}
                      <StarRating
                        rating={part.rating}
                        count={part.reviewCount}
                      />

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-primary">
                          {formatINR(part.price)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {formatINR(part.marketPrice)}
                        </span>
                        {part.marketPrice > part.price && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] text-green-700 dark:text-green-400"
                          >
                            {Math.round(
                              ((part.marketPrice - part.price) /
                                part.marketPrice) *
                                100
                            )}
                            % off
                          </Badge>
                        )}
                      </div>

                      <Separator />

                      {/* Workshop */}
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <MapPin className="mt-0.5 size-3 shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">
                            {part.workshopName}
                          </p>
                          <p>{part.location}</p>
                        </div>
                      </div>

                      {/* Action */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1 w-full"
                        disabled={!part.inStock}
                      >
                        {part.inStock
                          ? "View Details"
                          : "Notify When Available"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      ) : !isLoading && !isError && viewMode === "list" ? (
        /* List View */
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {displayParts.map(
              (
                part: {
                  id: string;
                  name: string;
                  vehicleType: string;
                  brand: string;
                  condition: string;
                  price: number;
                  marketPrice: number;
                  workshopName: string;
                  location: string;
                  rating: number;
                  reviewCount: number;
                  inStock: boolean;
                  stockQty: number;
                  gradient: string;
                },
                index: number
              ) => (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                      {/* Image Placeholder */}
                      <div
                        className={`flex h-20 w-full shrink-0 items-center justify-center rounded-lg bg-gradient-to-br sm:h-24 sm:w-28 ${part.gradient}`}
                      >
                        <Package className="size-8 text-white/60" />
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold">{part.name}</h3>
                          <Badge
                            className={`text-[10px] border-0 ${
                              conditionColor[part.condition] ?? ""
                            }`}
                          >
                            {part.condition}
                          </Badge>
                          {part.inStock ? (
                            <Badge className="bg-green-600/90 text-white text-[10px] gap-1 border-0">
                              <CheckCircle2 className="size-3" />
                              In Stock ({part.stockQty})
                            </Badge>
                          ) : (
                            <Badge className="bg-red-600/90 text-white text-[10px] gap-1 border-0">
                              <AlertCircle className="size-3" />
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        <StarRating
                          rating={part.rating}
                          count={part.reviewCount}
                        />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          <span>
                            {part.workshopName} - {part.location}
                          </span>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {formatINR(part.price)}
                          </p>
                          <p className="text-xs text-muted-foreground line-through">
                            {formatINR(part.marketPrice)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!part.inStock}
                        >
                          {part.inStock
                            ? "View Details"
                            : "Notify When Available"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      ) : null}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
              className="min-w-8"
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      {/* Add Listing Modal */}
      <AddListingModal open={addListingOpen} onOpenChange={setAddListingOpen} />
    </div>
  );
}

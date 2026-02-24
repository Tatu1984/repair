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

// --- Types ---

type Condition = "Used - Good" | "Refurbished" | "Like New" | "OEM Surplus";

interface SparePart {
  id: string;
  name: string;
  vehicleType: string;
  brand: string;
  condition: Condition;
  price: number;
  marketPrice: number;
  workshopName: string;
  location: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQty: number;
  gradient: string;
}

// --- Mock Data ---

const spareParts: SparePart[] = [
  {
    id: "SP-001",
    name: "Brake Pad Set - Honda Activa",
    vehicleType: "2-Wheeler",
    brand: "Honda",
    condition: "Like New",
    price: 450,
    marketPrice: 750,
    workshopName: "Sharma Auto Parts",
    location: "Lajpat Nagar, Delhi",
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stockQty: 12,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    id: "SP-002",
    name: "Clutch Plate - Bajaj Pulsar 150",
    vehicleType: "2-Wheeler",
    brand: "Bajaj",
    condition: "Refurbished",
    price: 680,
    marketPrice: 1200,
    workshopName: "Rajesh Two Wheeler Hub",
    location: "Koramangala, Bangalore",
    rating: 4.2,
    reviewCount: 89,
    inStock: true,
    stockQty: 5,
    gradient: "from-orange-500 to-amber-400",
  },
  {
    id: "SP-003",
    name: "Head Light Assembly - Hero Splendor",
    vehicleType: "2-Wheeler",
    brand: "Hero",
    condition: "OEM Surplus",
    price: 1100,
    marketPrice: 1800,
    workshopName: "Gupta Motor Works",
    location: "Karol Bagh, Delhi",
    rating: 4.8,
    reviewCount: 215,
    inStock: true,
    stockQty: 8,
    gradient: "from-purple-500 to-pink-400",
  },
  {
    id: "SP-004",
    name: "Radiator Fan Motor - Maruti Swift",
    vehicleType: "4-Wheeler",
    brand: "Maruti",
    condition: "Used - Good",
    price: 2200,
    marketPrice: 4500,
    workshopName: "Singh Auto Spares",
    location: "Andheri West, Mumbai",
    rating: 4.0,
    reviewCount: 64,
    inStock: true,
    stockQty: 3,
    gradient: "from-green-500 to-emerald-400",
  },
  {
    id: "SP-005",
    name: "Alternator - Hyundai i20",
    vehicleType: "4-Wheeler",
    brand: "Hyundai",
    condition: "Refurbished",
    price: 3500,
    marketPrice: 6800,
    workshopName: "Kumar Auto Electricals",
    location: "T. Nagar, Chennai",
    rating: 4.6,
    reviewCount: 147,
    inStock: false,
    stockQty: 0,
    gradient: "from-red-500 to-rose-400",
  },
  {
    id: "SP-006",
    name: "Suspension Coil Spring - Tata Nexon",
    vehicleType: "4-Wheeler",
    brand: "Tata",
    condition: "Like New",
    price: 1800,
    marketPrice: 3200,
    workshopName: "Patel Car Care",
    location: "Satellite, Ahmedabad",
    rating: 4.3,
    reviewCount: 93,
    inStock: true,
    stockQty: 6,
    gradient: "from-indigo-500 to-violet-400",
  },
  {
    id: "SP-007",
    name: "Battery 12V 35Ah - Bajaj Chetak EV",
    vehicleType: "EV",
    brand: "Bajaj",
    condition: "OEM Surplus",
    price: 8500,
    marketPrice: 14000,
    workshopName: "GreenDrive EV Solutions",
    location: "Hinjawadi, Pune",
    rating: 4.7,
    reviewCount: 56,
    inStock: true,
    stockQty: 4,
    gradient: "from-teal-500 to-green-400",
  },
  {
    id: "SP-008",
    name: "Air Filter - Tata Ace Truck",
    vehicleType: "Truck",
    brand: "Tata",
    condition: "Used - Good",
    price: 950,
    marketPrice: 1600,
    workshopName: "Bharat Truck Parts",
    location: "Peenya, Bangalore",
    rating: 3.9,
    reviewCount: 42,
    inStock: true,
    stockQty: 15,
    gradient: "from-yellow-500 to-orange-400",
  },
  {
    id: "SP-009",
    name: "Disc Brake Rotor - Honda City",
    vehicleType: "4-Wheeler",
    brand: "Honda",
    condition: "Refurbished",
    price: 2800,
    marketPrice: 5200,
    workshopName: "Verma Auto Garage",
    location: "Salt Lake, Kolkata",
    rating: 4.4,
    reviewCount: 110,
    inStock: true,
    stockQty: 7,
    gradient: "from-sky-500 to-blue-400",
  },
];

// --- Helpers ---

const conditionColor: Record<Condition, string> = {
  "Used - Good": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Refurbished: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Like New": "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "OEM Surplus": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

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

  const itemsPerPage = 6;

  // Filtering
  const filtered = spareParts.filter((part) => {
    const matchesSearch =
      !searchQuery ||
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.workshopName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVehicle =
      vehicleType === "all" || part.vehicleType === vehicleType;
    const matchesBrand =
      brandFilter === "all" || part.brand === brandFilter;
    const matchesCondition =
      conditionFilter === "all" || part.condition === conditionFilter;
    const matchesPriceMin =
      !priceMin || part.price >= Number(priceMin);
    const matchesPriceMax =
      !priceMax || part.price <= Number(priceMax);

    return (
      matchesSearch &&
      matchesVehicle &&
      matchesBrand &&
      matchesCondition &&
      matchesPriceMin &&
      matchesPriceMax
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const brands = [...new Set(spareParts.map((p) => p.brand))];

  const clearFilters = () => {
    setSearchQuery("");
    setVehicleType("all");
    setBrandFilter("all");
    setConditionFilter("all");
    setPriceMin("");
    setPriceMax("");
    setCurrentPage(1);
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
        <Button className="w-fit">
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
                <Separator orientation="vertical" className="h-6 hidden sm:block" />
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
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Vehicle Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Vehicles</SelectItem>
                        <SelectItem value="2-Wheeler">2-Wheeler</SelectItem>
                        <SelectItem value="4-Wheeler">4-Wheeler</SelectItem>
                        <SelectItem value="EV">EV</SelectItem>
                        <SelectItem value="Truck">Truck</SelectItem>
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
                        {brands.map((b) => (
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
                        <SelectItem value="Used - Good">Used - Good</SelectItem>
                        <SelectItem value="Refurbished">Refurbished</SelectItem>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="OEM Surplus">OEM Surplus</SelectItem>
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
          Showing {paginated.length} of {filtered.length} parts
        </p>
      </div>

      {/* Parts Grid / List */}
      {paginated.length === 0 ? (
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
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {paginated.map((part, index) => (
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
                        className={`text-[10px] border-0 ${conditionColor[part.condition]}`}
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
                    <StarRating rating={part.rating} count={part.reviewCount} />

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">
                        {formatINR(part.price)}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {formatINR(part.marketPrice)}
                      </span>
                      <Badge variant="secondary" className="text-[10px] text-green-700 dark:text-green-400">
                        {Math.round(
                          ((part.marketPrice - part.price) / part.marketPrice) *
                            100
                        )}
                        % off
                      </Badge>
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
                      {part.inStock ? "View Details" : "Notify When Available"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* List View */
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {paginated.map((part, index) => (
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
                          className={`text-[10px] border-0 ${conditionColor[part.condition]}`}
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
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

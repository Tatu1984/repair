"use client";

import { useState, useMemo } from "react";
import {
  Car,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  useVehicleMaster,
  useCreateVehicleMaster,
  useUpdateVehicleMaster,
  useDeleteVehicleMaster,
} from "@/lib/hooks/use-vehicle-master";

// --- Types ---

interface VehicleMasterEntry {
  id: string;
  vehicleType: string;
  brand: string;
  model: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  isActive: boolean;
}

interface FormData {
  vehicleType: string;
  brand: string;
  model: string;
  yearFrom: string;
  yearTo: string;
}

const emptyForm: FormData = {
  vehicleType: "",
  brand: "",
  model: "",
  yearFrom: "",
  yearTo: "",
};

// --- Add/Edit Dialog ---

function VehicleMasterFormDialog({
  open,
  onClose,
  editEntry,
}: {
  open: boolean;
  onClose: () => void;
  editEntry?: VehicleMasterEntry | null;
}) {
  const isEdit = !!editEntry;
  const createMutation = useCreateVehicleMaster();
  const updateMutation = useUpdateVehicleMaster();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [form, setForm] = useState<FormData>(() => {
    if (editEntry) {
      return {
        vehicleType: editEntry.vehicleType,
        brand: editEntry.brand,
        model: editEntry.model || "",
        yearFrom: editEntry.yearFrom ? String(editEntry.yearFrom) : "",
        yearTo: editEntry.yearTo ? String(editEntry.yearTo) : "",
      };
    }
    return emptyForm;
  });

  const setField = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.vehicleType.trim() || !form.brand.trim()) {
      toast.error("Vehicle type and brand are required");
      return;
    }

    const payload: Record<string, unknown> = {
      vehicleType: form.vehicleType.trim(),
      brand: form.brand.trim(),
    };
    if (form.model.trim()) payload.model = form.model.trim();
    if (form.yearFrom) payload.yearFrom = Number(form.yearFrom);
    if (form.yearTo) payload.yearTo = Number(form.yearTo);

    if (isEdit) {
      updateMutation.mutate(
        { id: editEntry!.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Entry updated");
            onClose();
          },
          onError: (err: Error) => toast.error(err.message || "Failed to update"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Entry added");
          onClose();
        },
        onError: (err: Error) => toast.error(err.message || "Failed to add"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Entry" : "Add Vehicle Master Entry"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update vehicle type, brand, and model details."
              : "Add a new vehicle type, brand, and model combination."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label>Vehicle Type *</Label>
            <Input
              value={form.vehicleType}
              onChange={(e) => setField("vehicleType", e.target.value)}
              placeholder="e.g. 2-Wheeler, 4-Wheeler, EV"
            />
          </div>

          <div className="space-y-2">
            <Label>Brand *</Label>
            <Input
              value={form.brand}
              onChange={(e) => setField("brand", e.target.value)}
              placeholder="e.g. Honda, Bajaj, Tata"
            />
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Input
              value={form.model}
              onChange={(e) => setField("model", e.target.value)}
              placeholder="e.g. Activa 6G, Pulsar 150"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Year From</Label>
              <Input
                type="number"
                value={form.yearFrom}
                onChange={(e) => setField("yearFrom", e.target.value)}
                placeholder="e.g. 2018"
              />
            </div>
            <div className="space-y-2">
              <Label>Year To</Label>
              <Input
                type="number"
                value={form.yearTo}
                onChange={(e) => setField("yearTo", e.target.value)}
                placeholder="e.g. 2024"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Entry"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Loading Skeleton ---

function TableSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vehicle Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Brand</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Model</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Years</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                <td className="hidden px-4 py-3 sm:table-cell"><Skeleton className="h-4 w-24" /></td>
                <td className="hidden px-4 py-3 md:table-cell"><Skeleton className="h-4 w-20" /></td>
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

export default function VehicleMasterPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<VehicleMasterEntry | null>(null);

  const { data, isLoading, isError, error, refetch } = useVehicleMaster();
  const deleteMutation = useDeleteVehicleMaster();

  const entries: VehicleMasterEntry[] = data?.entries ?? [];

  // Get unique vehicle types for filter
  const vehicleTypes = useMemo(
    () => [...new Set(entries.map((e) => e.vehicleType))].sort(),
    [entries]
  );

  // Filter entries
  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      if (typeFilter !== "all" && entry.vehicleType !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          entry.vehicleType.toLowerCase().includes(q) ||
          entry.brand.toLowerCase().includes(q) ||
          (entry.model?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [entries, typeFilter, search]);

  const openAdd = () => {
    setEditEntry(null);
    setDialogOpen(true);
  };

  const openEdit = (entry: VehicleMasterEntry) => {
    setEditEntry(entry);
    setDialogOpen(true);
  };

  const handleDelete = (id: string, label: string) => {
    if (!confirm(`Deactivate "${label}"? It will be hidden from dropdowns.`)) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Entry deactivated"),
      onError: (err: Error) => toast.error(err.message || "Failed to deactivate"),
    });
  };

  if (isError && !isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Master Data</h1>
          <p className="text-sm text-muted-foreground">Manage vehicle types, brands, and models</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="size-7 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Failed to load vehicle master data</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Master Data</h1>
          <p className="text-sm text-muted-foreground">
            Manage vehicle types, brands, and models
            {entries.length > 0 && ` \u2022 ${entries.length} entries`}
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="size-4" />
          Add Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search type, brand, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vehicle Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {vehicleTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vehicle Type</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Brand</th>
                    <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Model</th>
                    <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Years</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => (
                    <tr key={entry.id} className="border-b last:border-b-0 transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Badge variant="secondary">{entry.vehicleType}</Badge>
                      </td>
                      <td className="px-4 py-3 font-medium">{entry.brand}</td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {entry.model || "\u2014"}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                        {entry.yearFrom || entry.yearTo
                          ? `${entry.yearFrom || "?"} - ${entry.yearTo || "?"}`
                          : "\u2014"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEdit(entry)}
                            title="Edit"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              handleDelete(
                                entry.id,
                                `${entry.brand} ${entry.model || ""}`.trim()
                              )
                            }
                            title="Deactivate"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <Car className="size-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No entries found</p>
                <Button variant="outline" size="sm" onClick={openAdd}>
                  <Plus className="mr-1.5 size-3.5" />
                  Add first entry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add / Edit Dialog */}
      {dialogOpen && (
        <VehicleMasterFormDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditEntry(null);
          }}
          editEntry={editEntry}
        />
      )}
    </div>
  );
}

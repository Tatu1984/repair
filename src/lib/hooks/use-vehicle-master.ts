"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface VehicleMasterModel {
  id: string;
  model: string | null;
  yearFrom: number | null;
  yearTo: number | null;
}

interface VehicleMasterEntry {
  id: string;
  vehicleType: string;
  brand: string;
  model: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VehicleMasterResponse {
  grouped: Record<string, Record<string, VehicleMasterModel[]>>;
  entries: VehicleMasterEntry[];
}

// Public hook — returns grouped vehicle master data for cascading dropdowns
export function useVehicleMaster() {
  return useQuery({
    queryKey: ["vehicle-master"],
    queryFn: () => apiClient<VehicleMasterResponse>("/api/v1/admin/vehicle-master"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Admin mutations

export function useCreateVehicleMaster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient("/api/v1/admin/vehicle-master", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-master"] });
    },
  });
}

export function useUpdateVehicleMaster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiClient(`/api/v1/admin/vehicle-master/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-master"] });
    },
  });
}

export function useDeleteVehicleMaster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/api/v1/admin/vehicle-master/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-master"] });
    },
  });
}

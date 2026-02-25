"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface PartsFilters {
  search?: string;
  vehicleType?: string;
  brand?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: number;
  limit?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface PartsResponse {
  parts: any[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function useSpareParts(filters: PartsFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "all" && value !== "") {
      params.set(key, String(value));
    }
  });

  return useQuery({
    queryKey: ["spare-parts", filters],
    queryFn: () => apiClient<PartsResponse>(`/api/v1/marketplace/parts?${params.toString()}`),
  });
}

export function useSparePartDetail(id: string | null) {
  return useQuery({
    queryKey: ["spare-part", id],
    queryFn: () => apiClient(`/api/v1/marketplace/parts/${id}`),
    enabled: !!id,
  });
}

export function useCreatePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient("/api/v1/marketplace/parts", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spare-parts"] });
    },
  });
}

export function useDeletePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/api/v1/marketplace/parts/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spare-parts"] });
    },
  });
}

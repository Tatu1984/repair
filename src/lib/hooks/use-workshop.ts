"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// --- Dashboard ---

export function useWorkshopDashboard() {
  return useQuery({
    queryKey: ["workshop-dashboard"],
    queryFn: () => apiClient<any>("/api/v1/workshop/dashboard"),
    refetchInterval: 30000,
  });
}

// --- Inventory ---

interface InventoryFilters {
  search?: string;
  condition?: string;
  stockStatus?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export function useWorkshopInventory(filters: InventoryFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.condition) params.set("condition", filters.condition);
  if (filters.stockStatus) params.set("stockStatus", filters.stockStatus);
  if (filters.category) params.set("category", filters.category);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const qs = params.toString();

  return useQuery({
    queryKey: ["workshop-inventory", filters],
    queryFn: () =>
      apiClient<any>(`/api/v1/workshop/inventory${qs ? `?${qs}` : ""}`),
  });
}

// --- Orders ---

interface OrderFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export function useWorkshopOrders(filters: OrderFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const qs = params.toString();

  return useQuery({
    queryKey: ["workshop-orders", filters],
    queryFn: () =>
      apiClient<any>(`/api/v1/workshop/orders${qs ? `?${qs}` : ""}`),
  });
}

// --- Profile ---

export function useWorkshopProfile() {
  return useQuery({
    queryKey: ["workshop-profile"],
    queryFn: () => apiClient<any>("/api/v1/workshop/profile"),
    staleTime: 60000,
  });
}

export function useUpdateWorkshopProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient("/api/v1/workshop/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workshop-profile"] });
      queryClient.invalidateQueries({ queryKey: ["workshop-dashboard"] });
    },
  });
}

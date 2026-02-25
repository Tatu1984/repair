"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface OrdersResponse {
  orders: any[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function useOrders(filters: { status?: string; page?: number } = {}) {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));

  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => apiClient<OrdersResponse>(`/api/v1/orders?${params.toString()}`),
  });
}

export function useMyOrders(page = 1) {
  return useQuery({
    queryKey: ["my-orders", page],
    queryFn: () => apiClient(`/api/v1/orders/my-orders?page=${page}`),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, orderStatus }: { id: string; orderStatus: string }) =>
      apiClient(`/api/v1/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ orderStatus }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface BreakdownFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface BreakdownsResponse {
  breakdowns: any[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function useBreakdowns(filters: BreakdownFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  return useQuery({
    queryKey: ["breakdowns", filters],
    queryFn: () => apiClient<BreakdownsResponse>(`/api/v1/breakdowns?${params.toString()}`),
  });
}

export function useBreakdownDetail(id: string | null) {
  return useQuery({
    queryKey: ["breakdown", id],
    queryFn: () => apiClient(`/api/v1/breakdowns/${id}`),
    enabled: !!id,
  });
}

export function useMyBreakdowns(page = 1) {
  return useQuery({
    queryKey: ["my-breakdowns", page],
    queryFn: () => apiClient(`/api/v1/breakdowns/my-history?page=${page}`),
  });
}

export function useUpdateBreakdownStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient(`/api/v1/breakdowns/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["breakdowns"] });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMechanics(filters: { search?: string; status?: string } = {}) {
  return useQuery({
    queryKey: ["mechanics-admin", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      return apiClient<any[]>(`/api/v1/admin/mechanics/pending?${params.toString()}`);
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAllMechanics() {
  return useQuery({
    queryKey: ["all-mechanics"],
    queryFn: () => apiClient<any[]>("/api/v1/admin/mechanics/pending"),
  });
}

export function useVerifyMechanic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      apiClient(`/api/v1/admin/mechanics/${id}/verify`, {
        method: "PUT",
        body: JSON.stringify({ action }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mechanics-admin"] });
      queryClient.invalidateQueries({ queryKey: ["all-mechanics"] });
    },
  });
}

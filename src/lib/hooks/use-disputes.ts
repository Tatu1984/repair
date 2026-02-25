"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DisputesResponse {
  disputes: any[];
}

export function useDisputes(filters: { status?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "all") params.set("status", filters.status);

  return useQuery({
    queryKey: ["disputes", filters],
    queryFn: () => apiClient<DisputesResponse>(`/api/v1/disputes?${params.toString()}`),
  });
}

export function useResolveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolution, status }: { id: string; resolution: string; status: string }) =>
      apiClient(`/api/v1/disputes/${id}/resolve`, {
        method: "PUT",
        body: JSON.stringify({ resolution, status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
    },
  });
}

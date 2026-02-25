"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useWorkshops() {
  return useQuery({
    queryKey: ["workshops"],
    queryFn: () => apiClient<any[]>("/api/v1/admin/workshops/pending"),
  });
}

export function useVerifyWorkshop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      apiClient(`/api/v1/admin/workshops/${id}/verify`, {
        method: "PUT",
        body: JSON.stringify({ action }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
    },
  });
}

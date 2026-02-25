"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiClient<any>("/api/v1/admin/dashboard-stats"),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePlatformConfig() {
  return useQuery({
    queryKey: ["platform-config"],
    queryFn: () => apiClient<any>("/api/v1/admin/config/commission"),
  });
}

export function useUpdatePlatformConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient("/api/v1/admin/config/commission", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-config"] });
    },
  });
}

export function useActiveBreakdowns() {
  return useQuery({
    queryKey: ["active-breakdowns"],
    queryFn: () => apiClient("/api/v1/admin/breakdowns/active"),
    refetchInterval: 5000,
  });
}

interface AnalyticsData {
  stats: {
    totalBreakdowns: number;
    avgResponseTime: string;
    totalRevenue: number;
    activeMechanics: number;
    partsSold: number;
    customerSatisfaction: string;
  };
  breakdownTrends: { date: string; breakdowns: number; resolved: number }[];
  breakdownTypes: { name: string; value: number; color: string }[];
  revenueByMonth: { month: string; services: number; parts: number }[];
  mechanicPerformance: { name: string; rating: number; totalJobs: number }[];
  cityBreakdowns: { city: string; count: number; percentage: number }[];
  topParts: { name: string; demand: number; trend: number }[];
}

export function useAnalytics(range?: string) {
  const params = range ? `?range=${encodeURIComponent(range)}` : "";
  return useQuery({
    queryKey: ["analytics", range],
    queryFn: () => apiClient<AnalyticsData>(`/api/v1/admin/analytics${params}`),
    staleTime: 60000, // Cache for 1 minute
  });
}

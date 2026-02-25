"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { apiClient } from "@/lib/api-client";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, login, logout, updateUser } = useAuthStore();

  const sendOtp = async (phone: string, role: string) => {
    return apiClient("/api/v1/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone, role: role.toUpperCase() }),
      skipAuth: true,
    });
  };

  const verifyOtp = async (phone: string, otp: string, role: string) => {
    const data = await apiClient<{
      user: { id: string; phone: string; name: string | null; email: string | null; role: string; avatarUrl: string | null };
      accessToken: string;
      refreshToken: string;
    }>("/api/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp, role: role.toUpperCase() }),
      skipAuth: true,
    });

    login(data.user, data.accessToken, data.refreshToken);

    // Set cookie for middleware with security flags
    const isSecure = window.location.protocol === "https:";
    document.cookie = `access_token=${data.accessToken};path=/;max-age=${15 * 60};SameSite=Strict${isSecure ? ";Secure" : ""}`;

    return data;
  };

  const handleLogout = () => {
    logout();
    document.cookie = "access_token=;path=/;max-age=0;SameSite=Strict";
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    sendOtp,
    verifyOtp,
    logout: handleLogout,
    updateUser,
  };
}

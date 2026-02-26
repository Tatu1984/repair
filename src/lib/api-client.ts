import { useAuthStore } from "./store/auth-store";

// Always use relative URLs — the client runs on the same origin as the API
const BASE_URL = "";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

async function refreshAuth(): Promise<boolean> {
  const { refreshToken, setTokens, logout } = useAuthStore.getState();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      logout();
      return false;
    }

    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    // Sync cookie with new access token
    if (typeof document !== "undefined") {
      const isSecure = window.location.protocol === "https:";
      document.cookie = `access_token=${data.accessToken};path=/;max-age=${7 * 24 * 60 * 60};SameSite=Strict${isSecure ? ";Secure" : ""}`;
    }
    return true;
  } catch {
    logout();
    return false;
  }
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { accessToken } = useAuthStore.getState();
  const { skipAuth, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (!skipAuth && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Auto-refresh on 401
  if (res.status === 401 && !skipAuth) {
    const refreshed = await refreshAuth();
    if (refreshed) {
      const { accessToken: newToken } = useAuthStore.getState();
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

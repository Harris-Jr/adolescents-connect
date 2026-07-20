/**
 * useAuth - Hook for authentication API calls
 * Handles:
 * - Register
 * - Login
 * - Logout
 * - Forgot password
 * - Reset password
 * - Refresh token
 * - Token management
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let accessToken = localStorage.getItem("accessToken") || null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
}

/**
 * Make API request with automatic token refresh
 */
async function apiRequest(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // for cookies (refresh token)
  });

  // Auto-refresh if 401 and not already a refresh attempt
  if (response.status === 401 && !endpoint.includes("refresh-token")) {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      const { accessToken: newToken } = await refreshResponse.json();
      setAccessToken(newToken);
      headers.Authorization = `Bearer ${newToken}`;

      // Retry original request
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      // Refresh failed - redirect to login
      setAccessToken(null);
      window.location.href = "/auth";
      return null;
    }
  }

  return response;
}

/**
 * Hook for authentication
 */
export function useAuthApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Registration failed");
      }

      const result = await response.json();
      setAccessToken(result.accessToken);
      toast.success("Registration successful!");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Login failed");
      }

      const result = await response.json();
      setAccessToken(result.accessToken);
      toast.success("Logged in successfully!");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      setAccessToken(null);
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Request failed");
      }

      const result = await response.json();
      toast.success("Check your email for a password reset link");
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Password reset request failed";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword, confirmPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Password reset failed");
      }

      const result = await response.json();
      setAccessToken(null);
      toast.success("Password reset successfully! Please log in.");
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Password reset failed";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await apiRequest("/auth/refresh-token", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const { accessToken: newToken } = await response.json();
      setAccessToken(newToken);
      return newToken;
    } catch (err) {
      setAccessToken(null);
      throw err;
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await apiRequest("/auth/me");

      if (!response.ok) {
        if (response.status === 401) {
          setAccessToken(null);
          return null;
        }
        throw new Error("Failed to fetch user");
      }

      const { user } = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      console.error("Get current user error:", err);
      return null;
    }
  }, []);

  return {
    isLoading,
    error,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    refreshAccessToken,
    getCurrentUser,
  };
}

export default useAuthApi;

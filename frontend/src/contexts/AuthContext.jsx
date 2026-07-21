import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);
const STORAGE_KEY = "alinks_user";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Get stored access token from localStorage
 */
function getStoredToken() {
  return localStorage.getItem("accessToken");
}

/**
 * Store access token in localStorage
 */
function setStoredToken(token) {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
}

/**
 * Make authenticated API request
 */
async function apiCall(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // For refresh token cookie
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || response.statusText || "Request failed");
  }

  return response.json();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to restore user from storage:", error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user with an identifier (phone number OR email) and password.
   * Calls backend API, stores token and user in state/localStorage
   */
  const login = async (identifier, password) => {
    try {
      const result = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      });

      const { user: userData, accessToken } = result;
      setStoredToken(accessToken);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  /**
   * Register new user
   * Calls backend API, stores token and user in state/localStorage
   */
  const register = async (input) => {
    try {
      const result = await apiCall("/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      });

      const { user: userData, accessToken } = result;
      setStoredToken(accessToken);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  /**
   * Logout user
   * Calls backend API to invalidate refresh token, clears local state
   */
  const logout = async () => {
    try {
      await apiCall("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setStoredToken(null);
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  };

  /**
   * Update user state (for onboarding, profile changes, etc.)
   */
  const updateUser = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/**
 * Get current access token (for API calls outside of hooks)
 */
export function getAccessToken() {
  return getStoredToken();
}

/**
 * Set access token (typically called by refresh-token flow)
 */
export function setAccessToken(token) {
  setStoredToken(token);
}

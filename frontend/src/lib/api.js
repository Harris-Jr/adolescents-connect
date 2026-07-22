import { getAccessToken, refreshAccessToken } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function authHeaders(extra) {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

/**
 * Core request helper. On a 401 (expired access token) it transparently
 * refreshes once and retries — the safety net for when the proactive
 * refresh scheduler hasn't fired yet (e.g. after the tab was backgrounded).
 */
export async function authFetch(path, options = {}) {
  const run = () =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: authHeaders(options.headers),
      credentials: "include",
    });

  let res = await run();
  if (res.status === 401 && !path.startsWith("/auth/")) {
    try {
      await refreshAccessToken();
      res = await run();
    } catch {
      // refresh failed — return the original 401 for the caller to handle
    }
  }
  return res;
}

async function toJson(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText || "Request failed");
  }
  return res.json();
}

export async function apiGet(path) {
  return toJson(await authFetch(path));
}

export async function apiPost(path, body) {
  return toJson(await authFetch(path, { method: "POST", body: JSON.stringify(body) }));
}

export async function apiPatch(path, body) {
  return toJson(await authFetch(path, { method: "PATCH", body: JSON.stringify(body) }));
}

export async function apiDelete(path) {
  return toJson(await authFetch(path, { method: "DELETE" }));
}

export { API_URL };

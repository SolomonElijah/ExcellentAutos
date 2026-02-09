// src/lib/api.js

export const API_BASE_URL = "https://portal.ejccars.com/api";

export async function api(endpoint, options = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
    body: options.body,
  });

  // IMPORTANT: stop silent redirects
  if (res.redirected) {
    throw new Error("Request was redirected (check backend middleware)");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }

  return res.json();
}

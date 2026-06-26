// src/repositories/authRepository.js

const BASE_URL = "/api/auth";

// ── Helper: builds headers with optional auth token ──
const headers = (token = null) => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
});

// ── Helper: handles response and throws readable errors ──
const handleResponse = async (res) => {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  } catch {
    throw new Error(`Server returned non-JSON (${res.status}): ${text.slice(0, 100)}`);
  }
};

export const authRepository = {
  // ── Register (owner only — self registration) ──
  async register({ email, password, businessName, businessType, ownerName }) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        email,
        password,
        businessName,
        businessType,
        ownerName,
      }),
    });
    return handleResponse(res);
  },

  // ── Login ──
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res); // returns { user, session }
  },

  // ── Logout ──
  async logout(token) {
    const res = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: headers(token),
    });
    return handleResponse(res);
  },

  // ── Get current user + profile (protected) ──
  async getMe(token) {
    const res = await fetch("/api/user/me", {
      method: "GET",
      headers: headers(token),
    });
    return handleResponse(res); // returns { user, profile }
  },
};

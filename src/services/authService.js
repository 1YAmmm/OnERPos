// src/services/authService.js

import { authRepository } from "../repositories/authRepository";

const SESSION_KEY = "onerpos_session";

export const authService = {
  // ── Register (owner only) ──
  async register({ businessName, businessType, ownerName, email, password }) {
    // Validation — business rules only, UI already validates format
    if (!email || !email.includes("@"))
      throw new Error("Invalid email address");
    if (!password || password.length < 6)
      throw new Error("Password must be at least 6 characters");
    if (!businessName?.trim()) throw new Error("Business name is required");
    if (!businessType) throw new Error("Business type is required");
    if (!ownerName?.trim()) throw new Error("Owner name is required");

    // confirmPassword never reaches here — already stripped by repository
    await authRepository.register({
      businessName,
      businessType,
      ownerName,
      email,
      password,
    });

    return { success: true };
  },

  // ── Login ──
  async login(email, password) {
    if (!email || !password) throw new Error("Email and password are required");

    const data = await authRepository.login(email, password);

    if (!data.session) throw new Error("Login failed — no session returned");

    // Persist full session (has access_token, refresh_token, user)
    localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));

    // Also persist user separately for quick access
    localStorage.setItem(`${SESSION_KEY}_user`, JSON.stringify(data.user));

    return { user: data.user, session: data.session };
  },

  // ── Logout ──
  async logout() {
    try {
      const token = authService.getToken();
      if (token) await authRepository.logout(token);
    } catch {
      // Even if API call fails, clear local session
    } finally {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(`${SESSION_KEY}_user`);
    }
  },

  // ── Get current user + full profile from API ──
  async fetchMe() {
    const token = authService.getToken();
    if (!token) throw new Error("Not authenticated");
    return authRepository.getMe(token);
    // returns { user, profile } — profile includes role, business info
  },

  // ── Session helpers ──
  getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  },

  getToken() {
    return authService.getSession()?.access_token || null;
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(`${SESSION_KEY}_user`) || "null");
    } catch {
      return null;
    }
  },

  // ── Role helpers ──
  getRole() {
    return authService.getUser()?.role || null;
  },

  isOwner() {
    return authService.getRole() === "owner";
  },

  isEmployee() {
    return authService.getRole() === "employee";
  },

  isSystemAdmin() {
    return authService.getRole() === "system_admin";
  },

  isAuthenticated() {
    return !!authService.getToken();
  },
};

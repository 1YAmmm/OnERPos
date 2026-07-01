// src/services/authService.js

import { authRepository } from '../repositories/authRepository';
import { supabase } from '../utils/supabaseClient';

const SESSION_KEY = 'onerpos_session';

export const authService = {
  // ── Register (owner only) ──
  async register({ businessName, businessType, ownerName, email, password }) {
    if (!email || !email.includes('@'))
      throw new Error('Invalid email address');
    if (!password || password.length < 6)
      throw new Error('Password must be at least 6 characters');
    if (!businessName?.trim()) throw new Error('Business name is required');
    if (!businessType) throw new Error('Business type is required');
    if (!ownerName?.trim()) throw new Error('Owner name is required');

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
    if (!email || !password) throw new Error('Email and password are required');

    const data = await authRepository.login(email, password);

    if (!data.session) throw new Error('Login failed — no session returned');

    // ── Sync session to supabase client so RLS works ──
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    // Persist full session
    localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    localStorage.setItem(`${SESSION_KEY}_user`, JSON.stringify(data.user));

    return { user: data.user, session: data.session };
  },

  // ── Restore session on app load (call this on mount) ──
  async restoreSession() {
    const session = authService.getSession();
    if (!session?.access_token) return null;

    // Sync stored session back into the supabase client
    const { data, error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (error) {
      // Token expired — clear everything
      authService._clearLocal();
      return null;
    }

    // If supabase refreshed the token, save the new session
    if (data.session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    }

    return data.session;
  },

  // ── Logout ──
  async logout() {
    try {
      const token = authService.getToken();
      if (token) await authRepository.logout(token);
      await supabase.auth.signOut();
    } catch {
      // ignore errors, always clear local
    } finally {
      authService._clearLocal();
    }
  },

  // ── Get current user + full profile from API ──
  async fetchMe() {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');
    return authRepository.getMe(token);
  },

  // ── Session helpers ──
  getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  },

  getToken() {
    return authService.getSession()?.access_token || null;
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(`${SESSION_KEY}_user`) || 'null');
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!authService.getToken();
  },

  // ── Role helpers ──
  getRole() {
    return authService.getUser()?.role || null;
  },

  isOwner() {
    return authService.getRole() === 'owner';
  },

  isEmployee() {
    return authService.getRole() === 'employee';
  },

  isSystemAdmin() {
    return authService.getRole() === 'system_admin';
  },

  // ── Internal: clear localStorage ──
  _clearLocal() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(`${SESSION_KEY}_user`);
  },
};

// src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // includes role + business info
  const [loading, setLoading] = useState(true); // true on mount while restoring session
  const [error, setError] = useState("");

  // ── Restore session on app load ──
  useEffect(() => {
    const restored = authService.getUser();
    if (restored) setUser(restored);

    // Also try to fetch full profile if token exists
    if (authService.isAuthenticated()) {
      authService
        .fetchMe()
        .then(({ user: u, profile: p }) => {
          setUser(u);
          setProfile(p);
        })
        .catch(() => {
          // Token expired or invalid — clear everything
          authService.logout();
          setUser(null);
          setProfile(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ── Register ──
  const register = async (form) => {
    setLoading(true);
    setError("");
    try {
      await authService.register(form);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ── Login ──
const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const { user: u } = await authService.login(email, password);
      setUser(u);

      const { profile: p } = await authService.fetchMe();
      setProfile(p);

      console.log("✅ Login successful:", { user: u, role: p?.role });
      return { success: true, role: p?.role };
    } catch (err) {
      console.log("❌ Login failed:", err.message);
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ──
  const logout = async () => {
    setLoading(true);
    setError("");
    try {
      await authService.logout();
      setUser(null);
      setProfile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Clear error manually (useful in forms) ──
  const clearError = () => setError("");

  return (
    <AuthContext.Provider
      value={{
        // State
        user,
        profile,
        loading,
        error,

        // Auth actions
        register,
        login,
        logout,
        clearError,

        // Token
        getToken: authService.getToken,

        // Auth status
        isAuthenticated: !!user,

        // Role booleans — use these in your UI
        isOwner: profile?.role === "owner",
        isEmployee: profile?.role === "employee",
        isSystemAdmin: profile?.role === "system_admin",
        role: profile?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

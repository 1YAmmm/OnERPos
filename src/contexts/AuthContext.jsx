// src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const effectiveRole =
    profile?.role === 'employee'
      ? profile?.position?.toLowerCase()
      : (profile?.role ?? null);

  // ── Restore session on app load ──
  useEffect(() => {
    async function restore() {
      try {
        const session = await authService.restoreSession();
        if (!session) {
          setLoading(false);
          return;
        }

        const { user: u, profile: p } = await authService.fetchMe();
        setUser(u);
        setProfile(p);
      } catch {
        await authService.logout();
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    restore();
  }, []);

  // ── Register ──
  const register = async (form) => {
    setLoading(true);
    setError('');
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
    setError('');
    try {
      const { user: u } = await authService.login(email, password);
      setUser(u);

      const { profile: p } = await authService.fetchMe();
      setProfile(p);

      return { success: true, role: p?.role, position: p?.position };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ──
  const logout = async () => {
    setLoading(true);
    setError('');
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

  const clearError = () => setError('');

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,

        register,
        login,
        logout,
        clearError,

        getToken: authService.getToken,
        isAuthenticated: !!user,

        isOwner: profile?.role === 'owner',
        isEmployee: profile?.role === 'employee',
        isSystemAdmin: profile?.role === 'system_admin',

        role: profile?.role ?? null,
        effectiveRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

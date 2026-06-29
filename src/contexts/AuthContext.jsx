import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Derive effectiveRole from profile
  const effectiveRole =
    profile?.role === 'employee'
      ? profile?.position?.toLowerCase() // 'Cashier' → 'cashier', 'Admin' → 'admin'
      : (profile?.role ?? null);

  useEffect(() => {
    const restored = authService.getUser();
    if (restored) setUser(restored);

    if (authService.isAuthenticated()) {
      authService
        .fetchMe()
        .then(({ user: u, profile: p }) => {
          setUser(u);
          setProfile(p);
        })
        .catch(() => {
          authService.logout();
          setUser(null);
          setProfile(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

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

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const { user: u } = await authService.login(email, password);
      setUser(u);

      const { profile: p } = await authService.fetchMe();
      setProfile(p);

      const role = p?.role;
      const position = p?.position;
      return { success: true, role, position };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

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

        // Role booleans
        isOwner: profile?.role === 'owner',
        isEmployee: profile?.role === 'employee',
        isSystemAdmin: profile?.role === 'system_admin',

        role: profile?.role ?? null,
        effectiveRole, // 'owner' | 'cashier' | 'admin' | 'system_admin' | null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

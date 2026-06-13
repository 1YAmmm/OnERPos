import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

// In-memory registered businesses (simulates a DB)
const registeredBusinesses = [];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('onerpos_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 800));

    // Check mock users first
    let found = MOCK_USERS.find(u => u.email === email && u.password === password);

    // Also check registered businesses
    if (!found) {
      const biz = registeredBusinesses.find(b => b.email === email && b.password === password);
      if (biz) found = biz;
    }

    if (found) {
      const { password: _, ...safe } = found;
      setUser(safe);
      sessionStorage.setItem('onerpos_user', JSON.stringify(safe));
      setLoading(false);
      return { success: true, user: safe };
    }
    setError('Invalid credentials. Try owner@onerpos.com / demo');
    setLoading(false);
    return { success: false };
  }, []);

  const register = useCallback(async ({ businessName, businessType, ownerName, email, password }) => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 900));

    // Check duplicate email
    const allEmails = [
      ...MOCK_USERS.map(u => u.email),
      ...registeredBusinesses.map(b => b.email),
    ];
    if (allEmails.includes(email)) {
      setError('An account with this email already exists.');
      setLoading(false);
      return { success: false };
    }

    const av = ownerName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const newUser = {
      id: Date.now(),
      name: ownerName,
      email,
      password,
      role: 'owner',
      avatar: av,
      business: businessName,
      businessType,
    };
    registeredBusinesses.push(newUser);

    setLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('onerpos_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

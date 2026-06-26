import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth();

  // Wait for session restore before making any redirect decision
  if (loading) return null; // or a spinner if you prefer

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    const redirects = { owner: '/owner', cashier: '/cashier', admin: '/admin' };
    return <Navigate to={redirects[profile?.role] ?? '/login'} replace />;
  }

  return children;
}
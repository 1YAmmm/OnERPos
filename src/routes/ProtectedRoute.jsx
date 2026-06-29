import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const effectiveRole =
    profile?.role === 'employee'
      ? profile?.position?.toLowerCase()
      : profile?.role;

  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    const redirects = {
      owner: '/owner',
      cashier: '/cashier',
      admin: '/admin',
      system_admin: '/admin',
    };
    return <Navigate to={redirects[effectiveRole] ?? '/login'} replace />;
  }

  return children;
}

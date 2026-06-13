import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirects = { owner: '/owner', cashier: '/cashier', admin: '/admin' };
    return <Navigate to={redirects[user.role] ?? '/login'} replace />;
  }
  return children;
}

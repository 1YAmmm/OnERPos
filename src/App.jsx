import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { DashboardLayout } from './components/layouts/DashboardLayout';

import { LandingPage }    from './pages/LandingPage';
import { LoginPage }      from './pages/LoginPage';
import { RegisterPage }   from './pages/RegisterPage';

import { OwnerDashboard }    from './features/owner/OwnerDashboard';
import { SalesPage }         from './features/owner/SalesPage';
import { InventoryPage }     from './features/owner/InventoryPage';
import { PurchasesPage }     from './features/owner/PurchasesPage';
import { AccountingPage }    from './features/owner/AccountingPage';
import { CustomersPage }     from './features/owner/CustomersPage';
import { EmployeesPage }     from './features/owner/EmployeesPage';
import { ReportsPage }       from './features/owner/ReportsPage';
import { NotificationsPage } from './features/owner/NotificationsPage';
import { SettingsPage }      from './features/owner/SettingsPage';

import { POSPage }                               from './features/cashier/POSPage';
import { CashierDashboard, CashierTransactions } from './features/cashier/CashierPages';

import {
  AdminDashboard, AdminBusinesses, AdminUsers,
  AdminSubscriptions, AdminMonitoring, AdminSettings
} from './features/admin/AdminPages';

function OwnerPortal() {
  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <DashboardLayout>
        <Routes>
          <Route index              element={<OwnerDashboard />} />
          <Route path="sales"       element={<SalesPage />} />
          <Route path="inventory"   element={<InventoryPage />} />
          <Route path="purchases"   element={<PurchasesPage />} />
          <Route path="accounting"  element={<AccountingPage />} />
          <Route path="customers"   element={<CustomersPage />} />
          <Route path="employees"   element={<EmployeesPage />} />
          <Route path="reports"     element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings"    element={<SettingsPage />} />
          <Route path="*"           element={<Navigate to="/owner" replace />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function CashierPortal() {
  return (
    <ProtectedRoute allowedRoles={['cashier']}>
      <DashboardLayout>
        <Routes>
          <Route index               element={<POSPage />} />
          <Route path="dashboard"    element={<CashierDashboard />} />
          <Route path="transactions" element={<CashierTransactions />} />
          <Route path="*"            element={<Navigate to="/cashier" replace />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function AdminPortal() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <Routes>
          <Route index                element={<AdminDashboard />} />
          <Route path="businesses"    element={<AdminBusinesses />} />
          <Route path="users"         element={<AdminUsers />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="monitoring"    element={<AdminMonitoring />} />
          <Route path="settings"      element={<AdminSettings />} />
          <Route path="*"             element={<Navigate to="/admin" replace />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"           element={<LandingPage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/register"   element={<RegisterPage />} />
          <Route path="/owner/*"   element={<OwnerPortal />} />
          <Route path="/cashier/*" element={<CashierPortal />} />
          <Route path="/admin/*"   element={<AdminPortal />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, Package, Truck, BookOpen,
  Users, UserCircle, BarChart3, Bell, Settings, LogOut,
  ChevronLeft, Menu, X, Zap, Building2, Activity, CreditCard,
  ShieldCheck, Store
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationPanel } from '../common/NotificationPanel';
import { cn } from '../../utils/cn';

const ownerNav = [
  { label: 'Overview',    icon: LayoutDashboard, to: '/owner' },
  { label: 'Sales',       icon: ShoppingCart,    to: '/owner/sales' },
  { label: 'Inventory',   icon: Package,         to: '/owner/inventory' },
  { label: 'Purchases',   icon: Truck,           to: '/owner/purchases' },
  { label: 'Accounting',  icon: BookOpen,        to: '/owner/accounting' },
  { label: 'Customers',   icon: Users,           to: '/owner/customers' },
  { label: 'Employees',   icon: UserCircle,      to: '/owner/employees' },
  { label: 'Reports',     icon: BarChart3,       to: '/owner/reports' },
  { label: 'Notifications',icon: Bell,           to: '/owner/notifications' },
  { label: 'Settings',    icon: Settings,        to: '/owner/settings' },
];

const cashierNav = [
  { label: 'POS',         icon: Store,           to: '/cashier' },
  { label: 'Dashboard',   icon: LayoutDashboard, to: '/cashier/dashboard' },
  { label: 'Transactions',icon: ShoppingCart,    to: '/cashier/transactions' },
];

const adminNav = [
  { label: 'Overview',    icon: LayoutDashboard, to: '/admin' },
  { label: 'Businesses',  icon: Building2,       to: '/admin/businesses' },
  { label: 'Users',       icon: Users,           to: '/admin/users' },
  { label: 'Subscriptions',icon: CreditCard,     to: '/admin/subscriptions' },
  { label: 'Monitoring',  icon: Activity,        to: '/admin/monitoring' },
  { label: 'Settings',    icon: ShieldCheck,     to: '/admin/settings' },
];

function getNav(role) {
  if (role === 'owner')   return ownerNav;
  if (role === 'cashier') return cashierNav;
  if (role === 'admin')   return adminNav;
  return [];
}

function getPortalLabel(role) {
  if (role === 'owner')   return 'Business Portal';
  if (role === 'cashier') return 'Cashier Portal';
  if (role === 'admin')   return 'Admin Console';
  return 'Portal';
}

export function DashboardLayout({ children }) {
const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = getNav(profile?.role);

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = ({ onNavClick }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-white/8', collapsed && 'justify-center px-3')}>
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
            <p className="text-sm font-semibold text-white/90 truncate">OnERPos</p>
         <p className="text-[10px] text-white/30 capitalize truncate">{profile?.role}</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length <= 2}
            onClick={onNavClick}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group',
              collapsed && 'justify-center px-2.5',
              isActive
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                : 'text-white/45 hover:text-white/75 hover:bg-white/5'
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className={cn('border-t border-white/8 p-3', collapsed ? 'flex flex-col items-center gap-2' : 'space-y-1')}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center text-xs font-semibold text-indigo-300 border border-indigo-500/20 shrink-0">
              {user?.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/75 truncate">{user?.name}</p>
              <p className="text-[10px] text-white/30 capitalize truncate">{user?.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-2 text-xs text-white/35 hover:text-rose-400 transition-colors rounded-lg px-2 py-1.5 w-full hover:bg-rose-500/8',
            collapsed && 'justify-center w-auto px-2'
          )}
        >
          <LogOut className="w-3.5 h-3.5" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#080c14] overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 60 : 220 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="hidden lg:flex flex-col shrink-0 border-r border-white/8 bg-[#0a0f1a] relative z-20 overflow-hidden"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute top-5 -right-3 w-6 h-6 glass rounded-full flex items-center justify-center text-white/40 hover:text-white/70 transition-colors z-30"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </motion.div>
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#0a0f1a] border-r border-white/8 z-50 lg:hidden"
            >
              <SidebarContent onNavClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-3.5 border-b border-white/6 bg-[#080c14]/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 glass rounded-lg text-white/50 hover:text-white/80 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs text-white/25">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationPanel />
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                {user?.avatar}
              </div>
              <span className="text-xs text-white/60 hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 lg:p-6 min-h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

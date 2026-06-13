// ─── Auth ───────────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 1, name: 'Alex Rivera', email: 'owner@onerpos.com', password: 'demo', role: 'owner', avatar: 'AR', business: 'Rivera Enterprises' },
  { id: 2, name: 'Casey Lin',   email: 'cashier@onerpos.com', password: 'demo', role: 'cashier', avatar: 'CL', business: 'Rivera Enterprises' },
  { id: 3, name: 'Morgan Hayes', email: 'admin@onerpos.com', password: 'demo', role: 'admin', avatar: 'MH', business: 'OnERPos Platform' },
];

// ─── Products ────────────────────────────────────────────────────────────────
export const PRODUCTS = [
  { id: 1, name: 'Premium Coffee Blend', sku: 'BEV-001', category: 'Beverages', price: 12.99, cost: 4.50, stock: 148, reorderPoint: 20, unit: 'bag', status: 'active', image: '☕' },
  { id: 2, name: 'Ergonomic Office Chair', sku: 'FRN-002', category: 'Furniture',  price: 349.00, cost: 180.00, stock: 7, reorderPoint: 5, unit: 'unit', status: 'active', image: '🪑' },
  { id: 3, name: 'Wireless Keyboard Pro', sku: 'ELC-003', category: 'Electronics', price: 89.99, cost: 38.00, stock: 3, reorderPoint: 10, unit: 'unit', status: 'low_stock', image: '⌨️' },
];

// ─── Customers ───────────────────────────────────────────────────────────────
export const CUSTOMERS = [
  { id: 1, name: 'Customer Alpha', email: 'alpha@email.com', phone: '+1 555-0101', totalSpent: 1240.50, orders: 8, joined: '2024-01-15', status: 'active' },
  { id: 2, name: 'Customer Beta',  email: 'beta@email.com',  phone: '+1 555-0102', totalSpent: 874.20,  orders: 5, joined: '2024-03-22', status: 'active' },
  { id: 3, name: 'Customer Gamma', email: 'gamma@email.com', phone: '+1 555-0103', totalSpent: 320.00,  orders: 2, joined: '2024-06-01', status: 'inactive' },
];

// ─── Employees ───────────────────────────────────────────────────────────────
export const EMPLOYEES = [
  { id: 1, name: 'Employee Alpha', role: 'Store Manager',   email: 'emp.a@biz.com', phone: '+1 555-0201', salary: 4800, status: 'active',   joined: '2023-06-10', avatar: 'EA' },
  { id: 2, name: 'Employee Beta',  role: 'Sales Associate', email: 'emp.b@biz.com', phone: '+1 555-0202', salary: 2800, status: 'active',   joined: '2023-11-01', avatar: 'EB' },
  { id: 3, name: 'Employee Gamma', role: 'Inventory Clerk', email: 'emp.c@biz.com', phone: '+1 555-0203', salary: 2600, status: 'on_leave', joined: '2024-01-20', avatar: 'EG' },
];

// ─── Sales Transactions ───────────────────────────────────────────────────────
export const TRANSACTIONS = [
  { id: 'TXN-0001', customer: 'Customer Alpha', items: 3, total: 412.97, payment: 'Card',  status: 'completed', date: '2025-06-11T10:23:00', cashier: 'Employee Alpha' },
  { id: 'TXN-0002', customer: 'Walk-in',        items: 1, total: 12.99,  payment: 'Cash',  status: 'completed', date: '2025-06-11T11:05:00', cashier: 'Employee Beta'  },
  { id: 'TXN-0003', customer: 'Customer Beta',  items: 2, total: 178.98, payment: 'Card',  status: 'refunded',  date: '2025-06-11T14:40:00', cashier: 'Employee Alpha' },
];

// ─── Purchase Orders ──────────────────────────────────────────────────────────
export const PURCHASE_ORDERS = [
  { id: 'PO-0001', supplier: 'Bean Source Co.',   items: 2, total: 540.00, status: 'received', date: '2025-06-08', expectedDate: '2025-06-12' },
  { id: 'PO-0002', supplier: 'OfficeSupply Corp.',items: 1, total: 1800.00,status: 'pending',  date: '2025-06-10', expectedDate: '2025-06-17' },
  { id: 'PO-0003', supplier: 'TechDistrib Ltd.',  items: 1, total: 380.00, status: 'in_transit',date: '2025-06-09', expectedDate: '2025-06-14' },
];

// ─── Revenue Chart Data ───────────────────────────────────────────────────────
export const REVENUE_DATA = [
  { month: 'Jan', revenue: 18400, expenses: 9200, profit: 9200 },
  { month: 'Feb', revenue: 22100, expenses: 10800, profit: 11300 },
  { month: 'Mar', revenue: 19800, expenses: 9900, profit: 9900 },
  { month: 'Apr', revenue: 25600, expenses: 11200, profit: 14400 },
  { month: 'May', revenue: 28900, expenses: 12400, profit: 16500 },
  { month: 'Jun', revenue: 31200, expenses: 13100, profit: 18100 },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: 1, type: 'warning', title: 'Low Stock Alert',    message: 'Wireless Keyboard Pro has only 3 units remaining.', time: '5 min ago', read: false },
  { id: 2, type: 'success', title: 'Sale Completed',     message: 'Transaction TXN-0001 for $412.97 processed successfully.', time: '32 min ago', read: false },
  { id: 3, type: 'info',    title: 'Purchase Order',     message: 'PO-0002 from OfficeSupply Corp. is awaiting approval.', time: '2 hrs ago', read: true },
];

// ─── Accounting ───────────────────────────────────────────────────────────────
export const INCOME_ENTRIES = [
  { id: 1, description: 'Product Sales — June W1', amount: 8420.00, category: 'Sales Revenue',  date: '2025-06-07', status: 'posted' },
  { id: 2, description: 'Product Sales — June W2', amount: 11340.00, category: 'Sales Revenue', date: '2025-06-14', status: 'posted' },
  { id: 3, description: 'Consulting Service Fee',  amount: 1500.00, category: 'Service Income',  date: '2025-06-10', status: 'pending' },
];

export const EXPENSE_ENTRIES = [
  { id: 1, description: 'Inventory Restock — Bean Source', amount: 540.00, category: 'Cost of Goods', date: '2025-06-08', status: 'posted' },
  { id: 2, description: 'Utilities — June',                amount: 320.00, category: 'Utilities',     date: '2025-06-01', status: 'posted' },
  { id: 3, description: 'Staff Payroll — Partial',         amount: 5200.00, category: 'Payroll',      date: '2025-06-15', status: 'pending' },
];

// ─── Admin: Businesses ────────────────────────────────────────────────────────
export const BUSINESSES = [
  { id: 1, name: 'Rivera Enterprises',  plan: 'Professional', users: 4, status: 'active',    mrr: 149, joined: '2024-02-15' },
  { id: 2, name: 'Summit Retail Group', plan: 'Starter',      users: 2, status: 'active',    mrr: 49,  joined: '2024-05-20' },
  { id: 3, name: 'Horizon Cafe Chain',  plan: 'Enterprise',   users: 12, status: 'suspended', mrr: 399, joined: '2023-11-01' },
];

// ─── Admin: System Metrics ────────────────────────────────────────────────────
export const SYSTEM_METRICS = [
  { time: '00:00', cpu: 22, memory: 44, requests: 120 },
  { time: '04:00', cpu: 18, memory: 41, requests: 80  },
  { time: '08:00', cpu: 45, memory: 58, requests: 340 },
  { time: '12:00', cpu: 72, memory: 67, requests: 620 },
  { time: '16:00', cpu: 68, memory: 63, requests: 580 },
  { time: '20:00', cpu: 40, memory: 52, requests: 290 },
];

export const ACTIVITY_LOGS = [
  { id: 1, user: 'Alex Rivera',   action: 'Logged in',                  ip: '192.168.1.10', time: '2025-06-11 10:21:05', level: 'info' },
  { id: 2, user: 'Casey Lin',     action: 'Processed transaction TXN-0001', ip: '192.168.1.11', time: '2025-06-11 10:23:18', level: 'info' },
  { id: 3, user: 'System',        action: 'Low stock alert triggered for Wireless Keyboard', ip: 'system', time: '2025-06-11 10:30:00', level: 'warning' },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  { id: 1, name: 'James Okafor',  role: 'Owner, Okafor Retail', avatar: 'JO', rating: 5, text: 'OnERPos transformed how we run our three stores. The real-time inventory sync alone saved us from countless stockouts. It genuinely feels like enterprise software built for humans.' },
  { id: 2, name: 'Priya Menon',   role: 'Director, Menon Hospitality', avatar: 'PM', rating: 5, text: 'The POS interface is so intuitive our staff needed less than an hour of training. Revenue reporting is now something I actually look forward to reviewing each morning.' },
  { id: 3, name: 'Carlos Ferreira', role: 'CFO, Ferreira Distribution', avatar: 'CF', rating: 5, text: 'We evaluated six platforms before choosing OnERPos. The accounting module and purchase-order workflow are exactly what a mid-size distribution business needs.' },
];

// ─── Plans ────────────────────────────────────────────────────────────────────
export const PLANS = [
  {
    id: 'starter', name: 'Starter', price: 49, period: 'month',
    description: 'Everything you need to launch and grow.',
    features: ['1 branch', 'Up to 3 users', 'POS & inventory', 'Basic reporting', 'Email support'],
    highlighted: false,
  },
  {
    id: 'professional', name: 'Professional', price: 149, period: 'month',
    description: 'Full ERP power for scaling businesses.',
    features: ['Up to 5 branches', 'Up to 15 users', 'Full ERP suite', 'Advanced analytics', 'Purchase management', 'Priority support'],
    highlighted: true,
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 399, period: 'month',
    description: 'Unlimited scale with white-glove service.',
    features: ['Unlimited branches', 'Unlimited users', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee', 'Custom training'],
    highlighted: false,
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const FAQS = [
  { q: 'Can I switch plans at any time?', a: 'Yes. Plan upgrades take effect immediately; downgrades apply at the next billing cycle. No penalties or lock-in.' },
  { q: 'Is my data safe and backed up?', a: 'All data is encrypted at rest and in transit. We run automated backups every 6 hours with 30-day retention across geo-redundant storage.' },
  { q: 'Do you support multiple currencies?', a: 'Yes. Professional and Enterprise plans support multi-currency transactions with live exchange rates.' },
  { q: 'How long does onboarding take?', a: 'Most businesses are live within one business day. Our guided setup wizard walks you through product catalog, employee roles, and your first transaction.' },
  { q: 'Can cashiers work offline?', a: 'The POS module supports offline mode with automatic sync once connectivity is restored. Transactions are never lost.' },
];

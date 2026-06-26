import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { MetricCard } from '../../components/common/MetricCard';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal, DeleteModal, Field, Input, FormActions } from '../../components/common/Modal';
import { useCrud } from '../../hooks/useCrud';
import { BUSINESSES, MOCK_USERS, ACTIVITY_LOGS, SYSTEM_METRICS } from '../../data/mockData';
import { Building2, Users, CreditCard, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnimatePresence, motion } from 'framer-motion';

// ─── Shared Custom Select ─────────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => (typeof o === 'string' ? o : o.value) === value);
  const label = current ? (typeof current === 'string' ? current : current.label) : null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full rounded-xl px-3 py-2 text-sm text-left flex items-center justify-between border border-white/8 outline-none focus:border-indigo-500/60 transition-colors"
        style={{ background: 'rgba(15,20,40,0.95)' }}
      >
        <span className={label ? 'text-white/80' : 'text-white/25'}>{label || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ background: '#0f1629' }}
          >
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map(opt => {
                const v = typeof opt === 'string' ? opt : opt.value;
                const l = typeof opt === 'string' ? opt : opt.label;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { onChange(v); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      value === v
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'text-white/65 hover:bg-white/5 hover:text-white/85'
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Admin Overview ──────────────────────────────────────────────────────────
export function AdminDashboard() {
  const metrics = [
    { title: 'Total Businesses',    value: BUSINESSES.length,                                      change: 12, icon: Building2, color: 'indigo'  },
    { title: 'Total Users',          value: MOCK_USERS.length,                                      change: 5,  icon: Users,     color: 'violet'  },
    { title: 'Active Subscriptions', value: BUSINESSES.filter(b => b.status === 'active').length,   change: 8,  icon: CreditCard,color: 'cyan'    },
    { title: 'System Uptime',        value: '99.9%',                                                change: 0,  icon: Activity,  color: 'emerald' },
  ];

  const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs border border-white/10">
        <p className="text-white/40 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}{p.name === 'requests' ? '' : '%'}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Overview" subtitle="System health and business metrics" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => <MetricCard key={m.title} {...m} delay={i * 0.08} />)}
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total MRR', value: `$${BUSINESSES.reduce((s, b) => s + b.mrr, 0)}`, sub: 'monthly recurring', color: 'text-emerald-400' },
          { label: 'Suspended', value: BUSINESSES.filter(b => b.status === 'suspended').length, sub: 'businesses', color: 'text-amber-400' },
          { label: 'Req / hr', value: '~340', sub: 'avg requests', color: 'text-cyan-300' },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.08} className="p-4">
            <p className="text-xs text-white/35 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard delay={0.3} className="p-5">
        <h3 className="text-sm font-semibold text-white/80 mb-4">System Performance (Today)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={SYSTEM_METRICS} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Line type="monotone" dataKey="cpu"    stroke="#6366f1" strokeWidth={2} dot={false} name="CPU %" />
            <Line type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Memory %" />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Recent business registrations */}
      <GlassCard delay={0.35} className="p-5">
        <h3 className="text-sm font-semibold text-white/80 mb-4">Recently Registered Businesses</h3>
        <div className="space-y-2">
          {BUSINESSES.slice(0, 3).map(b => (
            <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">{b.name}</p>
                  <p className="text-xs text-white/35">{b.joined}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-indigo-300 font-medium">{b.plan}</span>
                <Badge status={b.status} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Business Management ─────────────────────────────────────────────────────
const PLANS = ['Starter', 'Professional', 'Enterprise'];
const BUSINESS_TYPES = [
  'Retail Store', 'Restaurant / Food Service', 'Cafe / Coffee Shop',
  'Grocery / Supermarket', 'Pharmacy', 'Electronics', 'Clothing & Apparel',
  'Hardware / Home Improvement', 'Beauty & Personal Care', 'Service Business',
  'Wholesale / Distribution', 'Other',
];
const emptyBiz = {
  name: '', businessType: '', ownerName: '', plan: 'Starter',
  users: '', status: 'active', mrr: '', joined: new Date().toISOString().slice(0, 10),
};

function BizForm({ initial = emptyBiz, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));
  const mrrMap = { Starter: 49, Professional: 149, Enterprise: 399 };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, users: parseInt(form.users, 10) || 1, mrr: mrrMap[form.plan] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Business Name">
        <Input required value={form.name} onChange={e => set('name')(e.target.value)} placeholder="Acme Corp." />
      </Field>
      <Field label="Type of Business">
        <CustomSelect
          value={form.businessType}
          onChange={set('businessType')}
          options={BUSINESS_TYPES}
          placeholder="Select business type"
        />
      </Field>
      <Field label="Owner's Name">
        <Input value={form.ownerName} onChange={e => set('ownerName')(e.target.value)} placeholder="Full name" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Plan">
          <CustomSelect
            value={form.plan}
            onChange={set('plan')}
            options={PLANS.map(p => ({ value: p, label: `${p} — $${mrrMap[p]}/mo` }))}
          />
        </Field>
        <Field label="Status">
          <CustomSelect
            value={form.status}
            onChange={set('status')}
            options={[{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]}
          />
        </Field>
      </div>
      <Field label="Number of Users">
        <Input required type="number" min="1" value={form.users} onChange={e => set('users')(e.target.value)} placeholder="1" />
      </Field>
      <FormActions onCancel={onCancel} submitLabel={initial.name ? 'Update Business' : 'Add Business'} />
    </form>
  );
}

export function AdminBusinesses() {
  const { items, editTarget, deleteTarget, isNew, openCreate, openEdit, closeEdit, openDelete, closeDelete, create, update, remove } = useCrud(BUSINESSES);

  const bizCols = [
    { key: 'name', label: 'Business', render: (v, row) => (
      <div>
        <p className="text-sm text-white/80 font-medium">{v}</p>
        {row.businessType && <p className="text-xs text-white/35 mt-0.5">{row.businessType}</p>}
      </div>
    )},
    { key: 'ownerName', label: 'Owner', render: v => v ? <span className="text-xs text-white/55">{v}</span> : <span className="text-xs text-white/20">—</span> },
    { key: 'plan', label: 'Plan', render: v => <span className="text-indigo-300 text-xs font-medium">{v}</span> },
    { key: 'users', label: 'Users' },
    { key: 'mrr', label: 'MRR', render: v => <span className="font-semibold">${v}/mo</span> },
    { key: 'joined', label: 'Joined', render: v => <span className="text-white/40 text-xs">{v}</span> },
    { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex gap-1.5 justify-end">
        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-white/40 hover:text-indigo-300 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => openDelete(row)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Business Management" subtitle="All registered businesses on the platform" />
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: items.length, sub: 'businesses' },
          { label: 'Active', value: items.filter(b => b.status === 'active').length, sub: 'subscribed' },
          { label: 'MRR', value: `$${items.reduce((s, b) => s + b.mrr, 0)}`, sub: 'monthly recurring' },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.08} className="p-4">
            <p className="text-xs text-white/35 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-white/85">{s.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.sub}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard delay={0.2} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80">All Businesses</h3>
          <Button size="sm" onClick={openCreate}><Plus className="w-3.5 h-3.5" />Add Business</Button>
        </div>
        <DataTable columns={bizCols} data={items} />
      </GlassCard>

      <Modal open={!!editTarget} onClose={closeEdit} title={isNew ? 'Add Business' : 'Edit Business'}>
        <BizForm initial={isNew ? emptyBiz : editTarget} onSubmit={isNew ? create : (f) => update(editTarget.id, f)} onCancel={closeEdit} />
      </Modal>
      <DeleteModal open={!!deleteTarget} onClose={closeDelete} onConfirm={() => remove(deleteTarget.id)} itemName={deleteTarget?.name} />
    </div>
  );
}

// ─── User Management ──────────────────────────────────────────────────────────
const emptyUser = { name: '', email: '', role: 'cashier', business: '', avatar: '' };
const USER_ROLES = ['owner', 'cashier', 'admin'];

function UserForm({ initial = emptyUser, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const av = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    onSubmit({ ...form, avatar: av });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Full Name">
        <Input required value={form.name} onChange={e => set('name')(e.target.value)} placeholder="Jane Smith" />
      </Field>
      <Field label="Email">
        <Input required type="email" value={form.email} onChange={e => set('email')(e.target.value)} placeholder="jane@business.com" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Role">
          <CustomSelect
            value={form.role}
            onChange={set('role')}
            options={USER_ROLES.map(r => ({ value: r, label: r.charAt(0).toUpperCase() + r.slice(1) }))}
          />
        </Field>
        <Field label="Business">
          <Input value={form.business} onChange={e => set('business')(e.target.value)} placeholder="Business name" />
        </Field>
      </div>
      <FormActions onCancel={onCancel} submitLabel={initial.name ? 'Update User' : 'Add User'} />
    </form>
  );
}

export function AdminUsers() {
  const { items, editTarget, deleteTarget, isNew, openCreate, openEdit, closeEdit, openDelete, closeDelete, create, update, remove } = useCrud(MOCK_USERS);

  const userCols = [
    { key: 'avatar', label: '', width: 44, render: v => (
      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500/25 to-violet-500/25 flex items-center justify-center text-xs font-semibold text-indigo-300 border border-indigo-500/20">
        {v}
      </div>
    )},
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', render: v => <span className="text-xs text-white/45">{v}</span> },
    { key: 'role', label: 'Role', render: v => <Badge status="active" label={v} /> },
    { key: 'business', label: 'Business', render: v => <span className="text-xs text-white/50">{v}</span> },
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex gap-1.5 justify-end">
        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-white/40 hover:text-indigo-300 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => openDelete(row)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" subtitle="All users across the platform" />
      <GlassCard delay={0.1} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80">Platform Users</h3>
          <Button size="sm" onClick={openCreate}><Plus className="w-3.5 h-3.5" />Add User</Button>
        </div>
        <DataTable columns={userCols} data={items} />
      </GlassCard>

      <Modal open={!!editTarget} onClose={closeEdit} title={isNew ? 'Add User' : 'Edit User'}>
        <UserForm initial={isNew ? emptyUser : editTarget} onSubmit={isNew ? create : (f) => update(editTarget.id, f)} onCancel={closeEdit} />
      </Modal>
      <DeleteModal open={!!deleteTarget} onClose={closeDelete} onConfirm={() => remove(deleteTarget.id)} itemName={deleteTarget?.name} />
    </div>
  );
}

// ─── Subscriptions ────────────────────────────────────────────────────────────
export function AdminSubscriptions() {
  const { items, update } = useCrud(BUSINESSES);
  const [editPlan, setEditPlan] = useState(null);
  const mrrMap = { Starter: 49, Professional: 149, Enterprise: 399 };

  return (
    <div className="space-y-6">
      <PageHeader title="Subscription Management" subtitle="Active plans and billing overview" />
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total MRR', value: `$${items.reduce((s, b) => s + b.mrr, 0)}`, sub: 'monthly recurring revenue', color: 'text-emerald-400' },
          { label: 'Active Plans', value: items.filter(b => b.status === 'active').length, sub: 'subscriptions', color: 'text-white/85' },
          { label: 'Suspended', value: items.filter(b => b.status === 'suspended').length, sub: 'require attention', color: 'text-amber-400' },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.08} className="p-4">
            <p className="text-xs text-white/35 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.sub}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard delay={0.2} className="p-5">
        <h3 className="text-sm font-semibold text-white/80 mb-4">Subscription Details</h3>
        <DataTable
          columns={[
            { key: 'name', label: 'Business' },
            { key: 'plan', label: 'Plan', render: v => <span className="text-indigo-300 font-medium text-xs">{v}</span> },
            { key: 'mrr', label: 'Monthly', render: v => <span className="font-semibold">${v}/mo</span> },
            { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
            { key: 'id', label: '', render: (_, row) => (
              <button onClick={() => setEditPlan({ ...row })} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-1 glass rounded-lg">
                Change Plan
              </button>
            )},
          ]}
          data={items}
        />
      </GlassCard>

      <Modal open={!!editPlan} onClose={() => setEditPlan(null)} title="Change Subscription Plan" size="sm">
        {editPlan && (
          <form onSubmit={(e) => {
            e.preventDefault();
            update(editPlan.id, { plan: editPlan.plan, mrr: mrrMap[editPlan.plan] });
            setEditPlan(null);
          }} className="space-y-4">
            <Field label="Business">
              <p className="text-sm text-white/70 py-2">{editPlan.name}</p>
            </Field>
            <Field label="Plan">
              <CustomSelect
                value={editPlan.plan}
                onChange={(v) => setEditPlan(p => ({ ...p, plan: v }))}
                options={PLANS.map(p => ({ value: p, label: `${p} — $${mrrMap[p]}/mo` }))}
              />
            </Field>
            <Field label="Status">
              <CustomSelect
                value={editPlan.status}
                onChange={(v) => setEditPlan(p => ({ ...p, status: v }))}
                options={[{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]}
              />
            </Field>
            <FormActions onCancel={() => setEditPlan(null)} submitLabel="Apply Changes" />
          </form>
        )}
      </Modal>
    </div>
  );
}

// ─── Monitoring ───────────────────────────────────────────────────────────────
const logCols = [
  { key: 'user', label: 'User' },
  { key: 'action', label: 'Action' },
  { key: 'ip', label: 'IP', render: v => <span className="font-mono text-xs text-white/40">{v}</span> },
  { key: 'time', label: 'Time', render: v => <span className="text-xs text-white/40">{v}</span> },
  { key: 'level', label: 'Level', render: v => <Badge status={v} label={v} /> },
];

export function AdminMonitoring() {
  const { items, deleteTarget, openDelete, closeDelete, remove } = useCrud(ACTIVITY_LOGS);

  const colsWithDel = [
    ...logCols,
    { key: 'id', label: '', render: (_, row) => (
      <button onClick={() => openDelete(row)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/30 hover:text-rose-400 transition-colors">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="System Monitoring" subtitle="Activity logs and performance metrics" />
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'CPU Avg', value: '44%', color: 'text-indigo-300' },
          { label: 'Memory Avg', value: '55%', color: 'text-violet-300' },
          { label: 'Uptime', value: '99.9%', color: 'text-emerald-400' },
          { label: 'Req / hr', value: '~340', color: 'text-cyan-300' },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.07} className="p-4">
            <p className="text-xs text-white/35 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard delay={0.25} className="p-5">
        <h3 className="text-sm font-semibold text-white/80 mb-4">Activity Log</h3>
        <DataTable columns={colsWithDel} data={items} />
      </GlassCard>

      <DeleteModal open={!!deleteTarget} onClose={closeDelete} onConfirm={() => remove(deleteTarget.id)} itemName={`log entry by ${deleteTarget?.user}`} />
    </div>
  );
}

// ─── Platform Settings ────────────────────────────────────────────────────────
export function AdminSettings() {
  const [toggles, setToggles] = useState({ twoFactor: true, rateLimiting: true, maintenanceMode: false, auditLogging: true });
  const [backupFreq, setBackupFreq] = useState('Every 6 hours');
  const [retention, setRetention] = useState('30 days');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Settings" subtitle="System configuration and security" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassCard delay={0.1} className="p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-4">System Configuration</h3>
          <form onSubmit={handleSave} className="space-y-4">
            {[
              { label: 'Platform Version', value: 'v3.0.1' },
              { label: 'Database', value: 'PostgreSQL 16' },
              { label: 'Cache', value: 'Redis 7' },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-xs text-white/40">{f.label}</span>
                <span className="text-sm text-white/70 font-medium">{f.value}</span>
              </div>
            ))}
            <Field label="Backup Frequency">
              <CustomSelect
                value={backupFreq}
                onChange={setBackupFreq}
                options={['Every 1 hour', 'Every 6 hours', 'Every 12 hours', 'Daily']}
              />
            </Field>
            <Field label="Retention Period">
              <CustomSelect
                value={retention}
                onChange={setRetention}
                options={['7 days', '14 days', '30 days', '90 days']}
              />
            </Field>
            <Button type="submit" size="sm">{saved ? 'Saved!' : 'Save Configuration'}</Button>
          </form>
        </GlassCard>

        <GlassCard delay={0.15} className="p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-4">Security</h3>
          <div className="space-y-4">
            {Object.entries({
              twoFactor: 'Two-factor auth (admin)',
              rateLimiting: 'Rate limiting',
              maintenanceMode: 'Maintenance mode',
              auditLogging: 'Audit logging',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-white/65">{label}</span>
                <button
                  onClick={() => setToggles(t => ({ ...t, [key]: !t[key] }))}
                  className={`w-9 h-5 rounded-full relative transition-colors ${toggles[key] ? 'bg-indigo-600' : 'bg-white/15'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${toggles[key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

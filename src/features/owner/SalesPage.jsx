import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal, DeleteModal, Field, Input, Select, FormActions } from '../../components/common/Modal';
import { useCrud } from '../../hooks/useCrud';
import { TRANSACTIONS, REVENUE_DATA } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs border border-white/10">
      <p className="text-white/50 mb-1">{label}</p>
      <p className="text-indigo-400 font-medium">${payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
};

const STATUSES = ['completed', 'pending', 'refunded'];
const PAYMENTS = ['Cash', 'Card', 'Online', 'GCash'];

function TxnForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, total: parseFloat(form.total), items: parseInt(form.items, 10) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Customer">
        <Input required value={form.customer} onChange={set('customer')} placeholder="Customer name or 'Walk-in'" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Items">
          <Input required type="number" min="1" value={form.items} onChange={set('items')} placeholder="1" />
        </Field>
        <Field label="Total ($)">
          <Input required type="number" step="0.01" min="0" value={form.total} onChange={set('total')} placeholder="0.00" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Payment Method">
          <Select value={form.payment} onChange={set('payment')}>
            {PAYMENTS.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Cashier">
        <Input value={form.cashier} onChange={set('cashier')} placeholder="Cashier name" />
      </Field>
      <FormActions onCancel={onCancel} submitLabel="Update Transaction" />
    </form>
  );
}

export function SalesPage() {
  const [search, setSearch] = useState('');
  const { items, editTarget, deleteTarget, isNew, openEdit, closeEdit, openDelete, closeDelete, update, remove } = useCrud(TRANSACTIONS);

  const filtered = items.filter(t =>
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.customer.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = items.filter(t => t.status === 'completed').reduce((s, t) => s + t.total, 0);
  const refunded     = items.filter(t => t.status === 'refunded').reduce((s, t) => s + t.total, 0);

  const cols = [
    { key: 'id', label: 'Transaction', render: v => <span className="font-mono text-xs text-indigo-300">{v}</span> },
    { key: 'customer', label: 'Customer' },
    { key: 'items', label: 'Items', render: v => <span>{v} items</span> },
    { key: 'payment', label: 'Payment' },
    { key: 'cashier', label: 'Cashier', render: v => <span className="text-white/50 text-xs">{v}</span> },
    { key: 'total', label: 'Total', render: v => <span className="font-semibold">${v.toFixed(2)}</span> },
    { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex gap-1.5 justify-end">
        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-white/40 hover:text-indigo-300 transition-colors" title="Edit">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => openDelete(row)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors" title="Delete">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Sales" subtitle="Transaction history and revenue overview" />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, sub: 'completed sales' },
          { label: 'Transactions', value: items.length, sub: 'all statuses' },
          { label: 'Refunded', value: `$${refunded.toFixed(2)}`, sub: 'total refunds', warn: refunded > 0 },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.08} className="p-4">
            <p className="text-xs text-white/35 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.warn ? 'text-rose-400' : 'text-white/85'}`}>{s.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard delay={0.2} className="p-5">
        <h3 className="text-sm font-semibold text-white/80 mb-4">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={REVENUE_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      <GlassCard delay={0.25} className="p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-white/80">Transactions</h3>
          <SearchBar value={search} onChange={setSearch} placeholder="Search transactions…" className="w-56" />
        </div>
        <DataTable columns={cols} data={filtered} />
      </GlassCard>

      <Modal open={!!editTarget} onClose={closeEdit} title="Edit Transaction">
        {editTarget && (
          <TxnForm
            initial={editTarget}
            onSubmit={(fields) => update(editTarget.id, fields)}
            onCancel={closeEdit}
          />
        )}
      </Modal>

      <DeleteModal
        open={!!deleteTarget}
        onClose={closeDelete}
        onConfirm={() => remove(deleteTarget.id)}
        itemName={deleteTarget?.id}
      />
    </div>
  );
}

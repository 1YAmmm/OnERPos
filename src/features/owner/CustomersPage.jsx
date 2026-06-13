import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Modal, DeleteModal, Field, Input, Select, FormActions } from '../../components/common/Modal';
import { useCrud } from '../../hooks/useCrud';
import { CUSTOMERS } from '../../data/mockData';

const emptyForm = { name: '', email: '', phone: '', status: 'active' };

function CustomerForm({ initial = emptyForm, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      joined: form.joined ?? new Date().toISOString().slice(0, 10),
      totalSpent: form.totalSpent ?? 0,
      orders: form.orders ?? 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Full Name">
        <Input required value={form.name} onChange={set('name')} placeholder="John Smith" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email">
          <Input required type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={set('phone')} placeholder="+1 555-0100" />
        </Field>
      </div>
      <Field label="Status">
        <Select value={form.status} onChange={set('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </Field>
      <FormActions onCancel={onCancel} submitLabel={initial.name ? 'Update Customer' : 'Add Customer'} />
    </form>
  );
}

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const { items, editTarget, deleteTarget, isNew, openCreate, openEdit, closeEdit, openDelete, closeDelete, create, update, remove } = useCrud(CUSTOMERS);

  const filtered = items.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const cols = [
    { key: 'name', label: 'Customer' },
    { key: 'email', label: 'Email', render: v => <span className="text-white/50 text-xs">{v}</span> },
    { key: 'phone', label: 'Phone', render: v => <span className="text-white/50 text-xs">{v}</span> },
    { key: 'orders', label: 'Orders', render: v => <span className="font-medium">{v}</span> },
    { key: 'totalSpent', label: 'Lifetime Value', render: v => <span className="font-semibold text-indigo-300">${v.toFixed(2)}</span> },
    { key: 'joined', label: 'Member Since', render: v => <span className="text-white/40 text-xs">{v}</span> },
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
      <PageHeader title="Customer Management" subtitle="Customer records and purchase history" />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: items.length, sub: 'registered' },
          { label: 'Active', value: items.filter(c => c.status === 'active').length, sub: 'customers' },
          { label: 'Total Revenue', value: `$${items.reduce((s, c) => s + c.totalSpent, 0).toFixed(2)}`, sub: 'from customers' },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.08} className="p-4">
            <p className="text-xs text-white/35 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-white/85">{s.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard delay={0.2} className="p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-white/80">Customer List</h3>
          <div className="flex gap-3 items-center">
            <SearchBar value={search} onChange={setSearch} placeholder="Search customers…" className="w-56" />
            <Button size="sm" onClick={openCreate}><Plus className="w-3.5 h-3.5" />Add Customer</Button>
          </div>
        </div>
        <DataTable columns={cols} data={filtered} />
      </GlassCard>

      <Modal open={!!editTarget} onClose={closeEdit} title={isNew ? 'Add Customer' : 'Edit Customer'}>
        <CustomerForm
          initial={isNew ? emptyForm : editTarget}
          onSubmit={isNew ? create : (fields) => update(editTarget.id, fields)}
          onCancel={closeEdit}
        />
      </Modal>

      <DeleteModal
        open={!!deleteTarget}
        onClose={closeDelete}
        onConfirm={() => remove(deleteTarget.id)}
        itemName={deleteTarget?.name}
      />
    </div>
  );
}

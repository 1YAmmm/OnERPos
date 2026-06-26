import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Modal,
  DeleteModal,
  Field,
  Input,
  Select,
  FormActions,
} from '../../components/common/Modal';
import { useCrud } from '../../hooks/useCrud';
import { PURCHASE_ORDERS } from '../../data/mockData';
import { PurchasesSkeleton } from '../../components/common/Skeleton';
const makePoId = (items) => {
  const num = items.length + 1;
  return `PO-${String(num).padStart(4, '0')}`;
};

const emptyForm = {
  supplier: '',
  items: '',
  total: '',
  status: 'pending',
  date: new Date().toISOString().slice(0, 10),
  expectedDate: '',
};

function POForm({ initial = emptyForm, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      items: parseInt(form.items, 10),
      total: parseFloat(form.total),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Supplier Name">
        <Input
          required
          value={form.supplier}
          onChange={set('supplier')}
          placeholder="Bean Source Co."
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Number of Items">
          <Input
            required
            type="number"
            min="1"
            value={form.items}
            onChange={set('items')}
            placeholder="1"
          />
        </Field>
        <Field label="Total Amount ($)">
          <Input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.total}
            onChange={set('total')}
            placeholder="0.00"
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Order Date">
          <Input
            required
            type="date"
            value={form.date}
            onChange={set('date')}
          />
        </Field>
        <Field label="Expected Date">
          <Input
            required
            type="date"
            value={form.expectedDate}
            onChange={set('expectedDate')}
          />
        </Field>
      </div>
      <Field label="Status">
        <Select value={form.status} onChange={set('status')}>
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="received">Received</option>
        </Select>
      </Field>
      <FormActions
        onCancel={onCancel}
        submitLabel={initial.supplier ? 'Update Order' : 'Create Order'}
      />
    </form>
  );
}

export function PurchasesPage() {
  const [loading, setLoading] = useState(true);
  const {
    items,
    editTarget,
    deleteTarget,
    isNew,
    openCreate,
    openEdit,
    closeEdit,
    openDelete,
    closeDelete,
    create,
    update,
    remove,
  } = useCrud(PURCHASE_ORDERS, makePoId);

  const cols = [
    {
      key: 'id',
      label: 'PO Number',
      render: (v) => (
        <span className="font-mono text-xs text-indigo-300">{v}</span>
      ),
    },
    { key: 'supplier', label: 'Supplier' },
    { key: 'items', label: 'Items', render: (v) => `${v} items` },
    {
      key: 'date',
      label: 'Ordered',
      render: (v) => <span className="text-white/50 text-xs">{v}</span>,
    },
    {
      key: 'expectedDate',
      label: 'Expected',
      render: (v) => <span className="text-white/50 text-xs">{v}</span>,
    },
    {
      key: 'total',
      label: 'Total',
      render: (v) => <span className="font-semibold">${v.toFixed(2)}</span>,
    },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v} /> },
    {
      key: 'id',
      label: '',
      render: (_, row) => (
        <div className="flex gap-1.5 justify-end">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-white/40 hover:text-indigo-300 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openDelete(row)}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const open = items.filter((p) => p.status !== 'received');
  const totalOutstanding = open.reduce((s, p) => s + p.total, 0);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  });
  if (loading) return <PurchasesSkeleton />;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Management"
        subtitle="Supplier orders, approvals, and delivery tracking"
      />

      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Open Orders',
            value: open.length,
            sub: 'pending / in transit',
          },
          {
            label: 'Total PO Value',
            value: `$${totalOutstanding.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            sub: 'outstanding',
          },
          {
            label: 'Received',
            value: items.filter((p) => p.status === 'received').length,
            sub: 'this session',
          },
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
          <h3 className="text-sm font-semibold text-white/80">
            Purchase Orders
          </h3>
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-3.5 h-3.5" />
            New Order
          </Button>
        </div>
        <DataTable columns={cols} data={items} />
      </GlassCard>

      <Modal
        open={!!editTarget}
        onClose={closeEdit}
        title={isNew ? 'New Purchase Order' : 'Edit Purchase Order'}
      >
        <POForm
          initial={isNew ? emptyForm : editTarget}
          onSubmit={
            isNew
              ? (f) => create({ ...f, id: makePoId(items) })
              : (fields) => update(editTarget.id, fields)
          }
          onCancel={closeEdit}
        />
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

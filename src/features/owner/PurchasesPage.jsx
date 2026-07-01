// src/features/owner/PurchasesPage.jsx
import { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  ChevronDown,
  Check,
  Package,
  Search,
  X,
} from 'lucide-react';
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
} from '../../components/common/Modal';
import { PurchasesSkeleton } from '../../components/common/Skeleton';
import { usePurchases } from '../../hooks/usePurchases';

const CATEGORIES = [
  'Beverages',
  'Furniture',
  'Electronics',
  'Clothing',
  'Food',
  'Other',
];
const UNITS = ['bag', 'unit', 'box', 'kg', 'litre', 'pair', 'piece', 'carton'];

// ── Custom Product Dropdown ───────────────────────────────────────────────────
function ProductDropdown({ value, products, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = products.find((p) => p.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between glass rounded-xl px-3 py-2 text-sm text-left outline-none transition-colors hover:border-indigo-500/40"
      >
        <span className={selected ? 'text-white/80' : 'text-white/25'}>
          {selected ? selected.name : 'Select existing product…'}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/30 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-xl border border-white/10 bg-[#0f1521] shadow-xl overflow-hidden">
          <div className="max-h-52 overflow-y-auto">
            {products.length === 0 && (
              <p className="text-xs text-white/30 px-3 py-2">No products yet</p>
            )}
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange(p.id);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-indigo-500/15 transition-colors text-left"
              >
                <div>
                  <p className="text-sm text-white/80">{p.name}</p>
                  <p className="text-xs text-white/35">
                    {p.category} · {p.unit}
                    {p.description ? ` · ${p.description}` : ''}
                  </p>
                </div>
                {value === p.id && (
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-white/8">
            <button
              type="button"
              onClick={() => {
                onChange('__new__');
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-indigo-400 hover:bg-indigo-500/10 transition-colors text-left"
            >
              <Plus className="w-3.5 h-3.5" />
              Add new product…
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PO Form ───────────────────────────────────────────────────────────────────
function POForm({ initial, products, onSubmit, onCancel, submitting, error }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleProductSelect = (productId) => {
    if (productId === '__new__') {
      setForm((f) => ({
        ...f,
        mode: 'new',
        productId: '',
        productName: '',
        category: 'Beverages',
        unit: 'unit',
        description: '',
        unitCost: '',
      }));
    } else {
      const found = products.find((p) => p.id === productId);
      setForm((f) => ({
        ...f,
        mode: 'existing',
        productId,
        productName: found?.name ?? '',
        category: found?.category ?? f.category,
        unit: found?.unit ?? f.unit,
        description: found?.description ?? '', // ← auto-fill from product
        unitCost: found?.cost != null ? String(found.cost) : f.unitCost,
      }));
    }
  };

  const total =
    form.quantity && form.unitCost
      ? (parseFloat(form.quantity) * parseFloat(form.unitCost)).toFixed(2)
      : null;

  const handleSave = (status) =>
    onSubmit({ ...form, total: total ? parseFloat(total) : 0, status });

  return (
    <div className="space-y-4">
      {/* PO Number + Date */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="PO Number">
          <Input
            value={form.poNumber}
            disabled
            className="opacity-50 cursor-not-allowed"
          />
        </Field>
        <Field label="PO Date">
          <Input type="date" value={form.poDate} onChange={set('poDate')} />
        </Field>
      </div>

      {/* Supplier */}
      <Field label="Supplier Name">
        <Input
          required
          value={form.supplier}
          onChange={set('supplier')}
          placeholder="e.g. Bean Source Co."
        />
      </Field>

      {/* Product section */}
      <div className="rounded-xl border border-white/8 bg-white/2 p-3 space-y-3">
        <span className="text-xs text-white/40 font-medium">Product</span>

        {/* Mode toggle */}
        <div className="flex gap-2">
          {['existing', 'new'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  mode: m,
                  productId: '',
                  productName: '',
                  unitCost: '',
                  description: '',
                }))
              }
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                form.mode === m
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'glass text-white/40 hover:text-white/60'
              }`}
            >
              {m === 'existing' ? 'Existing product' : 'New product'}
            </button>
          ))}
        </div>

        {/* Product input */}
        {form.mode === 'existing' ? (
          <div className="space-y-2">
            <Field label="Select Product">
              <ProductDropdown
                value={form.productId}
                products={products}
                onChange={handleProductSelect}
              />
            </Field>
            {form.productName && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-indigo-500/8 border border-indigo-500/15">
                <Package className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="text-xs text-indigo-300 font-medium">
                  {form.productName}
                </span>
                <span className="text-xs text-white/30 ml-1">
                  · {form.category}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Product Name">
              <Input
                required
                value={form.productName}
                onChange={set('productName')}
                placeholder="e.g. Premium Coffee"
                autoFocus
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={set('category')}
                className="w-full rounded-xl px-3 py-2 text-sm outline-none border border-white/10 bg-[#0f1521] text-white/80"
              >
                {CATEGORIES.map((c) => (
                  <option
                    key={c}
                    value={c}
                    className="bg-[#0f1521] text-white/80"
                  >
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {/* Qty + Unit + Cost */}
        <div className="grid grid-cols-3 gap-3">
          <Field label="Quantity">
            <Input
              required
              type="number"
              min="1"
              value={form.quantity}
              onChange={set('quantity')}
              placeholder="0"
            />
          </Field>
          <Field label="Unit">
            <select
              value={form.unit}
              onChange={set('unit')}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none border border-white/10 bg-[#0f1521] text-white/80"
            >
              {UNITS.map((u) => (
                <option
                  key={u}
                  value={u}
                  className="bg-[#0f1521] text-white/80"
                >
                  {u}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cost per Unit ($)">
            <Input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.unitCost}
              onChange={set('unitCost')}
              placeholder="0.00"
            />
          </Field>
        </div>

        {/* Description — free text */}
        <Field label="Description (optional)">
          <Input
            value={form.description}
            onChange={set('description')}
            placeholder="e.g. 50kg per bag, 24 cans per box, imported…"
          />
        </Field>
      </div>

      {/* Expected Date */}
      <Field label="Expected Delivery Date">
        <Input
          required
          type="date"
          value={form.expectedDate}
          onChange={set('expectedDate')}
        />
      </Field>

      {/* Total */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/8">
        <span className="text-sm text-white/50">Order Total</span>
        <span className="text-lg font-bold text-white/90">
          {total ? `$${total}` : '—'}
        </span>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2 border border-rose-500/20">
          {error}
        </p>
      )}

      {/* Save actions */}
      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm glass rounded-xl text-white/50 hover:text-white/80 transition-colors"
        >
          Cancel
        </button>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('pending')}
            className="px-3 py-2 text-sm rounded-xl text-amber-300 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 disabled:opacity-50 transition-colors"
          >
            Save as Pending
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('in_transit')}
            className="px-3 py-2 text-sm rounded-xl text-blue-300 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 disabled:opacity-50 transition-colors"
          >
            Mark In Transit
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('received')}
            className="px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            {submitting ? 'Saving…' : 'Mark Received'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function PurchasesPage() {
  const {
    orders,
    products,
    loading,
    error,
    submitting,
    modalOpen,
    editTarget,
    deleteTarget,
    poNumber,
    isNew,
    openCreate,
    openEdit,
    closeModal,
    setDeleteTarget,
    createOrder,
    updateOrder,
    deleteOrder,
    openOrders,
    totalOutstanding,
    receivedCount,
  } = usePurchases();

  const formInitial = isNew
    ? {
        poNumber,
        poDate: new Date().toISOString().slice(0, 10),
        supplier: '',
        expectedDate: '',
        mode: 'existing',
        productId: '',
        productName: '',
        category: 'Beverages',
        unit: 'unit',
        description: '', // ← replaced unitSize
        quantity: '',
        unitCost: '',
      }
    : editTarget;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.poNumber?.toLowerCase().includes(q) ||
      o.supplier?.toLowerCase().includes(q) ||
      o.productName?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = (form) => {
    if (isNew) createOrder(form);
    else updateOrder(editTarget.id, form);
  };

  const cols = [
    {
      key: 'poNumber',
      label: 'PO Number',
      render: (v) => (
        <span className="font-mono text-xs text-indigo-300">{v}</span>
      ),
    },
    { key: 'supplier', label: 'Supplier' },
    {
      key: 'productName',
      label: 'Product',
      render: (v, r) => (
        <div>
          <p className="text-sm text-white/75">{v || '—'}</p>
          <p className="text-xs text-white/30">{r.category}</p>
          {r.description && (
            <p className="text-xs text-white/20 italic">{r.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Qty',
      render: (v, r) => (
        <span className="text-white/60 text-sm">
          {v} {r.unit}
        </span>
      ),
    },
    {
      key: 'unitCost',
      label: 'Cost/Unit',
      render: (v) => (
        <span className="text-white/60 text-sm">
          ${Number(v ?? 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'poDate',
      label: 'Ordered',
      render: (v) => <span className="text-white/50 text-xs">{v}</span>,
    },
    {
      key: 'expectedDate',
      label: 'Expected',
      render: (v) => <span className="text-white/50 text-xs">{v ?? '—'}</span>,
    },
    {
      key: 'total',
      label: 'Total',
      render: (v) => (
        <span className="font-semibold">${Number(v ?? 0).toFixed(2)}</span>
      ),
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
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

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
            value: openOrders.length,
            sub: 'pending / in transit',
          },
          {
            label: 'Total PO Value',
            value: `$${totalOutstanding.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            sub: 'outstanding',
          },
          { label: 'Received', value: receivedCount, sub: 'all time' },
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
          <h3 className="text-sm font-semibold text-white/80">
            Purchase Orders
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search PO, supplier, product…"
                className="glass rounded-xl pl-8 pr-8 py-2 text-xs text-white/70 placeholder:text-white/25 outline-none w-56"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status filter pills */}
            <div className="flex gap-1">
              {['all', 'pending', 'in_transit', 'received'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                    statusFilter === s
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'glass text-white/35 hover:text-white/60'
                  }`}
                >
                  {s === 'all'
                    ? 'All'
                    : s === 'in_transit'
                      ? 'In Transit'
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <Button size="sm" onClick={openCreate}>
              <Plus className="w-3.5 h-3.5" />
              New Order
            </Button>
          </div>
        </div>

        {/* Result count */}
        {(search || statusFilter !== 'all') && (
          <p className="text-xs text-white/25 mb-3">
            {filtered.length} of {orders.length} orders
            {search && ` matching "${search}"`}
            {statusFilter !== 'all' &&
              ` · ${statusFilter === 'in_transit' ? 'in transit' : statusFilter}`}
          </p>
        )}
        {error && !modalOpen && (
          <p className="text-xs text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2 border border-rose-500/20 mb-3">
            {error}
          </p>
        )}
        <DataTable columns={cols} data={filtered} />
      </GlassCard>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isNew ? 'New Purchase Order' : `Edit ${editTarget?.poNumber}`}
        size="lg"
      >
        {formInitial && (
          <POForm
            key={editTarget?.id ?? 'new'}
            initial={formInitial}
            products={products}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitting={submitting}
            error={error}
          />
        )}
      </Modal>

      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteOrder(deleteTarget.id)}
        itemName={deleteTarget?.poNumber}
      />
    </div>
  );
}

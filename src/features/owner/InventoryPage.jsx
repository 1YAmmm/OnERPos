import { useState, useEffect } from 'react';
import { AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import {
  Modal,
  DeleteModal,
  Field,
  Input,
  FormActions,
} from '../../components/common/Modal';
import { useCrud } from '../../hooks/useCrud';
import { PRODUCTS } from '../../data/mockData';
import { InventorySkeleton } from '../../components/common/Skeleton';

const CATEGORIES = [
  'Beverages',
  'Furniture',
  'Electronics',
  'Clothing',
  'Food',
  'Other',
];
const UNITS = ['bag', 'unit', 'box', 'kg', 'litre', 'pair', 'piece', 'carton'];
const EMOJIS = ['📦', '☕', '🪑', '⌨️', '👕', '🍎', '💡', '🖥️'];

// ── Product Edit Form (no stock, no cost, no SKU change) ──────────────────────
function ProductEditForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: parseFloat(form.price) || 0,
      reorderPoint: parseInt(form.reorderPoint, 10) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name + SKU (SKU locked) */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Product Name">
          <Input
            required
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Premium Coffee"
          />
        </Field>
        <Field label="SKU">
          <Input
            value={form.sku}
            disabled
            className="opacity-50 cursor-not-allowed"
          />
        </Field>
      </div>

      {/* Category + Unit */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <select
            value={form.category}
            onChange={set('category')}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none border border-white/10 bg-[#0f1521] text-white/80"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0f1521] text-white/80">
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Unit">
          <select
            value={form.unit}
            onChange={set('unit')}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none border border-white/10 bg-[#0f1521] text-white/80"
          >
            {UNITS.map((u) => (
              <option key={u} value={u} className="bg-[#0f1521] text-white/80">
                {u}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Selling Price + Reorder Point */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Selling Price ($)">
          <Input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={set('price')}
            placeholder="0.00"
          />
        </Field>
        <Field label="Reorder Point">
          <Input
            required
            type="number"
            min="0"
            value={form.reorderPoint}
            onChange={set('reorderPoint')}
            placeholder="e.g. 10"
          />
        </Field>
      </div>

      {/* Stock info — read only */}
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
        <AlertTriangle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-300/70">
          Stock and cost are managed automatically via Purchase Orders and
          Sales.
        </p>
      </div>

      {/* Icon */}
      <Field label="Icon">
        <div className="flex gap-2 flex-wrap">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setForm((f) => ({ ...f, image: e }))}
              className={`text-xl p-2 rounded-xl transition-all ${
                form.image === e
                  ? 'bg-indigo-600/40 ring-1 ring-indigo-500'
                  : 'glass hover:bg-white/8'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </Field>

      <FormActions onCancel={onCancel} submitLabel="Update Product" />
    </form>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function InventoryPage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const {
    items,
    editTarget,
    deleteTarget,
    openEdit,
    closeEdit,
    openDelete,
    closeDelete,
    update,
    remove,
  } = useCrud(PRODUCTS);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const filtered = items.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = items.filter((p) => p.stock <= p.reorderPoint);
  const invValue = items.reduce(
    (s, p) => s + (p.cost ?? 0) * (p.stock ?? 0),
    0
  );

  const cols = [
    {
      key: 'image',
      label: '',
      width: 48,
      render: (v) => <span className="text-xl">{v}</span>,
    },
    {
      key: 'name',
      label: 'Product',
      render: (v, r) => (
        <div>
          <p className="text-sm font-medium text-white/80">{v}</p>
          <p className="text-xs text-white/35">{r.sku}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (v) => <span className="text-white/50 text-xs">{v}</span>,
    },
    {
      key: 'price',
      label: 'Sell Price',
      render: (v) => (
        <span className="font-semibold text-white/80">
          ${Number(v ?? 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'cost',
      label: 'Cost',
      render: (v) => (
        <span className="text-white/40 text-xs">
          {v != null ? `$${Number(v).toFixed(2)}` : '—'}
        </span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (v, r) => (
        <div className="flex items-center gap-2">
          <span
            className={
              v <= r.reorderPoint
                ? 'text-amber-400 font-semibold'
                : 'text-white/75'
            }
          >
            {v ?? 0} {r.unit}
          </span>
          {v <= r.reorderPoint && (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          )}
        </div>
      ),
    },
    {
      key: 'reorderPoint',
      label: 'Reorder At',
      render: (v) => <span className="text-white/40 text-xs">{v}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <Badge status={v} />,
    },
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

  if (loading) return <InventorySkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        subtitle="Product catalog, stock levels, and reorder alerts"
      />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: items.length, sub: 'in catalog' },
          {
            label: 'Low Stock',
            value: lowStock.length,
            sub: 'need reorder',
            warn: true,
          },
          {
            label: 'Inventory Value',
            value: `$${invValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            sub: 'at cost price',
          },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.08} className="p-4">
            <p className="text-xs text-white/35 mb-1">{s.label}</p>
            <p
              className={`text-xl font-bold ${s.warn && s.value > 0 ? 'text-amber-400' : 'text-white/85'}`}
            >
              {s.value}
            </p>
            <p className="text-xs text-white/30 mt-0.5">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      {lowStock.length > 0 && (
        <GlassCard
          delay={0.2}
          className="p-4 bg-amber-500/5 border-amber-500/15"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">
              Low Stock Alert
            </span>
          </div>
          <div className="space-y-1">
            {lowStock.map((p) => (
              <p key={p.id} className="text-xs text-white/50">
                <span className="text-white/70 font-medium">{p.name}</span> —
                only {p.stock} {p.unit} left (reorder at {p.reorderPoint})
              </p>
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard delay={0.25} className="p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold text-white/80">
              Product Catalog
            </h3>
            <p className="text-xs text-white/30 mt-0.5">
              Products are added via Purchase Orders
            </p>
          </div>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search products…"
            className="w-56"
          />
        </div>
        <DataTable columns={cols} data={filtered} />
      </GlassCard>

      <Modal
        open={!!editTarget}
        onClose={closeEdit}
        title="Edit Product"
        size="lg"
      >
        {editTarget && (
          <ProductEditForm
            initial={{
              ...editTarget,
              price: editTarget.price ?? '',
              reorderPoint: editTarget.reorderPoint ?? '',
            }}
            onSubmit={(fields) => {
              update(editTarget.id, fields);
              closeEdit();
            }}
            onCancel={closeEdit}
          />
        )}
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

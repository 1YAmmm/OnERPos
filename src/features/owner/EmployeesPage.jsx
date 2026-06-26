import { useState, useEffect } from 'react';
import { EmployeesSkeleton } from '../../components/common/Skeleton';
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
import { EMPLOYEES } from '../../data/mockData';

const ROLES = [
  'Store Manager',
  'Sales Associate',
  'Inventory Clerk',
  'Cashier',
  'Supervisor',
];
const emptyForm = {
  name: '',
  role: 'Sales Associate',
  email: '',
  phone: '',
  salary: '',
  status: 'active',
  avatar: '',
};

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function EmployeeForm({ initial = emptyForm, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      salary: parseFloat(form.salary),
      avatar: initials(form.name),
      joined: form.joined ?? new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Full Name">
        <Input
          required
          value={form.name}
          onChange={set('name')}
          placeholder="Jane Doe"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Role">
          <Select value={form.role} onChange={set('role')}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')}>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email">
          <Input
            required
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="jane@biz.com"
          />
        </Field>
        <Field label="Phone">
          <Input
            value={form.phone}
            onChange={set('phone')}
            placeholder="+1 555-0200"
          />
        </Field>
      </div>
      <Field label="Monthly Salary ($)">
        <Input
          required
          type="number"
          min="0"
          step="100"
          value={form.salary}
          onChange={set('salary')}
          placeholder="3000"
        />
      </Field>
      <FormActions
        onCancel={onCancel}
        submitLabel={initial.name ? 'Update Employee' : 'Add Employee'}
      />
    </form>
  );
}

export function EmployeesPage() {
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
  } = useCrud(EMPLOYEES);

  const cols = [
    {
      key: 'avatar',
      label: '',
      width: 44,
      render: (v, r) => (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/25 to-violet-500/25 flex items-center justify-center text-xs font-semibold text-indigo-300 border border-indigo-500/20">
          {initials(r.name)}
        </div>
      ),
    },
    { key: 'name', label: 'Employee' },
    {
      key: 'role',
      label: 'Role',
      render: (v) => <span className="text-white/55 text-xs">{v}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (v) => <span className="text-white/40 text-xs">{v}</span>,
    },
    {
      key: 'salary',
      label: 'Salary',
      render: (v) => (
        <span className="font-semibold text-emerald-400">
          ${v.toLocaleString()}/mo
        </span>
      ),
    },
    {
      key: 'joined',
      label: 'Since',
      render: (v) => <span className="text-white/40 text-xs">{v}</span>,
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
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);
  if (loading) return <EmployeesSkeleton />;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Management"
        subtitle="Team records, roles, and payroll overview"
      />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Staff', value: items.length, sub: 'employees' },
          {
            label: 'Active',
            value: items.filter((e) => e.status === 'active').length,
            sub: 'on duty',
          },
          {
            label: 'Monthly Payroll',
            value: `$${items.reduce((s, e) => s + e.salary, 0).toLocaleString()}`,
            sub: 'estimated',
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
          <h3 className="text-sm font-semibold text-white/80">Team Members</h3>
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-3.5 h-3.5" />
            Add Employee
          </Button>
        </div>
        <DataTable columns={cols} data={items} />
      </GlassCard>

      <Modal
        open={!!editTarget}
        onClose={closeEdit}
        title={isNew ? 'Add Employee' : 'Edit Employee'}
      >
        <EmployeeForm
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

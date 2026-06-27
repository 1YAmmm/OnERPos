// src/pages/employees/EmployeesPage.jsx

import { useState, useEffect } from 'react';
import { EmployeesSkeleton } from '../../components/common/Skeleton';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useEmployees } from '../../contexts/EmployeeContext';
import {
  Modal,
  DeleteModal,
  Field,
  Input,
  Select,
  FormActions,
} from '../../components/common/Modal';

const POSITIONS = ['Store Manager', 'Cashier', 'Sales Associate', 'Supervisor'];

const emptyForm = {
  fullName: '',
  email: '',
  password: '',
  position: 'Sales Associate',
  hourlyRate: '',
  hireDate: new Date().toISOString().slice(0, 10),
  status: 'active',
};

function initials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function EmployeeForm({
  initial = emptyForm,
  isNew = true,
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, hourlyRate: parseFloat(form.hourlyRate) || 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Full Name">
        <Input
          required
          value={form.fullName}
          onChange={set('fullName')}
          placeholder="Jane Doe"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email">
          <Input
            required
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="jane@biz.com"
            disabled={!isNew}
          />
        </Field>
        {isNew && (
          <Field label="Password">
            <Input
              required
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="Min. 6 characters"
              minLength={6}
            />
          </Field>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Position">
          <Select value={form.position} onChange={set('position')}>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
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
        <Field label="Hourly Rate ($)">
          <Input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.hourlyRate}
            onChange={set('hourlyRate')}
            placeholder="15.00"
          />
        </Field>
        <Field label="Hire Date">
          <Input type="date" value={form.hireDate} onChange={set('hireDate')} />
        </Field>
      </div>
      <FormActions
        onCancel={onCancel}
        submitLabel={
          submitting ? 'Saving...' : isNew ? 'Add Employee' : 'Update Employee'
        }
      />
    </form>
  );
}

export function EmployeesPage() {
  const {
    employees,
    loading,
    error,
    clearError,
    fetchEmployees,
    registerEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();

  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading && employees.length === 0) return <EmployeesSkeleton />;

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openCreate = () => {
    clearError();
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    clearError();
    setEditTarget({
      id: row.id,
      fullName: row.name,
      email: row.email,
      position: row.role,
      hourlyRate: row.salary,
      hireDate:
        row.joined === '—' ? new Date().toISOString().slice(0, 10) : row.joined,
      status: row.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    clearError();
  };

  // ── Create ─────────────────────────────────────────────────────────────────
  const handleCreate = async (fields) => {
    setSubmitting(true);
    const result = await registerEmployee(fields);
    setSubmitting(false);
    if (result.success) closeModal();
  };

  // ── Update ─────────────────────────────────────────────────────────────────
  const handleUpdate = async (fields) => {
    setSubmitting(true);
    const result = await updateEmployee({ id: editTarget.id, ...fields });
    setSubmitting(false);
    if (result.success) closeModal();
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    const result = await deleteEmployee(deleteTarget.id);
    if (result.success) setDeleteTarget(null);
  };

  // ── Columns ────────────────────────────────────────────────────────────────
  const cols = [
    {
      key: 'avatar',
      label: '',
      width: 44,
      render: (_, r) => (
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500/25 to-violet-500/25 flex items-center justify-center text-xs font-semibold text-indigo-300 border border-indigo-500/20">
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
          ${Number(v).toLocaleString()}/hr
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
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Management"
        subtitle="Team records, roles, and payroll overview"
      />

      {error && !modalOpen && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Staff', value: employees.length, sub: 'employees' },
          {
            label: 'Active',
            value: employees.filter((e) => e.status === 'active').length,
            sub: 'on duty',
          },
          {
            label: 'Monthly Payroll',
            value: `$${employees.reduce((s, e) => s + Number(e.salary), 0).toLocaleString()}`,
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
        <DataTable columns={cols} data={employees} />
      </GlassCard>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit Employee' : 'Add Employee'}
      >
        <EmployeeForm
          key={editTarget?.id ?? 'new'}
          initial={editTarget ?? emptyForm}
          isNew={!editTarget}
          onSubmit={editTarget ? handleUpdate : handleCreate}
          onCancel={closeModal}
          submitting={submitting}
        />
        {error && (
          <p className="mt-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </Modal>

      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name}
      />
    </div>
  );
}

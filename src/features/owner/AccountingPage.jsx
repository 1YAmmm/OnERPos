import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal, DeleteModal, Field, Input, Select, FormActions } from '../../components/common/Modal';
import { useCrud } from '../../hooks/useCrud';
import { INCOME_ENTRIES, EXPENSE_ENTRIES } from '../../data/mockData';

const INCOME_CATS = ['Sales Revenue', 'Service Income', 'Rental Income', 'Other Income'];
const EXPENSE_CATS = ['Cost of Goods', 'Utilities', 'Payroll', 'Rent', 'Marketing', 'Other'];

const emptyIncome  = { description: '', amount: '', category: 'Sales Revenue', date: new Date().toISOString().slice(0, 10), status: 'pending' };
const emptyExpense = { description: '', amount: '', category: 'Cost of Goods', date: new Date().toISOString().slice(0, 10), status: 'pending' };

function EntryForm({ initial, categories, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Description">
        <Input required value={form.description} onChange={set('description')} placeholder="e.g. Product Sales — Week 1" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Amount ($)">
          <Input required type="number" step="0.01" min="0" value={form.amount} onChange={set('amount')} placeholder="0.00" />
        </Field>
        <Field label="Date">
          <Input required type="date" value={form.date} onChange={set('date')} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <Select value={form.category} onChange={set('category')}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')}>
            <option value="pending">Pending</option>
            <option value="posted">Posted</option>
          </Select>
        </Field>
      </div>
      <FormActions onCancel={onCancel} submitLabel={initial.description ? 'Update Entry' : 'Add Entry'} />
    </form>
  );
}

function EntryTable({ items, type, onEdit, onDelete }) {
  const cols = [
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category', render: v => <span className="text-white/50 text-xs">{v}</span> },
    { key: 'date', label: 'Date', render: v => <span className="text-white/50 text-xs">{v}</span> },
    { key: 'amount', label: 'Amount', render: v => (
      <span className={`font-semibold ${type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {type === 'income' ? '+' : '-'}${v.toFixed(2)}
      </span>
    )},
    { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
    { key: 'id', label: '', render: (_, row) => (
      <div className="flex gap-1.5 justify-end">
        <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-white/40 hover:text-indigo-300 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(row)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    )},
  ];
  return <DataTable columns={cols} data={items} />;
}

export function AccountingPage() {
  const [activeModal, setActiveModal] = useState(null); // null | { type, target }

  const income  = useCrud(INCOME_ENTRIES);
  const expense = useCrud(EXPENSE_ENTRIES);

  const totalIncome  = income.items.reduce((s, e) => s + e.amount, 0);
  const totalExpense = expense.items.reduce((s, e) => s + e.amount, 0);
  const netProfit    = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <PageHeader title="Accounting" subtitle="Income, expenses, and financial summaries" />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Income',   value: `$${totalIncome.toLocaleString()}`,  color: 'text-emerald-400' },
          { label: 'Total Expenses', value: `$${totalExpense.toLocaleString()}`, color: 'text-rose-400' },
          { label: 'Net Profit',     value: `$${netProfit.toLocaleString()}`,    color: netProfit >= 0 ? 'text-indigo-300' : 'text-rose-400' },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.08} className="p-4">
            <p className="text-xs text-white/35 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Income */}
      <GlassCard delay={0.2} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80">Income Entries</h3>
          <Button size="sm" onClick={income.openCreate}><Plus className="w-3.5 h-3.5" />Add Income</Button>
        </div>
        <EntryTable items={income.items} type="income" onEdit={income.openEdit} onDelete={income.openDelete} />
      </GlassCard>

      {/* Expenses */}
      <GlassCard delay={0.25} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80">Expense Entries</h3>
          <Button size="sm" onClick={expense.openCreate}><Plus className="w-3.5 h-3.5" />Add Expense</Button>
        </div>
        <EntryTable items={expense.items} type="expense" onEdit={expense.openEdit} onDelete={expense.openDelete} />
      </GlassCard>

      {/* Income Modals */}
      <Modal open={!!income.editTarget} onClose={income.closeEdit} title={income.isNew ? 'Add Income Entry' : 'Edit Income Entry'}>
        <EntryForm
          initial={income.isNew ? emptyIncome : income.editTarget}
          categories={INCOME_CATS}
          onSubmit={income.isNew ? income.create : (fields) => income.update(income.editTarget.id, fields)}
          onCancel={income.closeEdit}
        />
      </Modal>
      <DeleteModal open={!!income.deleteTarget} onClose={income.closeDelete} onConfirm={() => income.remove(income.deleteTarget.id)} itemName={income.deleteTarget?.description} />

      {/* Expense Modals */}
      <Modal open={!!expense.editTarget} onClose={expense.closeEdit} title={expense.isNew ? 'Add Expense Entry' : 'Edit Expense Entry'}>
        <EntryForm
          initial={expense.isNew ? emptyExpense : expense.editTarget}
          categories={EXPENSE_CATS}
          onSubmit={expense.isNew ? expense.create : (fields) => expense.update(expense.editTarget.id, fields)}
          onCancel={expense.closeEdit}
        />
      </Modal>
      <DeleteModal open={!!expense.deleteTarget} onClose={expense.closeDelete} onConfirm={() => expense.remove(expense.deleteTarget.id)} itemName={expense.deleteTarget?.description} />
    </div>
  );
}

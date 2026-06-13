import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { TRANSACTIONS, PRODUCTS } from '../../data/mockData';

const txCols = [
  { key: 'id',      label: 'ID',       render: v => <span className="font-mono text-xs text-indigo-300">{v}</span> },
  { key: 'customer',label: 'Customer' },
  { key: 'items',   label: 'Items',    render: v => `${v} items` },
  { key: 'total',   label: 'Total',    render: v => <span className="font-semibold">${v.toFixed(2)}</span> },
  { key: 'payment', label: 'Payment' },
  { key: 'status',  label: 'Status',   render: v => <Badge status={v} /> },
];

export function CashierDashboard() {
  const completed = TRANSACTIONS.filter(t => t.status === 'completed');
  const dailySales = completed.reduce((s, t) => s + t.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="My Dashboard" subtitle="Your shift summary" />
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Daily Sales',   value: `$${dailySales.toFixed(2)}`, sub: 'today' },
          { label: 'Transactions',  value: TRANSACTIONS.length, sub: 'processed' },
          { label: 'Top Product',   value: 'Premium Coffee', sub: 'most sold today' },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.08} className="p-4">
            <p className="text-xs text-white/35 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-white/85">{s.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.sub}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard delay={0.2} className="p-5">
        <h3 className="text-sm font-semibold text-white/80 mb-4">My Recent Transactions</h3>
        <DataTable columns={txCols} data={TRANSACTIONS} />
      </GlassCard>
    </div>
  );
}

export function CashierTransactions() {
  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" subtitle="All transactions processed by you" />
      <GlassCard delay={0.1} className="p-5">
        <DataTable columns={txCols} data={TRANSACTIONS} />
      </GlassCard>
    </div>
  );
}

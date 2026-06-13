import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { REVENUE_DATA } from '../../data/mockData';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs border border-white/10">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }} className="font-medium">{p.name}: ${p.value?.toLocaleString()}</p>)}
    </div>
  );
};

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" subtitle="Revenue, sales trends, and inventory reports" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassCard delay={0.1} className="p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-4">Revenue vs Profit</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={REVENUE_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }} />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} name="Revenue" />
              <Line type="monotone" dataKey="profit"  stroke="#10b981" strokeWidth={2} dot={false} name="Profit"  />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard delay={0.15} className="p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-4">Expenses Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="expenses" fill="#f43f5e" radius={[4,4,0,0]} opacity={0.75} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <GlassCard delay={0.25} className="p-5">
        <h3 className="text-sm font-semibold text-white/80 mb-4">6-Month Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Month','Revenue','Expenses','Profit','Margin'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-white/35 uppercase tracking-wider px-3 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REVENUE_DATA.map(r => (
                <tr key={r.month} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-3 py-3 text-white/70 font-medium">{r.month}</td>
                  <td className="px-3 py-3 text-white/70">${r.revenue.toLocaleString()}</td>
                  <td className="px-3 py-3 text-rose-400/80">${r.expenses.toLocaleString()}</td>
                  <td className="px-3 py-3 text-emerald-400">${r.profit.toLocaleString()}</td>
                  <td className="px-3 py-3 text-indigo-300">{((r.profit/r.revenue)*100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

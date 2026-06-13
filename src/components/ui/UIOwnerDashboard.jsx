import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  AlertTriangle,
} from "lucide-react";
import { MetricCard } from "../common/MetricCard";
import { GlassCard } from "../common/GlassCard";
import { Badge } from "../common/Badge";
import { PageHeader } from "../common/PageHeader";
import {
  REVENUE_DATA,
  TRANSACTIONS,
  PRODUCTS,
  NOTIFICATIONS,
} from "../../data/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const metrics = [
  {
    title: "Total Revenue",
    value: "$31,200",
    change: 8,
    changeLabel: "vs last month",
    icon: DollarSign,
    color: "indigo",
  },
  {
    title: "Net Profit",
    value: "$18,100",
    change: 12,
    changeLabel: "vs last month",
    icon: TrendingUp,
    color: "emerald",
  },
  {
    title: "Total Sales",
    value: "284",
    change: 5,
    changeLabel: "transactions",
    icon: ShoppingCart,
    color: "violet",
  },
  {
    title: "Inventory Value",
    value: "$6,420",
    change: -3,
    changeLabel: "stock value",
    icon: Package,
    color: "cyan",
  },
  {
    title: "Active Employees",
    value: "2 / 3",
    change: 0,
    changeLabel: "headcount",
    icon: Users,
    color: "amber",
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs border border-white/10">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export function UIOwnerDashboard() {
  return (
    <div className="space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0">
      <PageHeader
        title="Business Overview"
        subtitle="June 2025 — Live summary"
      />

      {/* KPI — horizontal scroll on mobile, grid on sm+ */}
      <div
        className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4
                   overflow-x-auto pb-2 sm:pb-0
                   snap-x snap-mandatory sm:snap-none
                   -mx-3 px-3 sm:mx-0 sm:px-0
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {metrics.map((m, i) => (
          <div key={m.title} className="shrink-0 w-40 sm:w-auto snap-start">
            <MetricCard {...m} delay={i * 0.07} />
          </div>
        ))}
      </div>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 glass rounded-2xl p-4 md:p-5"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 md:mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white/80">
                Revenue vs Expenses
              </h3>
              <p className="text-xs text-white/35 mt-0.5">6-month trend</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/35">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-rose-400 rounded-full" />
                Expenses
              </span>
            </div>
          </div>

          {/* Chart scrollable on mobile */}
          <div
            className="overflow-x-auto -mx-1 px-1
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="min-w-[300px]">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={REVENUE_DATA}
                  margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
                >
                  <defs>
                    <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#gradRev)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#gradExp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Alerts — horizontal scroll on mobile, stacked on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="glass rounded-2xl p-4 md:p-5"
        >
          <h3 className="text-sm font-semibold text-white/80 mb-3">Alerts</h3>
          <div
            className="flex lg:flex-col gap-2
                       overflow-x-auto pb-1 lg:pb-0
                       snap-x snap-mandatory lg:snap-none
                       -mx-1 px-1
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className={`rounded-xl p-3 flex gap-3 items-start
                            shrink-0 w-64 lg:w-auto snap-start
                            ${
                              n.type === "warning"
                                ? "bg-amber-500/8 border border-amber-500/15"
                                : n.type === "success"
                                  ? "bg-emerald-500/8 border border-emerald-500/15"
                                  : "bg-indigo-500/8 border border-indigo-500/15"
                            }`}
              >
                <AlertTriangle
                  className={`w-4 h-4 mt-0.5 shrink-0
                              ${
                                n.type === "warning"
                                  ? "text-amber-400"
                                  : n.type === "success"
                                    ? "text-emerald-400"
                                    : "text-indigo-400"
                              }`}
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/75">{n.title}</p>
                  <p className="text-xs text-white/40 mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-white/25 mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Transactions + Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5">
        <GlassCard delay={0.4} className="p-4 md:p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-3 md:mb-4">
            Recent Transactions
          </h3>
          <div
            className="overflow-x-auto -mx-2 px-2
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="min-w-[280px]">
              {TRANSACTIONS.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white/75 truncate">
                      {tx.id}
                    </p>
                    <p className="text-xs text-white/35 truncate">
                      {tx.customer} · {tx.items} items
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-white/80 tabular-nums">
                      ${tx.total.toFixed(2)}
                    </span>
                    <Badge status={tx.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.45} className="p-4 md:p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-3 md:mb-4">
            Inventory Snapshot
          </h3>
          <div
            className="overflow-x-auto -mx-2 px-2
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="min-w-[280px]">
              {PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 gap-2"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm shrink-0">
                      {p.image}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white/75 truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-white/35 truncate">{p.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs sm:text-sm font-semibold tabular-nums ${
                        p.stock <= p.reorderPoint
                          ? "text-amber-400"
                          : "text-white/80"
                      }`}
                    >
                      {p.stock}
                    </span>
                    <Badge
                      status={p.status}
                      label={p.status === "low_stock" ? "Low" : "OK"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

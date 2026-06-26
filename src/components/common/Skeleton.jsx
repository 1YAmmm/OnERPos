// src/components/common/Skeleton.jsx
import { cn } from '../../utils/cn';

// Base skeleton block
export function Skeleton({ className }) {
  return (
    <div className={cn('animate-pulse bg-white/10 rounded-md', className)} />
  );
}

export function SidebarSkeleton({ collapsed }) {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-5 border-b border-white/8',
          collapsed && 'justify-center px-3'
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-white/10 shrink-0" />
        {!collapsed && (
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-20 bg-white/10 rounded-md" />
            <div className="h-2 w-12 bg-white/6 rounded-md" />
          </div>
        )}
      </div>
      <div className="flex-1 px-2 py-4 space-y-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl',
              collapsed && 'justify-center px-2.5'
            )}
          >
            <div className="w-4 h-4 rounded bg-white/10 shrink-0" />
            {!collapsed && (
              <div
                className="h-3 rounded bg-white/8"
                style={{ width: `${45 + (i % 4) * 15}%` }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-white/8 p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-2.5 w-24 bg-white/10 rounded-md" />
              <div className="h-2 w-14 bg-white/6 rounded-md" />
            </div>
          </div>
        )}
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1.5',
            collapsed && 'justify-center'
          )}
        >
          <div className="w-3.5 h-3.5 rounded bg-white/10 shrink-0" />
          {!collapsed && <div className="h-2.5 w-12 bg-white/10 rounded-md" />}
        </div>
      </div>
    </div>
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3 w-36 bg-white/6" />
      </div>
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-3 w-10 bg-white/8" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-2.5 w-24 bg-white/6" />
            </div>
          </div>
        ))}
      </div>
      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24 bg-white/6" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-3 w-16 bg-white/8" />
              <Skeleton className="h-3 w-16 bg-white/8" />
            </div>
          </div>
          <Skeleton className="h-50 bg-white/4 rounded-xl" />
        </div>
        <div className="glass rounded-2xl p-5 space-y-3">
          <Skeleton className="h-4 w-16 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-3 bg-white/4 border border-white/6 flex gap-3"
            >
              <Skeleton className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2.5 w-full bg-white/6" />
                <Skeleton className="h-2 w-12 bg-white/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Transactions + Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 2 }).map((_, t) => (
          <div key={t} className="glass rounded-2xl p-5 space-y-3">
            <Skeleton className="h-4 w-36 mb-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
              >
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-2.5 w-20 bg-white/6" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-14 bg-white/8" />
                  <Skeleton className="h-5 w-12 rounded-full bg-white/8" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AccountingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-36 bg-white/10 rounded-md" />
        <div className="h-3 w-52 bg-white/6 rounded-md" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 space-y-2">
            <div className="h-3 w-24 bg-white/8 rounded-md" />
            <div className="h-6 w-28 bg-white/10 rounded-md" />
          </div>
        ))}
      </div>

      {/* Income table */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-white/10 rounded-md" />
          <div className="h-8 w-24 bg-white/8 rounded-xl" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
          >
            <div className="space-y-1.5">
              <div className="h-3 w-40 bg-white/10 rounded-md" />
              <div className="h-2.5 w-24 bg-white/6 rounded-md" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-16 bg-white/8 rounded-md" />
              <div className="h-5 w-14 bg-white/8 rounded-full" />
              <div className="h-6 w-14 bg-white/6 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Expense table */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-white/10 rounded-md" />
          <div className="h-8 w-24 bg-white/8 rounded-xl" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
          >
            <div className="space-y-1.5">
              <div className="h-3 w-40 bg-white/10 rounded-md" />
              <div className="h-2.5 w-24 bg-white/6 rounded-md" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-16 bg-white/8 rounded-md" />
              <div className="h-5 w-14 bg-white/8 rounded-full" />
              <div className="h-6 w-14 bg-white/6 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function CustomersSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-44 bg-white/10 rounded-md" />
        <div className="h-3 w-56 bg-white/6 rounded-md" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 space-y-2">
            <div className="h-3 w-24 bg-white/8 rounded-md" />
            <div className="h-6 w-16 bg-white/10 rounded-md" />
            <div className="h-2.5 w-20 bg-white/6 rounded-md" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="h-4 w-28 bg-white/10 rounded-md" />
          <div className="flex gap-3">
            <div className="h-8 w-36 bg-white/8 rounded-xl" />
            <div className="h-8 w-28 bg-white/8 rounded-xl" />
          </div>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
            <div className="space-y-1.5">
              <div className="h-3 w-32 bg-white/10 rounded-md" />
              <div className="h-2.5 w-44 bg-white/6 rounded-md" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-20 bg-white/8 rounded-md" />
              <div className="h-3 w-16 bg-white/8 rounded-md" />
              <div className="h-5 w-14 bg-white/8 rounded-full" />
              <div className="h-6 w-14 bg-white/6 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function EmployeesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-48 bg-white/10 rounded-md" />
        <div className="h-3 w-60 bg-white/6 rounded-md" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 space-y-2">
            <div className="h-3 w-24 bg-white/8 rounded-md" />
            <div className="h-6 w-16 bg-white/10 rounded-md" />
            <div className="h-2.5 w-20 bg-white/6 rounded-md" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-white/10 rounded-md" />
          <div className="h-8 w-28 bg-white/8 rounded-xl" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-32 bg-white/10 rounded-md" />
              <div className="h-2.5 w-24 bg-white/6 rounded-md" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-28 bg-white/8 rounded-md" />
              <div className="h-3 w-20 bg-white/8 rounded-md" />
              <div className="h-3 w-16 bg-white/8 rounded-md" />
              <div className="h-5 w-14 bg-white/8 rounded-full" />
              <div className="h-6 w-14 bg-white/6 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
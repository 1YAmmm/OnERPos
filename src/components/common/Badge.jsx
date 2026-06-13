import { cn } from '../../utils/cn';

const variants = {
  active:     'bg-emerald-500/12 text-emerald-400 border-emerald-500/20',
  inactive:   'bg-white/6 text-white/40 border-white/10',
  suspended:  'bg-rose-500/12 text-rose-400 border-rose-500/20',
  low_stock:  'bg-amber-500/12 text-amber-400 border-amber-500/20',
  completed:  'bg-emerald-500/12 text-emerald-400 border-emerald-500/20',
  pending:    'bg-amber-500/12 text-amber-400 border-amber-500/20',
  refunded:   'bg-rose-500/12 text-rose-400 border-rose-500/20',
  received:   'bg-emerald-500/12 text-emerald-400 border-emerald-500/20',
  in_transit: 'bg-cyan-500/12 text-cyan-400 border-cyan-500/20',
  on_leave:   'bg-amber-500/12 text-amber-400 border-amber-500/20',
  posted:     'bg-emerald-500/12 text-emerald-400 border-emerald-500/20',
  warning:    'bg-amber-500/12 text-amber-400 border-amber-500/20',
  info:       'bg-indigo-500/12 text-indigo-400 border-indigo-500/20',
  success:    'bg-emerald-500/12 text-emerald-400 border-emerald-500/20',
};

export function Badge({ status, label, className }) {
  const text = label ?? status?.replace(/_/g, ' ') ?? '';
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
      variants[status] ?? 'bg-white/6 text-white/50 border-white/10',
      className
    )}>
      {text}
    </span>
  );
}

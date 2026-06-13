import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

export function MetricCard({ title, value, change, changeLabel, icon: Icon, color = 'indigo', delay = 0 }) {
  const colors = {
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
    cyan:   { bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   border: 'border-cyan-500/20'   },
    emerald:{ bg: 'bg-emerald-500/10',text: 'text-emerald-400',border: 'border-emerald-500/20'},
    amber:  { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20'  },
    rose:   { bg: 'bg-rose-500/10',   text: 'text-rose-400',   border: 'border-rose-500/20'   },
  };
  const c = colors[color] || colors.indigo;
  const isPositive = change > 0;
  const isNeutral  = change === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-xl', c.bg, `border ${c.border}`)}>
          {Icon && <Icon className={cn('w-5 h-5', c.text)} />}
        </div>
        <div className={cn(
          'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
          isNeutral  ? 'bg-white/5 text-white/40' :
          isPositive ? 'bg-emerald-500/10 text-emerald-400' :
                       'bg-rose-500/10 text-rose-400'
        )}>
          {isNeutral ? <Minus className="w-3 h-3" /> :
           isPositive ? <TrendingUp className="w-3 h-3" /> :
                        <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold text-white/90 tracking-tight">{value}</p>
        <p className="text-xs text-white/40 mt-1">{title}</p>
        {changeLabel && <p className="text-xs text-white/25 mt-0.5">{changeLabel}</p>}
      </div>
    </motion.div>
  );
}

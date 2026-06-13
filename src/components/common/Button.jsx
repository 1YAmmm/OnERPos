import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export function Button({ children, variant = 'primary', size = 'md', className, disabled, onClick, type = 'button' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20',
    secondary: 'glass hover:bg-white/8 text-white/80',
    ghost: 'hover:bg-white/6 text-white/60 hover:text-white/90',
    danger: 'bg-rose-600/80 hover:bg-rose-500 text-white',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </motion.button>
  );
}

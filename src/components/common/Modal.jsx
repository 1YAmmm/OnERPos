import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Generic glass modal.
 * Props:
 *   open      — boolean
 *   onClose   — fn
 *   title     — string
 *   size      — 'sm' | 'md' | 'lg' (default 'md')
 *   children
 */
export function Modal({ open, onClose, title, size = 'md', children }) {
  // close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              'relative w-full glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden',
              widths[size]
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="text-sm font-semibold text-white/85">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/8 text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Simple confirm-delete modal */
export function DeleteModal({ open, onClose, onConfirm, itemName }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete" size="sm">
      <p className="text-sm text-white/60 mb-6">
        Are you sure you want to delete{' '}
        <span className="text-white/85 font-medium">{itemName}</span>?
        This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm glass rounded-xl text-white/70 hover:bg-white/8 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm bg-rose-600/80 hover:bg-rose-500 text-white rounded-xl transition-colors"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

/** Styled form field wrapper */
export function Field({ label, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-white/45 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

/** Styled text/number input */
export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full glass rounded-xl px-3 py-2 text-sm text-white/80 placeholder:text-white/25',
        'border border-white/8 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30',
        'transition-colors',
        className
      )}
      {...props}
    />
  );
}

/** Styled select */
export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        'w-full rounded-xl px-3 py-2 text-sm text-white/80',
        'border border-white/8 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30',
        'transition-colors appearance-none cursor-pointer',
        className
      )}
      style={{
        background: 'rgba(15, 20, 40, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      {...props}
    >
      {children}
    </select>
  );
}

/** Form action row */
export function FormActions({ onCancel, submitLabel = 'Save', loading }) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-white/8 mt-5">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm glass rounded-xl text-white/70 hover:bg-white/8 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </div>
  );
}

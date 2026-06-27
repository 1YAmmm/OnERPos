// src/components/common/Toast.jsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';

const ToastContext = createContext(null);

const VARIANTS = {
  success: {
    bar: 'border-l-emerald-500',
    icon: 'ti-circle-check text-emerald-400',
  },
  error: {
    bar: 'border-l-rose-500',
    icon: 'ti-circle-x text-rose-400',
  },
  warning: {
    bar: 'border-l-amber-400',
    icon: 'ti-alert-triangle text-amber-400',
  },
  info: {
    bar: 'border-l-indigo-400',
    icon: 'ti-info-circle text-indigo-400',
  },
};

function ToastItem({ toast, onDismiss }) {
  const v = VARIANTS[toast.type] || VARIANTS.info;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-start gap-2.5
        bg-white/5 backdrop-blur-sm
        border border-white/10 border-l-2 ${v.bar}
        rounded-lg px-3.5 py-3
        min-w-70 max-w-90
        shadow-lg shadow-black/30
        animate-[toast-in_0.2s_ease]
      `}
    >
      <i
        className={`ti ${v.icon} text-[17px] mt-px shrink-0`}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-[13px] font-medium text-white/90 leading-snug mb-0.5">
            {toast.title}
          </p>
        )}
        {toast.message && (
          <p className="text-[13px] text-white/55 leading-snug">
            {toast.message}
          </p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action.onClick();
              onDismiss(toast.id);
            }}
            className="mt-1.5 text-[12px] font-medium underline underline-offset-2 text-white/70 hover:text-white/90 transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="shrink-0 p-0.5 rounded text-white/30 hover:text-white/70 transition-colors"
      >
        <i className="ti ti-x text-[14px]" aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = 'info', title, message, duration = 4000, action }) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, title, message, action }]);
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  toast.success = (title, opts) => toast({ type: 'success', title, ...opts });
  toast.error = (title, opts) => toast({ type: 'error', title, ...opts });
  toast.warning = (title, opts) => toast({ type: 'warning', title, ...opts });
  toast.info = (title, opts) => toast({ type: 'info', title, ...opts });

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-label="Notifications"
        className="fixed bottom-6 right-6 flex flex-col gap-2 z-9999 pointer-events-none *:pointer-events-auto"
      >
        <style>{`
          @keyframes toast-in {
            from { opacity: 0; transform: translateY(8px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

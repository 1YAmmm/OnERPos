import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NOTIFICATIONS } from '../../data/mockData';

const icons = {
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  info:    <Info className="w-4 h-4 text-indigo-400" />,
};

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  // Calculate dropdown position from button's bounding rect
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen(o => !o)}
        className="relative p-2 glass rounded-xl hover:bg-white/8 transition-colors"
      >
        <Bell className="w-4 h-4 text-white/60" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0"
                style={{ zIndex: 9998 }}
                onClick={() => setOpen(false)}
              />

              {/* Panel — portalled to body, above everything */}
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: 'fixed',
                  top: panelPos.top,
                  right: panelPos.right,
                  zIndex: 9999,
                  width: 320,
                }}
                className="glass-strong rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/8">
                  <span className="text-sm font-medium text-white/80">Notifications</span>
                  <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className={`flex gap-3 p-4 ${!n.read ? 'bg-indigo-500/4' : ''}`}>
                      <div className="mt-0.5 shrink-0">{icons[n.type]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white/80">{n.title}</p>
                        <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-white/25 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

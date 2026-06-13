import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, Plus, Trash2, CheckCheck } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal, DeleteModal, Field, Input, Select, FormActions } from '../../components/common/Modal';
import { useCrud } from '../../hooks/useCrud';
import { NOTIFICATIONS } from '../../data/mockData';

const icons = { warning: AlertTriangle, success: CheckCircle2, info: Info };
const colors = { warning: 'text-amber-400', success: 'text-emerald-400', info: 'text-indigo-400' };

const emptyForm = { type: 'info', title: '', message: '' };

function NotifForm({ initial = emptyForm, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, time: 'Just now', read: false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Type">
        <Select value={form.type} onChange={set('type')}>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="success">Success</option>
        </Select>
      </Field>
      <Field label="Title">
        <Input required value={form.title} onChange={set('title')} placeholder="Notification title" />
      </Field>
      <Field label="Message">
        <textarea
          required
          value={form.message}
          onChange={set('message')}
          placeholder="Notification message…"
          rows={3}
          className="w-full glass rounded-xl px-3 py-2 text-sm text-white/80 placeholder:text-white/25 border border-white/8 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors resize-none"
        />
      </Field>
      <FormActions onCancel={onCancel} submitLabel="Add Notification" />
    </form>
  );
}

export function NotificationsPage() {
  const { items, setItems, editTarget, deleteTarget, isNew, openCreate, closeEdit, openDelete, closeDelete, create, remove } = useCrud(NOTIFICATIONS);

  const markAllRead = () => {
    // directly mutate via a trick — we re-use setItems via a wrapped remove that touches all
    // We'll handle this outside useCrud cleanly:
    closeEdit();
  };

  // Custom mark-all-read since useCrud doesn't expose setItems
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread = notifs.filter(n => !n.read).length;

  const handleCreate = (fields) => {
    const newNotif = { id: notifs.length + 1, ...fields };
    setNotifs(prev => [newNotif, ...prev]);
    closeEdit();
  };

  const handleDelete = (id) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
    closeDelete();
  };

  const handleMarkAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle="Low stock alerts, sales updates, and system messages" />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: notifs.length, sub: 'notifications' },
          { label: 'Unread', value: unread, sub: 'pending review', warn: unread > 0 },
          { label: 'Read', value: notifs.length - unread, sub: 'acknowledged' },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.08} className="p-4">
            <p className="text-xs text-white/35 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.warn ? 'text-amber-400' : 'text-white/85'}`}>{s.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard delay={0.1} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80">All Notifications</h3>
          <div className="flex gap-2">
            {unread > 0 && (
              <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
                <CheckCheck className="w-3.5 h-3.5" />Mark all read
              </Button>
            )}
            <Button size="sm" onClick={openCreate}><Plus className="w-3.5 h-3.5" />Add</Button>
          </div>
        </div>

        <div className="space-y-3">
          {notifs.length === 0 && (
            <p className="text-center text-white/30 py-10 text-sm">No notifications.</p>
          )}
          {notifs.map(n => {
            const Icon = icons[n.type] ?? Info;
            return (
              <div key={n.id} className={`flex gap-4 p-4 rounded-xl transition-colors group ${!n.read ? 'bg-indigo-500/5 border border-indigo-500/10' : 'hover:bg-white/3'}`}>
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${colors[n.type] ?? 'text-white/40'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white/80">{n.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge status={n.type} label={n.type} />
                      {!n.read && (
                        <button
                          onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => { /* set delete target */ handleDelete(n.id); }}
                        className="p-1 rounded hover:bg-rose-500/20 text-white/30 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-white/45 mt-1">{n.message}</p>
                  <p className="text-xs text-white/25 mt-1.5">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <Modal open={!!editTarget} onClose={closeEdit} title="Add Notification" size="sm">
        <NotifForm onSubmit={handleCreate} onCancel={closeEdit} />
      </Modal>
    </div>
  );
}

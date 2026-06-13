import { useState, useCallback } from 'react';

/**
 * Generic CRUD hook.
 * @param {Array} initialData  — seed data
 * @param {Function} makeId    — optional id factory; defaults to incrementing integer
 */
export function useCrud(initialData = [], makeId) {
  const [items, setItems] = useState(initialData);
  const [editTarget, setEditTarget] = useState(null); // null | 'new' | item
  const [deleteTarget, setDeleteTarget] = useState(null); // null | item

  const nextId = useCallback(() => {
    if (makeId) return makeId(items);
    const max = items.reduce((m, i) => Math.max(m, typeof i.id === 'number' ? i.id : 0), 0);
    return max + 1;
  }, [items, makeId]);

  const openCreate = () => setEditTarget({ __new: true });
  const openEdit   = (item) => setEditTarget(item);
  const closeEdit  = () => setEditTarget(null);

  const openDelete  = (item) => setDeleteTarget(item);
  const closeDelete = () => setDeleteTarget(null);

  const create = useCallback((fields) => {
    const newItem = { id: nextId(), ...fields };
    setItems(prev => [newItem, ...prev]);
    setEditTarget(null);
    return newItem;
  }, [nextId]);

  const update = useCallback((id, fields) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...fields } : i));
    setEditTarget(null);
  }, []);

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteTarget(null);
  }, []);

  const isNew = editTarget && editTarget.__new;

  return {
    items,
    editTarget,
    deleteTarget,
    isNew,
    openCreate,
    openEdit,
    closeEdit,
    openDelete,
    closeDelete,
    create,
    update,
    remove,
  };
}

// src/hooks/usePurchases.js
import { useState, useEffect, useCallback } from 'react';
import { purchaseService } from '../services/purchaseService';
import { useAuth } from '../contexts/AuthContext';

export function usePurchases() {
  const { profile } = useAuth();
  const ownerId = profile?.id;

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [poNumber, setPoNumber] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      const data = await purchaseService.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const { supabase } = await import('../utils/supabaseClient');
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, cost, unit, unit_size') // ← added unit_size
        .eq('owner_id', ownerId)
        .order('name');
      if (error) throw new Error(error.message);
      setProducts(data ?? []);
    } catch (err) {
      console.error('Failed to fetch products:', err.message);
    }
  }, [ownerId]);

  useEffect(() => {
    if (ownerId) {
      fetchOrders();
      fetchProducts();
    }
  }, [ownerId, fetchOrders, fetchProducts]);

  const openCreate = async () => {
    const num = await purchaseService.generatePoNumber();
    setPoNumber(num);
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditTarget(row);
    setPoNumber(row.poNumber);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setError(null);
  };

  const createOrder = async (form) => {
    setSubmitting(true);
    setError(null);
    try {
      const created = await purchaseService.create(form, ownerId);
      setOrders((prev) => [created, ...prev]);
      if (form.status === 'received') fetchProducts();
      closeModal();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  const updateOrder = async (id, form) => {
    setSubmitting(true);
    setError(null);
    try {
      const updated = await purchaseService.update(id, form, ownerId);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      if (form.status === 'received') fetchProducts();
      closeModal();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  const deleteOrder = async (id) => {
    setError(null);
    try {
      await purchaseService.remove(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setDeleteTarget(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const openOrders = orders.filter((o) => o.status !== 'received');
  const totalOutstanding = openOrders.reduce((s, o) => s + (o.total ?? 0), 0);
  const receivedCount = orders.filter((o) => o.status === 'received').length;

  return {
    orders,
    products,
    loading,
    error,
    submitting,
    modalOpen,
    editTarget,
    deleteTarget,
    poNumber,
    isNew: !editTarget,
    openCreate,
    openEdit,
    closeModal,
    setDeleteTarget,
    createOrder,
    updateOrder,
    deleteOrder,
    openOrders,
    totalOutstanding,
    receivedCount,
  };
}

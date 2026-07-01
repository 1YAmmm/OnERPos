// src/repositories/purchaseRepository.js
import { supabase } from '../utils/supabaseClient';

export const purchaseRepository = {
  // ── Fetch all POs for the logged-in owner ──
  async getAll() {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // ── Create a new PO ──
  async create(payload) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // ── Update a PO (including status change → triggers stock update) ──
  async update(id, payload) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // ── Delete a PO ──
  async remove(id) {
    const { error } = await supabase
      .from('purchase_orders')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  // ── Fetch today's PO count for PO number generation ──
  async getTodayCount() {
    const today = new Date().toISOString().slice(0, 10);
    const { count, error } = await supabase
      .from('purchase_orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    if (error) throw new Error(error.message);
    return count ?? 0;
  },
};

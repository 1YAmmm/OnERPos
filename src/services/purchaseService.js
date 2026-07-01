// src/services/purchaseService.js
import { purchaseRepository } from '../repositories/purchaseRepository';

// ── PO Number: PO-YYMMDD-001 ──────────────────────────────────────────────────
async function generatePoNumber() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yy}${mm}${dd}`;

  const count = await purchaseRepository.getTodayCount();
  const seq = String(count + 1).padStart(3, '0');
  return `PO-${dateStr}-${seq}`;
}

// ── Map frontend form fields → DB column names ────────────────────────────────
function toDbPayload(form, ownerId) {
  return {
    owner_id: ownerId,
    po_number: form.poNumber,
    supplier: form.supplier,
    product_id:
      form.mode === 'existing' && form.productId ? form.productId : null,
    product_name: form.productName,
    category: form.category,
    quantity: parseInt(form.quantity, 10),
    unit: form.unit,
    description: form.description?.trim() || null, // ← replaced unit_size
    unit_cost: parseFloat(form.unitCost),
    po_date: form.poDate,
    expected_date: form.expectedDate || null,
    status: form.status,
  };
}

// ── Map DB row → frontend shape ───────────────────────────────────────────────
function fromDb(row) {
  return {
    id: row.id,
    poNumber: row.po_number,
    supplier: row.supplier,
    productId: row.product_id,
    productName: row.product_name,
    category: row.category,
    quantity: row.quantity,
    unit: row.unit,
    description: row.description, // ← replaced unit_size
    unitCost: row.unit_cost,
    total: row.total,
    poDate: row.po_date,
    expectedDate: row.expected_date,
    status: row.status,
    receivedAt: row.received_at,
    createdAt: row.created_at,
    mode: row.product_id ? 'existing' : 'new',
  };
}

export const purchaseService = {
  async getAll() {
    const rows = await purchaseRepository.getAll();
    return rows.map(fromDb);
  },

  async generatePoNumber() {
    return generatePoNumber();
  },

  async create(form, ownerId) {
    if (!form.supplier?.trim()) throw new Error('Supplier name is required');
    if (!form.productName?.trim()) throw new Error('Product name is required');
    if (!form.quantity || parseInt(form.quantity) < 1)
      throw new Error('Quantity must be at least 1');
    if (!form.unitCost || parseFloat(form.unitCost) < 0)
      throw new Error('Unit cost is required');

    const payload = toDbPayload(form, ownerId);
    const row = await purchaseRepository.create(payload);
    return fromDb(row);
  },

  async update(id, form, ownerId) {
    if (!form.supplier?.trim()) throw new Error('Supplier name is required');

    const payload = toDbPayload(form, ownerId);
    const row = await purchaseRepository.update(id, payload);
    return fromDb(row);
  },

  async remove(id) {
    return purchaseRepository.remove(id);
  },
};

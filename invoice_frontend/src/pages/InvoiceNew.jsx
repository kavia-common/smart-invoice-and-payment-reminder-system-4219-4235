import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvoiceApi } from '../api/invoiceApi';

export default function InvoiceNew() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    number: '',
    partnerId: '',
    dueDate: '',
    currency: 'USD',
    items: [{ name: '', quantity: 1, price: 0 }],
  });
  const [loading, setLoading] = useState(false);

  const updateItem = (idx, key, val) => {
    setForm((s) => {
      const items = s.items.slice();
      items[idx] = { ...items[idx], [key]: val };
      return { ...s, items };
    });
  };

  const addItem = () => {
    setForm((s) => ({ ...s, items: [...s.items, { name: '', quantity: 1, price: 0 }] }));
  };

  const removeItem = (idx) => {
    setForm((s) => {
      const items = s.items.filter((_, i) => i !== idx);
      return { ...s, items };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        number: form.number,
        partnerId: form.partnerId,
        dueDate: form.dueDate,
        currency: form.currency,
        items: form.items.map((it) => ({
          name: it.name,
          quantity: Number(it.quantity),
          price: Number(it.price),
        })),
      };
      const { data } = await InvoiceApi.create(payload);
      const newId = data?.id;
      window.alert('Invoice created.');
      nav(newId ? `/invoices/${newId}` : '/invoices');
    } catch (e1) {
      window.alert(e1?.response?.data?.message || 'Failed to create invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Invoice</h2>
      <form onSubmit={onSubmit} className="card" style={{ padding: 16, marginTop: 12 }}>
        <div className="helper-row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <input className="input" placeholder="Invoice Number" value={form.number}
                 onChange={(e) => setForm((s) => ({ ...s, number: e.target.value }))} required />
          <input className="input" placeholder="Partner ID" value={form.partnerId}
                 onChange={(e) => setForm((s) => ({ ...s, partnerId: e.target.value }))} required />
          <input className="input" type="date" placeholder="Due Date" value={form.dueDate}
                 onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))} required />
          <input className="input" placeholder="Currency" value={form.currency}
                 onChange={(e) => setForm((s) => ({ ...s, currency: e.target.value }))} />
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Items</div>
          {form.items.map((it, idx) => (
            <div key={idx} className="helper-row" style={{ gap: 8, marginBottom: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input className="input" placeholder="Name" value={it.name}
                     onChange={(e) => updateItem(idx, 'name', e.target.value)} required />
              <input className="input" type="number" min="1" placeholder="Qty" value={it.quantity}
                     onChange={(e) => updateItem(idx, 'quantity', e.target.value)} required />
              <input className="input" type="number" step="0.01" placeholder="Price" value={it.price}
                     onChange={(e) => updateItem(idx, 'price', e.target.value)} required />
              <button type="button" className="btn secondary" onClick={() => removeItem(idx)}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn" onClick={addItem}>Add Item</button>
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Invoice'}</button>
        </div>
      </form>
    </div>
  );
}

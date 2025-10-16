import { useEffect, useState } from 'react';
import { PartnerApi } from '../api/partnerApi';
import Table from '../components/common/Table';

export default function Partners() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ id: null, name: '', email: '', taxId: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await PartnerApi.list();
      setRows(data || []);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to load partners.';
      setErr(msg);
      window.alert(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onEdit = (row) => setForm({ id: row.id, name: row.name, email: row.email, taxId: row.taxId || '' });
  const onCancel = () => setForm({ id: null, name: '', email: '', taxId: '' });

  const onDelete = async (id) => {
    if (!window.confirm('Delete this partner?')) return;
    try {
      await PartnerApi.remove(id);
      window.alert('Deleted.');
      await load();
    } catch (e) {
      window.alert('Delete failed.');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form.id) {
        await PartnerApi.update(form.id, { name: form.name, email: form.email, taxId: form.taxId || undefined });
        window.alert('Updated.');
      } else {
        await PartnerApi.create({ name: form.name, email: form.email, taxId: form.taxId || undefined });
        window.alert('Created.');
      }
      onCancel();
      await load();
    } catch (e) {
      window.alert(e?.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Tax ID', accessor: 'taxId' },
    {
      header: '', accessor: 'actions', cell: (r) => (
        <div className="helper-row" style={{ gap: 8 }}>
          <button className="btn secondary" onClick={() => onEdit(r)}>Edit</button>
          <button className="btn" onClick={() => onDelete(r.id)}>Delete</button>
        </div>
      )
    },
  ];

  return (
    <div>
      <h2>Partners</h2>

      <form onSubmit={onSubmit} className="card" style={{ padding: 16, marginTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>{form.id ? 'Edit Partner' : 'Add Partner'}</div>
        <div className="helper-row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
          <input className="input" placeholder="Tax ID" value={form.taxId} onChange={(e) => setForm((s) => ({ ...s, taxId: e.target.value }))} />
          <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : (form.id ? 'Update' : 'Create')}</button>
          {form.id && <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>

      <div style={{ marginTop: 16 }}>
        <Table columns={columns} data={rows} />
        {loading && <div>Loading...</div>}
        {err && <div className="text-muted" style={{ color: 'var(--error)' }}>{err}</div>}
      </div>
    </div>
  );
}

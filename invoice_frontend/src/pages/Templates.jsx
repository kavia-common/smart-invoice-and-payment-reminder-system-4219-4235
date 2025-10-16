import { useEffect, useState } from 'react';
import Table from '../components/common/Table';
import { TemplateApi } from '../api/templateApi';

export default function Templates() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ id: null, name: '', body: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await TemplateApi.list();
      setRows(data || []);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to load templates.';
      setErr(msg);
      window.alert(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onEdit = (row) => setForm({ id: row.id, name: row.name, body: row.body || '' });
  const onCancel = () => setForm({ id: null, name: '', body: '' });

  const onDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await TemplateApi.remove(id);
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
        await TemplateApi.update(form.id, { name: form.name, body: form.body });
        window.alert('Updated.');
      } else {
        await TemplateApi.create({ name: form.name, body: form.body });
        window.alert('Created.');
      }
      onCancel();
      await load();
    } catch (e1) {
      window.alert(e1?.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Preview', accessor: 'preview', cell: (r) => <span className="text-muted">{(r.body || '').slice(0, 40)}...</span> },
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
      <h2>Templates</h2>

      <form onSubmit={onSubmit} className="card" style={{ padding: 16, marginTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>{form.id ? 'Edit Template' : 'Add Template'}</div>
        <div className="helper-row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
          <textarea className="input" placeholder="Template body" value={form.body} onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))} rows={4} style={{ width: '100%' }} />
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

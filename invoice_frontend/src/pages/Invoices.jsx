import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import { InvoiceApi } from '../api/invoiceApi';

export default function Invoices() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState({ status: 'ALL', q: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const params = {};
      if (query.q) params.q = query.q;
      if (query.status && query.status !== 'ALL') params.status = query.status;
      const { data } = await InvoiceApi.list(params);
      setRows(data || []);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to load invoices.';
      setErr(msg);
      window.alert(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.status]);

  const columns = useMemo(() => ([
    { header: 'Invoice #', accessor: 'number', cell: (r) => r.number || r.no },
    { header: 'Partner', accessor: 'partnerName', cell: (r) => r.partnerName || r.partner?.name },
    { header: 'Amount', accessor: 'total', cell: (r) => formatCurrency(r.total || r.amount) },
    {
      header: 'Status', accessor: 'status',
      cell: (r) => (
        <Badge color={r.status === 'PAID' || r.status === 'Paid' ? 'success' : r.status === 'OVERDUE' || r.status === 'Overdue' ? 'error' : 'secondary'}>
          {r.status}
        </Badge>
      )
    },
    { header: '', accessor: 'actions', cell: (r) => <Link to={`/invoices/${r.id}`}>View</Link> },
  ]), []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, gap: 10, flexWrap: 'wrap' }}>
        <h2>Invoices</h2>
        <div className="helper-row" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <input className="input" placeholder="Search..." value={query.q}
                 onChange={(e) => setQuery((s) => ({ ...s, q: e.target.value }))} />
          <select className="input" value={query.status} onChange={(e) => setQuery((s) => ({ ...s, status: e.target.value }))}>
            <option value="ALL">All</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          <button className="btn" onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Apply'}</button>
          <button className="btn" onClick={() => nav('/invoices/new')}>New Invoice</button>
        </div>
      </div>

      <Table columns={columns} data={rows} />
      {err && <div className="text-muted" style={{ marginTop: 10, color: 'var(--error)' }}>{err}</div>}
      {rows?.length === 0 && !loading && <div className="text-muted" style={{ marginTop: 10 }}>No invoices found.</div>}
    </div>
  );
}

function formatCurrency(v) {
  if (v == null) return '-';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(v));
  } catch {
    return String(v);
  }
}

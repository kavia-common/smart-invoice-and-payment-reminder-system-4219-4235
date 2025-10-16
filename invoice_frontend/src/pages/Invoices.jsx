import { Link, useNavigate } from 'react-router-dom';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';

const columns = [
  { header: 'Invoice #', accessor: 'no' },
  { header: 'Partner', accessor: 'partner' },
  { header: 'Amount', accessor: 'amount' },
  { header: 'Status', accessor: 'status', cell: (r) => <Badge color={r.status === 'Paid' ? 'success' : r.status === 'Overdue' ? 'error' : 'secondary'}>{r.status}</Badge> },
  { header: '', accessor: 'actions', cell: (r) => <Link to={`/invoices/${r.id}`}>View</Link> },
];

const data = [
  { id: 1, no: 'INV-1001', partner: 'Acme Inc.', amount: '$1,200', status: 'Paid' },
  { id: 2, no: 'INV-1002', partner: 'Globex', amount: '$980', status: 'Overdue' },
];

export default function Invoices() {
  const nav = useNavigate();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Invoices</h2>
        <button className="btn" onClick={() => nav('/invoices/new')}>New Invoice</button>
      </div>
      <Table columns={columns} data={data} />
      <p className="text-muted" style={{ marginTop: 10 }}>TODO: Load data from backend.</p>
    </div>
  );
}

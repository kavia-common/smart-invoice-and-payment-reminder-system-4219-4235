import { useParams } from 'react-router-dom';

export default function InvoiceDetail() {
  const { id } = useParams();
  return (
    <div>
      <h2>Invoice Detail</h2>
      <p>Invoice ID: <strong>{id}</strong></p>
      <p className="text-muted">TODO: Fetch invoice details from backend.</p>
    </div>
  );
}

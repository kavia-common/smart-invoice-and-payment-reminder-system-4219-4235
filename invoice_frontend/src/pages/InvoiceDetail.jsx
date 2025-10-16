import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InvoiceApi } from '../api/invoiceApi';
import FileUploader from '../components/common/FileUploader';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('');
  const [addingPayment, setAddingPayment] = useState(false);
  const [payment, setPayment] = useState({ amount: '', date: '', note: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: inv }, { data: atts }] = await Promise.all([
        InvoiceApi.get(id),
        InvoiceApi.listAttachments(id),
      ]);
      setInvoice(inv);
      setAttachments(atts || []);
    } catch (e) {
      window.alert(e?.response?.data?.message || 'Failed to load invoice.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onDownloadPdf = async () => {
    try {
      const { data, headers } = await InvoiceApi.pdf(id);
      const blob = new Blob([data], { type: headers['content-type'] || 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      // trigger download as well
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice?.number || 'invoice'}.pdf`;
      a.click();
    } catch (e) {
      window.alert('Failed to download PDF.');
    }
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await InvoiceApi.uploadAttachment(id, file);
      window.alert('Attachment uploaded.');
      await load();
    } catch (er) {
      window.alert(er?.response?.data?.message || 'Upload failed.');
    }
  };

  const onDownloadAttachment = async (attId, filename = 'attachment') => {
    try {
      const { data, headers } = await InvoiceApi.downloadAttachment(id, attId);
      const blob = new Blob([data], { type: headers['content-type'] || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      window.alert('Download failed.');
    }
  };

  const onRemoveAttachment = async (attId) => {
    if (!window.confirm('Remove this attachment?')) return;
    try {
      await InvoiceApi.removeAttachment(id, attId);
      window.alert('Removed.');
      await load();
    } catch (e) {
      window.alert('Removal failed.');
    }
  };

  const onAddPayment = async (e) => {
    e.preventDefault();
    setAddingPayment(true);
    try {
      await InvoiceApi.addPayment(id, {
        amount: Number(payment.amount),
        date: payment.date,
        note: payment.note || undefined,
      });
      window.alert('Payment recorded.');
      setPayment({ amount: '', date: '', note: '' });
      await load();
    } catch (e1) {
      window.alert(e1?.response?.data?.message || 'Failed to add payment.');
    } finally {
      setAddingPayment(false);
    }
  };

  const onSendReminder = async (channel, test = true) => {
    try {
      await InvoiceApi.sendReminder(id, channel, test);
      window.alert(`Reminder ${test ? '(test) ' : ''}sent via ${channel}.`);
    } catch (e) {
      window.alert(e?.response?.data?.message || 'Failed to send reminder.');
    }
  };

  if (loading) return <div>Loading invoice...</div>;
  if (!invoice) return <div>Invoice not found.</div>;

  const items = invoice.items || [];
  const payments = invoice.payments || [];
  const columnsItems = [
    { header: 'Item', accessor: 'name' },
    { header: 'Qty', accessor: 'quantity' },
    { header: 'Price', accessor: 'price' },
    { header: 'Total', accessor: 'total' },
  ];
  const columnsPayments = [
    { header: 'Date', accessor: 'date' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Note', accessor: 'note' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <h2>Invoice {invoice.number || invoice.no}</h2>
        <div className="helper-row">
          <button className="btn" onClick={onDownloadPdf}>Download PDF</button>
          <button className="btn secondary" onClick={() => onSendReminder('EMAIL', true)}>Test Email</button>
          <button className="btn secondary" onClick={() => onSendReminder('SMS', true)}>Test SMS</button>
          <button className="btn secondary" onClick={() => onSendReminder('WHATSAPP', true)}>Test WhatsApp</button>
        </div>
      </div>

      <div style={{ marginTop: 6, marginBottom: 16 }}>
        <Badge color={invoice.status === 'PAID' ? 'success' : invoice.status === 'OVERDUE' ? 'error' : 'secondary'}>
          {invoice.status}
        </Badge>
        <span style={{ marginLeft: 12 }} className="text-muted">
          Partner: <strong>{invoice.partnerName || invoice.partner?.name}</strong>
        </span>
      </div>

      <div className="helper-row" style={{ alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 320 }} className="card">
          <div className="card-header">Items</div>
          <div className="card-body">
            <Table columns={columnsItems} data={items} />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 280 }} className="card">
          <div className="card-header">Payments</div>
          <div className="card-body">
            <Table columns={columnsPayments} data={payments} />
            <form onSubmit={onAddPayment} className="helper-row" style={{ marginTop: 12, flexDirection: 'column', gap: 8 }}>
              <input className="input" type="number" step="0.01" placeholder="Amount"
                     value={payment.amount} onChange={(e) => setPayment((s) => ({ ...s, amount: e.target.value }))} required />
              <input className="input" type="date" placeholder="Date"
                     value={payment.date} onChange={(e) => setPayment((s) => ({ ...s, date: e.target.value }))} required />
              <input className="input" type="text" placeholder="Note (optional)"
                     value={payment.note} onChange={(e) => setPayment((s) => ({ ...s, note: e.target.value }))} />
              <button className="btn" type="submit" disabled={addingPayment}>
                {addingPayment ? 'Adding...' : 'Add Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">Attachments</div>
        <div className="card-body">
          <FileUploader onChange={onUpload} accept="*/*" />
          <div style={{ marginTop: 12 }}>
            {attachments?.length ? attachments.map((att) => (
              <div key={att.id} className="helper-row" style={{ justifyContent: 'space-between' }}>
                <div>{att.filename || att.name}</div>
                <div className="helper-row">
                  <button className="btn secondary" onClick={() => onDownloadAttachment(att.id, att.filename || 'file')}>Download</button>
                  <button className="btn" onClick={() => onRemoveAttachment(att.id)}>Remove</button>
                </div>
              </div>
            )) : <div className="text-muted">No attachments.</div>}
          </div>
        </div>
      </div>

      {pdfUrl && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header">PDF Preview</div>
          <div className="card-body">
            <iframe title="Invoice PDF" src={pdfUrl} style={{ width: '100%', height: 600, border: 'none' }} />
          </div>
        </div>
      )}
    </div>
  );
}

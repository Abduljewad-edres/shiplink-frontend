import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ shipmentId: '', amount: '', method: 'Cash', reference: '', notes: '' });
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/payments'),
      api.get('/admin/shipments?paymentStatus=Unpaid&limit=50'),
    ])
      .then(([p, s]) => {
        setPayments(p.data);
        setShipments(s.data.shipments);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load payments'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const handleRecord = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/admin/payments', { ...form, amount: Number(form.amount) });
      setForm({ shipmentId: '', amount: '', method: 'Cash', reference: '', notes: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to record payment');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Payments</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Record Payment
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>Record Payment</h2>
          {formError && <div className="alert error">{formError}</div>}
          <form onSubmit={handleRecord}>
            <label>Shipment (unpaid)</label>
            <select required value={form.shipmentId} onChange={set('shipmentId')}>
              <option value="">— Select shipment —</option>
              {shipments.map((s) => (
                <option key={s._id} value={s._id}>{s.trackingNumber} — {s.deliveryFee} {s.currency}</option>
              ))}
            </select>
            <div className="form-row">
              <div><label>Amount</label><input type="number" required min="1" value={form.amount} onChange={set('amount')} /></div>
              <div>
                <label>Method</label>
                <select value={form.method} onChange={set('method')}>
                  {['Cash', 'Bank Transfer', 'Mobile Money', 'Other'].map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <label>Reference</label>
            <input value={form.reference} onChange={set('reference')} placeholder="Receipt / Tx ref" />
            <label>Notes</label>
            <input value={form.notes} onChange={set('notes')} />
            <div className="form-actions">
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Record</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Tracking #</th><th>Business</th><th>Amount</th><th>Method</th><th>Reference</th><th>By</th><th>Date</th></tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>No payments recorded yet</td></tr>
              ) : payments.map((p) => (
                <tr key={p._id}>
                  <td className="mono">{p.shipment?.trackingNumber}</td>
                  <td>{p.business?.businessName}</td>
                  <td>{p.amount} {p.currency}</td>
                  <td>{p.method}</td>
                  <td>{p.reference || '—'}</td>
                  <td>{p.recordedBy?.name}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;

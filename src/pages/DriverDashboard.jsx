import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Truck, CheckCircle, XCircle } from 'lucide-react';

const TRANSITIONS = {
  'Created': ['Picked Up'],
  'Picked Up': ['In Transit'],
  'In Transit': ['Out for Delivery'],
  'Out for Delivery': ['Delivered', 'Failed'],
};

const STATUS_COLORS = {
  Created: 'blue', 'Picked Up': 'yellow', 'In Transit': 'orange',
  'Out for Delivery': 'purple', Delivered: 'green', Failed: 'red',
};

const DriverDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selected, setSelected] = useState(null);
  const [updateNote, setUpdateNote] = useState('');
  const [proofForm, setProofForm] = useState({ receivedBy: '', notes: '' });

  const load = () => {
    setLoading(true);
    api.get('/driver/assignments')
      .then(({ data }) => setAssignments(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load assignments'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (assignmentId, status) => {
    setError(''); setSuccess('');
    try {
      await api.patch(`/driver/assignments/${assignmentId}/status`, { status, note: updateNote });
      setSuccess(`Status updated to "${status}"`);
      setUpdateNote('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const submitProof = async (assignmentId) => {
    setError(''); setSuccess('');
    try {
      await api.post(`/driver/assignments/${assignmentId}/proof`, proofForm);
      setSuccess('Proof of delivery submitted');
      setProofForm({ receivedBy: '', notes: '' });
      setSelected(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proof');
    }
  };

  if (loading) return <div className="page"><p className="loading-text">Loading your deliveries...</p></div>;

  const active = assignments.filter((a) => a.status !== 'Completed' && a.status !== 'Cancelled');
  const completed = assignments.filter((a) => a.status === 'Completed');

  return (
    <div className="page">
      <h1>My Deliveries</h1>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <h2>Active ({active.length})</h2>

      {active.length === 0 ? (
        <div className="empty-state"><Truck size={40} /><p>No active assignments right now</p></div>
      ) : (
        active.map((a) => {
          const shipment = a.shipment;
          const next = TRANSITIONS[shipment?.status] || [];
          const isSelected = selected === a._id;

          return (
            <div key={a._id} className="driver-card">
              <div className="driver-card-header">
                <div>
                  <p className="mono">{shipment?.trackingNumber}</p>
                  <p style={{ fontWeight: 500 }}>{shipment?.recipient?.name}</p>
                  <p className="muted">{shipment?.delivery?.address}, {shipment?.delivery?.city}</p>
                  <p className="muted" style={{ marginTop: 4 }}>
                    Vehicle: {a.vehicle?.registrationNumber} ({a.vehicle?.type})
                  </p>
                </div>
                <span className={`badge badge-${STATUS_COLORS[shipment?.status] || 'blue'}`}>
                  {shipment?.status}
                </span>
              </div>

              {next.length > 0 && (
                <div className="driver-actions">
                  <input
                    placeholder="Add a note (optional)"
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                  />
                  <div className="btn-group">
                    {next.map((n) => (
                      <button
                        key={n}
                        className={`btn-primary small${n === 'Failed' ? ' btn-danger' : ''}`}
                        onClick={() => updateStatus(a._id, n)}
                      >
                        {n === 'Delivered' && <CheckCircle size={14} />}
                        {n === 'Failed' && <XCircle size={14} />}
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {shipment?.status === 'Delivered' && (
                <div className="proof-form">
                  <button className="btn-ghost small" onClick={() => setSelected(isSelected ? null : a._id)}>
                    {isSelected ? 'Cancel' : 'Submit Proof of Delivery'}
                  </button>
                  {isSelected && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                      <label>Received by *</label>
                      <input
                        required
                        placeholder="Name of person who received"
                        value={proofForm.receivedBy}
                        onChange={(e) => setProofForm({ ...proofForm, receivedBy: e.target.value })}
                      />
                      <label>Notes</label>
                      <input
                        value={proofForm.notes}
                        onChange={(e) => setProofForm({ ...proofForm, notes: e.target.value })}
                      />
                      <button
                        className="btn-primary small"
                        style={{ marginTop: 4, alignSelf: 'flex-start' }}
                        onClick={() => submitProof(a._id)}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {completed.length > 0 && (
        <>
          <h2 style={{ marginTop: 8 }}>Completed ({completed.length})</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Tracking #</th><th>Recipient</th><th>City</th><th>Date</th></tr>
              </thead>
              <tbody>
                {completed.map((a) => (
                  <tr key={a._id}>
                    <td className="mono">{a.shipment?.trackingNumber}</td>
                    <td>{a.shipment?.recipient?.name}</td>
                    <td>{a.shipment?.delivery?.city}</td>
                    <td>{new Date(a.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default DriverDashboard;

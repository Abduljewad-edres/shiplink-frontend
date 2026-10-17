import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const STATUSES = ['', 'Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed'];
const STATUS_COLORS = { Created: 'blue', 'Picked Up': 'yellow', 'In Transit': 'orange', 'Out for Delivery': 'purple', Delivered: 'green', Failed: 'red' };

const AdminShipments = () => {
  const [data, setData] = useState({ shipments: [], total: 0, pages: 1 });
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.append('status', statusFilter);
    api.get(`/admin/shipments?${params}`)
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load shipments'))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/shipments/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>All Shipments</h1>
        <div className="filter-row">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            {STATUSES.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : data.shipments.length === 0 ? (
        <p className="loading-text">No shipments found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tracking #</th><th>Business</th><th>Recipient</th>
                <th>City</th><th>Fee</th><th>Status</th><th>Payment</th><th>Update</th>
              </tr>
            </thead>
            <tbody>
              {data.shipments.map((s) => (
                <tr key={s._id}>
                  <td className="mono">{s.trackingNumber}</td>
                  <td>{s.business?.businessName || '—'}</td>
                  <td>{s.recipient?.name}</td>
                  <td>{s.delivery?.city}</td>
                  <td>{s.deliveryFee} {s.currency}</td>
                  <td><span className={`badge badge-${STATUS_COLORS[s.status] || 'blue'}`}>{s.status}</span></td>
                  <td>
                    <span className={`badge ${s.paymentStatus === 'Paid' ? 'badge-green' : s.paymentStatus === 'Partial' ? 'badge-yellow' : 'badge-red'}`}>
                      {s.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <select value={s.status} onChange={(e) => updateStatus(s._id, e.target.value)}>
                      {STATUSES.filter(Boolean).map((st) => <option key={st}>{st}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-ghost">Prev</button>
        <span>Page {page} of {data.pages}</span>
        <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="btn-ghost">Next</button>
      </div>
    </div>
  );
};

export default AdminShipments;

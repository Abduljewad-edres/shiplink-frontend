import { useEffect, useState } from 'react';
import api from '../api/axios';
import { CheckCircle, XCircle, PauseCircle, RefreshCw } from 'lucide-react';

const STATUS_BADGE = { active: 'badge-green', pending: 'badge-yellow', rejected: 'badge-red', suspended: 'badge-orange' };

const AdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/admin/businesses')
      .then(({ data }) => setBusinesses(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load businesses'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/businesses/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="page">
      <h1>Business Accounts</h1>
      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Business</th><th>Contact</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {businesses.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>No businesses registered yet</td></tr>
              ) : businesses.map((b) => (
                <tr key={b._id}>
                  <td>{b.businessName}</td>
                  <td>{b.user?.name}</td>
                  <td>{b.user?.email}</td>
                  <td>{b.phone || '—'}</td>
                  <td><span className={`badge ${STATUS_BADGE[b.status] || 'badge-yellow'}`}>{b.status}</span></td>
                  <td className="action-row">
                    {b.status !== 'active' && (
                      <button className="icon-btn green" title="Approve" onClick={() => setStatus(b._id, 'active')}>
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {b.status !== 'rejected' && (
                      <button className="icon-btn red" title="Reject" onClick={() => setStatus(b._id, 'rejected')}>
                        <XCircle size={16} />
                      </button>
                    )}
                    {b.status === 'active' && (
                      <button className="icon-btn orange" title="Suspend" onClick={() => setStatus(b._id, 'suspended')}>
                        <PauseCircle size={16} />
                      </button>
                    )}
                    {b.status === 'suspended' && (
                      <button className="icon-btn blue" title="Reactivate" onClick={() => setStatus(b._id, 'active')}>
                        <RefreshCw size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBusinesses;

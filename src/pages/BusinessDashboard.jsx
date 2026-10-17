import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Package, Plus, DollarSign, Truck } from 'lucide-react';

const STATUS_COLORS = { Created: 'blue', 'Picked Up': 'yellow', 'In Transit': 'orange', 'Out for Delivery': 'purple', Delivered: 'green', Failed: 'red' };

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ shipments: [], total: 0 });

  useEffect(() => {
    api.get('/shipments?limit=5').then(({ data }) => setData(data));
  }, []);

  const delivered = data.shipments.filter((s) => s.status === 'Delivered').length;
  const inTransit = data.shipments.filter((s) => s.status === 'In Transit').length;

  if (!user.isApproved) {
    return (
      <div className="page">
        <h1>Dashboard</h1>
        <div className="alert warning">
          Your account is pending admin approval. You'll be able to create shipments once approved.
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Welcome, {user.name}</p>
        </div>
        <Link to="/shipments/create" className="btn-primary"><Plus size={16} /> New Shipment</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><Package size={22} /></div>
          <div><p className="stat-label">Total Shipments</p><p className="stat-value">{data.total}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f0fdf4', color: '#22c55e' }}><Package size={22} /></div>
          <div><p className="stat-label">Delivered</p><p className="stat-value">{delivered}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff7ed', color: '#f59e0b' }}><Truck size={22} /></div>
          <div><p className="stat-label">In Transit</p><p className="stat-value">{inTransit}</p></div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Recent Shipments</h2>
          <Link to="/my-shipments" className="link">View all</Link>
        </div>
        {data.shipments.length === 0 ? (
          <div className="empty-state"><Package size={40} /><p>No shipments yet</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Tracking #</th><th>Recipient</th><th>City</th><th>Status</th><th>Fee</th><th></th></tr></thead>
              <tbody>
                {data.shipments.map((s) => (
                  <tr key={s._id}>
                    <td className="mono">{s.trackingNumber}</td>
                    <td>{s.recipient.name}</td>
                    <td>{s.delivery.city}</td>
                    <td><span className={`badge badge-${STATUS_COLORS[s.status]}`}>{s.status}</span></td>
                    <td>{s.deliveryFee} {s.currency}</td>
                    <td><Link to={`/shipments/${s._id}`} className="link">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const STATUSES = ['', 'Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed'];
const STATUS_COLORS = { Created: 'blue', 'Picked Up': 'yellow', 'In Transit': 'orange', 'Out for Delivery': 'purple', Delivered: 'green', Failed: 'red' };

const MyShipments = () => {
  const [data, setData] = useState({ shipments: [], total: 0, pages: 1 });
  const [filter, setFilter] = useState({ status: '', page: 1 });

  useEffect(() => {
    const params = new URLSearchParams({ page: filter.page, limit: 20 });
    if (filter.status) params.append('status', filter.status);
    api.get(`/shipments?${params}`).then(({ data }) => setData(data));
  }, [filter]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Shipments</h1>
        <div className="filter-row">
          <select value={filter.status} onChange={(e) => setFilter({ status: e.target.value, page: 1 })}>
            {STATUSES.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
          </select>
          <Link to="/shipments/create" className="btn-primary">+ New</Link>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Tracking #</th><th>Recipient</th><th>Pickup</th><th>Delivery</th><th>Fee</th><th>Status</th><th>Payment</th><th></th></tr></thead>
          <tbody>
            {data.shipments.map((s) => (
              <tr key={s._id}>
                <td className="mono">{s.trackingNumber}</td>
                <td>{s.recipient.name}</td>
                <td>{s.pickup.city}</td>
                <td>{s.delivery.city}</td>
                <td>{s.deliveryFee} {s.currency}</td>
                <td><span className={`badge badge-${STATUS_COLORS[s.status]}`}>{s.status}</span></td>
                <td><span className={`badge ${s.paymentStatus === 'Paid' ? 'badge-green' : s.paymentStatus === 'Partial' ? 'badge-yellow' : 'badge-red'}`}>{s.paymentStatus}</span></td>
                <td><Link to={`/shipments/${s._id}`} className="link">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button disabled={filter.page <= 1} className="btn-ghost" onClick={() => setFilter({ ...filter, page: filter.page - 1 })}>Prev</button>
        <span>Page {filter.page} of {data.pages}</span>
        <button disabled={filter.page >= data.pages} className="btn-ghost" onClick={() => setFilter({ ...filter, page: filter.page + 1 })}>Next</button>
      </div>
    </div>
  );
};

export default MyShipments;

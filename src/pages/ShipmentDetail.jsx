import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, Circle } from 'lucide-react';

const ALL_STATUSES = ['Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

const ShipmentDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/shipments/${id}`)
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || 'Not found'));
  }, [id]);

  if (error) return <div className="page"><div className="alert error">{error}</div></div>;
  if (!data) return <div className="page"><p className="loading-text">Loading...</p></div>;

  const { shipment, events, payments, balance } = data;
  const currentIndex = ALL_STATUSES.indexOf(shipment.status);
  const paid = payments?.reduce((s, p) => s + p.amount, 0) || 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Shipment Details</h1>
          <p className="mono tracking-num">{shipment.trackingNumber}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className={`badge badge-${shipment.paymentStatus === 'Paid' ? 'green' : shipment.paymentStatus === 'Partial' ? 'yellow' : 'red'}`}>
            {shipment.paymentStatus}
          </span>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Sender</h3>
          <p>{shipment.sender.name}</p>
          <p className="muted">{shipment.sender.phone}</p>
          <p className="muted">{shipment.pickup.address}, {shipment.pickup.city}</p>
        </div>
        <div className="detail-card">
          <h3>Recipient</h3>
          <p>{shipment.recipient.name}</p>
          <p className="muted">{shipment.recipient.phone}</p>
          <p className="muted">{shipment.delivery.address}, {shipment.delivery.city}</p>
        </div>
        <div className="detail-card">
          <h3>Parcel</h3>
          <p>{shipment.parcel?.description || '—'}</p>
          <p className="muted">{shipment.parcel?.weightKg ? `${shipment.parcel.weightKg} kg` : ''}</p>
        </div>
        <div className="detail-card">
          <h3>Payment</h3>
          <p>{shipment.deliveryFee} {shipment.currency}</p>
          <p className="muted">Paid: {paid} {shipment.currency}</p>
          <p className="muted">Balance: {balance} {shipment.currency}</p>
        </div>
      </div>

      <div className="timeline-card">
        <h2>Status</h2>
        <div className="timeline">
          {ALL_STATUSES.map((status, i) => (
            <div key={status} className={`timeline-step ${i <= currentIndex ? 'done' : ''}`}>
              {i <= currentIndex ? <CheckCircle size={20} /> : <Circle size={20} />}
              <span>{status}</span>
            </div>
          ))}
        </div>
        {shipment.status === 'Failed' && <p className="alert error" style={{ marginTop: 12 }}>Delivery failed — see history below</p>}
      </div>

      <div className="events-card">
        <h2>History</h2>
        {events.map((ev) => (
          <div key={ev._id} className="event-item">
            <span className="event-status">{ev.status}</span>
            {ev.note && <span className="event-note">{ev.note}</span>}
            <span className="muted">{new Date(ev.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentDetail;

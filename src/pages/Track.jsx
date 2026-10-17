import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, Circle, Search } from 'lucide-react';

const ALL_STATUSES = ['Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

const Track = () => {
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('tn') || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError(''); setResult(null); setLoading(true);
    try {
      const { data } = await api.get(`/shipments/track/${trackingNumber.trim()}`);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Shipment not found');
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = result ? ALL_STATUSES.indexOf(result.shipment.status) : -1;

  return (
    <div className="page centered">
      <h1>Track Shipment</h1>
      <p className="muted">Enter your tracking number below</p>

      <form onSubmit={handleTrack} className="track-form">
        <input
          placeholder="e.g. SL-20261016-A3F2B1"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          <Search size={16} /> {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && <div className="alert error">{error}</div>}

      {result && (
        <div className="track-result">
          <div className="detail-grid">
            <div className="detail-card">
              <h3>Sender</h3>
              <p>{result.shipment.sender.name}</p>
              <p className="muted">{result.shipment.pickup.city}</p>
            </div>
            <div className="detail-card">
              <h3>Recipient</h3>
              <p>{result.shipment.recipient.name}</p>
              <p className="muted">{result.shipment.delivery.city}</p>
            </div>
            <div className="detail-card">
              <h3>Parcel</h3>
              <p>{result.shipment.parcel?.description || '—'}</p>
              <p className="muted">{result.shipment.parcel?.weightKg ? `${result.shipment.parcel.weightKg} kg` : ''}</p>
            </div>
            <div className="detail-card">
              <h3>Status</h3>
              <p>{result.shipment.status}</p>
              <p className="muted">{new Date(result.shipment.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="timeline-card">
            <div className="timeline">
              {ALL_STATUSES.map((status, i) => (
                <div key={status} className={`timeline-step ${i <= currentIndex ? 'done' : ''}`}>
                  {i <= currentIndex ? <CheckCircle size={20} /> : <Circle size={20} />}
                  <span>{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="events-card">
            <h2>History</h2>
            {result.events.map((ev) => (
              <div key={ev._id} className="event-item">
                <span className="event-status">{ev.status}</span>
                {ev.note && <span className="event-note">{ev.note}</span>}
                <span className="muted">{new Date(ev.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Track;

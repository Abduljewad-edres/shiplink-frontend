import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateShipment = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sender: { name: '', phone: '' },
    recipient: { name: '', phone: '' },
    pickup: { city: '', address: '' },
    delivery: { city: '', address: '' },
    parcel: { description: '', weightKg: '' },
    deliveryFee: '',
    currency: 'ETB',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (section, field) => (e) =>
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [field]: e.target.value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        deliveryFee: Number(form.deliveryFee),
        parcel: { ...form.parcel, weightKg: form.parcel.weightKg ? Number(form.parcel.weightKg) : undefined },
      };
      const { data } = await api.post('/shipments', payload);
      navigate(`/shipments/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Create Shipment</h1>
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-card">

        <h2>Sender</h2>
        <div className="form-row">
          <div><label>Name</label><input required value={form.sender.name} onChange={set('sender', 'name')} /></div>
          <div><label>Phone</label><input value={form.sender.phone} onChange={set('sender', 'phone')} placeholder="+251..." /></div>
        </div>

        <h2>Recipient</h2>
        <div className="form-row">
          <div><label>Name</label><input required value={form.recipient.name} onChange={set('recipient', 'name')} /></div>
          <div><label>Phone</label><input value={form.recipient.phone} onChange={set('recipient', 'phone')} placeholder="+251..." /></div>
        </div>

        <h2>Pickup Location</h2>
        <div className="form-row">
          <div><label>City</label><input required value={form.pickup.city} onChange={set('pickup', 'city')} /></div>
          <div><label>Address</label><input required value={form.pickup.address} onChange={set('pickup', 'address')} /></div>
        </div>

        <h2>Delivery Location</h2>
        <div className="form-row">
          <div><label>City</label><input required value={form.delivery.city} onChange={set('delivery', 'city')} /></div>
          <div><label>Address</label><input required value={form.delivery.address} onChange={set('delivery', 'address')} /></div>
        </div>

        <h2>Parcel</h2>
        <div className="form-row">
          <div><label>Description</label><input value={form.parcel.description} onChange={set('parcel', 'description')} /></div>
          <div><label>Weight (kg)</label><input type="number" min="0" step="0.1" value={form.parcel.weightKg} onChange={set('parcel', 'weightKg')} /></div>
        </div>

        <h2>Delivery Fee</h2>
        <div className="form-row">
          <div><label>Fee</label><input type="number" required min="0" value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })} /></div>
          <div>
            <label>Currency</label>
            <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option>ETB</option><option>USD</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Shipment'}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateShipment;

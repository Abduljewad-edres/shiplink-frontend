import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ registrationNumber: '', type: 'Van', make: '', model: '' });
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/admin/vehicles')
      .then(({ data }) => setVehicles(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load vehicles'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/admin/vehicles', form);
      setForm({ registrationNumber: '', type: 'Van', make: '', model: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add vehicle');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Fleet</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>New Vehicle</h2>
          {formError && <div className="alert error">{formError}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <div><label>Registration #</label><input required value={form.registrationNumber} onChange={set('registrationNumber')} /></div>
              <div>
                <label>Type</label>
                <select value={form.type} onChange={set('type')}>
                  {['Motorcycle', 'Car', 'Van', 'Truck'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div><label>Make</label><input value={form.make} onChange={set('make')} /></div>
              <div><label>Model</label><input value={form.model} onChange={set('model')} /></div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Add Vehicle</button>
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
              <tr><th>Registration #</th><th>Type</th><th>Make / Model</th><th>Available</th></tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>No vehicles yet</td></tr>
              ) : vehicles.map((v) => (
                <tr key={v._id}>
                  <td className="mono">{v.registrationNumber}</td>
                  <td>{v.type}</td>
                  <td>{[v.make, v.model].filter(Boolean).join(' ') || '—'}</td>
                  <td><span className={`badge ${v.isAvailable ? 'badge-green' : 'badge-orange'}`}>{v.isAvailable ? 'Yes' : 'Assigned'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminVehicles;

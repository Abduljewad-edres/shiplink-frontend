import { useEffect, useState } from 'react';
import api from '../api/axios';
import { UserPlus } from 'lucide-react';

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', licenseNumber: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/admin/drivers')
      .then(({ data }) => setDrivers(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load drivers'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await api.post('/admin/drivers', form);
      setForm({ name: '', email: '', password: '', phone: '', licenseNumber: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create driver');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Drivers</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <UserPlus size={16} /> Add Driver
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>New Driver</h2>
          {formError && <div className="alert error">{formError}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <div><label>Full Name</label><input required value={form.name} onChange={set('name')} /></div>
              <div><label>Email</label><input type="email" required value={form.email} onChange={set('email')} /></div>
            </div>
            <div className="form-row">
              <div><label>Password</label><input type="password" required minLength={6} value={form.password} onChange={set('password')} /></div>
              <div><label>Phone</label><input required value={form.phone} onChange={set('phone')} /></div>
            </div>
            <div className="form-row">
              <div><label>License Number</label><input required value={form.licenseNumber} onChange={set('licenseNumber')} /></div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Driver'}</button>
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
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>License</th><th>Status</th></tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>No drivers yet</td></tr>
              ) : drivers.map((d) => (
                <tr key={d._id}>
                  <td>{d.user?.name || '—'}</td>
                  <td>{d.user?.email || '—'}</td>
                  <td>{d.phone}</td>
                  <td className="mono">{d.licenseNumber}</td>
                  <td><span className={`badge ${d.isActive ? 'badge-green' : 'badge-red'}`}>{d.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDrivers;

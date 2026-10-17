import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link2 } from 'lucide-react';

const AdminAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ shipmentId: '', driverId: '', vehicleId: '', notes: '' });
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/assignments'),
      api.get('/admin/drivers'),
      api.get('/admin/vehicles'),
      api.get('/admin/unassigned-shipments'),
    ])
      .then(([a, d, v, s]) => {
        setAssignments(a.data);
        setDrivers(d.data);
        setVehicles(v.data.filter((veh) => veh.isAvailable));
        setShipments(s.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/admin/assignments', form);
      setForm({ shipmentId: '', driverId: '', vehicleId: '', notes: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to assign');
    }
  };

  const aColor = (s) => ({ Assigned: 'blue', Accepted: 'yellow', Completed: 'green', Cancelled: 'red' }[s] || 'blue');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Assignments</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Link2 size={16} /> Assign Delivery
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>New Assignment</h2>
          {formError && <div className="alert error">{formError}</div>}
          <form onSubmit={handleCreate}>
            <label>Shipment (unassigned)</label>
            <select required value={form.shipmentId} onChange={set('shipmentId')}>
              <option value="">— Select shipment —</option>
              {shipments.map((s) => (
                <option key={s._id} value={s._id}>{s.trackingNumber} — {s.recipient?.name}</option>
              ))}
            </select>
            <label>Driver</label>
            <select required value={form.driverId} onChange={set('driverId')}>
              <option value="">— Select driver —</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>{d.user?.name}</option>
              ))}
            </select>
            <label>Vehicle (available only)</label>
            <select required value={form.vehicleId} onChange={set('vehicleId')}>
              <option value="">— Select vehicle —</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>{v.registrationNumber} ({v.type})</option>
              ))}
            </select>
            <label>Notes</label>
            <input value={form.notes} onChange={set('notes')} placeholder="Optional" />
            <div className="form-actions">
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Assign</button>
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
              <tr><th>Tracking #</th><th>Driver</th><th>Vehicle</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>No assignments yet</td></tr>
              ) : assignments.map((a) => (
                <tr key={a._id}>
                  <td className="mono">{a.shipment?.trackingNumber}</td>
                  <td>{a.driver?.user?.name}</td>
                  <td>{a.vehicle?.registrationNumber}</td>
                  <td><span className={`badge badge-${aColor(a.status)}`}>{a.status}</span></td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAssignments;

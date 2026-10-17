import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Package, Truck, Users, DollarSign, AlertCircle, Clock } from 'lucide-react';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#64748b'];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color + '22', color }}><Icon size={22} /></div>
    <div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data));
    api.get('/admin/shipments?limit=5').then(({ data }) => setShipments(data.shipments));
  }, []);

  const pieData = stats ? [
    { name: 'Delivered', value: stats.delivered },
    { name: 'In Transit', value: stats.inTransit },
    { name: 'Pending', value: stats.pending },
  ] : [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/shipments" className="btn-primary">View All Shipments</Link>
      </div>

      {stats && (
        <div className="stats-grid">
          <StatCard icon={Package} label="Total Shipments" value={stats.totalShipments} color="#3b82f6" />
          <StatCard icon={Truck} label="In Transit" value={stats.inTransit} color="#f59e0b" />
          <StatCard icon={Package} label="Delivered" value={stats.delivered} color="#22c55e" />
          <StatCard icon={AlertCircle} label="Unpaid" value={stats.unpaidCount} color="#ef4444" />
          <StatCard icon={Clock} label="Pending Approvals" value={stats.pendingBusinesses} color="#a855f7" />
          <StatCard icon={DollarSign} label="Revenue (ETB)" value={stats.revenue.toLocaleString()} color="#0ea5e9" />
        </div>
      )}

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Delivery Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h2>Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pieData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Recent Shipments</h2>
          <Link to="/admin/shipments" className="link">View all</Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Tracking #</th><th>Business</th><th>Recipient</th><th>Status</th><th>Fee</th></tr></thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s._id}>
                  <td className="mono">{s.trackingNumber}</td>
                  <td>{s.business?.businessName}</td>
                  <td>{s.recipient.name}</td>
                  <td><span className={`badge badge-${statusColor(s.status)}`}>{s.status}</span></td>
                  <td>{s.deliveryFee} {s.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const statusColor = (s) => ({
  'Created': 'blue', 'Picked Up': 'yellow', 'In Transit': 'orange',
  'Out for Delivery': 'purple', 'Delivered': 'green', 'Failed': 'red',
}[s] || 'blue');

export default AdminDashboard;

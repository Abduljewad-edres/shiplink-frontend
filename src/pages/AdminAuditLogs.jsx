import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => { api.get('/admin/audit-logs').then(({ data }) => setLogs(data)); }, []);

  return (
    <div className="page">
      <h1>Audit Logs</h1>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>User</th><th>Action</th><th>Resource</th><th>Details</th><th>Date</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id}>
                <td>{l.user?.name || 'System'}</td>
                <td className="mono">{l.action}</td>
                <td>{l.resource}</td>
                <td>{l.details || '—'}</td>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;

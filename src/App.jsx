import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Track from './pages/Track';

import AdminDashboard from './pages/AdminDashboard';
import AdminBusinesses from './pages/AdminBusinesses';
import AdminShipments from './pages/AdminShipments';
import AdminDrivers from './pages/AdminDrivers';
import AdminVehicles from './pages/AdminVehicles';
import AdminAssignments from './pages/AdminAssignments';
import AdminPayments from './pages/AdminPayments';
import AdminAuditLogs from './pages/AdminAuditLogs';

import BusinessDashboard from './pages/BusinessDashboard';
import MyShipments from './pages/MyShipments';
import CreateShipment from './pages/CreateShipment';
import ShipmentDetail from './pages/ShipmentDetail';

import DriverDashboard from './pages/DriverDashboard';

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/home" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'driver') return <Navigate to="/driver" replace />;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/home" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track" element={<Track />} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/businesses" element={<ProtectedRoute roles={['admin']}><AdminBusinesses /></ProtectedRoute>} />
            <Route path="/admin/shipments" element={<ProtectedRoute roles={['admin']}><AdminShipments /></ProtectedRoute>} />
            <Route path="/admin/drivers" element={<ProtectedRoute roles={['admin']}><AdminDrivers /></ProtectedRoute>} />
            <Route path="/admin/vehicles" element={<ProtectedRoute roles={['admin']}><AdminVehicles /></ProtectedRoute>} />
            <Route path="/admin/assignments" element={<ProtectedRoute roles={['admin']}><AdminAssignments /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute roles={['admin']}><AdminPayments /></ProtectedRoute>} />
            <Route path="/admin/audit" element={<ProtectedRoute roles={['admin']}><AdminAuditLogs /></ProtectedRoute>} />

            {/* Business */}
            <Route path="/dashboard" element={<ProtectedRoute roles={['business']}><BusinessDashboard /></ProtectedRoute>} />
            <Route path="/my-shipments" element={<ProtectedRoute roles={['business']}><MyShipments /></ProtectedRoute>} />
            <Route path="/shipments/create" element={<ProtectedRoute roles={['admin', 'business']}><CreateShipment /></ProtectedRoute>} />
            <Route path="/shipments/:id" element={<ProtectedRoute roles={['admin', 'business']}><ShipmentDetail /></ProtectedRoute>} />

            {/* Driver */}
            <Route path="/driver" element={<ProtectedRoute roles={['driver']}><DriverDashboard /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

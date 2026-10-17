import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Package } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const active = (path) => pathname.startsWith(path) ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand"><Package size={22} />ShipLink</Link>
      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/track" className={active('/track')}>Track</Link>
            <Link to="/login" className={active('/login')}>Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <Link to="/admin" className={active('/admin')}>Dashboard</Link>
            <Link to="/admin/businesses" className={active('/admin/businesses')}>Businesses</Link>
            <Link to="/admin/shipments" className={active('/admin/shipments')}>Shipments</Link>
            <Link to="/admin/drivers" className={active('/admin/drivers')}>Drivers</Link>
            <Link to="/admin/vehicles" className={active('/admin/vehicles')}>Fleet</Link>
            <Link to="/admin/assignments" className={active('/admin/assignments')}>Assign</Link>
            <Link to="/admin/payments" className={active('/admin/payments')}>Payments</Link>
          </>
        )}

        {user?.role === 'business' && (
          <>
            <Link to="/dashboard" className={active('/dashboard')}>Dashboard</Link>
            <Link to="/my-shipments" className={active('/my-shipments')}>Shipments</Link>
            <Link to="/shipments/create" className={active('/shipments/create')}>+ New</Link>
            <Link to="/track" className={active('/track')}>Track</Link>
          </>
        )}

        {user?.role === 'driver' && (
          <>
            <Link to="/driver" className={active('/driver')}>Deliveries</Link>
          </>
        )}

        {user && (
          <button onClick={handleLogout} className="btn-ghost small">
            <LogOut size={15} /> Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

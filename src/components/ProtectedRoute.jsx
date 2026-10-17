import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length > 0 && !roles.includes(user.role)) {
    const fallback = user.role === 'admin' ? '/admin' : user.role === 'driver' ? '/driver' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }
  return children;
};

export default ProtectedRoute;

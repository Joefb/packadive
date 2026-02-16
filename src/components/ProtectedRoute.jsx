import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute

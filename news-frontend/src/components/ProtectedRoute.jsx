import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show nice loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render protected pages
  return <Outlet />;
};

export default ProtectedRoute;
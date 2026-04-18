import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuthStore();
  const location = useLocation();

  if (isBootstrapping) {
    return <div className="p-10 text-center text-gray-400">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

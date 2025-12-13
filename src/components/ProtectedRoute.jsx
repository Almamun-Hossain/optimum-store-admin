import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // If no token or not authenticated, redirect to signin
  if (!isAuthenticated || !token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If we have token but no user data, AuthStateSync will handle it
  // For now, allow rendering (AuthStateSync will show loading/error if needed)
  return children;
};

export default ProtectedRoute;

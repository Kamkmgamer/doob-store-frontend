import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import our auth hook

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Get authentication status

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    // The `replace` prop ensures that the login page replaces the current history entry
    // so the user can't just go "back" to the protected page after being redirected.
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes/components
  return children;
};

export default ProtectedRoute;
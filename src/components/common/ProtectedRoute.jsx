import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Note: This is a structural placeholder.
// The real authentication logic will be hooked up in future steps via Redux.
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token'); // Dummy check

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

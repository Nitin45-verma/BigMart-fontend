import React from 'react';
import { Navigate } from 'react-router-dom';

// Note: This is a structural placeholder.
// The real role checking logic will be hooked up in future steps via Redux.
const RoleRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('role') || 'customer'; // Dummy check

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;

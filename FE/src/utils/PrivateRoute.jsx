import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element, allowedRoles, ...rest }) => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userRole = user?.role;

  if (!user || !allowedRoles.includes(userRole)) {
    // Redirect to a different page or show a "403 Forbidden" page
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;

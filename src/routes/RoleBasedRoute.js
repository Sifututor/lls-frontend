// src/routes/RoleBasedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageLoader } from '../components/ui/LoadingSpinner';

const RoleBasedRoute = ({ children, allowedRoles = [], requiredPermission = null }) => {
  const { isAuthenticated, isLoading, role, checkPermission, getDashboardPath } = useAuth();

  // IMPORTANT: Show loading while checking auth
  if (isLoading) {
    return <PageLoader message="Loading..." />;
  }

  // Not authenticated → Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role - only if allowedRoles is specified
  if (allowedRoles.length > 0) {
    const hasAccess = role && allowedRoles.includes(role.toLowerCase());

    if (!hasAccess) {
      const dashboardPath = getDashboardPath();
      return <Navigate to={dashboardPath} replace />;
    }
  }

  // Check specific permission if required
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return <Navigate to={getDashboardPath()} replace />;
  }

  // Render children
  return children;
};

export default RoleBasedRoute;


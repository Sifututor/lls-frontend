// src/components/ProtectedRoute.js
// CREATE THIS NEW FILE

import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { logout } from '../store/slices/authSlice';
import { isTokenExpired } from '../store/api/authApi';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  useEffect(() => {
    // Check session on every route change
    const checkSession = () => {
      if (isAuthenticated && isTokenExpired()) {
        if (process.env.NODE_ENV === 'development') console.warn('Session expired - logging out');

        // Clear Redux state
        dispatch(logout());
        
        // Redirect to login
        navigate('/login', { replace: true });
      }
    };

    checkSession();

    // Check session every 60 seconds
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, dispatch, navigate]);

  // Not authenticated - redirect to landing
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Token expired - don't render
  if (isTokenExpired()) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
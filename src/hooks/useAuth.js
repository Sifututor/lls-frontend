// src/hooks/useAuth.js
import { useMemo } from 'react';
import Cookies from 'js-cookie';
import { ROLES, getRoleDashboard, hasPermission } from '../utils/roleConfig';

export const useAuth = () => {
  const token = localStorage.getItem('authToken') || Cookies.get('authToken');
  const storedUserType = localStorage.getItem('userType') || Cookies.get('userType');
  const storedUser = localStorage.getItem('userData') || Cookies.get('userData');

  // ✅ FIX: Don't call /me API here - it's called only during login/profile update
  // Read user data from localStorage only (NO API CALLS!)
  const authState = useMemo(() => {
    const userData = storedUser ? JSON.parse(storedUser) : null;
    const rawRole = userData?.user_type || storedUserType || null;
    const normalizedRole = rawRole ? String(rawRole).toLowerCase().trim() : null;
    const isAuthenticated = !!token && !!userData;

    return {
      isAuthenticated,
      isLoading: false, // No API call = never loading
      error: null, // No API call = no error
      user: userData,
      role: normalizedRole,
      token,
    };
  }, [token, storedUserType, storedUser]);

  const checkPermission = (permission) => {
    return hasPermission(authState.role, permission);
  };

  const getDashboardPath = () => {
    return getRoleDashboard(authState.role);
  };

  const isRole = (role) => {
    return authState.role === role;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('isPremium');
    Cookies.remove('authToken', { path: '/' });
    Cookies.remove('userData', { path: '/' });
    Cookies.remove('userType', { path: '/' });
    Cookies.remove('tokenExpiry', { path: '/' });
    Cookies.remove('isPremium', { path: '/' });
    window.location.href = '/login';
  };

  return {
    ...authState,
    checkPermission,
    getDashboardPath,
    isRole,
    isStudent: authState.role === ROLES.STUDENT,
    isTutor: authState.role === ROLES.TUTOR,
    isParent: authState.role === ROLES.PARENT,
    isAdmin: authState.role === ROLES.ADMIN,
    logout,
  };
};

export default useAuth;


// src/hooks/useAuth.js
import { useMemo } from 'react';
import Cookies from 'js-cookie';
import { useGetMeQuery } from '../store/api/authApi';
import { ROLES, getRoleDashboard, hasPermission } from '../utils/roleConfig';

export const useAuth = () => {
  const token = localStorage.getItem('authToken') || Cookies.get('authToken');
  const storedUserType = localStorage.getItem('userType') || Cookies.get('userType');
  const storedUser = localStorage.getItem('userData') || Cookies.get('userData');

  // Only call API if token exists
  const { data: user, isLoading, error } = useGetMeQuery(undefined, {
    skip: !token, // Skip if no token
  });

  const authState = useMemo(() => {
    // API returns { user: {...} } or direct user object
    const userData = user?.user || user || (storedUser ? JSON.parse(storedUser) : null);

    // Normalize role to lowercase to match ROLES constants
    const rawRole = userData?.user_type || storedUserType || null;
    // Ensure role is always a string and lowercase
    const normalizedRole = rawRole ? String(rawRole).toLowerCase().trim() : null;

    // Determine authentication state - token must exist and not be in error state
    const isAuthenticated = !!token && !error;

    return {
      isAuthenticated,
      isLoading: token ? isLoading : false, // Not loading if no token
      error,
      user: userData,
      role: normalizedRole,
      token,
    };
  }, [user, isLoading, error, token]);

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


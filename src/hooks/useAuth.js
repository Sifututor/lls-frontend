// src/hooks/useAuth.js
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { ROLES, getRoleDashboard, hasPermission } from '../utils/roleConfig';
import { selectCurrentUser, selectIsAuthenticated } from '../store/slices/authSlice';

export const useAuth = () => {
  // ✅ Routing uses Redux so logout → navigate("/") shows login immediately (no redirect back to dashboard)
  const reduxAuthenticated = useSelector(selectIsAuthenticated);
  const reduxUser = useSelector(selectCurrentUser);

  const token = localStorage.getItem('authToken') || Cookies.get('authToken');
  const storedUserType = localStorage.getItem('userType') || Cookies.get('userType');
  const storedUser = localStorage.getItem('userData') || Cookies.get('userData');

  // Prefer Redux for isAuthenticated/role so route guards react to logout in same render
  const authState = useMemo(() => {
    const userData = reduxUser || (storedUser ? JSON.parse(storedUser) : null);
    const rawRole = userData?.user_type || storedUserType || (reduxAuthenticated ? 'student' : null);
    const normalizedRole = rawRole ? String(rawRole).toLowerCase().trim() : null;
    // Redux is source of truth for routing so logout takes effect immediately
    const isAuthenticated = reduxAuthenticated;

    return {
      isAuthenticated,
      isLoading: false,
      error: null,
      user: userData,
      role: normalizedRole,
      token: token || null,
    };
  }, [reduxAuthenticated, reduxUser, token, storedUserType, storedUser]);

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


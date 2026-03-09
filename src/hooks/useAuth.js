// src/hooks/useAuth.js
import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { ROLES, getRoleDashboard, hasPermission } from '../utils/roleConfig';
import { selectCurrentUser, selectIsAuthenticated, logout as logoutAction } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
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
    dispatch(logoutAction());
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


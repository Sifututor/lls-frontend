// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import { FILE_SERVER_BASE } from '../../config/apiConfig';
// POST /account-settings returns RELATIVE path; GET may return FULL URL. This helper normalizes to full URL.
const IMAGE_SERVER = FILE_SERVER_BASE;

const toFullUrl = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('data:')) return img;
  if (img.startsWith('/assets')) return img;
  return `${IMAGE_SERVER}/${img.replace(/^\/+/, '')}`;
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('userData') || Cookies.get('userData');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredToken = () => localStorage.getItem('authToken') || Cookies.get('authToken') || null;

const initialState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      const userType = action.payload.user?.user_type;
      if (userType) {
        try {
          const role = String(userType).toLowerCase();
          localStorage.setItem('userType', role);
          Cookies.set('userType', role, { path: '/' });
        } catch (_) {}
      }
    },
    updateUser: (state, action) => {
      // Update user data in state
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Also update localStorage
        try {
          localStorage.setItem('userData', JSON.stringify(state.user));
          Cookies.set('userData', JSON.stringify(state.user), { expires: 7, path: '/' });
        } catch (e) {
          // Silent error
        }
      }
    },
    logout: (state) => {
      // Get user ID before clearing for AI chat cleanup
      const userId = state.user?.id;
      
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userData');
      localStorage.removeItem('userType');
      localStorage.removeItem('isPremium');
      
      // ✅ FIX: Clear AI Tutor user-specific data on logout
      if (userId) {
        localStorage.removeItem(`ai_tutor_chat_${userId}`);
        localStorage.removeItem(`ai_tutor_session_${userId}`);
      }
      
      Cookies.remove('authToken', { path: '/' });
      Cookies.remove('tokenExpiry', { path: '/' });
      Cookies.remove('userData', { path: '/' });
      Cookies.remove('userType', { path: '/' });
      Cookies.remove('isPremium', { path: '/' });
    },
    updateUserProfile: (state, action) => {
      const payload = action.payload;
      
      if (!state.user) {
        return;
      }

      // Extract profile data from any API response format
      let profileData;

      if (payload.user && payload.user.profile) {
        profileData = payload.user.profile;
      } else if (payload.profile && payload.profile.first_name !== undefined) {
        profileData = payload.profile;
      } else if (payload.first_name !== undefined || payload.profile_image !== undefined || payload.user_id !== undefined) {
        profileData = payload;
      } else {
        return;
      }

      const fullName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
      const fullAvatar = toFullUrl(profileData.profile_image);

      state.user = {
        ...state.user,
        name: fullName || state.user.name,
        avatar: fullAvatar || state.user.avatar || null,
        profile: {
          ...(state.user.profile || {}),
          ...profileData,
          profile_image: fullAvatar || state.user.profile?.profile_image || null,
        },
      };

      if (payload.user) {
        state.user.email = payload.user.email || state.user.email;
      }

      try {
        localStorage.setItem('userData', JSON.stringify(state.user));
        Cookies.set('userData', JSON.stringify(state.user), {
          expires: 7, path: '/', sameSite: 'Lax',
        });
      } catch (e) {
        // Silent error
      }
    },
  },
});

export const { setCredentials, updateUser, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
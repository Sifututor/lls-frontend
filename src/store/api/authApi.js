// src/store/api/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { updateUser, updateUserProfile } from '../slices/authSlice';

import { API_BASE, API_BASE_ROOT } from '../../config/apiConfig';
const BASE_URL = API_BASE;

const cookieOptions = {
  expires: 7,
  path: '/',
  sameSite: 'Lax',
  secure: typeof window !== 'undefined' && window.location?.protocol === 'https:',
};

const formDataEndpoints = new Set([
  'updateAccountSettings', 'createTutorLesson', 'updateTutorLesson', 'uploadTutorLiveClassRecording', 'submitTutorVerification',
]);

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    if (endpoint !== 'getParentAccessByToken') {
      const token = localStorage.getItem('authToken') || Cookies.get('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    if (!formDataEndpoints.has(endpoint)) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');
    return headers;
  },
});

/** Parent-access-by-token uses API root (no /parent) so URL is .../api/parent-access/:token */
const baseQueryParentAccessByToken = fetchBaseQuery({
  baseUrl: API_BASE_ROOT,
  prepareHeaders: (headers, { endpoint }) => {
    if (!formDataEndpoints.has(endpoint)) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const req = typeof args === 'string' ? args : args?.url ?? '';
  const isParentAccessByToken = String(req).startsWith('/parent-access/');
  const result = await (isParentAccessByToken ? baseQueryParentAccessByToken(args, api, extraOptions) : baseQueryWithAuth(args, api, extraOptions));
  if (result.error && result.error.status === 401 && !isParentAccessByToken) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userData');
      localStorage.removeItem('userType');
      localStorage.removeItem('isPremium');
    }
    try {
      Cookies.remove('authToken', { path: '/' });
      Cookies.remove('tokenExpiry', { path: '/' });
      Cookies.remove('userData', { path: '/' });
      Cookies.remove('userType', { path: '/' });
      Cookies.remove('isPremium', { path: '/' });
    } catch (_) {}
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const isOnLoginPage = path === '/login' || path.includes('/login') || path === '/tutor/login' || path === '/login/student' || path === '/login/parent';
    const isAuthRequest = String(req).includes('/login') || String(req).includes('/register');
    if (typeof window !== 'undefined' && !isAuthRequest && !isOnLoginPage) {
      window.location.href = '/login';
    }
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'ParentAccess', 'AI', 'Courses', 'Notes', 'LiveClasses', 'VideoQnA', 'Notifications', 'Quiz', 'Tutor'],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      // ✅ FIX: After login, fetch fresh user data from /me to ensure profile updates are reflected
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Save token first
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            Cookies.set('authToken', data.token, cookieOptions);
            const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem('tokenExpiry', expiryTime.toString());
            Cookies.set('tokenExpiry', expiryTime.toString(), cookieOptions);
          }
          
          // Save user data from login response
          if (data.user) {
            localStorage.setItem('userData', JSON.stringify(data.user));
            Cookies.set('userData', JSON.stringify(data.user), cookieOptions);
            const userRole = (data.user.user_type || 'student').toLowerCase();
            localStorage.setItem('userType', userRole);
            Cookies.set('userType', userRole, cookieOptions);
            localStorage.setItem('isPremium', data.user.is_premium ? 'true' : 'false');
            Cookies.set('isPremium', data.user.is_premium ? 'true' : 'false', cookieOptions);
          }
          // Clear all cached API data so new user does not see previous user's data
          dispatch(authApi.util.resetApiState());
        } catch (error) {
          // Silent error - login still works, just no fresh data fetch
        }
      },
      transformResponse: (response) => {
        // Token and user data are now handled in onQueryStarted
        // Just return the response
        return response;
      },
      invalidatesTags: ['Auth'],
    }),

    // Register
    register: builder.mutation({
      query: (registerData) => {
        const body = {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          password_confirmation: registerData.password_confirmation,
          user_type: registerData.user_type || 'parent',
          pdpa_terms: registerData.pdpa_terms || true,
          pdpa_privacy: registerData.pdpa_privacy || true,
          pdpa_consent: registerData.pdpa_consent || true,
        };
        if (registerData.user_type === 'parent') {
          body.children = registerData.children || [];
        }
        if (registerData.user_type === 'student') {
          body.form_level = registerData.form_level;
          if (registerData.school_name) body.school_name = registerData.school_name;
          if (registerData.state) body.state = registerData.state;
          if (registerData.date_of_birth) body.date_of_birth = registerData.date_of_birth;
        }
        return { url: '/register', method: 'POST', body };
      },
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          Cookies.set('authToken', response.token, cookieOptions);
          const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
          localStorage.setItem('tokenExpiry', expiryTime.toString());
          Cookies.set('tokenExpiry', expiryTime.toString(), cookieOptions);
        }
        if (response.user) {
          localStorage.setItem('userData', JSON.stringify(response.user));
          Cookies.set('userData', JSON.stringify(response.user), cookieOptions);
          const userRole = (response.user.user_type || 'parent').toLowerCase();
          localStorage.setItem('userType', userRole);
          Cookies.set('userType', userRole, cookieOptions);
          localStorage.setItem('isPremium', response.user.is_premium ? 'true' : 'false');
          Cookies.set('isPremium', response.user.is_premium ? 'true' : 'false', cookieOptions);
        }
        return response;
      },
      invalidatesTags: ['Auth'],
    }),

    // Get Me
    getMe: builder.query({
      query: () => '/me',
      providesTags: ['User'],
      transformResponse: (response) => {
        if (response.user || response.data) {
          // API can return { user } or { data: { user } }
          const userData = response.user || response.data?.user || response.data || response;
          
          // Save complete user data including profile image and form_level
          const userToSave = {
            ...userData,
            profile_image: userData.profile_image || userData.profile?.profile_image || userData.avatar,
            avatar: userData.profile_image || userData.profile?.profile_image || userData.avatar,
            name: userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          };
          
          localStorage.setItem('userData', JSON.stringify(userToSave));
          Cookies.set('userData', JSON.stringify(userToSave), cookieOptions);
          
          const userRole = (userData.user_type || 'student').toLowerCase();
          localStorage.setItem('userType', userRole);
          Cookies.set('userType', userRole, cookieOptions);
          
          localStorage.setItem('isPremium', userData.is_premium ? 'true' : 'false');
          Cookies.set('isPremium', userData.is_premium ? 'true' : 'false', cookieOptions);
        }
        
        return response;
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const userData = data?.user || data?.data?.user || data?.data || data;
          if (userData && userData.id) {
            dispatch(updateUser({ ...userData }));
          }
        } catch (_e) {
          // ignore
        }
      },
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({ url: '/logout', method: 'POST' }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authApi.util.resetApiState());
        } catch (_e) {
          dispatch(authApi.util.resetApiState());
        } finally {
          localStorage.removeItem('authToken');
          localStorage.removeItem('tokenExpiry');
          localStorage.removeItem('userData');
          localStorage.removeItem('userType');
          localStorage.removeItem('isPremium');
          Cookies.remove('authToken', { path: '/' });
          Cookies.remove('tokenExpiry', { path: '/' });
          Cookies.remove('userData', { path: '/' });
          Cookies.remove('userType', { path: '/' });
          Cookies.remove('isPremium', { path: '/' });
        }
      },
      transformResponse: (response) => response,
    }),

    // Refresh Token
    refreshToken: builder.mutation({
      query: () => ({ url: '/refresh', method: 'POST' }),
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          Cookies.set('authToken', response.token, cookieOptions);
          const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
          localStorage.setItem('tokenExpiry', expiryTime.toString());
          Cookies.set('tokenExpiry', expiryTime.toString(), cookieOptions);
        }
        return response;
      },
    }),

    // Get Form Levels for registration (CORRECT ENDPOINT)
    getForms: builder.query({
      query: () => '/levels', // CORRECT ENDPOINT
      transformResponse: (response) => {
        // API returns { levels: [...] } with 'title' field
        const levels = response?.levels || response?.data || response || [];
        
        // Map 'title' to 'name' for consistency in frontend
        return levels.map(level => ({
          id: level.id,
          name: level.title || level.name, // Use title, fallback to name
          title: level.title,
          level: level.level || level.id,
        }));
      },
    }),

    // Get Schools (for registration)
    getSchools: builder.query({
      query: () => '/schools',
      transformResponse: (response) => {
        return response?.data || response || [];
      },
    }),

    // Get Subjects for AI Tutor
    getSubjects: builder.query({
      query: () => '/subjects',
      providesTags: ['AI'],
    }),

    // AI Ask - supports new chat (with subject) and existing chat (with chat_id)
    askAI: builder.mutation({
      query: (questionData) => {
        const body = {
          question: questionData.question,
        };
        
        // New chat requires subject
        if (questionData.subject) {
          body.subject = questionData.subject;
        }
        
        // Existing chat uses chat_id
        if (questionData.chat_id) {
          body.chat_id = questionData.chat_id;
        }
        
        // Optional parameters
        if (questionData.model) body.model = questionData.model;
        if (questionData.max_tokens) body.max_tokens = questionData.max_tokens;
        if (questionData.temperature) body.temperature = questionData.temperature;
        
        return {
          url: '/ai/ask',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['AI'],
    }),

    // ========== ACCOUNT SETTINGS ==========
    getAccountSettings: builder.query({
      query: () => '/account-settings',
      providesTags: (result) =>
        result ? [{ type: 'User', id: 'ACCOUNT_SETTINGS' }] : ['User'],
      transformResponse: (response) => {
        if (!response) return response;
        const data = response?.data ?? response;
        const user = data?.user ?? {};
        const profile = data?.profile ?? {};
        return {
          ...response,
          data: {
            ...data,
            user,
            profile,
            normalized: {
              name: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user?.name || '',
              email: profile?.email ?? user?.email ?? '',
              phone: profile?.phone ?? '',
              avatar: profile?.profile_image || '/assets/images/icons/Ellipse 3.svg',
              first_name: profile?.first_name ?? '',
              last_name: profile?.last_name ?? '',
              country: profile?.country ?? '',
              dob: profile?.dob ?? '',
            },
          },
        };
      },
    }),

    updateAccountSettings: builder.mutation({
      query: (formData) => ({
        url: '/account-settings',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'User', id: 'ACCOUNT_SETTINGS' }, 'User'],
      async onQueryStarted(formData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          if (data?.data) {
            // Update getAccountSettings cache
            dispatch(
              authApi.util.updateQueryData('getAccountSettings', undefined, (draft) => {
                Object.assign(draft, data);
                if (draft.data && !draft.data.normalized && data.data) {
                  const user = data.data.user ?? draft.data.user ?? {};
                  const profile = data.data.profile ?? draft.data.profile ?? {};
                  draft.data.normalized = {
                    name: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user?.name || '',
                    email: profile?.email ?? user?.email ?? '',
                    phone: profile?.phone ?? '',
                    avatar: profile?.profile_image || '/assets/images/icons/Ellipse 3.svg',
                    first_name: profile?.first_name ?? '',
                    last_name: profile?.last_name ?? '',
                    country: profile?.country ?? '',
                    dob: profile?.dob ?? '',
                  };
                }
              })
            );
            
            // Fetch fresh user data from /me after profile update
            setTimeout(() => {
              dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }));
            }, 100);
          }
        } catch (error) {
          // Silent error - profile update still works
        }
      },
    }),

    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/change-password',
        method: 'POST',
        body: passwordData,
      }),
    }),

    // ========== NOTIFICATIONS ==========
    getNotifications: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.filter) queryParams.append('filter', params.filter);
        const queryString = queryParams.toString();
        return `/notifications${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Notifications'],
    }),

    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),

    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // ========== MY COURSES ==========
    getMyCourses: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.subject) queryParams.append('subject', params.subject);
        if (params.level) queryParams.append('level', params.level);
        const queryString = queryParams.toString();
        return `/my-courses${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Courses'],
    }),

    getCourseDetails: builder.query({
      query: (slug) => `/my-courses/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Courses', id: slug }],
    }),

    getBrowseCourses: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.subject) queryParams.append('subject', params.subject);
        if (params.level) queryParams.append('level', params.level);
        const queryString = queryParams.toString();
        return `/browse/courses${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Courses'],
    }),

    getBrowseCourseDetails: builder.query({
      query: (slug) => `/courses/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Courses', id: slug }],
    }),

    // Enroll in Course
    enrollCourse: builder.mutation({
      query: (slug) => ({
        url: `/courses/${slug}/enroll`,
        method: 'POST',
      }),
      invalidatesTags: ['Courses'],
    }),

    markLessonComplete: builder.mutation({
      query: ({ courseSlug, lessonId }) => ({
        url: `/courses/${courseSlug}/lessons/${lessonId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { courseSlug }) => [{ type: 'Courses', id: courseSlug }],
    }),

    addBookmark: builder.mutation({
      query: ({ lessonId, timestamp, note }) => {
        const secs = typeof timestamp === 'number' ? timestamp : parseInt(timestamp, 10) || 0;
        return {
          url: `/lesson/${lessonId}/bookmark`,
          method: 'POST',
          body: { timestamp: secs, note: note || '' },
        };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const payload = data?.data || data;
          const lessonId = _arg.lessonId;
          if (payload && lessonId != null) {
            dispatch(
              authApi.util.updateQueryData('getLessonNotes', lessonId, (draft) => {
                if (!draft) draft = { notes: [] };
                if (!Array.isArray(draft.notes)) draft.notes = [];
                draft.notes.push({
                  id: payload.id,
                  timestamp: payload.timestamp,
                  timestamp_seconds: payload.timestamp ?? 0,
                  note: payload.note ?? payload.content ?? '',
                  content: payload.content ?? payload.note ?? '',
                  created_at: payload.created_at ?? null,
                });
              })
            );
          }
        } catch (_e) {}
      },
      invalidatesTags: (result, error, { lessonId }) => [{ type: 'Notes', id: String(lessonId) }, 'Notes'],
    }),

    getLessonNotes: builder.query({
      query: (lessonId) => `/lesson/${lessonId}/notes`,
      transformResponse: (response) => {
        if (!response) return { notes: [] };
        const arr =
          response?.data?.notes ??
          response?.data?.bookmarks ??
          response?.data?.data ??
          (Array.isArray(response?.data) ? response.data : null) ??
          response?.notes ??
          response?.bookmarks ??
          (Array.isArray(response) ? response : null) ??
          [];
        return { notes: Array.isArray(arr) ? arr : [] };
      },
      providesTags: (result, error, lessonId) => [{ type: 'Notes', id: String(lessonId) }, 'Notes'],
    }),

    deleteNote: builder.mutation({
      query: (noteId) => ({
        url: `/notes/${noteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notes'],
    }),

    // Alternative: create note via POST /lesson/:id/notes (if backend uses this instead of bookmark)
    createLessonNote: builder.mutation({
      query: ({ lessonId, timestamp_seconds, content }) => ({
        url: `/lesson/${lessonId}/notes`,
        method: 'POST',
        body: { timestamp_seconds: timestamp_seconds ?? 0, content: content || '' },
      }),
      async onQueryStarted({ lessonId, timestamp_seconds, content }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const payload = data?.data || data;
          if (payload && lessonId != null) {
            dispatch(
              authApi.util.updateQueryData('getLessonNotes', lessonId, (draft) => {
                if (!draft) draft = { notes: [] };
                if (!Array.isArray(draft.notes)) draft.notes = [];
                draft.notes.push({
                  id: payload.id,
                  timestamp: timestamp_seconds ?? 0,
                  timestamp_seconds: timestamp_seconds ?? 0,
                  note: content ?? payload.note ?? payload.content ?? '',
                  content: content ?? payload.content ?? payload.note ?? '',
                  created_at: payload.created_at ?? null,
                });
              })
            );
          }
        } catch (_e) {}
      },
      invalidatesTags: (result, error, { lessonId }) => [{ type: 'Notes', id: String(lessonId) }, 'Notes'],
    }),

    // ========== VIDEO PROGRESS ==========
    saveVideoProgress: builder.mutation({
      query: ({ lessonId, last_position, duration_delta }) => ({
        url: `/lessons/${lessonId}/video-progress`,
        method: 'POST',
        body: {
          last_position: Math.round(Number(last_position) || 0),
          duration_delta: Math.round(Number(duration_delta) || 0),
        },
      }),
      transformResponse: (response) => {
        if (response?.status === false) {
          const e = new Error(response?.message);
          e.data = { message: response?.message };
          throw e;
        }
        return response?.data ?? response;
      },
      invalidatesTags: (result, error, { lessonId }) => [
        'User',
        { type: 'Courses', id: 'PROGRESS' },
        'Courses',
      ],
    }),

    // ========== LIVE CLASSES ==========
    getBrowseLiveClasses: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.status) queryParams.append('status', params.status);
        const queryString = queryParams.toString();
        return `/browse/live-classes${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['LiveClasses'],
    }),

    joinLiveClass: builder.mutation({
      query: (classId) => ({
        url: `/live-classes/${classId}/join`,
        method: 'POST',
      }),
      invalidatesTags: ['LiveClasses'],
    }),

    // ========== PARENT - ADD CHILDREN ==========
    addChildren: builder.mutation({
      query: (childrenData) => ({
        url: '/parent/children',
        method: 'POST',
        body: childrenData,
      }),
      invalidatesTags: ['User'],
    }),

    // ========== STUDENT ACTIVATION ==========
    getStudentActivationInfo: builder.query({
      query: (token) => `/student/activation/${token}`,
      providesTags: ['Auth'],
    }),

    activateStudent: builder.mutation({
      query: (data) => ({
        url: '/student/activate',
        method: 'POST',
        body: {
          token: data.token,
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
      }),
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          Cookies.set('authToken', response.token, cookieOptions);
          const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
          localStorage.setItem('tokenExpiry', expiryTime.toString());
          Cookies.set('tokenExpiry', expiryTime.toString(), cookieOptions);
        }
        if (response.user) {
          localStorage.setItem('userData', JSON.stringify(response.user));
          Cookies.set('userData', JSON.stringify(response.user), cookieOptions);
          const userRole = (response.user.user_type || 'student').toLowerCase();
          localStorage.setItem('userType', userRole);
          Cookies.set('userType', userRole, cookieOptions);
          localStorage.setItem('isPremium', response.user.is_premium ? 'true' : 'false');
          Cookies.set('isPremium', response.user.is_premium ? 'true' : 'false', cookieOptions);
        }
        return response;
      },
      invalidatesTags: ['Auth'],
    }),

    // ========== VIDEO Q&A ==========
    getVideoQnA: builder.query({
      query: ({ lessonId, page = 1, sort = 'most-upvoted' }) => {
        const queryParams = new URLSearchParams();
        if (lessonId) queryParams.append('lesson_id', lessonId);
        if (page) queryParams.append('page', page);
        if (sort) queryParams.append('sort', sort);
        return `/video-qna?${queryParams.toString()}`;
      },
      transformResponse: (response) => {
        if (!response) return { data: { data: [] }, total_comments: 0 };
        const list = response?.data?.data ?? response?.data ?? (Array.isArray(response?.data) ? response.data : null) ?? [];
        const total = response?.total_comments ?? (Array.isArray(list) ? list.length : 0);
        return {
          data: { ...response?.data, data: Array.isArray(list) ? list : [] },
          total_comments: total,
        };
      },
      providesTags: ['VideoQnA'],
    }),

    postVideoQuestion: builder.mutation({
      query: ({ lessonId, questionText, timestamp, isAnonymous }) => ({
        url: '/video-qna',
        method: 'POST',
        body: {
          lesson_id: lessonId,
          question_text: questionText,
          timestamp: timestamp || 0,
          is_anonymous: isAnonymous ? 1 : 0,
        },
      }),
      transformResponse: (response) => {
        if (response?.status === false) { const e = new Error(response?.message); e.data = { message: response?.message }; throw e; }
        return response;
      },
      invalidatesTags: ['VideoQnA'],
    }),

    upvoteQuestion: builder.mutation({
      query: (questionId) => ({
        url: `/video-qna/${questionId}/upvote`,
        method: 'POST',
      }),
      transformResponse: (response) => {
        if (response?.status === false) { const e = new Error(response?.message); e.data = { message: response?.message }; throw e; }
        return response;
      },
      invalidatesTags: ['VideoQnA'],
    }),

    flagQuestion: builder.mutation({
      query: ({ questionId, reason }) => ({
        url: '/video-qna/flag',
        method: 'POST',
        body: {
          flaggable_type: 'video_question',
          flaggable_id: questionId,
          reason: reason || '',
        },
      }),
      transformResponse: (response) => {
        if (response?.status === false) { const e = new Error(response?.message); e.data = { message: response?.message }; throw e; }
        return response;
      },
      invalidatesTags: ['VideoQnA'],
    }),

    unflagQuestion: builder.mutation({
      query: (questionId) => ({
        url: `/video-qna/${questionId}/unflag`,
        method: 'POST',
      }),
      transformResponse: (response) => {
        if (response?.status === false) { const e = new Error(response?.message); e.data = { message: response?.message }; throw e; }
        return response;
      },
      invalidatesTags: ['VideoQnA'],
    }),

    postVideoReply: builder.mutation({
      query: ({ questionId, answerText }) => ({
        url: `/video-qna/${questionId}/reply`,
        method: 'POST',
        body: { answer_text: answerText },
      }),
      transformResponse: (response) => {
        if (response?.status === false) { const e = new Error(response?.message); e.data = { message: response?.message }; throw e; }
        return response;
      },
      invalidatesTags: ['VideoQnA'],
    }),

    getQuestionReplies: builder.query({
      query: (questionId) => `/video-qna/${questionId}/replies`,
      providesTags: ['VideoQnA'],
    }),

    // ========== QUIZ ==========
    getQuizOverview: builder.query({
      query: (quizId) => `/quizzes/${quizId}/overview`,
      providesTags: (result, error, quizId) => [{ type: 'Quiz', id: quizId }],
    }),

    startQuizAttempt: builder.mutation({
      query: (quizId) => ({
        url: `/quizzes/${quizId}/start`,
        method: 'POST',
      }),
      invalidatesTags: ['Quiz'],
    }),

    getQuizQuestions: builder.query({
      query: (attemptId) => `/quiz-attempts/${attemptId}/questions`,
    }),

    submitQuizAttempt: builder.mutation({
      query: ({ attemptId, answers }) => ({
        url: `/quiz-attempts/${attemptId}/submit`,
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: ['Quiz', 'User'],
    }),

    getQuizAttempts: builder.query({
      query: (quizId) => `/quizzes/${quizId}/attempts`,
      providesTags: (result, error, quizId) => [{ type: 'Quiz', id: quizId }],
    }),

    getQuizAttemptReview: builder.query({
      query: (attemptId) => `/quiz-attempts/${attemptId}/review`,
      transformResponse: (response) => {
        if (!response) return null;
        const d = response?.data ?? response;
        const questions = d?.questions ?? [];
        return {
          attempt_id: d?.attempt_id ?? d?.attemptId,
          score: d?.score ?? 0,
          passed: d?.passed === 1 || d?.passed === true,
          questions: Array.isArray(questions) ? questions : [],
          user_answers: d?.user_answers ?? d?.userAnswers ?? {},
          correct_answers: d?.correct_answers ?? d?.correctAnswers ?? {},
          correct: d?.correct,
          incorrect: d?.incorrect,
          skipped: d?.skipped,
          total: d?.total,
          ...d,
        };
      },
      providesTags: (result, error, attemptId) => [{ type: 'Quiz', id: `review-${attemptId}` }],
    }),

    // Course overall progress: GET /courses/:id/overall-progress
    getCourseOverallProgress: builder.query({
      query: (courseId) => `/courses/${courseId}/overall-progress`,
      providesTags: (result, error, courseId) => [{ type: 'Courses', id: courseId }, 'User'],
    }),

    // Parent Access Link (student): GET, POST generate, regenerate, revoke
    getParentAccess: builder.query({
      query: () => '/parent-access',
      providesTags: ['User', 'ParentAccess'],
    }),
    generateParentAccess: builder.mutation({
      query: () => ({ url: '/parent-access/generate', method: 'POST' }),
      invalidatesTags: ['User', 'ParentAccess'],
    }),
    regenerateParentAccess: builder.mutation({
      query: () => ({ url: '/parent-access/regenerate', method: 'POST' }),
      invalidatesTags: ['User', 'ParentAccess'],
    }),
    revokeParentAccess: builder.mutation({
      query: () => ({ url: '/parent-access/revoke', method: 'POST' }),
      invalidatesTags: ['User'],
    }),

    // Parent Access view (public): GET /parent-access/:token — token from URL, no auth
    getParentAccessByToken: builder.query({
      query: (token) => `/parent-access/${token}`,
      transformResponse: (response) => {
        const body = response?.data ?? response;
        const inner = body?.data ?? body;
        const payload = inner ?? body;
        if (payload && (payload.status === false || payload.success === false)) {
          throw Object.assign(new Error(payload.message || 'Link expired or revoked'), {
            status: 'CUSTOM_ERROR',
            data: { message: payload.message || 'Link expired or revoked' },
          });
        }
        return payload;
      },
    }),

    // ========== STUDENT DASHBOARD ==========
    getStudentDashboardAnalytics: builder.query({
      query: () => '/student/dashboard-analytics',
      providesTags: ['User'],
    }),

    // User badges - earned from videos, quizzes, streaks
    getUserBadges: builder.query({
      query: () => '/badges',
      transformResponse: (response) => {
        if (!response) return [];
        const data = response?.data ?? response;
        return Array.isArray(data) ? data : (data?.data ?? []);
      },
      providesTags: ['User'],
    }),

    // ========== TUTOR ==========
    getTutorDashboard: builder.query({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        let res = await baseQuery({ url: '/tutor/dashboard-stats', method: 'GET' });
        if (res.error) res = await baseQuery({ url: '/tutor/dashboard', method: 'GET' });
        return res.error ? { error: res.error } : { data: res.data };
      },
      providesTags: ['Tutor'],
    }),

    getTutorUpcomingClasses: builder.query({
      query: () => '/tutor/live-classes/upcoming',
      providesTags: ['Tutor'],
    }),

    getTutorStudentsProgress: builder.query({
      query: () => '/tutor/students/progress',
      providesTags: ['Tutor'],
    }),

    // Tutor students list (paginated): GET /tutor/students?page=1
    getTutorStudents: builder.query({
      query: (page = 1) => `/tutor/students?page=${page}`,
      transformResponse: (response) => response?.data ?? response,
      providesTags: ['Tutor'],
    }),

    // Tutor student analytics: GET /tutor/students/:id
    getTutorStudentAnalytics: builder.query({
      query: (studentId) => `/tutor/students/${studentId}`,
      transformResponse: (response) => response?.data ?? response,
      providesTags: (result, error, studentId) => [{ type: 'Tutor', id: `STUDENT_${studentId}` }],
    }),

    // Tutor student quiz results (paginated): GET /tutor/students/quiz-results?page=1&type=lesson_quiz|exam_quiz
    getTutorStudentsQuizResults: builder.query({
      query: (params = 1) => {
        const p = typeof params === 'number' ? { page: params } : (params || {});
        const { page = 1, type } = p;
        const q = new URLSearchParams();
        q.set('page', page);
        if (type) q.set('type', type);
        return `/tutor/students/quiz-results?${q.toString()}`;
      },
      transformResponse: (response) => response?.data ?? response,
      providesTags: ['Tutor'],
    }),

    getTutorPendingQnA: builder.query({
      query: () => '/tutor/qna/pending',
      providesTags: ['Tutor'],
    }),

    getTutorSubmissions: builder.query({
      query: () => '/tutor/submissions',
      providesTags: ['Tutor'],
    }),

    // Tutor Video Q&A: GET /tutor/video-qa?page=&filter=&course_id=&subject_id=&form_level=
    getTutorVideoQA: builder.query({
      query: (params = {}) => {
        const { page = 1, filter = 'all', course_id, subject_id, form_level, lesson_id } = params;
        const q = new URLSearchParams();
        q.set('page', page);
        if (filter) q.set('filter', filter);
        if (course_id) q.set('course_id', course_id);
        if (subject_id) q.set('subject_id', subject_id);
        if (form_level) q.set('form_level', form_level);
        if (lesson_id) q.set('lesson_id', lesson_id);
        return `/tutor/video-qa?${q.toString()}`;
      },
      transformResponse: (res) => res?.data ?? res,
      providesTags: (result) =>
        result?.data
          ? [{ type: 'Tutor', id: 'VIDEO_QA' }, ...result.data.map((q) => ({ type: 'Tutor', id: `VIDEO_QA_${q.id}` }))]
          : ['Tutor'],
    }),

    // Single question detail with answers: GET /tutor/video-qa/:id
    getTutorVideoQADetail: builder.query({
      query: (id) => `/tutor/video-qa/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tutor', id: `VIDEO_QA_${id}` }],
    }),

    // Post tutor answer: POST /tutor/video-qa/:id/answer
    postTutorVideoQAAnswer: builder.mutation({
      query: ({ questionId, answer_text }) => ({
        url: `/tutor/video-qa/${questionId}/answer`,
        method: 'POST',
        body: { answer_text },
      }),
      invalidatesTags: (result, error, { questionId }) => [{ type: 'Tutor', id: `VIDEO_QA_${questionId}` }, { type: 'Tutor', id: 'VIDEO_QA' }],
    }),

    // Update answer: PUT /tutor/video-qa/answers/:id
    updateTutorVideoQAAnswer: builder.mutation({
      query: ({ answerId, answer_text }) => ({
        url: `/tutor/video-qa/answers/${answerId}`,
        method: 'PUT',
        body: { answer_text },
      }),
      invalidatesTags: (result, error, { questionId }) =>
        questionId
          ? [{ type: 'Tutor', id: `VIDEO_QA_${questionId}` }, { type: 'Tutor', id: 'VIDEO_QA' }]
          : ['Tutor'],
    }),

    // Post reply: POST /tutor/video-qa/answers/:answerId/reply
    postTutorVideoQAReply: builder.mutation({
      query: ({ answerId, reply_text, answer_text }) => ({
        url: `/tutor/video-qa/answers/${answerId}/reply`,
        method: 'POST',
        body: { reply_text: reply_text ?? answer_text },
      }),
      invalidatesTags: (result, error, { questionId }) =>
        questionId
          ? [{ type: 'Tutor', id: `VIDEO_QA_${questionId}` }, { type: 'Tutor', id: 'VIDEO_QA' }]
          : ['Tutor'],
    }),

    // Flag question: POST /tutor/video-qa/flag
    flagTutorVideoQA: builder.mutation({
      query: ({ flaggable_id, reason }) => ({
        url: '/tutor/video-qa/flag',
        method: 'POST',
        body: {
          flaggable_type: 'video_question',
          flaggable_id,
          reason: reason || '',
        },
      }),
      invalidatesTags: (result, error, { questionId }) =>
        questionId
          ? [{ type: 'Tutor', id: `VIDEO_QA_${questionId}` }, { type: 'Tutor', id: 'VIDEO_QA' }]
          : ['Tutor'],
    }),

    // Unflag: backend route varies by environment, so try safe fallbacks
    unflagTutorVideoQA: builder.mutation({
      async queryFn({ flaggable_id }, _api, _extraOptions, baseQuery) {
        const payload = {
          flaggable_type: 'video_question',
          flaggable_id,
        };

        // 1) Preferred: DELETE /tutor/video-qa/flag
        let res = await baseQuery({
          url: '/tutor/video-qa/flag',
          method: 'DELETE',
          body: payload,
        });
        if (!res.error) return { data: res.data };

        // 2) Some backends expose POST /tutor/video-qa/unflag
        res = await baseQuery({
          url: '/tutor/video-qa/unflag',
          method: 'POST',
          body: payload,
        });
        if (!res.error) return { data: res.data };

        // 3) Legacy fallback: GET /tutor/video-qa/unflag?flaggable_type=&flaggable_id=
        const q = new URLSearchParams({
          flaggable_type: 'video_question',
          flaggable_id: String(flaggable_id),
        }).toString();
        res = await baseQuery({
          url: `/tutor/video-qa/unflag?${q}`,
          method: 'GET',
        });
        if (!res.error) return { data: res.data };

        return { error: res.error };
      },
      invalidatesTags: (result, error, { questionId }) =>
        questionId
          ? [{ type: 'Tutor', id: `VIDEO_QA_${questionId}` }, { type: 'Tutor', id: 'VIDEO_QA' }]
          : ['Tutor'],
    }),

    // Toggle pin: POST /tutor/video-qa/:id/toggle-pin
    toggleTutorVideoQAPin: builder.mutation({
      query: (questionId) => ({
        url: `/tutor/video-qa/${questionId}/toggle-pin`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, questionId) => [{ type: 'Tutor', id: `VIDEO_QA_${questionId}` }, { type: 'Tutor', id: 'VIDEO_QA' }],
    }),

    getCoursesWithChapters: builder.query({
      query: () => '/courses-with-chapters',
      transformResponse: (res) => {
        const list = res?.courses ?? res?.data?.courses ?? [];
        return Array.isArray(list) ? list : [];
      },
      providesTags: ['Tutor', 'Courses'],
    }),

    getTutorCourses: builder.query({
      query: (page = 1) => `/tutor/courses?page=${page}`,
      providesTags: (result) =>
        result?.courses?.data
          ? [
              { type: 'Tutor', id: 'COURSES_LIST' },
              ...result.courses.data.map((c) => ({ type: 'Tutor', id: `COURSE_${c.id}` })),
            ]
          : ['Tutor'],
    }),

    // Tutor single course detail: GET /tutor/courses/:id
    getTutorCourseById: builder.query({
      query: (id) => `/tutor/courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tutor', id: `COURSE_${id}` }],
    }),

    createTutorCourse: builder.mutation({
      query: (body) => ({ url: '/tutor/courses', method: 'POST', body }),
      invalidatesTags: ['Tutor'],
    }),
    updateTutorCourse: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/tutor/courses/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tutor', id: `COURSE_${id}` }, 'Tutor'],
    }),
    deleteTutorCourse: builder.mutation({
      query: (id) => ({ url: `/tutor/courses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tutor'],
    }),
    publishTutorCourse: builder.mutation({
      query: (id) => ({ url: `/tutor/courses/${id}/publish`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Tutor', id: `COURSE_${id}` }, 'Tutor'],
    }),

    // Tutor lessons: GET /tutor/lessons, POST, PUT, DELETE, publish
    getTutorLessons: builder.query({
      query: (params) => {
        const q = new URLSearchParams();
        if (params?.course_id) q.set('course_id', params.course_id);
        if (params?.chapter_id) q.set('chapter_id', params.chapter_id);
        if (params?.page) q.set('page', params.page);
        return `/tutor/lessons${q.toString() ? `?${q.toString()}` : ''}`;
      },
      transformResponse: (res) => res?.data ?? res,
      providesTags: ['Tutor'],
    }),
    getTutorLessonById: builder.query({
      query: (id) => `/tutor/lessons/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tutor', id: `LESSON_${id}` }],
    }),
    createTutorLesson: builder.mutation({
      query: (formData) => ({
        url: '/tutor/lessons',
        method: 'POST',
        body: formData instanceof FormData ? formData : (() => {
          const fd = new FormData();
          Object.entries(formData || {}).forEach(([k, v]) => {
            if (v != null && v !== '') fd.append(k, v instanceof File ? v : String(v));
          });
          return fd;
        })(),
      }),
      invalidatesTags: ['Tutor'],
    }),
    updateTutorLesson: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `/tutor/lessons/${id}`,
        method: 'PUT',
        body: formData instanceof FormData ? formData : (() => {
          const fd = new FormData();
          Object.entries(formData || {}).forEach(([k, v]) => {
            if (v != null && v !== '') fd.append(k, v instanceof File ? v : String(v));
          });
          return fd;
        })(),
      }),
      invalidatesTags: ['Tutor'],
    }),
    deleteTutorLesson: builder.mutation({
      query: (id) => ({ url: `/tutor/lessons/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tutor'],
    }),
    publishTutorLesson: builder.mutation({
      query: (id) => ({ url: `/tutor/lessons/${id}/publish`, method: 'POST' }),
      invalidatesTags: ['Tutor'],
    }),

    // Live classes: GET, POST, upload-recording, join
    getTutorLiveClasses: builder.query({
      query: (params) => {
        const q = new URLSearchParams();
        if (params?.page) q.set('page', params.page);
        return `/tutor/live-classes${q.toString() ? `?${q.toString()}` : ''}`;
      },
      transformResponse: (res) => res?.data ?? res,
      providesTags: ['Tutor'],
    }),
    getTutorLiveClassById: builder.query({
      query: (id) => `/tutor/live-classes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tutor', id: `LIVE_${id}` }],
    }),
    createTutorLiveClass: builder.mutation({
      query: (body) => ({
        url: '/tutor/live-classes',
        method: 'POST',
        body: {
          title: body.title,
          course_id: body.course_id,
          scheduled_at: body.scheduled_at,
          duration: body.duration ?? 60,
          description: body.description ?? '',
        },
      }),
      invalidatesTags: ['Tutor'],
    }),
    uploadTutorLiveClassRecording: builder.mutation({
      query: ({ liveClassId, formData }) => ({
        url: `/tutor/live-classes/${liveClassId}/upload-recording`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { liveClassId }) => [{ type: 'Tutor', id: `LIVE_${liveClassId}` }, 'Tutor'],
    }),
    joinTutorLiveClass: builder.query({
      query: (id) => `/tutor/live-classes/${id}/join`,
      providesTags: (result, error, id) => [{ type: 'Tutor', id: `LIVE_${id}` }],
    }),

    // Tutor quizzes list: GET /tutor/quizzes?page=1
    getTutorQuizzes: builder.query({
      query: (page = 1) => `/tutor/quizzes?page=${page}`,
      providesTags: (result) =>
        result?.data?.data
          ? [
              { type: 'Tutor', id: 'QUIZZES_LIST' },
              ...result.data.data.map((q) => ({ type: 'Tutor', id: `QUIZ_${q.id}` })),
            ]
          : ['Tutor'],
    }),

    // Tutor single quiz: GET /tutor/quizzes/:id
    getTutorQuizById: builder.query({
      query: (id) => `/tutor/quizzes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tutor', id: `QUIZ_${id}` }],
    }),

    // Create quiz: POST /tutor/quizzes
    createTutorQuiz: builder.mutation({
      query: (body) => ({
        url: '/tutor/quizzes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Tutor', id: 'QUIZZES_LIST' }],
    }),

    // Update quiz: PUT /tutor/quizzes/:id
    updateTutorQuiz: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tutor/quizzes/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tutor', id: `QUIZ_${id}` }, { type: 'Tutor', id: 'QUIZZES_LIST' }],
    }),

    // Delete quiz: DELETE /tutor/quizzes/:id
    deleteTutorQuiz: builder.mutation({
      query: (id) => ({
        url: `/tutor/quizzes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Tutor', id: `QUIZ_${id}` }, { type: 'Tutor', id: 'QUIZZES_LIST' }],
    }),
    publishTutorQuiz: builder.mutation({
      query: (id) => ({ url: `/tutor/quizzes/${id}/publish`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Tutor', id: `QUIZ_${id}` }, { type: 'Tutor', id: 'QUIZZES_LIST' }],
    }),
    requestTutorQuizUpdate: builder.mutation({
      query: ({ id, update_request }) => ({
        url: `/tutor/quizzes/${id}/request-update`,
        method: 'POST',
        body: { update_request: update_request || '' },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tutor', id: `QUIZ_${id}` }],
    }),

    // Tutor profile: GET /tutor/profile (fallback /account-settings), PUT /tutor/profile
    getTutorProfile: builder.query({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const normalize = (response) => {
          if (!response) return null;
          const ok = response?.success === true || response?.status === true;
          const data = response?.data ?? response;
          const nestedProfile = data?.profile ?? data?.user?.profile ?? null;
          const user = data?.user ?? {};
          const firstName = nestedProfile?.first_name ?? '';
          const lastName = nestedProfile?.last_name ?? '';
          const fullName = [firstName, lastName].filter(Boolean).join(' ') || user?.name || '';
          return {
            ok,
            raw: response,
            profile: {
              ...nestedProfile,
              full_name: fullName,
              name: fullName || user?.name || '',
              email: nestedProfile?.email ?? user?.email ?? '',
              phone: nestedProfile?.phone ?? '',
              bio: nestedProfile?.bio ?? '',
              profile_image: nestedProfile?.profile_image ?? null,
            },
            user,
          };
        };

        // Primary route
        let res = await baseQuery({ url: '/tutor/profile', method: 'GET' });
        if (!res.error) return { data: normalize(res.data) };

        // Fallback route used by account settings API
        res = await baseQuery({ url: '/account-settings', method: 'GET' });
        if (!res.error) return { data: normalize(res.data) };

        return { error: res.error };
      },
      transformResponse: (response) => {
        if (response?.profile) return response;
        const ok = response?.success === true || response?.status === true;
        const data = response?.data ?? response;
        const nestedProfile = data?.profile ?? data?.user?.profile ?? null;
        const user = data?.user ?? {};
        const firstName = nestedProfile?.first_name ?? '';
        const lastName = nestedProfile?.last_name ?? '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ') || user?.name || '';
        return {
          ok,
          raw: response,
          profile: {
            ...nestedProfile,
            full_name: fullName,
            name: fullName || user?.name || '',
            email: nestedProfile?.email ?? user?.email ?? '',
            phone: nestedProfile?.phone ?? '',
            bio: nestedProfile?.bio ?? '',
            profile_image: nestedProfile?.profile_image ?? null,
          },
          user,
        };
      },
      providesTags: [{ type: 'Tutor', id: 'PROFILE' }],
    }),
    updateTutorProfile: builder.mutation({
      async queryFn(body, _api, _extraOptions, baseQuery) {
        const payload = {
          full_name: body?.full_name,
          first_name: body?.first_name ?? body?.full_name,
          last_name: body?.last_name ?? '',
          email: body?.email,
          phone: body?.phone,
          bio: body?.bio,
          address: body?.address,
          country: body?.country,
          dob: body?.dob,
          gender: body?.gender,
        };

        // Primary route
        let res = await baseQuery({
          url: '/tutor/profile',
          method: 'PUT',
          body: payload,
        });
        if (!res.error) return { data: res.data };

        // Fallback route used by account settings
        res = await baseQuery({
          url: '/account-settings',
          method: 'POST',
          body: payload,
        });
        if (!res.error) return { data: res.data };

        return { error: res.error };
      },
      transformResponse: (response) => {
        const data = response?.data ?? response;
        return {
          ok: response?.success === true || response?.status === true,
          message: response?.message,
          profile: data,
          raw: response,
        };
      },
      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const p = data?.profile ?? data?.data ?? data ?? {};
          const fullName = p?.full_name || [p?.first_name, p?.last_name].filter(Boolean).join(' ');
          const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
          const firstName = p?.first_name ?? (parts[0] || '');
          const lastName = p?.last_name ?? (parts.length > 1 ? parts.slice(1).join(' ') : '');

          dispatch(updateUserProfile({
            user_id: p?.user_id,
            first_name: firstName,
            last_name: lastName,
            profile_image: p?.profile_image ?? null,
            email: p?.email,
            phone: p?.phone,
            bio: p?.bio,
            address: p?.address,
            country: p?.country,
            dob: p?.dob,
          }));

          setTimeout(() => {
            dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }));
          }, 50);
        } catch (_) {}
      },
      invalidatesTags: [{ type: 'Tutor', id: 'PROFILE' }, 'User'],
    }),

    // Tutor verification: GET /tutor/verification, POST /tutor/verification
    getTutorVerification: builder.query({
      query: () => '/tutor/verification',
      providesTags: [{ type: 'Tutor', id: 'VERIFICATION' }],
    }),
    submitTutorVerification: builder.mutation({
      query: (body) => ({
        url: '/tutor/verification',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const p = data?.data ?? data ?? {};
          const fullName = p?.full_name || '';
          const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
          const firstName = parts[0] || '';
          const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';

          dispatch(updateUserProfile({
            first_name: firstName,
            last_name: lastName,
            email: p?.email,
            phone: p?.phone,
          }));

          setTimeout(() => {
            dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }));
          }, 50);
        } catch (_) {}
      },
      invalidatesTags: [{ type: 'Tutor', id: 'VERIFICATION' }, { type: 'Tutor', id: 'PROFILE' }, 'User'],
    }),
  }),
});

// ========== HELPER FUNCTIONS ==========
export const isTokenExpired = () => {
  const expiry = localStorage.getItem('tokenExpiry') || Cookies.get('tokenExpiry');
  if (!expiry) return true;
  return new Date().getTime() > parseInt(expiry, 10);
};

export const getUserType = () => {
  return localStorage.getItem('userType') || Cookies.get('userType') || 'student';
};

export const isPremiumUser = () => {
  return (localStorage.getItem('isPremium') || Cookies.get('isPremium')) === 'true';
};

// ========== EXPORTS ==========
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetFormsQuery,
  useGetSchoolsQuery,
  useGetSubjectsQuery,
  useAskAIMutation,
  // Account Settings
  useGetAccountSettingsQuery,
  useUpdateAccountSettingsMutation,
  useChangePasswordMutation,
  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  // Courses
  useGetMyCoursesQuery,
  useGetCourseDetailsQuery,
  useGetBrowseCoursesQuery,
  useGetBrowseCourseDetailsQuery,
  useEnrollCourseMutation,
  useMarkLessonCompleteMutation,
  useAddBookmarkMutation,
  useGetLessonNotesQuery,
  useDeleteNoteMutation,
  useCreateLessonNoteMutation,
  useSaveVideoProgressMutation,
  useGetCourseOverallProgressQuery,
  useGetParentAccessQuery,
  useGenerateParentAccessMutation,
  useRegenerateParentAccessMutation,
  useRevokeParentAccessMutation,
  useGetParentAccessByTokenQuery,
  // Live Classes
  useGetBrowseLiveClassesQuery,
  useJoinLiveClassMutation,
  // Parent - Add Children
  useAddChildrenMutation,
  // Student Activation
  useGetStudentActivationInfoQuery,
  useActivateStudentMutation,
  // Video Q&A
  useGetVideoQnAQuery,
  usePostVideoQuestionMutation,
  useUpvoteQuestionMutation,
  useFlagQuestionMutation,
  useUnflagQuestionMutation,
  usePostVideoReplyMutation,
  useGetQuestionRepliesQuery,
  // Quiz
  useGetQuizOverviewQuery,
  useStartQuizAttemptMutation,
  useGetQuizQuestionsQuery,
  useSubmitQuizAttemptMutation,
  useGetQuizAttemptsQuery,
  useGetQuizAttemptReviewQuery,
  // Student Dashboard
  useGetStudentDashboardAnalyticsQuery,
  useGetUserBadgesQuery,
  // Tutor
  useGetTutorDashboardQuery,
  useGetTutorUpcomingClassesQuery,
  useGetTutorStudentsProgressQuery,
  useGetTutorStudentsQuery,
  useGetTutorStudentAnalyticsQuery,
  useGetTutorStudentsQuizResultsQuery,
  useGetTutorPendingQnAQuery,
  useGetTutorSubmissionsQuery,
  useGetTutorVideoQAQuery,
  useGetTutorVideoQADetailQuery,
  usePostTutorVideoQAAnswerMutation,
  useUpdateTutorVideoQAAnswerMutation,
  usePostTutorVideoQAReplyMutation,
  useToggleTutorVideoQAPinMutation,
  useFlagTutorVideoQAMutation,
  useUnflagTutorVideoQAMutation,
  useGetCoursesWithChaptersQuery,
  useGetTutorCoursesQuery,
  useGetTutorCourseByIdQuery,
  useCreateTutorCourseMutation,
  useUpdateTutorCourseMutation,
  useDeleteTutorCourseMutation,
  usePublishTutorCourseMutation,
  useGetTutorLessonsQuery,
  useGetTutorLessonByIdQuery,
  useCreateTutorLessonMutation,
  useUpdateTutorLessonMutation,
  useDeleteTutorLessonMutation,
  usePublishTutorLessonMutation,
  useGetTutorLiveClassesQuery,
  useGetTutorLiveClassByIdQuery,
  useCreateTutorLiveClassMutation,
  useUploadTutorLiveClassRecordingMutation,
  useJoinTutorLiveClassQuery,
  useGetTutorQuizzesQuery,
  useGetTutorQuizByIdQuery,
  useCreateTutorQuizMutation,
  useUpdateTutorQuizMutation,
  useDeleteTutorQuizMutation,
  usePublishTutorQuizMutation,
  useRequestTutorQuizUpdateMutation,
  useGetTutorProfileQuery,
  useUpdateTutorProfileMutation,
  useGetTutorVerificationQuery,
  useSubmitTutorVerificationMutation,
} = authApi;

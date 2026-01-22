// src/store/api/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://10.0.0.250:8000/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth', 'User', 'AI', 'Courses', 'Notes', 'LiveClasses'],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
          localStorage.setItem('tokenExpiry', expiryTime.toString());
        }
        
        if (response.user) {
          localStorage.setItem('userData', JSON.stringify(response.user));
          localStorage.setItem('userType', response.user.user_type || 'student');
          localStorage.setItem('isPremium', response.user.is_premium || false);
        }
        
        return response;
      },
      invalidatesTags: ['Auth'],
    }),

    // Register
    register: builder.mutation({
      query: (registerData) => ({
        url: '/register',
        method: 'POST',
        body: {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          password_confirmation: registerData.password_confirmation,
          user_type: registerData.user_type || 'parent',
          pdpa_terms: registerData.pdpa_terms,
          pdpa_privacy: registerData.pdpa_privacy,
          pdpa_consent: registerData.pdpa_consent,
          children: registerData.children || [],
        },
      }),
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
          localStorage.setItem('tokenExpiry', expiryTime.toString());
        }
        
        if (response.user) {
          localStorage.setItem('userData', JSON.stringify(response.user));
          localStorage.setItem('userType', response.user.user_type || 'parent');
          localStorage.setItem('isPremium', response.user.is_premium || false);
        }
        
        return response;
      },
      invalidatesTags: ['Auth'],
    }),

    // Get Me (Check session)
    getMe: builder.query({
      query: () => '/me',
      providesTags: ['User'],
      transformResponse: (response) => {
        if (response.user) {
          localStorage.setItem('userData', JSON.stringify(response.user));
          localStorage.setItem('userType', response.user.user_type || 'student');
          localStorage.setItem('isPremium', response.user.is_premium || false);
        }
        return response;
      },
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      transformResponse: (response) => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userData');
        localStorage.removeItem('userType');
        localStorage.removeItem('isPremium');
        return response;
      },
      invalidatesTags: ['Auth', 'User'],
    }),

    // Refresh Token
    refreshToken: builder.mutation({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
          localStorage.setItem('tokenExpiry', expiryTime.toString());
        }
        return response;
      },
    }),

    // AI Ask
    askAI: builder.mutation({
      query: (questionData) => ({
        url: '/ai/ask',
        method: 'POST',
        body: {
          question: questionData.question,
          model: questionData.model || 'gpt-4o-mini',
          max_tokens: questionData.max_tokens || 500,
          temperature: questionData.temperature || 0.7,
        },
      }),
      providesTags: ['AI'],
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

    // ========== COURSE DETAILS ==========
    getCourseDetails: builder.query({
      query: (slug) => `/my-courses/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Courses', id: slug }],
    }),

    // ========== BROWSE COURSES ==========
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

    // ========== MARK LESSON COMPLETE ==========
    markLessonComplete: builder.mutation({
      query: ({ courseSlug, lessonId }) => ({
        url: `/courses/${courseSlug}/lessons/${lessonId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { courseSlug }) => [{ type: 'Courses', id: courseSlug }],
    }),

    // ========== ADD BOOKMARK/NOTE ==========
    addBookmark: builder.mutation({
      query: ({ lessonId, timestamp, note }) => ({
        url: `/lesson/${lessonId}/bookmark`,
        method: 'POST',
        body: {
          timestamp: timestamp,
          note: note,
        },
      }),
      invalidatesTags: ['Notes'],
    }),

    // ========== GET LESSON NOTES ==========
    getLessonNotes: builder.query({
      query: (lessonId) => `/lesson/${lessonId}/notes`,
      providesTags: ['Notes'],
    }),

    // ========== DELETE NOTE ==========
    deleteNote: builder.mutation({
      query: (noteId) => ({
        url: `/notes/${noteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notes'],
    }),

    // ========== BROWSE LIVE CLASSES ==========
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

    // ========== JOIN LIVE CLASS ==========
    joinLiveClass: builder.mutation({
      query: (classId) => ({
        url: `/live-classes/${classId}/join`,
        method: 'POST',
      }),
      invalidatesTags: ['LiveClasses'],
    }),
  }),
});

// ========== HELPER FUNCTIONS ==========
export const isTokenExpired = () => {
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return true;
  return new Date().getTime() > parseInt(expiry);
};

export const getUserType = () => {
  return localStorage.getItem('userType') || 'student';
};

export const isPremiumUser = () => {
  return localStorage.getItem('isPremium') === 'true';
};

// ========== EXPORTS ==========
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
  useAskAIMutation,
  useGetMyCoursesQuery,
  useGetCourseDetailsQuery,
  useGetBrowseCoursesQuery,
  useMarkLessonCompleteMutation,
  useAddBookmarkMutation,
  useGetLessonNotesQuery,
  useDeleteNoteMutation,
  useGetBrowseLiveClassesQuery,
  useJoinLiveClassMutation,
} = authApi;
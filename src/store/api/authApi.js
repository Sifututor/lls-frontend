// src/store/api/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { updateUser } from '../slices/authSlice';

// const BASE_URL = 'http://10.0.0.178:8000/api';
const BASE_URL = 'https://lms-sifu.tutorla.tech/api';

const cookieOptions = {
  expires: 7,
  path: '/',
  sameSite: 'Lax',
  secure: typeof window !== 'undefined' && window.location?.protocol === 'https:',
};

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = localStorage.getItem('authToken') || Cookies.get('authToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (endpoint !== 'updateAccountSettings') {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
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
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'AI', 'Courses', 'Notes', 'LiveClasses', 'VideoQnA', 'Notifications', 'Quiz', 'Tutor'],
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
          
          // Save user data from login response first
          if (data.user) {
            localStorage.setItem('userData', JSON.stringify(data.user));
            Cookies.set('userData', JSON.stringify(data.user), cookieOptions);
            const userRole = (data.user.user_type || 'student').toLowerCase();
            localStorage.setItem('userType', userRole);
            Cookies.set('userType', userRole, cookieOptions);
            localStorage.setItem('isPremium', data.user.is_premium ? 'true' : 'false');
            Cookies.set('isPremium', data.user.is_premium ? 'true' : 'false', cookieOptions);
          }
          
          // Fetch fresh user data from /me after login
          setTimeout(() => {
            dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }));
          }, 100);
          
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
      transformResponse: (response) => {
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
        return response;
      },
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
      query: ({ lessonId, timestamp, note }) => ({
        url: `/lesson/${lessonId}/bookmark`,
        method: 'POST',
        body: { timestamp, note },
      }),
      invalidatesTags: ['Notes'],
    }),

    getLessonNotes: builder.query({
      query: (lessonId) => `/lesson/${lessonId}/notes`,
      providesTags: ['Notes'],
    }),

    deleteNote: builder.mutation({
      query: (noteId) => ({
        url: `/notes/${noteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notes'],
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
        queryParams.append('lesson_id', lessonId);
        if (page) queryParams.append('page', page);
        if (sort) queryParams.append('sort', sort);
        return `/video-qna?${queryParams.toString()}`;
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
      invalidatesTags: ['VideoQnA'],
    }),

    upvoteQuestion: builder.mutation({
      query: (questionId) => ({
        url: `/video-qna/${questionId}/upvote`,
        method: 'POST',
      }),
      invalidatesTags: ['VideoQnA'],
    }),

    flagQuestion: builder.mutation({
      query: ({ questionId, reason }) => ({
        url: `/video-qna/${questionId}/flag`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['VideoQnA'],
    }),

    postVideoReply: builder.mutation({
      query: ({ questionId, answerText }) => ({
        url: `/video-qna/${questionId}/reply`,
        method: 'POST',
        body: { answer_text: answerText },
      }),
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
      invalidatesTags: ['Quiz'],
    }),

    getQuizAttempts: builder.query({
      query: (quizId) => `/quizzes/${quizId}/attempts`,
      providesTags: (result, error, quizId) => [{ type: 'Quiz', id: quizId }],
    }),

    // ========== STUDENT DASHBOARD ==========
    getStudentDashboardAnalytics: builder.query({
      query: () => '/student/dashboard-analytics',
      providesTags: ['User'],
    }),

    // ========== TUTOR ==========
    getTutorDashboard: builder.query({
      query: () => '/tutor/dashboard',
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

    getTutorPendingQnA: builder.query({
      query: () => '/tutor/qna/pending',
      providesTags: ['Tutor'],
    }),

    getTutorSubmissions: builder.query({
      query: () => '/tutor/submissions',
      providesTags: ['Tutor'],
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
  usePostVideoReplyMutation,
  useGetQuestionRepliesQuery,
  // Quiz
  useGetQuizOverviewQuery,
  useStartQuizAttemptMutation,
  useGetQuizQuestionsQuery,
  useSubmitQuizAttemptMutation,
  useGetQuizAttemptsQuery,
  // Student Dashboard
  useGetStudentDashboardAnalyticsQuery,
  // Tutor
  useGetTutorDashboardQuery,
  useGetTutorUpcomingClassesQuery,
  useGetTutorStudentsProgressQuery,
  useGetTutorPendingQnAQuery,
  useGetTutorSubmissionsQuery,
} = authApi;
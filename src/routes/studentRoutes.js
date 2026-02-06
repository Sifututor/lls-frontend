// src/routes/studentRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import RoleBasedRoute from './RoleBasedRoute';
import StudentLayout from '../layouts/StudentLayout';
import { ROLES } from '../utils/roleConfig';

// Student Pages
import Dashboard from '../pages/Dashboard';
import MyCourses from '../pages/MyCourses';
import BrowseCourses from '../pages/browse-catalog';
import BrowseCourseDetails from '../pages/Browsecoursedetails';
import CourseDetails from '../pages/CourseDetails';
import LiveClasses from '../pages/Liveclasses';
import LiveClassDetails from '../pages/Liveclassdetails';
import PastSessions from '../pages/Pastsessions';
import Aitutor from '../pages/Aitutor';
import RecentVideoQA from '../pages/Recentvideoqa';
import QuizDetails from '../pages/QuizDetails';
import QuizTake from '../pages/QuizTake';
import CheckAnswers from '../pages/CheckAnswers';
import Profile from '../pages/Profile';
import EditProfile from '../pages/Editprofile';
import Settings from '../pages/Settings';
import ChangePassword from '../pages/ChangePassword';
import Notifications from '../pages/Notifications';
import Subscription from '../pages/Premiumsubscription';

const StudentRoutes = () => (
  <>
    {/* ========== DASHBOARD ========== */}
    <Route
      path="/student/dashboard"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Dashboard">
            <Dashboard />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    {/* ========== MY COURSES (Enrolled) ========== */}
    <Route
      path="/student/my-courses"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="My Courses">
            <MyCourses />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    {/* ========== BROWSE COURSES (Catalog) ========== */}
    <Route
      path="/student/browse-courses"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Browse Courses">
            <BrowseCourses />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    {/* ========== BROWSE COURSE DETAILS (Preview before enroll) ========== */}
    <Route
      path="/student/browse-course/:slug"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Course Preview">
            <BrowseCourseDetails />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    {/* ========== COURSE DETAILS (Enrolled - with videos) ========== */}
    <Route
      path="/student/course/:slug"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Course Details">
            <CourseDetails />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    {/* ========== LIVE CLASSES ========== */}
    <Route
      path="/student/live-classes"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Live Classes">
            <LiveClasses />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    <Route
      path="/student/live-class/:slug"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Live Class">
            <LiveClassDetails />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    {/* ========== PAST SESSIONS ========== */}
    <Route
      path="/student/past-sessions"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Past Sessions">
            <PastSessions />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    {/* ========== AI TUTOR ========== */}
    <Route
      path="/student/ai-tutor"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="AI Tutor">
            <Aitutor />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    {/* ========== VIDEO Q&A ========== */}
    <Route
      path="/student/video-qa"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Video Q&A">
            <RecentVideoQA />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    {/* ========== QUIZZES ========== */}
    <Route
      path="/student/quiz/:id"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Quiz">
            <QuizDetails />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    <Route
      path="/student/quiz/:id/take"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Take Quiz">
            <QuizTake />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    <Route
      path="/student/quiz/:id/review"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Check Answers">
            <CheckAnswers />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    {/* ========== PROFILE & SETTINGS ========== */}
    <Route
      path="/student/profile"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Profile">
            <Profile />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    <Route
      path="/student/profile/edit"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Edit Profile">
            <EditProfile />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    <Route
      path="/student/settings"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Settings">
            <Settings />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    <Route
      path="/student/settings/password"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Change Password">
            <ChangePassword />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    <Route
      path="/student/notifications"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Notifications">
            <Notifications />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />

    <Route
      path="/student/subscription"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout title="Subscription">
            <Subscription />
          </StudentLayout>
        </RoleBasedRoute>
      }
    />
  </>
);

export default StudentRoutes;
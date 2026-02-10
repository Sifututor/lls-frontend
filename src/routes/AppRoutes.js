// src/routes/AppRoutes.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GlobalLoader from '../components/GlobalLoader';

// Auth Pages
import Login from '../pages/LoginRoleSelection';
import StudentLogin from '../pages/StudentLogin';
import ParentLogin from '../pages/ParentLogin';
import TutorLogin from '../pages/auth/TutorLogin';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/Resetpassword';
import LandingPage from '../pages/LandingPage';
import TermsAndConditions from '../pages/TermsAndConditions';
import PrivacyPolicy from '../pages/PrivacyPolicy';

// Student Registration Pages (Multi-Step)
import StudentRegistrationStep1 from '../pages/Studentregistrationstep1';
import StudentRegistrationStep2 from '../pages/Studentregistrationstep2';
import StudentRegistrationSuccess from '../pages/Studentregistrationsuccess';
import StudentActivation from '../pages/StudentActivation';
import StudentActivationSuccess from '../pages/StudentActivationSuccess';

// Parent Registration Pages (multi-step flow: /register -> ... -> /select-student)
import CreateAccountStep1 from '../pages/CreateAccountStep1';
import AddChildrenStep from '../pages/Addchildrenstep';
import CreateAccountSuccess from '../pages/Createaccountsuccess';
import TermsConsent from '../pages/auth/TermsConsent';
import StudentTerms from '../pages/auth/StudentTerms';
import RegistrationComplete from '../pages/auth/RegistrationComplete';
import SelectStudent from '../pages/Selectstudent';
import RegistrationGuard from './RegistrationGuard';

// Browse Course Details (Requires Auth but accessible from browse)
import BrowseCourseDetails from '../pages/Browsecoursedetails';
import TutorProfile from '../pages/Tutorprofile';

// Layout
import StudentLayout from '../layouts/StudentLayout';

// Route Groups
import StudentRoutes from './studentRoutes';
import TutorRoutes from './tutorRoutes';
import ParentRoutes from './parentRoutes';
import AdminRoutes from './adminRoutes';

const AppRoutes = () => {
  const { isAuthenticated, isLoading, getDashboardPath } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);
      const t = setTimeout(() => setShowLoader(false), 400);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  if (showLoader) {
    return (
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 99999 }}
        className={fadeOut ? 'gl-fade-out' : ''}
      >
        <GlobalLoader />
      </div>
    );
  }

  return (
    <Routes>
      {/* ========== PUBLIC ROUTES (No Auth Required) ========== */}
      
      {/* Landing Page */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <LandingPage />
        } 
      />

      {/* Login Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <Login />
        } 
      />

      <Route 
        path="/login/student" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <StudentLogin />
        } 
      />

      <Route 
        path="/login/parent" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <ParentLogin />
        } 
      />

      <Route 
        path="/tutor/login" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <TutorLogin />
        } 
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Legal pages (public) */}
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      {/* ========== STUDENT REGISTRATION (Multi-Step) ========== */}
      {/* Step 1: Basic Info (Name, Email, Password) */}
      <Route 
        path="/create-account/student" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <StudentRegistrationStep1 />
        } 
      />
      
      {/* Step 2: Academic Details (Form Level, School, DOB, Terms) */}
      <Route 
        path="/create-account/student/details" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <StudentRegistrationStep2 />
        } 
      />
      
      {/* Success Page (also used for email verification when ?redirect= is present) */}
      <Route 
        path="/create-account/student/success" 
        element={<StudentRegistrationSuccess />} 
      />
      {/* Email verification link lands here; same component handles ?redirect= */}
      <Route 
        path="/verify-email" 
        element={<StudentRegistrationSuccess />} 
      />

      {/* ========== STUDENT ACTIVATION (Parent-created accounts) ========== */}
      <Route 
        path="/activate-student/:token" 
        element={<StudentActivation />} 
      />
      <Route 
        path="/activate-student/success" 
        element={<StudentActivationSuccess />} 
      />
      
      {/* ========== PARENT REGISTRATION (Multi-Step: /register -> ... -> /select-student) ========== */}
      <Route 
        path="/register" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : (
            <RegistrationGuard allowedStep={1}>
              <CreateAccountStep1 />
            </RegistrationGuard>
          )
        } 
      />
      <Route 
        path="/register/terms" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : (
            <RegistrationGuard allowedStep={2}>
              <TermsConsent />
            </RegistrationGuard>
          )
        } 
      />
      <Route 
        path="/register/success" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : (
            <RegistrationGuard allowedStep={3}>
              <CreateAccountSuccess />
            </RegistrationGuard>
          )
        } 
      />
      <Route 
        path="/register/add-children" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : (
            <RegistrationGuard allowedStep={4}>
              <AddChildrenStep />
            </RegistrationGuard>
          )
        } 
      />
      <Route 
        path="/register/student-terms" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : (
            <RegistrationGuard allowedStep={5}>
              <StudentTerms />
            </RegistrationGuard>
          )
        } 
      />
      <Route 
        path="/register/complete" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : (
            <RegistrationGuard allowedStep={6}>
              <RegistrationComplete />
            </RegistrationGuard>
          )
        } 
      />
      <Route 
        path="/select-student" 
        element={
          isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : (
            <RegistrationGuard allowedStep={7}>
              <SelectStudent />
            </RegistrationGuard>
          )
        } 
      />

      {/* Legacy parent registration paths -> redirect to new flow */}
      <Route path="/create-account/parent-info" element={<Navigate to="/register" replace />} />
      <Route path="/create-account/add-child" element={<Navigate to="/register/add-children" replace />} />
      <Route path="/create-account/terms" element={<Navigate to="/register/terms" replace />} />
      <Route path="/create-account/success" element={<Navigate to="/register/success" replace />} />

      {/* ========== BROWSE COURSE DETAILS ========== */}
      <Route 
        path="/browse-course/:id" 
        element={
          isAuthenticated ? (
            <StudentLayout title="Course Preview">
              <BrowseCourseDetails />
            </StudentLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* ========== TUTOR PROFILE (Auth Required) ========== */}
      <Route 
        path="/tutor-profile/:id" 
        element={
          isAuthenticated ? (
            <StudentLayout title="Tutor Profile">
              <TutorProfile />
            </StudentLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* ========== ROLE-BASED ROUTES (Auth Required) ========== */}
      {StudentRoutes()}
      {TutorRoutes()}
      {ParentRoutes()}
      {AdminRoutes()}

      {/* ========== SHORTCUT ROUTES - Redirect to registration ========== */}
      <Route path="/signup" element={<Navigate to="/register" replace />} />
      <Route path="/login/tutor" element={<Navigate to="/tutor/login" replace />} />
      <Route path="/register/student" element={<Navigate to="/create-account/student" replace />} />
      <Route path="/create-account" element={<Navigate to="/create-account/student" replace />} />

      {/* ========== LEGACY ROUTES - Redirect to new structure ========== */}
      <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/my-courses" element={<Navigate to="/student/my-courses" replace />} />
      <Route path="/browse-courses" element={<Navigate to="/student/browse-courses" replace />} />
      <Route path="/live-classes" element={<Navigate to="/student/live-classes" replace />} />
      <Route path="/ai-tutor" element={<Navigate to="/student/ai-tutor" replace />} />

      {/* ========== 404 - Redirect to appropriate dashboard ========== */}
      <Route 
        path="*" 
        element={
          isAuthenticated 
            ? <Navigate to={getDashboardPath()} replace />
            : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
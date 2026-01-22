import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { store } from './store/store';
import { selectIsAuthenticated } from './store/slices/authSlice';
import ProtectedRoute from './components/Protectedroute';

// Landing Page
import LandingPage from './pages/LandingPage';

// Create Account Flow
import CreateAccountStep1 from './pages/CreateAccountStep1';
import CreateAccountStep2 from './pages/CreateAccountStep2';
import CreateAccountSuccess from './pages/Createaccountsuccess';
import AddChildrenStep from './pages/Addchildrenstep';

// Login Flow
import LoginRoleSelection from './pages/LoginRoleSelection';
import ParentLogin from './pages/ParentLogin';
import StudentLogin from './pages/StudentLogin';
import ForgotPassword from './pages/ForgotPassword';

// Student Selection
import SelectStudent from './pages/Selectstudent';

// Your Existing Pages
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import BrowseCourses from './pages/browse-catalog';
import BrowseCourseDetails from './pages/Browsecoursedetails';
import TutorProfile from './pages/Tutorprofile';
import LiveClasses from './pages/Liveclasses';
import Pastsessions from './pages/Pastsessions';
import Liveclassdetails from './pages/Liveclassdetails';
import Recentvideoqa from './pages/Recentvideoqa';
import Aitutor from './pages/Aitutor';
import Profile from './pages/Profile';
import Premiumsubscription from './pages/Premiumsubscription';
import Editprofile from './pages/Editprofile';
import CourseDetails from './pages/CourseDetails';
import QuizDetails from './pages/QuizDetails';
import QuizTake from './pages/QuizTake';
import CheckAnswers from './pages/CheckAnswers';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

// CSS
import './assets/css/root.css';
import './assets/css/base.css';
import './assets/css/layout.css';
import './assets/css/components.css';
import './assets/css/responsive.css';
import './assets/css/my-courses.css';
import './assets/css/course-details.css';
import './assets/css/browse-course-details.css';
import './assets/css/quiz-check-answers.css';
import './assets/css/quiz-take.css';
import './assets/css/auth.css';
import './assets/css/Ai-tutor.css';
import './assets/css/Profile.css';

import { LayoutProvider } from './context/LayoutContext';

function AppRoutes() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [signupData, setSignupData] = useState({});
  const [childrenData, setChildrenData] = useState([]);
  const [students, setStudents] = useState([]);
  const [userData, setUserData] = useState(null);

  // Authentication Success (for backward compatibility)
  const handleAuthComplete = (role, data) => {
    console.log('User logged in:', role, data);
    setUserData({ role, ...data });
  };

  // Signup Data Handler
  const handleSignupStep = (data) => {
    setSignupData({ ...signupData, ...data });
  };

  // Students Handler
  const handleStudentsAdded = (studentList, childrenForApi) => {
    setStudents(studentList);
    setChildrenData(childrenForApi);
    setUserData({ role: 'parent', students: studentList });
  };

  // Student Selection
  const handleStudentSelect = (student) => {
    setUserData({ ...userData, selectedStudent: student });
  };

  // Logout
  const handleLogout = () => {
    setUserData(null);
    setSignupData({});
    setChildrenData([]);
    setStudents([]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('isPremium');
  };

  return (
    <Router>
      <LayoutProvider>
        <Routes>
          {/* ============================================ */}
          {/* LANDING PAGE */}
          {/* ============================================ */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <LandingPage />
            } 
          />

          {/* ============================================ */}
          {/* CREATE ACCOUNT FLOW */}
          {/* ============================================ */}
          <Route 
            path="/create-account/parent-info" 
            element={
              <CreateAccountStep1 
                onComplete={handleSignupStep}
              />
            } 
          />

          <Route 
            path="/create-account/terms" 
            element={
              <CreateAccountStep2 
                signupData={signupData}
                childrenData={childrenData}
                onComplete={handleSignupStep}
              />
            } 
          />

          <Route 
            path="/create-account/success" 
            element={<CreateAccountSuccess />} 
          />

          <Route 
            path="/create-account/add-child" 
            element={
              <AddChildrenStep 
                signupData={signupData}
                onComplete={handleStudentsAdded}
              />
            } 
          />

          {/* ============================================ */}
          {/* LOGIN FLOW */}
          {/* ============================================ */}
          <Route 
            path="/login" 
            element={<LoginRoleSelection />} 
          />

          <Route 
            path="/login/parent" 
            element={
              <ParentLogin 
                onLogin={handleAuthComplete}
              />
            } 
          />

          <Route 
            path="/login/student" 
            element={
              <StudentLogin 
                onLogin={handleAuthComplete}
              />
            } 
          />

         

          <Route 
            path="/forgot-password" 
            element={<ForgotPassword />} 
          />

          {/* ============================================ */}
          {/* STUDENT SELECTION */}
          {/* ============================================ */}
          <Route 
            path="/select-student" 
            element={
              <SelectStudent 
                students={students}
                onSelectStudent={handleStudentSelect}
              />
            } 
          />

          {/* ============================================ */}
          {/* PROTECTED ROUTES */}
          {/* ============================================ */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/my-courses" 
            element={
              <ProtectedRoute>
                <MyCourses userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/browse-courses" 
            element={
              <ProtectedRoute>
                <BrowseCourses userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/browse-course/:id" 
            element={
              <ProtectedRoute>
                <BrowseCourseDetails userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Tutor Profile - Browse Courses ka inner page */}
          <Route 
            path="/tutor/:id" 
            element={
              <ProtectedRoute>
                <TutorProfile userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Live Classes - Main page */}
          <Route 
            path="/live-classes" 
            element={
              <ProtectedRoute>
                <LiveClasses userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Past Sessions - Live Classes submenu page */}
          <Route 
            path="/past-sessions" 
            element={
              <ProtectedRoute>
                <Pastsessions userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Live Class Details - Inner page */}
          <Route 
            path="/live-class-details/:id" 
            element={
              <ProtectedRoute>
                <Liveclassdetails userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Recent Video Q&A - Dashboard page */}
          <Route 
            path="/recent-video-qa" 
            element={
              <ProtectedRoute>
                <Recentvideoqa userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* AI Tutor - Main page */}
          <Route 
            path="/ai-tutor" 
            element={
              <ProtectedRoute>
                <Aitutor userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Profile - User profile page */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Premium Subscription - Subscription management page */}
          <Route 
            path="/premium-subscription" 
            element={
              <ProtectedRoute>
                <Premiumsubscription userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Edit Profile - Edit user profile page */}
          <Route 
            path="/edit-profile" 
            element={
              <ProtectedRoute>
                <Editprofile userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/course-details/:id" 
            element={
              <ProtectedRoute>
                <CourseDetails userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/quiz-details/:id" 
            element={
              <ProtectedRoute>
                <QuizDetails userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/quiz-take/:id" 
            element={
              <ProtectedRoute>
                <QuizTake userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Notifications userData={userData} onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/check-answers/:id" 
            element={
              <ProtectedRoute>
                <CheckAnswers userData={userData} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </LayoutProvider>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
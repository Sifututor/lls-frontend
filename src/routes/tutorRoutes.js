// src/routes/tutorRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import RoleBasedRoute from './RoleBasedRoute';
import TutorLayout from '../layouts/TutorLayout';
import { ROLES } from '../utils/roleConfig';

// Tutor Pages
import TutorDashboard from '../pages/tutor/TutorDashboard';

// Placeholder pages - extend as needed
const Placeholder = ({ title }) => (
  <div className="dashboard-content tutor-placeholder">
    <h1>{title}</h1>
    <p>Coming soon...</p>
  </div>
);

const TutorRoutes = () => (
  <>
    <Route
      path="/tutor"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.TUTOR]}>
          <TutorLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<TutorDashboard />} />
      <Route path="dashboard" element={<TutorDashboard />} />
      <Route path="courses" element={<Placeholder title="Courses" />} />
      <Route path="courses/upload" element={<Placeholder title="Add Lesson" />} />
      <Route path="courses/quiz/create" element={<Placeholder title="Create Quiz" />} />
      <Route path="courses/pending" element={<Placeholder title="Pending Submissions" />} />
      <Route path="live-classes" element={<Placeholder title="Live Classes" />} />
      <Route path="live-classes/schedule" element={<Placeholder title="Schedule Class" />} />
      <Route path="engagement" element={<Placeholder title="Engagement" />} />
      <Route path="engagement/qna" element={<Placeholder title="Answer Q&A" />} />
      <Route path="engagement/progress" element={<Placeholder title="View Progress" />} />
      <Route path="students" element={<Placeholder title="My Students" />} />
      <Route path="profile" element={<Placeholder title="Tutor Profile" />} />
      <Route path="settings" element={<Placeholder title="Tutor Settings" />} />
      <Route path="notifications" element={<Placeholder title="Tutor Notifications" />} />
    </Route>
  </>
);

export default TutorRoutes;


// src/routes/parentRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import ParentLayout from '../layouts/ParentLayout';
import RoleBasedRoute from './RoleBasedRoute';
import { ROLES } from '../utils/roleConfig';

// Parent Pages
import ParentDashboard from '../pages/parent/ParentDashboard';
// Uncomment as you create these pages:
// import ParentCourses from '../pages/parent/ParentCourses';
// import ParentCourseDetails from '../pages/parent/ParentCourseDetails';
// import ParentLiveClasses from '../pages/parent/ParentLiveClasses';
// import ParentEngagement from '../pages/parent/ParentEngagement';

const ParentRoutes = () => (
  <>
    {/* Parent Index Route */}
    <Route
      path="/parent"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.PARENT]}>
          <ParentLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<ParentDashboard />} />
    </Route>
    
    {/* Parent Dashboard */}
    <Route
      path="/parent/dashboard"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.PARENT]}>
          <ParentLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<ParentDashboard />} />
    </Route>
    
    {/* Courses - Placeholder */}
    <Route
      path="/parent/courses"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.PARENT]}>
          <ParentLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<div className="dashboard-content"><h1>Courses</h1><p>Coming soon...</p></div>} />
    </Route>
    
    {/* Live Classes - Placeholder */}
    <Route
      path="/parent/live-classes"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.PARENT]}>
          <ParentLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<div className="dashboard-content"><h1>Live Classes</h1><p>Coming soon...</p></div>} />
    </Route>
    
    {/* Engagement - Placeholder */}
    <Route
      path="/parent/engagement"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.PARENT]}>
          <ParentLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<div className="dashboard-content"><h1>Engagement</h1><p>Coming soon...</p></div>} />
    </Route>
  </>
);

export default ParentRoutes;
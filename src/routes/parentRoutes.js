import React from 'react';
import { Route } from 'react-router-dom';
import ParentLayout from '../layouts/ParentLayout';
import RoleBasedRoute from './RoleBasedRoute';
import { ROLES } from '../utils/roleConfig';
import ParentDashboard from '../pages/parent/ParentDashboard';
import ComingSoonPage from '../components/ComingSoonPage';

const ParentRoutes = () => (
  <>
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
    <Route
      path="/parent/courses"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.PARENT]}>
          <ParentLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<ComingSoonPage title="Courses" description="View your children's enrolled courses and progress." reason="This feature will be available in a future release." />} />
    </Route>
    <Route
      path="/parent/live-classes"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.PARENT]}>
          <ParentLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<ComingSoonPage title="Live Classes" description="View and manage your children's live class schedules." reason="This feature will be available in a future release." />} />
    </Route>
    <Route
      path="/parent/engagement"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.PARENT]}>
          <ParentLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<ComingSoonPage title="Engagement" description="Monitor your children's learning engagement and activity." reason="This feature will be available in a future release." />} />
    </Route>
  </>
);

export default ParentRoutes;
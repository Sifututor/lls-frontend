// src/routes/adminRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import RoleBasedRoute from './RoleBasedRoute';
import AdminLayout from '../layouts/AdminLayout';
import { ROLES } from '../utils/roleConfig';

import ComingSoonPage from '../components/ComingSoonPage';

const AdminDashboard = () => <ComingSoonPage title="Admin Dashboard" description="Manage users, courses, and platform settings." reason="Admin panel will be available in a future release." />;
const UserManagement = () => <ComingSoonPage title="User Management" description="Manage platform users." reason="Admin features will be available in a future release." />;
const StudentManagement = () => <ComingSoonPage title="Student Management" description="View and manage student accounts." reason="Admin features will be available in a future release." />;
const TutorManagement = () => <ComingSoonPage title="Tutor Management" description="View and manage tutor accounts." reason="Admin features will be available in a future release." />;
const ParentManagement = () => <ComingSoonPage title="Parent Management" description="View and manage parent accounts." reason="Admin features will be available in a future release." />;
const CourseManagement = () => <ComingSoonPage title="Course Management" description="Manage courses and content." reason="Admin features will be available in a future release." />;
const LiveClassManagement = () => <ComingSoonPage title="Live Class Management" description="Manage live class schedules." reason="Admin features will be available in a future release." />;
const ContentModeration = () => <ComingSoonPage title="Content Moderation" description="Review and moderate platform content." reason="Admin features will be available in a future release." />;
const PaymentManagement = () => <ComingSoonPage title="Payment Management" description="View payments and subscriptions." reason="Admin features will be available in a future release." />;
const ReportsAnalytics = () => <ComingSoonPage title="Reports & Analytics" description="Platform analytics and reports." reason="Admin features will be available in a future release." />;
const SystemSettings = () => <ComingSoonPage title="System Settings" description="Configure system preferences." reason="Admin features will be available in a future release." />;
const AuditLogs = () => <ComingSoonPage title="Audit Logs" description="View system audit history." reason="Admin features will be available in a future release." />;
const AdminNotifications = () => <ComingSoonPage title="Admin Notifications" description="Platform notifications." reason="Admin features will be available in a future release." />;

const AdminRoutes = () => (
  <>
    <Route
      path="/admin/dashboard"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="Admin Dashboard">
            <AdminDashboard />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="User Management">
            <UserManagement />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/users/students"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="Student Management">
            <StudentManagement />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/users/tutors"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="Tutor Management">
            <TutorManagement />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/users/parents"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="Parent Management">
            <ParentManagement />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/courses"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="Course Management">
            <CourseManagement />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/live-classes"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="Live Class Management">
            <LiveClassManagement />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/moderation"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="Content Moderation">
            <ContentModeration />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/payments"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="Payment Management">
            <PaymentManagement />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/reports"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="Reports & Analytics">
            <ReportsAnalytics />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/settings"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="System Settings">
            <SystemSettings />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/audit-logs"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="Audit Logs">
            <AuditLogs />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/admin/notifications"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout title="Notifications">
            <AdminNotifications />
          </AdminLayout>
        </RoleBasedRoute>
      }
    />
  </>
);

export default AdminRoutes;


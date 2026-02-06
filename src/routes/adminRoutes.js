// src/routes/adminRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import RoleBasedRoute from './RoleBasedRoute';
import AdminLayout from '../layouts/AdminLayout';
import { ROLES } from '../utils/roleConfig';

// Placeholder pages - TODO: Create these
const AdminDashboard = () => <div className="dashboard-content"><h1>Admin Dashboard</h1><p>Coming soon...</p></div>;
const UserManagement = () => <div className="dashboard-content"><h1>User Management</h1><p>Coming soon...</p></div>;
const StudentManagement = () => <div className="dashboard-content"><h1>Student Management</h1><p>Coming soon...</p></div>;
const TutorManagement = () => <div className="dashboard-content"><h1>Tutor Management</h1><p>Coming soon...</p></div>;
const ParentManagement = () => <div className="dashboard-content"><h1>Parent Management</h1><p>Coming soon...</p></div>;
const CourseManagement = () => <div className="dashboard-content"><h1>Course Management</h1><p>Coming soon...</p></div>;
const LiveClassManagement = () => <div className="dashboard-content"><h1>Live Class Management</h1><p>Coming soon...</p></div>;
const ContentModeration = () => <div className="dashboard-content"><h1>Content Moderation</h1><p>Coming soon...</p></div>;
const PaymentManagement = () => <div className="dashboard-content"><h1>Payment Management</h1><p>Coming soon...</p></div>;
const ReportsAnalytics = () => <div className="dashboard-content"><h1>Reports & Analytics</h1><p>Coming soon...</p></div>;
const SystemSettings = () => <div className="dashboard-content"><h1>System Settings</h1><p>Coming soon...</p></div>;
const AuditLogs = () => <div className="dashboard-content"><h1>Audit Logs</h1><p>Coming soon...</p></div>;
const AdminNotifications = () => <div className="dashboard-content"><h1>Admin Notifications</h1><p>Coming soon...</p></div>;

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


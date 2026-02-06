// src/utils/roleConfig.js

export const ROLES = {
  STUDENT: 'student',
  TUTOR: 'tutor',
  PARENT: 'parent',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.TUTOR]: 'Tutor',
  [ROLES.PARENT]: 'Parent',
  [ROLES.ADMIN]: 'Administrator',
};

export const ROLE_DASHBOARDS = {
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.TUTOR]: '/tutor/dashboard',
  [ROLES.PARENT]: '/parent/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
};

export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: [
    'view_courses',
    'enroll_courses',
    'view_live_classes',
    'join_live_classes',
    'take_quizzes',
    'view_progress',
    'use_ai_tutor',
    'add_bookmarks',
    'add_notes',
  ],
  [ROLES.TUTOR]: [
    'view_students',
    'create_courses',
    'edit_own_courses',
    'create_live_classes',
    'manage_own_classes',
    'create_assignments',
    'grade_submissions',
    'view_earnings',
    'manage_schedule',
  ],
  [ROLES.PARENT]: [
    'view_children',
    'view_child_progress',
    'view_child_courses',
    'view_child_attendance',
    'make_payments',
    'view_payment_history',
  ],
  [ROLES.ADMIN]: [
    'manage_users',
    'manage_courses',
    'manage_live_classes',
    'manage_payments',
    'view_analytics',
    'system_settings',
    'view_audit_logs',
    'content_moderation',
  ],
};

// Helper functions
export const hasPermission = (userRole, permission) => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const getRoleDashboard = (userRole) => {
  return ROLE_DASHBOARDS[userRole] || '/';
};

export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role);
};


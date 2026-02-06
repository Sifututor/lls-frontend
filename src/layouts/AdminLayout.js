// src/layouts/AdminLayout.js
import React from 'react';
// TODO: Create AdminSidebar and AdminTopNavbar components
import '../assets/css/layout.css';
// TODO: Add admin-specific CSS when created: import '../assets/css/admin/admin-dashboard.css';

const AdminLayout = ({ children, title = 'Admin Dashboard' }) => {
  return (
    <div className="admin-layout">
      {/* TODO: Add AdminSidebar and AdminTopNavbar */}
      <main className="main-content admin-main">
        <div className="page-content admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;


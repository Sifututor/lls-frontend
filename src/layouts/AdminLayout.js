import React from 'react';
import '../assets/css/layout.css';

const AdminLayout = ({ children, title = 'Admin Dashboard' }) => {
  return (
    <div className="admin-layout">
      <main className="main-content admin-main">
        <div className="page-content admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;


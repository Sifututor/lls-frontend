// src/layouts/ParentLayout.js
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ParentSidebar from '../components/parent/ParentSidebar';
import TopNavbar from '../components/TopNavbar';

function ParentLayout() {
  const location = useLocation();

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/parent/dashboard' || path === '/parent') return 'Dashboard';
    if (path === '/parent/courses') return 'Courses';
    if (path.startsWith('/parent/course/')) return 'Course Details';
    if (path === '/parent/live-classes') return 'Live Classes';
    if (path.startsWith('/parent/live-class/')) return 'Live Class Details';
    if (path === '/parent/engagement') return 'Engagement';
    if (path === '/parent/settings') return 'Settings';
    if (path === '/parent/profile') return 'Profile';
    
    return 'Dashboard';
  };

  return (
    <div className="layout parent-layout">
      <ParentSidebar />
      <main className="main-content">
        <TopNavbar title={getPageTitle()} />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ParentLayout;
// src/layouts/TutorLayout.js
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TutorSidebar from '../components/tutor/TutorSidebar';
import TopNavbar from '../components/TopNavbar';
import '../assets/css/layout.css';
import '../assets/css/tutor.css';

function TutorLayout({ children }) {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/tutor/dashboard' || path === '/tutor') return 'Dashboard';
    if (path.startsWith('/tutor/courses')) return 'Courses';
    if (path.startsWith('/tutor/live-classes')) return 'Live Classes';
    if (path.startsWith('/tutor/engagement')) return 'Engagement';
    return 'Tutor Dashboard';
  };

  return (
    <div className="layout tutor-layout">
      <TutorSidebar />
      <main className="main-content">
        <TopNavbar title={getPageTitle()} />
        <div className="page-content tutor-content">
          {children != null ? children : <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default TutorLayout;

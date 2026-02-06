// src/layouts/StudentLayout.js
import React from 'react';
import Sidebar from '../components/student/Sidebar';
import TopNavbar from '../components/student/TopNavbar';
import '../assets/css/layout.css';

const StudentLayout = ({ children, title = 'Dashboard' }) => {
  return (
    <>
      <Sidebar />
      <main className="main-content">
        <TopNavbar title={title} />
        <div className="page-content">
          {children}
        </div>
      </main>
    </>
  );
};

export default StudentLayout;


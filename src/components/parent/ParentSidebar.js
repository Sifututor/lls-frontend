// src/components/parent/ParentSidebar.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutContext } from '../../context/LayoutContext';

function ParentSidebar() {
  const location = useLocation();
  const { collapsed, mobileOpen, setMobileOpen } = useContext(LayoutContext);

  // Active state checks
  const isDashboardActive = () => {
    return location.pathname === '/parent/dashboard' || location.pathname === '/parent';
  };

  const isCourseActive = () => {
    return location.pathname.startsWith('/parent/course');
  };

  const isLiveClassesActive = () => {
    return location.pathname.startsWith('/parent/live-class');
  };

  const isEngagementActive = () => {
    return location.pathname.startsWith('/parent/engagement');
  };

  const handleOverlayClick = () => {
    setMobileOpen(false);
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 767) {
      setMobileOpen(false);
    }
  };

  // Build class names
  const sidebarClasses = ['sidebar'];
  if (collapsed) sidebarClasses.push('collapsed');
  if (mobileOpen) sidebarClasses.push('active');

  const overlayClasses = ['sidebar-overlay'];
  if (mobileOpen) overlayClasses.push('active');

  return (
    <>
      <div className={overlayClasses.join(' ')} onClick={handleOverlayClick} />
      
      <aside className={sidebarClasses.join(' ')}>
        <div className="sidebar-inner">
          {/* Logo */}
          <div className="logo">
            <img 
              src={collapsed ? "/assets/images/learnest-menu.png" : "/assets/images/Learnest-logo.png"} 
              alt={collapsed ? "L" : "Learnest Logo"} 
              className={collapsed ? "logo-image-small" : "logo-image"} 
            />
          </div>

          {/* Navigation */}
          <nav className="sidebar-section">
            <ul className="nav-list">
              {/* Dashboard */}
              <li>
                <Link 
                  to="/parent/dashboard" 
                  className={`nav-item ${isDashboardActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/Dashboard.svg" alt="Dashboard" className="nav-icon" />
                  {!collapsed && <span>Dashboard</span>}
                </Link>
              </li>
              
              {/* Course */}
              <li>
                <Link 
                  to="/parent/courses" 
                  className={`nav-item ${isCourseActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/My Courses.svg" alt="Course" className="nav-icon" />
                  {!collapsed && <span>Course</span>}
                </Link>
              </li>

              {/* Live Classes */}
              <li>
                <Link 
                  to="/parent/live-classes" 
                  className={`nav-item ${isLiveClassesActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/Live Classes.svg" alt="Live Classes" className="nav-icon" />
                  {!collapsed && <span>Live Classes</span>}
                </Link>
              </li>

              {/* Engagement */}
              <li>
                <Link 
                  to="/parent/engagement" 
                  className={`nav-item ${isEngagementActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/Dashboard.svg" alt="Engagement" className="nav-icon" />
                  {!collapsed && <span>Engagement</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default ParentSidebar;
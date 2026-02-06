// src/components/tutor/TutorSidebar.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutContext } from '../../context/LayoutContext';

function TutorSidebar() {
  const location = useLocation();
  const { collapsed, mobileOpen, setMobileOpen } = useContext(LayoutContext);

  const isDashboardActive = () =>
    location.pathname === '/tutor/dashboard' || location.pathname === '/tutor';

  const isCoursesActive = () => location.pathname.startsWith('/tutor/courses');

  const isLiveClassesActive = () => location.pathname.startsWith('/tutor/live-classes');

  const isEngagementActive = () => location.pathname.startsWith('/tutor/engagement');

  const handleOverlayClick = () => setMobileOpen(false);

  const handleLinkClick = () => {
    if (window.innerWidth <= 767) setMobileOpen(false);
  };

  const sidebarClasses = ['sidebar', 'tutor-sidebar'];
  if (collapsed) sidebarClasses.push('collapsed');
  if (mobileOpen) sidebarClasses.push('active');

  const overlayClasses = ['sidebar-overlay'];
  if (mobileOpen) overlayClasses.push('active');

  return (
    <>
      <div className={overlayClasses.join(' ')} onClick={handleOverlayClick} aria-hidden="true" />
      <aside className={sidebarClasses.join(' ')}>
        <div className="sidebar-inner">
          <div className="logo">
            <Link to="/tutor/dashboard" onClick={handleLinkClick}>
              <img
                src={collapsed ? '/assets/images/learnest-menu.png' : '/assets/images/Learnest-logo.png'}
                alt={collapsed ? 'L' : 'Learnest'}
                className={collapsed ? 'logo-image-small' : 'logo-image'}
              />
            </Link>
          </div>

          <nav className="sidebar-section">
            <ul className="nav-list">
              <li>
                <Link
                  to="/tutor/dashboard"
                  className={`nav-item ${isDashboardActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/Dashboard.svg" alt="" className="nav-icon" />
                  {!collapsed && <span>Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/tutor/courses"
                  className={`nav-item ${isCoursesActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/My Courses.svg" alt="" className="nav-icon" />
                  {!collapsed && <span>Courses</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/tutor/live-classes"
                  className={`nav-item ${isLiveClassesActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/Live Classes.svg" alt="" className="nav-icon" />
                  {!collapsed && <span>Live Classes</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/tutor/engagement"
                  className={`nav-item ${isEngagementActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/Dashboard.svg" alt="" className="nav-icon" />
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

export default TutorSidebar;

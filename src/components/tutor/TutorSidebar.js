// src/components/tutor/TutorSidebar.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutContext } from '../../context/LayoutContext';

const HashIcon = () => (
  <img src="/assets/images/icons/Dashboard.svg" alt="" className="nav-icon" />
);

const MENU = [
  {
    label: 'Dashboard',
    path: '/tutor/dashboard',
    children: null,
  },
  {
    label: 'Course',
    pathBase: '/tutor/courses',
    children: [
      { label: 'My Courses', path: '/tutor/courses' },
      { label: 'Upload Lesson', path: '/tutor/courses/upload' },
      { label: 'Create Quiz', path: '/tutor/courses/quiz/create' },
      { label: 'Pending Approval', path: '/tutor/courses/pending' },
    ],
  },
  {
    label: 'Live Classes',
    pathBase: '/tutor/live-classes',
    children: [
      { label: 'Schedule Class', path: '/tutor/live-classes/schedule' },
      { label: 'My Live Classes', path: '/tutor/live-classes' },
      { label: 'Upload Recording', path: '/tutor/live-classes/upload-recording' },
    ],
  },
  {
    label: 'Engagement',
    pathBase: '/tutor/engagement',
    children: [
      { label: 'Video Q&A', path: '/tutor/engagement/qna' },
      { label: 'Student Progress', path: '/tutor/engagement/progress' },
      { label: 'Progress Cards', path: '/tutor/engagement/progress-cards' },
      { label: 'Quiz Results', path: '/tutor/engagement/quiz-results' },
    ],
  },
];

function TutorSidebar() {
  const location = useLocation();
  const { collapsed, mobileOpen, setMobileOpen } = useContext(LayoutContext);
  const path = location.pathname;

  const handleOverlayClick = () => setMobileOpen(false);
  const handleLinkClick = () => {
    if (window.innerWidth <= 767) setMobileOpen(false);
  };

  const isMainActive = (item) => {
    if (item.path) return path === item.path || (path === '/tutor' && item.path === '/tutor/dashboard');
    if (item.pathBase) return path === item.pathBase || path.startsWith(item.pathBase + '/');
    return false;
  };

  const isSubActive = (subPath) => path === subPath;

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
              {MENU.map((item) => {
                const mainActive = isMainActive(item);
                const showSub = item.children && (mainActive || path.startsWith((item.pathBase || '') + '/'));

                return (
                  <li key={item.label}>
                    {item.path ? (
                      <Link
                        to={item.path === '/tutor/dashboard' ? '/tutor/dashboard' : item.path}
                        className={`nav-item ${mainActive ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        <HashIcon />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    ) : (
                      <Link
                        to={item.children?.[0]?.path || item.pathBase}
                        className={`nav-item ${mainActive ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        <HashIcon />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    )}
                    {!collapsed && item.children && showSub && (
                      <ul className="nav-submenu">
                        {item.children.map((sub) => (
                          <li key={sub.path}>
                            <Link
                              to={sub.path}
                              className={`nav-subitem ${isSubActive(sub.path) ? 'active' : ''}`}
                              onClick={handleLinkClick}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default TutorSidebar;

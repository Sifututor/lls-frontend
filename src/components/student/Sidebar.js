// src/components/student/Sidebar.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutContext } from '../../context/LayoutContext';
import { isPremiumUser, getUserType } from '../../store/api/authApi';
import Premiumupgrademodal from '../Premiumupgrademodal';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { collapsed, mobileOpen, setMobileOpen } = useContext(LayoutContext);
  const [isPremium, setIsPremium] = useState(false);
  const [userType, setUserType] = useState('student');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    setIsPremium(isPremiumUser());
    setUserType(getUserType());
  }, []);

  // Dashboard active state - updated for new paths
  const isDashboardActive = () => {
    return location.pathname === '/student/dashboard' || location.pathname.startsWith('/student/dashboard');
  };

  // My Courses active state - includes all inner pages
  const isMyCoursesActive = () => {
    const myCoursesPages = [
      '/student/my-courses',
      '/student/course',
      '/student/quiz',
      '/student/check-answers'
    ];
    
    return myCoursesPages.some(page => location.pathname.startsWith(page));
  };

  // Browse Courses active state - includes inner pages
  const isBrowseCoursesActive = () => {
    const browsePages = [
      '/student/browse-courses',
      '/student/browse-course',
      '/student/tutor'
    ];
    
    return browsePages.some(page => location.pathname.startsWith(page));
  };

  // Live Classes active state - includes all related pages
  const isLiveClassesActive = () => {
    const liveClassPages = [
      '/student/live-classes',
      '/student/past-sessions',
      '/student/live-class'
    ];
    
    return liveClassPages.some(page => location.pathname.startsWith(page));
  };

  // AI Tutor active state
  const isAiTutorActive = () => {
    return location.pathname === '/student/ai-tutor';
  };

  const handleOverlayClick = () => {
    setMobileOpen(false);
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 767) {
      setMobileOpen(false);
    }
  };

  const handlePremiumClick = () => {
    setShowPremiumModal(true);
    handleLinkClick();
  };

  const handleCloseModal = () => {
    setShowPremiumModal(false);
  };

  const sidebarClasses = ['sidebar'];
  if (collapsed) sidebarClasses.push('collapsed');
  if (mobileOpen) sidebarClasses.push('active');
  const sidebarClass = sidebarClasses.join(' ');

  const overlayClasses = ['sidebar-overlay'];
  if (mobileOpen) overlayClasses.push('active');
  const overlayClass = overlayClasses.join(' ');

  return (
    <>
      <div className={overlayClass} onClick={handleOverlayClick} />
      
      <aside className={sidebarClass}>
        <div className="sidebar-inner">
          <div className="logo">
            <img 
              src={collapsed ? "/assets/images/learnest-menu.png" : "/assets/images/Learnest-logo.png"} 
              alt={collapsed ? "L" : "Learnest Logo"} 
              className={collapsed ? "logo-image-small" : "logo-image"} 
            />
          </div>

          <nav className="sidebar-section">
            {!collapsed && <div className="section-label">LEARNING</div>}
            <ul className="nav-list">
              {/* Dashboard */}
              <li>
                <Link 
                  to="/student/dashboard" 
                  className={`nav-item ${isDashboardActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/Dashboard.svg" alt="Dashboard" className="nav-icon" />
                  {!collapsed && <span>Dashboard</span>}
                </Link>
              </li>
              
              {/* My Courses */}
              <li>
                <Link 
                  to="/student/my-courses" 
                  className={`nav-item ${isMyCoursesActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/My Courses.svg" alt="My Courses" className="nav-icon" />
                  {!collapsed && <span>My Courses</span>}
                </Link>
              </li>
              
              {/* Browse Courses */}
              <li>
                <Link 
                  to="/student/browse-courses" 
                  className={`nav-item ${isBrowseCoursesActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/Browse Courses.svg" alt="Browse Courses" className="nav-icon" />
                  {!collapsed && <span>Browse Courses</span>}
                </Link>
              </li>

              {/* Live Classes */}
              <li className="nav-item-with-submenu">
                <Link
                  to="/student/live-classes"
                  className={`nav-item ${isLiveClassesActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/Live Classes.svg" alt="Live Classes" className="nav-icon" />
                  {!collapsed && <span>Live Classes</span>}
                </Link>

                {!collapsed && isLiveClassesActive() && (
                  <ul className="nav-submenu show">
                    <li>
                      <Link 
                        to="/student/past-sessions" 
                        className={`nav-subitem ${location.pathname === '/student/past-sessions' ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        <img src="/assets/images/icons/live-classes-submenu.svg" alt="Past Sessions" className="nav-icon" />
                        <span>Past Sessions</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* AI Tutor */}
              <li>
                <Link 
                  to="/student/ai-tutor" 
                  className={`nav-item ${isAiTutorActive() ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <img src="/assets/images/icons/ai-menu.svg" alt="AI Tutor" className="nav-icon" />
                  {!collapsed && <span>AI Tutor</span>}
                </Link>
              </li>
            </ul>
          </nav>

          {!isPremium && (
            <div className={`premium-card ${collapsed ? 'collapsed' : ''}`}>
              {collapsed ? (
                <div className="premium-icon-only" onClick={handlePremiumClick} style={{ cursor: 'pointer' }}>
                  <img src="/assets/images/icons/go-premime.svg" alt="Crown" />
                </div>
              ) : (
                <>
                  <div className="premium-top">
                    <div className="premium-icon">
                      <img src="/assets/images/icons/go-premime.svg" alt="Crown" />
                    </div>
                    <div className="premium-text">
                      <h4 className="premium-title">Go Premium</h4>
                      <p className="premium-desc">Unlock all features</p>
                    </div>
                  </div>
                  <button className="btn-premium" onClick={handlePremiumClick}>
                    Upgrade Now
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Premium Modal */}
      <Premiumupgrademodal 
        isOpen={showPremiumModal}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default Sidebar;


// src/components/TopNavbar.js
import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { logout, selectCurrentUser } from "../store/slices/authSlice";
import { authApi, getUserType, isPremiumUser } from "../store/api/authApi";
import { LayoutContext } from "../context/LayoutContext";

const { useLogoutMutation, useGetMeQuery } = authApi;

const BREADCRUMB_TITLE_MAX_LENGTH = 28;

function truncateBreadcrumbTitle(text) {
  if (!text || typeof text !== 'string') return text || '';
  const t = text.trim();
  if (t.length <= BREADCRUMB_TITLE_MAX_LENGTH) return t;
  return t.slice(0, BREADCRUMB_TITLE_MAX_LENGTH).trim() + '…';
}

function TopNavbar({ title, breadcrumb }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { data: meResponse } = useGetMeQuery(undefined, { skip: !currentUser?.id });

  const userName = currentUser?.profile
    ? `${currentUser.profile.first_name || ''} ${currentUser.profile.last_name || ''}`.trim() || currentUser?.name
    : currentUser?.name || 'Student';
  const userAvatar = currentUser?.profile?.profile_image
    || currentUser?.avatar
    || '/assets/images/icons/Ellipse 3.svg';
  const userEmail = (currentUser?.profile?.email ?? currentUser?.email) || '';

  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userType, setUserType] = useState('student');
  const [isPremium, setIsPremium] = useState(false);

  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useContext(LayoutContext);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    setUserType(getUserType());
    setIsPremium(isPremiumUser());
  }, []);

  const getUserDisplayInfo = () => {
    if (currentUser) {
      const userName = currentUser.profile
        ? `${currentUser.profile.first_name || ''} ${currentUser.profile.last_name || ''}`.trim() || currentUser.name
        : currentUser.name;
      const userAvatar = currentUser.profile?.profile_image || currentUser.avatar || '/assets/images/icons/Ellipse 3.svg';
      const userEmail = currentUser.profile?.email ?? currentUser.email;
      return {
        name: userName || 'User',
        email: userEmail || 'user@example.com',
        avatar: userAvatar,
        role: currentUser.user_type || userType
      };
    }

    const storedUser = localStorage.getItem('userData') || Cookies.get('userData');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const userName = userData.profile
          ? `${userData.profile.first_name || ''} ${userData.profile.last_name || ''}`.trim() || userData.name
          : userData.name;
        const userAvatar = userData.profile?.profile_image || userData.avatar || '/assets/images/icons/Ellipse 3.svg';
        return {
          name: userName || 'User',
          email: (userData.profile?.email ?? userData.email) || 'user@example.com',
          avatar: userAvatar,
          role: userData.user_type || userType
        };
      } catch (e) {
        if (process.env.NODE_ENV === 'development') console.error('Error parsing user data:', e);
      }
    }

    return {
      name: 'User',
      email: 'user@example.com',
      avatar: '/assets/images/icons/Ellipse 3.svg',
      role: userType
    };
  };

  const userInfo = getUserDisplayInfo();

  const getUserMeta = () => {
    if (userInfo.role === 'parent') {
      return 'Parent Account';
    } else if (userInfo.role === 'tutor') {
      return 'Tutor Account';
    }
    // Prefer form_level from getMe API response, then Redux, then localStorage
    const apiUser = meResponse?.user || meResponse?.data?.user;
    const raw = apiUser || currentUser || (() => {
      try {
        const s = localStorage.getItem('userData') || Cookies.get('userData');
        return s ? JSON.parse(s) : null;
      } catch { return null; }
    })();
    const user = raw?.user || raw;
    const profile = user?.profile || raw?.profile || {};
    const formLevel = user?.form_level ?? raw?.form_level ?? profile.form_level ?? '';
    const formDisplay = formLevel
      ? (formLevel.startsWith('Form') ? formLevel : String(formLevel).replace(/^form_/, 'Form '))
      : '';
    return formDisplay || 'Form level not set';
  };

  const getBreadcrumbData = () => {
    const path = location.pathname;

    if (path.startsWith('/student/browse-course/')) {
      return {
        parentName: 'Browse Courses',
        parentLink: '/student/browse-courses',
        currentName: breadcrumb || 'Course Details'
      };
    }

    if (path.startsWith('/student/course/')) {
      return {
        parentName: 'My Courses',
        parentLink: '/student/my-courses',
        currentName: breadcrumb || 'Course Details'
      };
    }

    if (path.startsWith('/student/quiz-details/')) {
      return {
        parentName: 'My Courses',
        parentLink: '/student/my-courses',
        currentName: breadcrumb || 'Quiz Details'
      };
    }

    if (path.startsWith('/student/quiz-take/')) {
      return {
        parentName: 'My Courses',
        parentLink: '/student/my-courses',
        currentName: breadcrumb || 'Take Quiz'
      };
    }

    if (path.startsWith('/student/check-answers/')) {
      return {
        parentName: 'My Courses',
        parentLink: '/student/my-courses',
        currentName: breadcrumb || 'Check Answers'
      };
    }

    if (path.startsWith('/student/tutor/')) {
      return {
        parentName: 'Browse Courses',
        parentLink: '/student/browse-courses',
        currentName: breadcrumb || 'Tutor Profile'
      };
    }

    if (path.startsWith('/student/live-class/')) {
      return {
        parentName: 'Live Classes',
        parentLink: '/student/live-classes',
        currentName: breadcrumb || 'Live Class Details'
      };
    }

    if (path === '/student/past-sessions') {
      return {
        parentName: 'Live Classes',
        parentLink: '/student/live-classes',
        currentName: 'Past Sessions'
      };
    }

    // Tutor Upload Lesson: Content / Upload Video
    if (path === '/tutor/courses/upload') {
      return {
        parentName: 'Content',
        parentLink: '/tutor/courses',
        currentName: breadcrumb || 'Upload Video'
      };
    }

    // Tutor Create Quiz: Content / Create Quiz
    if (path === '/tutor/courses/quiz/create') {
      return {
        parentName: 'Content',
        parentLink: '/tutor/courses',
        currentName: breadcrumb || 'Create Quiz'
      };
    }

    // Tutor Pending Approval: Content / Pending Approval
    if (path === '/tutor/courses/pending') {
      return {
        parentName: 'Content',
        parentLink: '/tutor/courses',
        currentName: breadcrumb || 'Pending Approval'
      };
    }

    // Tutor Live Classes – My Live Classes: Live Classes / My Live Classes
    if (path === '/tutor/live-classes') {
      return {
        parentName: 'Live Classes',
        parentLink: '/tutor/live-classes',
        currentName: breadcrumb || 'My Live Classes'
      };
    }

    // Tutor Live Classes – Schedule Class: Live Classes / Schedule Class
    if (path === '/tutor/live-classes/schedule') {
      return {
        parentName: 'Live Classes',
        parentLink: '/tutor/live-classes',
        currentName: breadcrumb || 'Schedule Class'
      };
    }

    // Tutor Live Classes – Upload Recording (detail, sidebar): Live Classes / Upload Recording
    if (path === '/tutor/live-classes/upload-recording') {
      return {
        parentName: 'Live Classes',
        parentLink: '/tutor/live-classes',
        currentName: breadcrumb || 'Upload Recording'
      };
    }

    // Tutor Live Classes – Upload Live Class (form, quick link): Live Classes / Upload Live Class
    if (path === '/tutor/live-classes/upload-live-class') {
      return {
        parentName: 'Live Classes',
        parentLink: '/tutor/live-classes',
        currentName: breadcrumb || 'Upload Live Class'
      };
    }

    // Tutor Engagement – Video Q&A: Engagement / Video Q&A
    if (path === '/tutor/engagement/qna') {
      return {
        parentName: 'Engagement',
        parentLink: '/tutor/engagement',
        currentName: breadcrumb || 'Video Q&A'
      };
    }

    // Tutor Engagement – Student Progress: Engagement / Student Progress
    if (path === '/tutor/engagement/progress') {
      return {
        parentName: 'Engagement',
        parentLink: '/tutor/engagement',
        currentName: breadcrumb || 'Student Progress'
      };
    }

    if (path === '/tutor/engagement/progress-cards') {
      return {
        parentName: 'Engagement',
        parentLink: '/tutor/engagement',
        currentName: breadcrumb || 'Student Progress Cards'
      };
    }

    if (path.startsWith('/tutor/engagement/progress-cards/student/')) {
      return {
        parentName: 'Student Progress Cards',
        parentLink: '/tutor/engagement/progress-cards',
        currentName: breadcrumb || 'Student Profile'
      };
    }

    if (path === '/tutor/engagement/quiz-results') {
      return {
        parentName: 'Engagement',
        parentLink: '/tutor/engagement',
        currentName: breadcrumb || 'Quiz Results'
      };
    }

    if (path === '/tutor/profile') {
      return {
        parentName: 'Dashboard',
        parentLink: '/tutor/dashboard',
        currentName: breadcrumb || 'Profile'
      };
    }

    if (path === '/tutor/verification-form') {
      return {
        parentName: 'Dashboard',
        parentLink: '/tutor/dashboard',
        currentName: breadcrumb || 'Verification Form'
      };
    }

    // Tutor course inner: Content / My Courses / <Course Title>
    if (path.startsWith('/tutor/courses/') && path !== '/tutor/courses') {
      const fullName = location.state?.courseTitle || breadcrumb || 'Course';
      return {
        parentName: 'Content / My Courses',
        parentLink: '/tutor/courses',
        currentName: truncateBreadcrumbTitle(fullName)
      };
    }

    return null;
  };

  const breadcrumbData = getBreadcrumbData();

  useEffect(() => {
    if (!notificationOpen && !profileOpen) return;

    const handleOutside = (event) => {
      const nEl = notificationRef.current;
      const pEl = profileRef.current;

      const clickedInNotification = nEl && nEl.contains(event.target);
      const clickedInProfile = pEl && pEl.contains(event.target);

      if (clickedInNotification || clickedInProfile) return;

      setNotificationOpen(false);
      setProfileOpen(false);
    };

    document.addEventListener("pointerdown", handleOutside, { capture: true });

    return () => {
      document.removeEventListener("pointerdown", handleOutside, { capture: true });
    };
  }, [notificationOpen, profileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
    logoutApi().catch(() => {});
  };

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 767) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const handleSwitch = () => {
    if (userInfo.role === 'parent') {
      navigate('/select-student');
    } else {
      navigate('/login');
    }
    setProfileOpen(false);
  };

  return (
    <header className={`top-navbar ${collapsed ? "collapsed" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={handleSidebarToggle}
        aria-label="Toggle sidebar"
        type="button"
      >
        <img src="/assets/images/icons/humber-menu.svg" alt="menu" />
      </button>

      <span className="dashboard-title topbar-breadcrumb">
        {breadcrumbData ? (
          <>
            <a 
              href={breadcrumbData.parentLink} 
              className="dashboard-link flex"
              onClick={(e) => {
                e.preventDefault();
                navigate(breadcrumbData.parentLink);
              }}
            >
              <img src="/assets/images/icons/Background.png" alt="" /> 
              {breadcrumbData.parentName}
            </a>
            {" / "}
            <span className="dashboard-link inner" title={location.state?.courseTitle || breadcrumbData.currentName}>{breadcrumbData.currentName}</span>
          </>
        ) : (
          title
        )}
      </span>

      <div className="navbar-right">
        <div className="search-wrapper">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search for courses, lessons, or tutors..."
            />
          </div>
        </div>

        <div ref={notificationRef} style={{ position: "relative" }}>
          <button
            className="notification-btn"
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setNotificationOpen((prev) => !prev);
              setProfileOpen(false);
            }}
          >
            <img
              src="/assets/images/icons/106-notification.svg"
              alt="Notifications"
              className="notification-icon"
            />
            <span className="notification-badge">4</span>
          </button>

          {notificationOpen && (
            <div className="notification-dropdown active">
              <div className="notification-header">
                <div>
                  <h4>Notifications</h4>
                  <div className="notification-filter">
                    <button className="filter-btn" type="button">
                      All
                      <img
                        src="/assets/images/icons/arrow.svg"
                        alt="dropdown"
                        style={{ width: 10, height: 10, marginLeft: 4 }}
                      />
                    </button>
                  </div>
                </div>
                <button className="mark-read-btn" type="button">
                  Mark all read
                </button>
              </div>

              <div className="notification-list">
                <div className="notification-section-title">Today</div>

                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="notification-item unread">
                    <span className="notification-dot"></span>
                    <div className="notification-item read">
                      <div className="notification-content">
                        <h5>Live class starting in 30 minutes</h5>
                        <p>SPM Revision: Additional Mathematics</p>
                        <div className="notification-time">
                          <span>10 min ago</span>
                          {!isPremium && (
                            <span className="premium-badge">
                              <img
                                src="/assets/images/icons/120-setting.svg"
                                alt="Premium"
                              />
                              Premium
                            </span>
                          )}
                        </div>
                      </div>

                      {i === 1 && (
                        <div className="notification-action">
                          <button className="join-btn-small" type="button">
                            Join
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="notification-footer">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/student/notifications'); }}>
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </div>

        <div ref={profileRef} style={{ position: "relative" }}>
          <div
            className="user-profile"
            role="button"
            tabIndex={0}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setProfileOpen((prev) => !prev);
              setNotificationOpen(false);
            }}
          >
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-meta">{getUserMeta()}</div>
            </div>
            <img
              src={userAvatar}
              alt="User Avatar"
              className="user-avatar"
              onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/icons/Ellipse 3.svg'; }}
            />
          </div>

          {profileOpen && userInfo.role === 'tutor' && (
            <div className="profile-dropdown active">
              <div className="profile-dropdown-header">
                <img
                  src={userAvatar}
                  alt="Avatar"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/icons/Ellipse 3.svg'; }}
                />
                <div className="profile-dropdown-info">
                  <h4>Tutor</h4>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                    {userEmail}
                  </p>
                </div>
              </div>
              <div className="profile-dropdown-menu">
                <div
                  className="profile-menu-item"
                  onClick={() => {
                    navigate("/tutor/profile");
                    setProfileOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img src="/assets/images/icons/059-pencil.svg" alt="" />
                  <span>Profile</span>
                </div>
                <div
                  className="profile-menu-item"
                  onClick={() => {
                    navigate("/tutor/verification-form");
                    setProfileOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img src="/assets/images/icons/profile-setting.svg" alt="" />
                  <span>Verification</span>
                </div>
              </div>
              <div className="profile-dropdown-footer">
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  type="button"
                >
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>
          )}

          {profileOpen && userInfo.role !== 'tutor' && (
            <div className="profile-dropdown active">
              <div className="profile-dropdown-header">
                <img
                  src={userAvatar}
                  alt="Avatar"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/icons/Ellipse 3.svg'; }}
                />
                <div className="profile-dropdown-info">
                  <h4>
                    {userInfo.role === 'parent' ? 'Parent' : 'Student'}
                  </h4>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                    {userEmail}
                  </p>
                </div>
                {userInfo.role === 'parent' && (
                  <button 
                    className="switch-btn" 
                    type="button"
                    onClick={handleSwitch}
                  >
                    Switch
                  </button>
                )}
              </div>

              <div className="profile-dropdown-menu">
                <div
                  className="profile-menu-item"
                  onClick={() => {
                    navigate("/student/profile");
                    setProfileOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img src="/assets/images/icons/059-pencil.svg" alt="" />
                  <span>Manage Profile</span>
                </div>
                <div
                  className="profile-menu-item"
                  onClick={() => {
                    navigate("/student/settings");
                    setProfileOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img src="/assets/images/icons/profile-setting.svg" alt="" />
                  <span>Settings</span>
                </div>
                {!isPremium && (
                  <div
                    className="profile-menu-item"
                    onClick={() => {
                      navigate("/student/subscription");
                      setProfileOpen(false);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img src="/assets/images/icons/go-premime.svg" alt="" />
                    <span>Go Premium</span>
                  </div>
                )}
              </div>

              <div className="profile-dropdown-footer">
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  type="button"
                >
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
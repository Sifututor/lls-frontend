// src/components/student/TopNavbar.js
import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { logout, selectCurrentUser } from "../../store/slices/authSlice";
import { useLogoutMutation } from "../../store/api/authApi";
import { getUserType, isPremiumUser } from "../../store/api/authApi";
import { LayoutContext } from "../../context/LayoutContext";

function TopNavbar({ title, breadcrumb }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

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
        console.error('Error parsing user data:', e);
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
    // Dynamic: form_level and stream from profile / userData
    const raw = currentUser || (() => {
      try {
        const s = localStorage.getItem('userData') || Cookies.get('userData');
        return s ? JSON.parse(s) : null;
      } catch { return null; }
    })();
    const profile = raw?.profile || {};
    const formLevel = profile.form_level || raw?.form_level || '';
    const stream = profile.stream || raw?.stream || profile.stream_name || raw?.stream_name || '';
    const formDisplay = formLevel
      ? (formLevel.startsWith('Form') ? formLevel : formLevel.replace(/^form_/, 'Form '))
      : '';
    const streamDisplay = stream || 'Science Stream';
    if (formDisplay && streamDisplay) return `${formDisplay} • ${streamDisplay}`;
    if (formDisplay) return formDisplay;
    return 'Form 4 • Science Stream';
  };

  const getBreadcrumbData = () => {
    const path = location.pathname;

    // Updated paths for student routes
    if (path.startsWith('/student/browse-course/') || path.startsWith('/student/browse-courses/')) {
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

    if (path.startsWith('/student/quiz/') && !path.includes('/take') && !path.includes('/review')) {
      return {
        parentName: 'My Courses',
        parentLink: '/student/my-courses',
        currentName: breadcrumb || 'Quiz Details'
      };
    }

    if (path.startsWith('/student/quiz/') && path.includes('/take')) {
      return {
        parentName: 'My Courses',
        parentLink: '/student/my-courses',
        currentName: breadcrumb || 'Take Quiz'
      };
    }

    if (path.startsWith('/student/quiz/') && path.includes('/review')) {
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

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      dispatch(logout());
      navigate("/", { replace: true });
    }
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

  // Truncate name function for long names
  const truncateName = (name, maxLength = 15) => {
    if (!name) return '';
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
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

      <span className="dashboard-title">
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
            <span className="dashboard-link inner">{breadcrumbData.currentName}</span>
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
              <div className="user-name">{truncateName(userInfo.name, 15)}</div>
              <div className="user-meta">{getUserMeta()}</div>
            </div>
            <img
              src={userInfo.avatar}
              alt="User Avatar"
              className="user-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/icons/Ellipse 3.svg';
              }}
            />
          </div>

          {profileOpen && (
            <div className="profile-dropdown active">
              <div className="profile-dropdown-header">
                <img
                  src={userInfo.avatar}
                  alt="Avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/icons/Ellipse 3.svg';
                  }}
                />
                <div className="profile-dropdown-info">
                  <h4>
                    {userInfo.role === 'parent' ? 'Parent' : 
                     userInfo.role === 'tutor' ? 'Tutor' : 'Student'}
                  </h4>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                    {userInfo.email}
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
                  <span>My Profile</span>
                </div>
                <div
                  className="profile-menu-item"
                  onClick={() => {
                    navigate("/student/profile/edit");
                    setProfileOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img src="/assets/images/icons/059-pencil.svg" alt="" />
                  <span>Edit Profile</span>
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


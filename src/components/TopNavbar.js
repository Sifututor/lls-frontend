// src/components/TopNavbar.js
import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "../store/slices/authSlice";
import { useLogoutMutation } from "../store/api/authApi";
import { getUserType, isPremiumUser } from "../store/api/authApi";
import { LayoutContext } from "../context/LayoutContext";

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
      return {
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar || '/assets/images/icons/Ellipse 3.svg',
        role: currentUser.user_type || userType
      };
    }

    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return {
          name: userData.name || 'User',
          email: userData.email || 'user@example.com',
          avatar: userData.avatar || '/assets/images/icons/Ellipse 3.svg',
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
    } else {
      return 'Form 4 • Science Stream';
    }
  };

  const getBreadcrumbData = () => {
    const path = location.pathname;

    if (path.startsWith('/browse-course/')) {
      return {
        parentName: 'Browse Courses',
        parentLink: '/browse-courses',
        currentName: breadcrumb || 'Course Details'
      };
    }

    if (path.startsWith('/course-details/')) {
      return {
        parentName: 'My Courses',
        parentLink: '/my-courses',
        currentName: breadcrumb || 'Course Details'
      };
    }

    if (path.startsWith('/quiz-details/')) {
      return {
        parentName: 'My Courses',
        parentLink: '/my-courses',
        currentName: breadcrumb || 'Quiz Details'
      };
    }

    if (path.startsWith('/quiz-take/')) {
      return {
        parentName: 'My Courses',
        parentLink: '/my-courses',
        currentName: breadcrumb || 'Take Quiz'
      };
    }

    if (path.startsWith('/check-answers/')) {
      return {
        parentName: 'My Courses',
        parentLink: '/my-courses',
        currentName: breadcrumb || 'Check Answers'
      };
    }

    if (path.startsWith('/tutor/')) {
      return {
        parentName: 'Browse Courses',
        parentLink: '/browse-courses',
        currentName: breadcrumb || 'Tutor Profile'
      };
    }

    if (path.startsWith('/live-class-details/')) {
      return {
        parentName: 'Live Classes',
        parentLink: '/live-classes',
        currentName: breadcrumb || 'Live Class Details'
      };
    }

    if (path === '/past-sessions') {
      return {
        parentName: 'Live Classes',
        parentLink: '/live-classes',
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
                          {isPremium && (
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
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/notifications'); }}>
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
              <div className="user-name">{userInfo.name}</div>
              <div className="user-meta">{getUserMeta()}</div>
            </div>
            <img
              src={userInfo.avatar}
              alt="User Avatar"
              className="user-avatar"
            />
          </div>

          {profileOpen && (
            <div className="profile-dropdown active">
              <div className="profile-dropdown-header">
                <img src={userInfo.avatar} alt="Avatar" />
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
                    navigate("/profile");
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
                    navigate("/edit-profile");
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
                      navigate("/premium-subscription");
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
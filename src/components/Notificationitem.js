// src/components/Notificationitem.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Notificationitem({ notification, onClick }) {
  const navigate = useNavigate();

  // Format time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  // Get icon based on notification type/category
  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'classes':
      case 'live_class':
        return '/assets/images/icons/Live Classes.svg';
      case 'courses':
      case 'course':
        return '/assets/images/icons/My Courses.svg';
      case 'q&a':
      case 'qna':
        return '/assets/images/icons/100-chat.svg';
      case 'reminder':
        return '/assets/images/icons/106-notification.svg';
      default:
        return '/assets/images/icons/106-notification.svg';
    }
  };

  const handleClick = () => {
    onClick();
    
    // Navigate based on notification type and data
    if (notification.data?.url) {
      navigate(notification.data.url);
    } else if (notification.type === 'live_class' && notification.data?.class_id) {
      navigate(`/student/live-class/${notification.data.class_id}`);
    } else if (notification.type === 'course' && notification.data?.course_slug) {
      navigate(`/student/course/${notification.data.course_slug}`);
    }
  };

  return (
    <div 
      className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
      onClick={handleClick}
    >
      <div className="notification-icon-wrapper">
        <img 
          src={getNotificationIcon(notification.type || notification.category)} 
          alt="notification"
          className="notification-type-icon"
        />
      </div>

      <div className="notification-content">
        <h5 className="notification-title">{notification.title || 'Notification'}</h5>
        <p className="notification-message">{notification.message || notification.body || ''}</p>
        
        <div className="notification-meta">
          <span className="notification-time">
            {getTimeAgo(notification.created_at)}
          </span>
          
          {notification.category && (
            <span className="notification-category-badge">
              {notification.category}
            </span>
          )}
        </div>
      </div>

      {!notification.is_read && (
        <span className="notification-unread-dot"></span>
      )}

      {notification.data?.action_text && (
        <button className="notification-action-btn">
          {notification.data.action_text}
        </button>
      )}
    </div>
  );
}

export default Notificationitem;
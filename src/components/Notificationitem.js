// src/components/Notificationitem.js
import React from 'react';

function Notificationitem({ notification, onClick }) {
  const {
    id,
    icon,
    iconColor,
    title,
    description,
    time,
    actionText,
    actionLink,
    isRead
  } = notification;

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (actionLink) {
      window.location.href = actionLink;
    }
  };

  // Icon background colors
  const getIconStyle = () => {
    const colors = {
      blue: '#E3F2FD',
      yellow: '#FFF4E5',
      green: '#E8F5E9'
    };
    return {
      backgroundColor: colors[iconColor] || '#F5F5F5'
    };
  };

  return (
    <div 
      className={`notification-page-item ${isRead ? 'read' : 'unread'}`}
      onClick={onClick}
    >
      <div className="notification-icon-wrapper" style={getIconStyle()}>
        <img src={icon} alt="" className="notification-icon-img" />
      </div>

      <div className="notification-item-content">
        <div className="notification-item-header">
          <h3 className="notification-item-title">{title}</h3>
          {!isRead && <span className="notification-unread-dot"></span>}
        </div>
        
        <p className="notification-item-description">{description}</p>
        
        <div className="notification-item-footer">
          <span className="notification-item-time">{time}</span>
          {actionText && (
            <>
              <span className="notification-separator">•</span>
              <button 
                className="notification-action-link"
                onClick={handleActionClick}
              >
                {actionText}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notificationitem;
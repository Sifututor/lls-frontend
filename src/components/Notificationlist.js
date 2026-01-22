// src/components/Notificationlist.js
import React from 'react';
import Notificationitem from './Notificationitem';

function Notificationlist({ notifications, onNotificationClick }) {
  if (notifications.length === 0) {
    return (
      <div className="notifications-empty-state">
        <div className="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="32" fill="#F5F5F5"/>
            <path d="M32 20v24M20 32h24" stroke="#9A9A9A" strokeWidth="3"/>
          </svg>
        </div>
        <h3 className="empty-state-title">No notifications</h3>
        <p className="empty-state-text">You're all caught up! Check back later for updates.</p>
      </div>
    );
  }

  return (
    <div className="notifications-list-container">
      {notifications.map(notification => (
        <Notificationitem
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick(notification.id)}
        />
      ))}
    </div>
  );
}

export default Notificationlist;
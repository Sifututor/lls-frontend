// src/components/Notificationlist.js
import React from 'react';
import Notificationitem from './Notificationitem';

function Notificationlist({ notifications, onNotificationClick }) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="notifications-empty-state">
        <div className="empty-state-icon">
          <img 
            src="/assets/images/icons/106-notification.svg" 
            alt="No notifications"
            style={{ width: 64, height: 64, opacity: 0.5 }}
          />
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
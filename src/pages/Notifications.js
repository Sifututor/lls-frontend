// src/pages/Notifications.js
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Notificationheader from '../components/Notificationheader';
import Notificationlist from '../components/Notificationlist';
import { notificationsData } from '../data/Notificationsdata';

function Notifications() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [activeFilter, setActiveFilter] = useState('All');

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleMarkAllRead = () => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      isRead: true
    }));
    setNotifications(updatedNotifications);
  };

  const handleNotificationClick = (id) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications);
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !notif.isRead;
    return notif.category === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <Sidebar />
      
      <main className="main-content">
        <TopNavbar title="Notifications" />
        
        <div className="notifications-page-container">
          <div className="notifications-page-header">
            <div>
              <h1 className="notifications-page-title">Notifications</h1>
              <p className="notifications-page-subtitle">Stay updated with your learning activities</p>
            </div>
          </div>

          <Notificationheader
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            unreadCount={unreadCount}
            onMarkAllRead={handleMarkAllRead}
          />

          <Notificationlist
            notifications={filteredNotifications}
            onNotificationClick={handleNotificationClick}
          />

          <div className="notifications-footer">
            Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
          </div>
        </div>
      </main>
    </>
  );
}

export default Notifications;
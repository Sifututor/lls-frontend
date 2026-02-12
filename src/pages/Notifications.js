// src/pages/Notifications.js
import React, { useState } from 'react';
import Notificationheader from '../components/Notificationheader';
import Notificationlist from '../components/Notificationlist';
import { 
  useGetNotificationsQuery, 
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation 
} from '../store/api/authApi';

function Notifications() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // RTK Query hooks
  const { data: notificationsData, isLoading, isError, refetch } = useGetNotificationsQuery({
    page: currentPage,
    filter: activeFilter !== 'All' ? activeFilter.toLowerCase() : undefined
  });

  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  // Extract notifications from API response
  const notifications = notificationsData?.data?.data || [];
  const pagination = notificationsData?.data || {};

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead().unwrap();
      refetch();
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Error marking all as read:', err);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      await markNotificationRead(id).unwrap();
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Error marking notification as read:', err);
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="notifications-page-container">
        <div className="notifications-loading">
          <div className="spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="notifications-page-container">
        <div className="notifications-error">
          <p>Failed to load notifications</p>
          <button onClick={refetch}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
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
        isMarkingAll={isMarkingAll}
      />

      <Notificationlist
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="notifications-pagination">
          <button
            className="pagination-btn"
            disabled={!pagination.prev_page_url}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <button
            className="pagination-btn"
            disabled={!pagination.next_page_url}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      <div className="notifications-footer">
        Showing {notifications.length} of {pagination.total || 0} notification{pagination.total !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default Notifications;
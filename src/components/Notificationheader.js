// src/components/Notificationheader.js
import React from 'react';

function Notificationheader({ activeFilter, onFilterChange, unreadCount, onMarkAllRead, isMarkingAll }) {
  const filters = [
    { id: 'All', label: 'All', count: null },
    { id: 'Unread', label: 'Unread', count: unreadCount },
    { id: 'Classes', label: 'Classes', count: null },
    { id: 'Courses', label: 'Courses', count: null },
    { id: 'Q&A', label: 'Q&A', count: null },
    { id: 'Reminder', label: 'Reminder', count: null }
  ];

  return (
    <div className="notifications-filter-bar">
      <div className="notifications-filters">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`notification-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
            {filter.count !== null && filter.count > 0 && (
              <span className="filter-count">{filter.count}</span>
            )}
          </button>
        ))}
      </div>

      <button 
        className="mark-all-read-btn" 
        onClick={onMarkAllRead}
        disabled={isMarkingAll}
      >
        {isMarkingAll ? 'Marking...' : 'Mark all as read'}
      </button>
    </div>
  );
}

export default Notificationheader;
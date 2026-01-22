import React from 'react';

function BrowseUpcomingClass({ classData, onNotifyMe }) {
  return (
    <div className="browse-sidebar-card">
      <h3 className="browse-sidebar-title">Upcoming Live Class</h3>

      <div className="browse-upcoming-card">
        <div className="browse-upcoming-content">
          <div className="browse-upcoming-datetime">{classData.datetime}</div>
          <h4 className="browse-upcoming-title">{classData.title}</h4>

          <button 
            className="btn-browse-notify"
            onClick={onNotifyMe}
          >
            Notify Me
          </button>
        </div>
      </div>

      {/* Premium Note - Separate div niche */}
      {classData.isPremium && (
        <div className="browse-premium-note-wrapper">
          <div className="browse-premium-note">
            {classData.premiumText}
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseUpcomingClass;
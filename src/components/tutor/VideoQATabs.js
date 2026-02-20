import React from 'react';

const TABS = [
  { id: 'pending', label: 'Pending', badge: 3 },
  { id: 'answered', label: 'Answered' },
  { id: 'pinned', label: 'Pinned' },
];

function VideoQATabs({ activeTab, onTabChange }) {
  return (
    <div className="tutor-video-qa-tabs">
      {TABS.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          className={`tutor-video-qa-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.badge != null && (
            <span className="tutor-video-qa-tab-badge">{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default VideoQATabs;

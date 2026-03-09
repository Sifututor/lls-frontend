import React from 'react';

const DEFAULT_TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'all', label: 'All' },
];

function VideoQATabs({ activeTab, onTabChange, tabs = DEFAULT_TABS }) {
  return (
    <div className="tutor-video-qa-tabs">
      {tabs.map((tab) => (
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

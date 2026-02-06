import React from 'react';
import QAItem from '../components/QAItem';
import { recentQAData } from '../data/Recentqadata';

function Recentvideoqa() {
  return (
    <div className="dashboard-content">
          {/* Page Header */}
          <div className="page-header-section">
            <h1 className="welcome-title">Recent Video Q&A</h1>
          </div>

          {/* Q&A List */}
          <div className="qa-list">
            {recentQAData.map((qa) => (
              <QAItem key={qa.id} qa={qa} />
            ))}
          </div>
    </div>
  );
}

export default Recentvideoqa;
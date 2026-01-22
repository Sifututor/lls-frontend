import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import QAItem from '../components/QAItem';
import { recentQAData } from '../data/Recentqadata';

function Recentvideoqa() {
  return (
    <>
      <Sidebar />

      <main className="main-content">
        <TopNavbar title="Recent Video Q&A" />

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
      </main>
    </>
  );
}

export default Recentvideoqa;
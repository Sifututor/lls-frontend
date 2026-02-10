import React from 'react';
import QAItem from '../components/QAItem';
import EmptyState from '../components/EmptyState';
import { useGetVideoQnAQuery } from '../store/api/authApi';
import { SectionLoader } from '../components/ui/LoadingSpinner';

function Recentvideoqa() {
  // Fetch Q&A from API
  const { data: qnaData, isLoading } = useGetVideoQnAQuery({});
  
  // Extract Q&A list from API response
  const qaList = qnaData?.data || qnaData?.questions || [];

  return (
    <div className="dashboard-content">
          {/* Page Header */}
          <div className="page-header-section">
            <h1 className="welcome-title">Recent Video Q&A</h1>
            <p className="welcome-subtitle">
              Questions and answers from your course videos
            </p>
          </div>

          {/* Q&A List */}
          {isLoading ? (
            <SectionLoader message="Loading Q&A..." height="400px" />
          ) : qaList.length > 0 ? (
            <div className="qa-list">
              {qaList.map((qa) => (
                <QAItem key={qa.id} qa={qa} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="/assets/images/icons/chat.svg"
              title="No questions yet"
              description="Ask questions in your course videos to get help from tutors and peers"
              actionText="Browse Courses"
              actionLink="/student/browse-courses"
            />
          )}
    </div>
  );
}

export default Recentvideoqa;
import React from 'react';
import { useParams } from 'react-router-dom';
import { SectionLoader } from '../components/ui/LoadingSpinner';
import CourseHeader from '../components/CourseHeader';
import AnswerItem from '../components/Answeritem';

// ✅ REMOVED: Static data import - should use API
// import { answersData, answerStats } from '../data/Checkanswersdata';

// ⚠️ BACKEND TODO: Create API endpoint GET /api/quiz-attempts/:id/review
// Should return: { questions: [...], user_answers: [...], correct_answers: [...], stats: {...} }

function CheckAnswers() {
  const { id } = useParams(); // This should be attemptId

  // TODO: Replace with actual API call
  // const { data: reviewData, isLoading } = useGetQuizAttemptReviewQuery(id);
  
  // For now, showing a placeholder message
  // Backend team needs to implement the quiz review endpoint first
  
  const isLoading = false;
  const reviewData = null;
  
  // When API is ready, extract data like this:
  // const answersData = reviewData?.questions || [];
  // const answerStats = reviewData?.stats || { correct: 0, incorrect: 0, skipped: 0, total: 0 };
  
  // Placeholder data structure (to be replaced with API response)
  const answerStats = {
    correct: 0,
    incorrect: 0,
    skipped: 0,
    total: 0
  };
  
  const answersData = [];

  // Check Answers Header Data
  const checkAnswersHeaderData = {
    title: reviewData?.quiz_title || 'Quiz Review',
    badges: reviewData?.badges || [
      { id: 3, text: 'Review Mode' }
    ],
    instructor: reviewData?.instructor || {
      name: 'Instructor',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    progress: answerStats.total > 0 
      ? Math.round((answerStats.correct / answerStats.total) * 100) 
      : 0
  };

  if (isLoading) {
    return (
      <>
        <CourseHeader courseData={checkAnswersHeaderData} />
        <SectionLoader message="Loading quiz review..." height="400px" />
      </>
    );
  }

  return (
    <>
      <CourseHeader courseData={checkAnswersHeaderData} />
      
      <div className="quiz-check-container">
        {answersData.length > 0 ? (
          <>
            {/* Stats Summary */}
            <div className="check-answers-stats">
              <div className="stats-summary">
                <h3 className="stats-title">Your Results Summary</h3>
                <div className="stats-grid">
                  <div className="stat-box correct-stat">
                    <div className="stat-icon">
                      <img src="/assets/images/icons/022-check.svg" alt="Correct" />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{answerStats.correct}</div>
                      <div className="stat-label">Correct</div>
                    </div>
                  </div>
                  <div className="stat-box incorrect-stat">
                    <div className="stat-icon">
                      <img src="/assets/images/icons/057-error sign.svg" alt="Incorrect" />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{answerStats.incorrect}</div>
                      <div className="stat-label">Incorrect</div>
                    </div>
                  </div>
                  <div className="stat-box skipped-stat">
                    <div className="stat-icon">
                      <img src="/assets/images/icons/057-error sign-skip.svg" alt="Skipped" />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{answerStats.skipped}</div>
                      <div className="stat-value">{answerStats.skipped}</div>
                      <div className="stat-label">Skipped</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Questions with Answers */}
            {answersData.map((item) => (
              <AnswerItem key={item.id} item={item} />
            ))}
          </>
        ) : (
          <div className="empty-state" style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E5E7EB'
          }}>
            <h3>Quiz Review Not Available</h3>
            <p style={{ color: '#6B7280', marginTop: '8px' }}>
              ⚠️ Backend API endpoint needed: <code>GET /api/quiz-attempts/{id}/review</code>
            </p>
            <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '16px' }}>
              This page requires backend implementation to show quiz answers and explanations.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default CheckAnswers;
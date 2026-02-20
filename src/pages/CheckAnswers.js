import React from 'react';
import { useParams } from 'react-router-dom';
import { SectionLoader } from '../components/ui/LoadingSpinner';
import CourseHeader from '../components/CourseHeader';
import AnswerItem from '../components/Answeritem';
import { useGetQuizAttemptReviewQuery } from '../store/api/authApi';

function CheckAnswers() {
  const { attemptId, id } = useParams();
  const effectiveAttemptId = attemptId || id;

  const { data: reviewData, isLoading, isError } = useGetQuizAttemptReviewQuery(effectiveAttemptId, {
    skip: !effectiveAttemptId,
  });

  const rawQuestions = reviewData?.questions ?? [];
  const answersData = Array.isArray(rawQuestions)
    ? rawQuestions.map((q, i) => ({
        id: q.id ?? i + 1,
        status: q.status ?? (q.is_correct ? 'correct' : q.user_answer ? 'incorrect' : 'skipped'),
        question: q.question_text ?? q.question ?? '',
        options: Array.isArray(q.options)
          ? q.options.map((o) => ({
              text: typeof o === 'object' ? (o.text ?? o.label ?? '') : String(o),
              correct: !!o?.correct,
              wrong: !!o?.wrong,
            }))
          : [],
        explanation: q.explanation ?? null,
      }))
    : [];
  const answerStats = {
    correct: reviewData?.correct ?? 0,
    incorrect: reviewData?.incorrect ?? 0,
    skipped: reviewData?.skipped ?? 0,
    total: reviewData?.total ?? (answersData.length || 1),
  };
  if (answerStats.total === 0 && answersData.length > 0) {
    answerStats.total = answersData.length;
  }
  const progressPercent = reviewData?.score ?? (answerStats.total > 0 ? Math.round((answerStats.correct / answerStats.total) * 100) : 0);

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
    progress: progressPercent
  };

  if (!effectiveAttemptId) {
    return (
      <>
        <CourseHeader courseData={{ title: 'Quiz Review', badges: [{ id: 1, text: 'Error' }], instructor: { name: '', avatar: '' }, progress: 0 }} />
        <div className="quiz-check-container">
          <div className="empty-state" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h3>Invalid Review Link</h3>
            <p style={{ color: '#6B7280', marginTop: '8px' }}>Please complete a quiz first to view your answers.</p>
          </div>
        </div>
      </>
    );
  }

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
            <h3>Quiz Review</h3>
            <p style={{ color: '#6B7280', marginTop: '8px' }}>
              {isError ? 'Failed to load review.' : 'No detailed answers available for this attempt.'}
            </p>
            {(reviewData?.score != null || reviewData?.passed != null) && (
              <p style={{ color: '#374151', fontSize: '16px', marginTop: '16px', fontWeight: 600 }}>
                Score: {reviewData.score}% • {reviewData.passed ? 'Passed' : 'Not Passed'}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default CheckAnswers;
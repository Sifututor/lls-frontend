import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

function QuizResultScreen({ results, passed, courseSlug, quizId: quizIdProp, attemptId }) {
  const navigate = useNavigate();
  const { id: quizIdFromParams } = useParams();
  const quizId = quizIdProp ?? quizIdFromParams;
  const reviewUrl = attemptId
    ? `/student/quiz-attempt/${attemptId}/review`
    : quizId
      ? `/student/quiz/${quizId}/review`
      : null;

  return (
    <div className="result-section">
      <div className={`result-container ${!passed ? 'fail-container' : ''}`}>
        {passed ? (
          <>
            <div className="result-success-icon">✓</div>
            <h2 className="result-title">Congratulations you passed!</h2>
            <p className="result-subtitle">Great job completing the Sorting Algorithm Test</p>
          </>
        ) : (
          <>
            <h2 className="result-title">Oops! Try again</h2>
            <p className="result-subtitle">Basic criteria for passing is 70%</p>
          </>
        )}
        
        <div className="result-score-circle">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#E5E5E5" strokeWidth="16"/>
            <circle 
              cx="100" cy="100" r="80" 
              fill="none" 
              stroke={passed ? "#9FE870" : "#EF4444"} 
              strokeWidth="16" 
              strokeLinecap="round"
              style={{
                strokeDasharray: 502,
                strokeDashoffset: 502 - (results.percentage / 100) * 502,
                transition: 'stroke-dashoffset 1s ease',
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%'
              }}
            />
          </svg>
          <div className="result-score-text">
            {passed ? (
              <>
                <div className="result-percentage pass-percentage">{results.percentage}%</div>
                <div className="result-label">Your Score</div>
              </>
            ) : (
              <>
                <div className="result-fraction">
                  <span className="fail-score">{results.correct}</span>
                  <span className="fail-total">/10</span>
                </div>
                <div className="result-label">Your Score</div>
              </>
            )}
          </div>
        </div>
        
        <div className="result-stats">
          <div className="result-stat-item">
            <span className="stat-icon correct">
              <img src="/assets/images/icons/022-check.svg" alt="Correct" />
            </span>
            <span className="stat-text">{results.correct}/10 Correct</span>
          </div>
          <div className="result-stat-item">
            <span className="stat-icon incorrect">
              <img src="/assets/images/icons/057-error sign.svg" alt="Incorrect" />
            </span>
            <span className="stat-text">{results.incorrect}/10 Incorrect</span>
          </div>
          {passed && results.skipped > 0 && (
            <div className="result-stat-item">
              <span className="stat-icon skipped">
                <img src="/assets/images/icons/057-error sign-skip.svg" alt="Skipped" />
              </span>
              <span className="stat-text">{results.skipped}/10 Skipped</span>
            </div>
          )}
        </div>
        
        {reviewUrl && (
          <Link to={reviewUrl} className="btn-check-answers">
            Check Answers →
          </Link>
        )}
        
        <div className="result-actions">
          <button className="btn-close" onClick={() => window.close()}>Close</button>
          {courseSlug ? (
            <button className="btn-back-course" onClick={() => navigate(`/student/course/${courseSlug}`)}>
              Back to Course →
            </button>
          ) : (
            <button className="btn-back-course" onClick={() => navigate('/student/my-courses')}>
              Back to Courses →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizResultScreen;
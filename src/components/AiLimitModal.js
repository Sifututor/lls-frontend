// src/components/AiLimitModal.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AiLimitModal({
  isOpen,
  onClose,
  usedQuestions = 5,
  maxQuestions = 5,
  hoursUntilReset = 24,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleUpgrade = () => {
    onClose();
    navigate('/student/subscription');
  };

  return (
    <div className="quiz-modal-overlay" onClick={handleOverlayClick}>
      <div className="quiz-modal-content slide-up">
        <button className="quiz-modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="quiz-modal-header">
          <img
            src="/assets/images/daily-limted.png"
            alt="Daily Limit Reached"
            className="quiz-header-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('limit-header-fallback');
            }}
          />
        </div>

        <div className="quiz-modal-body">
          <h2 className="quiz-modal-title">
            Daily Limit Reached: {usedQuestions}/{maxQuestions} used
          </h2>
          <p className="quiz-modal-description">
            You've used all your free questions for today ({usedQuestions}/{maxQuestions}).
            Upgrade to Premium for unlimited AI access, or come back tomorrow when your limit resets.
          </p>
          <div className="quiz-reset-time">
            <span className="reset-icon" aria-hidden>⏳</span>
            <span>Resets in {hoursUntilReset} hours</span>
          </div>
        </div>

        <div className="quiz-modal-footer">
          <button type="button" className="btn-cancel-quiz" onClick={onClose}>
            Cancel
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="btn-start-quiz" onClick={handleUpgrade}>
            Upgrade Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiLimitModal;

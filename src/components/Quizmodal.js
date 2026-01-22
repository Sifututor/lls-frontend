// src/components/QuizModal.js
import React, { useEffect } from 'react';

function QuizModal({ isOpen, onClose, lessonName, onStartQuiz }) {
  // Close on Escape key
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

  const handleStartQuiz = () => {
    if (onStartQuiz) onStartQuiz();
    onClose();
  };

  return (
    <div className="quiz-modal-overlay" onClick={handleOverlayClick}>
      <div className="quiz-modal-content slide-up">
        {/* Close Button */}
        <button className="quiz-modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header Image */}
        <div className="quiz-modal-header">
          <img 
            src="/assets/images/start-quiz.png" 
            alt="Ready for Quiz" 
            className="quiz-header-image"
          />
        </div>

        {/* Modal Body */}
        <div className="quiz-modal-body">
          <h2 className="quiz-modal-title">Ready for the Quiz?</h2>
          <p className="quiz-modal-subtitle">
            You've completed this lesson 🎉
          </p>
          <p className="quiz-modal-description">
            Ready to test your understanding? Take the {lessonName || 'Lesson'} Quiz now and track your progress.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="quiz-modal-footer">
          <button className="btn-cancel-quiz" onClick={onClose}>
            Cancel
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="btn-start-quiz" onClick={handleStartQuiz}>
            Start Quiz
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizModal;
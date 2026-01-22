import React from 'react';

function QuizGrid({ questions, userAnswers, currentQuestion, onGoToQuestion }) {
  return (
    <div className="question-grid-card">
      <div className="question-grid">
        {questions.map((_, index) => (
          <button
            key={index}
            className={`question-grid-btn ${
              index === currentQuestion ? 'current' : 
              userAnswers[index] !== null ? 'answered' : 'skipped'
            }`}
            onClick={() => onGoToQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizGrid;
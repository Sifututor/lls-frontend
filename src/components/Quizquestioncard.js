import React from 'react';

function QuizQuestionCard({ 
  question, 
  currentQuestion, 
  totalQuestions, 
  selectedAnswer, 
  onSelectAnswer, 
  onNext, 
  onPrevious 
}) {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number-badge">Question {currentQuestion + 1}</span>
        <div className="question-progress">
          <span>{currentQuestion + 1}</span>/<span>{totalQuestions}</span>
        </div>
      </div>
      
      <h2 className="question-text">{question.question}</h2>
      
      <div className="answer-options">
        {question.options.map((option) => (
          <div
            key={option.letter}
            className={`answer-option ${selectedAnswer === option.letter ? 'selected' : ''}`}
            onClick={() => onSelectAnswer(option.letter)}
          >
            <div className="option-letter">{option.letter}</div>
            <div className="option-text">{option.text}</div>
          </div>
        ))}
      </div>
      
      <div className="question-navigation">
        {currentQuestion > 0 && (
          <button className="btn-previous" onClick={onPrevious}>
            ← Previous
          </button>
        )}
        
        <div className="question-nav-right">
          <button className="btn-skip" onClick={onNext}>
            Skip Question
          </button>
          <button className="btn-next" onClick={onNext}>
            {currentQuestion === totalQuestions - 1 ? 'Submit Test' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizQuestionCard;
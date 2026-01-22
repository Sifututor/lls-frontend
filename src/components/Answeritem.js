import React from 'react';

function AnswerItem({ item }) {
  return (
    <div className="quiz-answer-item">
      <div className="quiz-answer-top">
        <span className="quiz-q-num">Question {item.id}</span>
        <span className={`quiz-badge-${item.status}`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      </div>
      
      <div className="quiz-answer-box">
        <div className="quiz-q-text">{item.question}</div>
        <div className="quiz-opts-label">Options:</div>
        <div className="quiz-opts">
          {item.options.map((option, index) => (
            <div 
              key={index}
              className={`quiz-opt ${option.correct ? 'quiz-correct' : ''} ${option.wrong ? 'quiz-wrong' : ''}`}
            >
              {option.text}
            </div>
          ))}
        </div>
        
        {item.explanation && (
          <div className="quiz-explanation">
            <div className="quiz-exp-label">Explanation:</div>
            <div className="quiz-exp-text">{item.explanation}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnswerItem;
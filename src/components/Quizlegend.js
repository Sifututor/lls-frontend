import React from 'react';

function QuizLegend() {
  return (
    <div className="quiz-legend-card">
      <h4 className="legend-title">Legend</h4>
      <div className="legend-items">
        <div className="legend-item">
          <div className="legend-box not-answered"></div>
          <span>Not Answered</span>
        </div>
        <div className="legend-item">
          <div className="legend-box current"></div>
          <span>Current</span>
        </div>
        <div className="legend-item">
          <div className="legend-box answered"></div>
          <span>Answered</span>
        </div>
      </div>
    </div>
  );
}

export default QuizLegend;
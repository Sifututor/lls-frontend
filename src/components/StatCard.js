import React, { useState, useEffect } from 'react';

function StatCard({ data }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  // Counter animation
  useEffect(() => {
    const numericValue = typeof data.value === 'string' ? 
      parseInt(data.value.replace(/[^\d]/g, '')) : data.value;
    
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCurrentValue(numericValue);
        clearInterval(timer);
      } else {
        setCurrentValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [data.value]);

  // Progress bar animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(data.progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [data.progress]);

  const formatValue = () => {
    if (typeof data.value === 'string') {
      if (data.value.includes('%')) return `${currentValue}%`;
      if (data.value.includes('h')) return `${currentValue}h`;
      return currentValue;
    }
    return currentValue;
  };

  return (
    <div className={`stat-card ${data.type}`}>
      <div className="stat-label">{data.label}</div>

      <div className="stat-header">
        <div className="stat-icon-wrapper">
          <img src={data.icon} alt={data.title} className="stat-icon" />
        </div>
        <div className="stat-content">
          <h2 className="stat-value">{formatValue()}</h2>
          <p className="stat-title">{data.title}</p>
        </div>
      </div>

      <div className="stat-footer">
        <span className="progress-text">{data.progressText}</span>
        <span className="progress-value">{data.progressValue}</span>
      </div>

      <div className="stat-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
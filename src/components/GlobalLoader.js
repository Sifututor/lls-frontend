// src/components/GlobalLoader.js
import React, { useState, useEffect } from 'react';
import './GlobalLoader.css';

function GlobalLoader() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Preparing your workspace');

  // Simulate progress
  useEffect(() => {
    const texts = [
      'Preparing your workspace',
      'Loading your courses',
      'Setting up dashboard',
      'Almost ready'
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * 15 + 5;
        const next = Math.min(prev + increment, 100);

        // Update text based on progress
        if (next < 25) setLoadingText(texts[0]);
        else if (next < 50) setLoadingText(texts[1]);
        else if (next < 75) setLoadingText(texts[2]);
        else setLoadingText(texts[3]);

        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gl-screen">
      {/* Animated background mesh */}
      <div className="gl-bg-mesh"></div>
      <div className="gl-bg-grain"></div>

      {/* Floating particles */}
      <div className="gl-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`gl-particle gl-p-${i + 1}`}></div>
        ))}
      </div>

      {/* Main content */}
      <div className="gl-content">
        {/* Logo with animated ring */}
        <div className="gl-logo-area">
          <div className="gl-ring-outer">
            <div className="gl-ring-inner"></div>
          </div>
          <img
            src="/assets/images/learnest-menu.png"
            alt="Learnest"
            className="gl-logo-img"
          />
        </div>

        {/* Brand name */}
        <h1 className="gl-brand">
          <span className="gl-brand-letter" style={{ animationDelay: '0s' }}>L</span>
          <span className="gl-brand-letter" style={{ animationDelay: '0.05s' }}>e</span>
          <span className="gl-brand-letter" style={{ animationDelay: '0.1s' }}>a</span>
          <span className="gl-brand-letter" style={{ animationDelay: '0.15s' }}>r</span>
          <span className="gl-brand-letter" style={{ animationDelay: '0.2s' }}>n</span>
          <span className="gl-brand-letter" style={{ animationDelay: '0.25s' }}>e</span>
          <span className="gl-brand-letter" style={{ animationDelay: '0.3s' }}>s</span>
          <span className="gl-brand-letter" style={{ animationDelay: '0.35s' }}>t</span>
        </h1>

        {/* Progress section */}
        <div className="gl-progress-area">
          <div className="gl-progress-track">
            <div 
              className="gl-progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
            <div 
              className="gl-progress-glow" 
              style={{ left: `${progress}%` }}
            ></div>
          </div>
          <div className="gl-progress-info">
            <span className="gl-progress-text">{loadingText}</span>
            <span className="gl-progress-percent">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalLoader;
// src/components/ui/LoadingSpinner.js
import React from 'react';
import './Loading.css';
import loadingBg from '../../assets/images/landing-page-bg.png';

export const Spinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);

export const ButtonLoader = () => (
  <div className="button-loader">
    <div className="button-spinner"></div>
  </div>
);

export const SectionLoader = ({ message = 'Loading...', height }) => (
  <div className="section-loader" style={height ? { minHeight: height } : undefined}>
    <div className="spinner"></div>
    {message && <p>{message}</p>}
  </div>
);

export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="loading-screen" style={{ '--loading-bg': `url(${loadingBg})` }}>
    <div className="loading-screen-content">
      <div className="loading-screen-icon">
        {/* SVG Book Icon */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12 58V22C12 19.5 13.5 17 17 16C24 13.5 34 12.5 40 16V56C32 53 22 54 17 56C13.5 57 12 58 12 58Z" 
            stroke="#4ADE80" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          <path 
            d="M68 58V22C68 19.5 66.5 17 63 16C56 13.5 46 12.5 40 16V56C48 53 58 54 63 56C66.5 57 68 58 68 58Z" 
            stroke="#4ADE80" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          <path 
            d="M40 16V56" 
            stroke="#4ADE80" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      {message && message !== 'Loading...' && (
        <p className="loading-screen-text">{message}</p>
      )}
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
  </div>
);

export const SkeletonCourseDetails = () => (
  <div className="skeleton-course-details">
    <div className="skeleton-header"></div>
    <div className="skeleton-video"></div>
    <div className="skeleton-tabs"></div>
    <div className="skeleton-content-area">
      <div className="skeleton-text"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
  </div>
);

export const SkeletonLiveClasses = () => (
  <div className="skeleton-live-classes">
    {[1, 2, 3].map((i) => (
      <div key={i} className="skeleton-class-card">
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
        </div>
      </div>
    ))}
  </div>
);

// Default export for backward compatibility
export default Spinner;

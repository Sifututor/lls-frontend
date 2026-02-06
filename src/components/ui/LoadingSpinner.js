// src/components/ui/LoadingSpinner.js
import React from 'react';
import './Loading.css';

// Simple spinner for buttons, small areas
export function Spinner({ size = 'md', color = 'primary' }) {
  return (
    <div className={`spinner spinner-${size} spinner-${color}`}>
      <div className="spinner-ring"></div>
    </div>
  );
}

// Full page loader with logo
export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="page-loader">
      <div className="page-loader-content">
        <div className="page-loader-logo">
          <img src="/assets/images/learnest-menu.png" alt="Learnest" />
        </div>
        <div className="page-loader-spinner">
          <Spinner size="lg" />
        </div>
        <p className="page-loader-text">{message}</p>
      </div>
    </div>
  );
}

// Inline loader for sections
export function SectionLoader({ message = 'Loading...', height = '200px' }) {
  return (
    <div className="section-loader" style={{ minHeight: height }}>
      <div className="section-loader-content">
        <Spinner size="md" />
        <p>{message}</p>
      </div>
    </div>
  );
}

// Skeleton loader for cards
export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-badge"></div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
      </div>
    </div>
  );
}

// Skeleton for course details page
export function SkeletonCourseDetails() {
  return (
    <div className="skeleton-course-details">
      <div className="skeleton skeleton-video"></div>
      <div className="skeleton-course-info">
        <div className="skeleton skeleton-title large"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
        <div className="skeleton-meta">
          <div className="skeleton skeleton-avatar"></div>
          <div className="skeleton skeleton-text tiny"></div>
        </div>
      </div>
      <div className="skeleton-tabs">
        <div className="skeleton skeleton-tab"></div>
        <div className="skeleton skeleton-tab"></div>
        <div className="skeleton skeleton-tab"></div>
      </div>
      <div className="skeleton-content-area">
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
      </div>
    </div>
  );
}

// Skeleton for list items
export function SkeletonList({ count = 3 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-list-item">
          <div className="skeleton skeleton-avatar small"></div>
          <div className="skeleton-list-content">
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text short"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for profile/sidebar
export function SkeletonProfile() {
  return (
    <div className="skeleton-profile">
      <div className="skeleton skeleton-avatar large"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text short"></div>
    </div>
  );
}

// Button loading state
export function ButtonLoader({ text = 'Loading...' }) {
  return (
    <span className="button-loader">
      <Spinner size="sm" color="white" />
      <span>{text}</span>
    </span>
  );
}

// Skeleton for Live Class Cards
export function SkeletonLiveClassCard() {
  return (
    <div className="skeleton-live-class-card">
      <div className="skeleton skeleton-thumbnail"></div>
      <div className="skeleton-card-content">
        <div className="skeleton-badges">
          <div className="skeleton skeleton-badge-status"></div>
          <div className="skeleton skeleton-badge-subject"></div>
        </div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-instructor">
          <div className="skeleton skeleton-avatar small"></div>
          <div className="skeleton skeleton-text tiny"></div>
        </div>
        <div className="skeleton skeleton-text short"></div>
        <div className="skeleton skeleton-button"></div>
      </div>
    </div>
  );
}

// Skeleton for Live Classes Page (full layout)
export function SkeletonLiveClasses() {
  return (
    <div className="skeleton-live-classes">
      <div className="skeleton-header">
        <div className="skeleton skeleton-title large"></div>
        <div className="skeleton skeleton-text short"></div>
      </div>
      <div className="skeleton-tabs">
        <div className="skeleton skeleton-tab active"></div>
        <div className="skeleton skeleton-tab"></div>
        <div className="skeleton skeleton-tab"></div>
      </div>
      <div className="skeleton skeleton-section-title"></div>
      <div className="skeleton-cards-grid">
        <SkeletonLiveClassCard />
        <SkeletonLiveClassCard />
        <SkeletonLiveClassCard />
        <SkeletonLiveClassCard />
      </div>
    </div>
  );
}

export default {
  Spinner,
  PageLoader,
  SectionLoader,
  SkeletonCard,
  SkeletonCourseDetails,
  SkeletonList,
  SkeletonProfile,
  ButtonLoader,
  SkeletonLiveClassCard,
  SkeletonLiveClasses,
};

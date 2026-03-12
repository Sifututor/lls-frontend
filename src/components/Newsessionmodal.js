// src/components/Newsessionmodal.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from './ui/LoadingSpinner';
import { useGetSubjectsQuery } from '../store/api/authApi';

function Newsessionmodal({ onClose, onStartSession }) {
  const navigate = useNavigate();
  const tutorAvatars = [
    { id: 1, src: '/assets/images/icons/team1.png', alt: 'Tutor 1', className: 'tutor-avatar' },
    { id: 2, src: '/assets/images/icons/team2.png', alt: 'Tutor 2', className: 'tutor-avatar main' },
    { id: 3, src: '/assets/images/icons/team3.png', alt: 'Tutor 3', className: 'tutor-avatar' },
  ];
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topicText, setTopicText] = useState('');

  // Fetch subjects from API
  const { data: subjectsData, isLoading, error } = useGetSubjectsQuery();

  // Get subjects array from API response
  const subjects = subjectsData?.data || subjectsData?.subjects || subjectsData || [];

  const handleStartSession = () => {
    if (selectedSubject) {
      onStartSession(selectedSubject, topicText);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content new-session-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header with Images - clickable to tutor profile */}
        <div className="modal-header-images">
          {tutorAvatars.map((t) => (
            <img
              key={t.id}
              src={t.src}
              alt={t.alt}
              className={t.className}
              onClick={() => navigate(`/tutor-profile/${t.id}`)}
              role="button"
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>

        <h2 className="modal-title">Start New Session</h2>
        <p className="modal-subtitle">Pick a subject, then add an optional topic below</p>

        {/* Select Subject */}
        <div className="form-group">
          <label className="form-label">Select Subject</label>
          
          {isLoading ? (
            <div className="subjects-loading"><Spinner size="sm" color="gray" /> Loading subjects...</div>
          ) : error ? (
            <div className="subjects-error">Failed to load subjects</div>
          ) : (
            <div className="subject-grid">
              {subjects.map(subject => (
                <button
                  key={subject.id || subject.title}
                  className={`subject-card ${selectedSubject === (subject.title || subject.id) ? 'selected' : ''}`}
                  onClick={() => setSelectedSubject(subject.title || subject.id)}
                >
                  <div className="subject-name">{subject.title}</div>
                  <div className="subject-topics">
                    {[subject.topics_count, subject.topics].some(n => typeof n === 'number' && n > 0)
                      ? `${subject.topics_count ?? subject.topics ?? 0} topics`
                      : 'Add topic below (optional)'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Topic Input */}
        <div className="form-group">
          <label className="form-label">Topic (Optional)</label>
          <input
            type="text"
            className="topic-input"
            placeholder="e.g., Quadratic Equations, Force and Motion"
            value={topicText}
            onChange={(e) => setTopicText(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-start-session"
            onClick={handleStartSession}
            disabled={!selectedSubject || isLoading}
          >
            Start Session
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Newsessionmodal;
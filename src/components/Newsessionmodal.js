import React, { useState } from 'react';

function Newsessionmodal({ onClose, onStartSession }) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topicText, setTopicText] = useState('');

  const subjects = [
    { id: 'mathematics', name: 'Mathematics', topics: 12 },
    { id: 'physics', name: 'Physics', topics: 10 },
    { id: 'chemistry', name: 'Chemistry', topics: 11 },
    { id: 'biology', name: 'Biology', topics: 9 }
  ];

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

        {/* Header with Images */}
        <div className="modal-header-images">
          <img src="/assets/images/icons/team1.png" alt="Tutor 1" className="tutor-avatar" />
          <img src="/assets/images/icons/team2.png" alt="Tutor 2" className="tutor-avatar main" />
          <img src="/assets/images/icons/team3.png" alt="Tutor 3" className="tutor-avatar" />
        </div>

        <h2 className="modal-title">Start New Session</h2>
        <p className="modal-subtitle">Choose a subject and topic to begin</p>

        {/* Select Subject */}
        <div className="form-group">
          <label className="form-label">Select Subject</label>
          <div className="subject-grid">
            {subjects.map(subject => (
              <button
                key={subject.id}
                className={`subject-card ${selectedSubject === subject.id ? 'selected' : ''}`}
                onClick={() => setSelectedSubject(subject.id)}
              >
                <div className="subject-name">{subject.name}</div>
                <div className="subject-topics">{subject.topics} topics</div>
              </button>
            ))}
          </div>
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
            disabled={!selectedSubject}
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
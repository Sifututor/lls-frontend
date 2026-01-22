import React from 'react';

function TutorCard({ tutor, onSendMessage }) {
  return (
    <div className="instructor-card">
      <span className="instructor-badge">{tutor.badge}</span>
      <h1 className="tutor-name">{tutor.name}</h1>
      <p className="instructor-role">{tutor.role}</p>

      <button 
        className="btn-send-message"
        onClick={onSendMessage}
      >
        Send Message
      </button>

      <div className="instructor-social-icons">
        {tutor.socialLinks.map((link, index) => (
          <button 
            key={index} 
            className="social-icon-btn"
            onClick={() => window.open(link.url, '_blank')}
          >
            <img src={link.icon} alt={link.name} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default TutorCard;
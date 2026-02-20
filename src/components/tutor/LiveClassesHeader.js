import React from 'react';
import { Link } from 'react-router-dom';

function LiveClassesHeader() {
  return (
    <div className="tutor-live-header">
      <div className="tutor-live-header-left">
        <h1 className="tutor-live-title">My Live Classes</h1>
        <p className="tutor-live-subtitle">Manage your scheduled and past live classes</p>
      </div>
      <Link to="/tutor/live-classes/schedule" className="tutor-live-btn-schedule">
        <span className="tutor-live-btn-icon">+</span>
        Schedule New Class
      </Link>
    </div>
  );
}

export default LiveClassesHeader;

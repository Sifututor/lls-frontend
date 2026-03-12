// src/components/tutor/UpcomingLiveClasses.js
import React from 'react';
import { Link } from 'react-router-dom';

const defaultClasses = [
  {
    id: 1,
    title: 'Integration Techniques',
    form: 'Form 5',
    subject: 'Additional Mathematics',
    topic: 'Add Maths',
    date: '15 Dec 2025',
    time: '3:00 PM',
    canStart: true,
  },
  {
    id: 2,
    title: 'Probability Revisions',
    form: 'Form 4',
    subject: 'Additional Mathematics',
    topic: 'Add Maths',
    date: '15 Dec 2025',
    time: '3:00 PM',
    canStart: false,
  },
];

function UpcomingLiveClasses({ classes = defaultClasses }) {
  const hasRealData = Array.isArray(classes) && classes.length > 0;
  const list = hasRealData ? classes : defaultClasses;

  return (
    <div className="upcoming-classes-section">
      <div className="section-header">
        <h3 className="section-title">Upcoming Live Classes</h3>
        <Link to="/tutor/live-classes" className="view-all-link">View all</Link>
      </div>
      <div className="live-classes-list">
        {hasRealData ? (
          list.map((cls) => (
            <div key={cls.id} className="live-class-card">
              <div className="tutor-class-info">
                <h4 className="tutor-class-title">{cls.title}</h4>
                <p className="tutors-class-meta">
                  {cls.form} • {cls.subject} • {cls.topic} • {cls.date} • {cls.time}
                </p>
              </div>
              <div className="tutor-class-actions">
                <button type="button" className="btn-edit">Edit Class</button>
                {cls.canStart ? (
                  <button type="button" className="btn-start">Start Class</button>
                ) : (
                  <button type="button" className="btn-details">Details</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#6B7280', fontSize: 14, margin: 0 }}>
            No upcoming live classes. Schedule a class to see it here.
          </p>
        )}
      </div>
    </div>
  );
}

export default UpcomingLiveClasses;
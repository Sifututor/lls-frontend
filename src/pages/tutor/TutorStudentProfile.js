/**
 * Student Profile – Exact Figma Design
 * Layout: Header (full width top) → Left/Right columns below
 * URL: /tutor/engagement/progress-cards/student/:studentId
 */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/css/tutor-student-profile.css';

const SUBJECT_SECTIONS = [
  {
    id: 'ds',
    title: 'Data Structures',
    progress: {
      videosWatched: 25,
      quizzesAttempted: 36,
      questionsAsked: 39,
      timeSpent: '36 Hrs',
    },
    topScore: 82,
    chapters: [
      { id: 1, name: 'Chapter 1', date: '15 Jan 2025', progress: 82 },
      { id: 2, name: 'Chapter 2', date: '15 Jan 2025', progress: 82 },
      { id: 3, name: 'Chapter 3', date: '15 Jan 2025', progress: 82 },
      { id: 4, name: 'Chapter 4', date: '15 Jan 2025', progress: 82 },
    ],
    mockTests: [
      { id: 1, name: 'Chapter 1, Chapter 3', date: '15 Jan 2025', progress: 82 },
      { id: 2, name: 'Chapter 2', date: '15 Jan 2025', progress: 82 },
      { id: 3, name: 'Chapter 3', date: '15 Jan 2025', progress: 82 },
      { id: 4, name: 'Chapter 4', date: '15 Jan 2025', progress: 82 },
    ],
  },
  {
    id: 'aa',
    title: 'Algorithm Analysis',
    progress: {
      videosWatched: 25,
      quizzesAttempted: 36,
      questionsAsked: 39,
      timeSpent: '36 Hrs',
    },
    topScore: 82,
    chapters: [
      { id: 1, name: 'Chapter 1', date: '15 Jan 2025', progress: 82 },
      { id: 2, name: 'Chapter 2', date: '15 Jan 2025', progress: 82 },
      { id: 3, name: 'Chapter 3', date: '15 Jan 2025', progress: 82 },
      { id: 4, name: 'Chapter 4', date: '15 Jan 2025', progress: 82 },
    ],
    mockTests: [
      { id: 1, name: 'Chapter 1', date: '15 Jan 2025', progress: 82 },
      { id: 2, name: 'Chapter 2', date: '15 Jan 2025', progress: 82 },
      { id: 3, name: 'Chapter 3', date: '15 Jan 2025', progress: 82 },
      { id: 4, name: 'Chapter 4', date: '15 Jan 2025', progress: 82 },
    ],
  },
  {
    id: 'mm',
    title: 'Modern Mathematics',
    progress: {
      videosWatched: 25,
      quizzesAttempted: 36,
      questionsAsked: 39,
      timeSpent: '36 Hrs',
    },
    topScore: 82,
    chapters: [
      { id: 1, name: 'Chapter 1', date: '15 Jan 2025', progress: 82 },
      { id: 2, name: 'Chapter 2', date: '15 Jan 2025', progress: 82 },
      { id: 3, name: 'Chapter 3', date: '15 Jan 2025', progress: 82 },
      { id: 4, name: 'Chapter 4', date: '15 Jan 2025', progress: 82 },
    ],
    mockTests: [
      { id: 1, name: 'Chapter 1', date: '15 Jan 2025', progress: 82 },
      { id: 2, name: 'Chapter 2', date: '15 Jan 2025', progress: 82 },
      { id: 3, name: 'Chapter 3', date: '15 Jan 2025', progress: 82 },
      { id: 4, name: 'Chapter 4', date: '15 Jan 2025', progress: 82 },
    ],
  },
];

function TutorStudentProfile() {
  const { studentId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const student = {
    name: 'Alex Student',
    email: 'alex@lms.my',
    avatar: '/assets/images/avatars/student1.jpg',
    bio: 'A seasoned educator with 15 years experience at Crestwood High, specializing in advanced calculus and AP physics.',
    location: 'San Francisco, CA',
    contactEmail: 'alex@sifu.my',
    timezone: 'Pakistan (GMT+5)',
  };

  return (
    <div className="tsp-wrapper">
      {/* Header - Full Width Top */}
      <div className="tsp-header">
        <div className="tsp-header-left">
          <h1 className="tsp-title">Student Profile</h1>
          <p className="tsp-subtitle">View progress of students assigned to your courses</p>
        </div>
        <div className="tsp-header-right">
          <div className="tsp-search-row">
            <input
              type="text"
              className="tsp-search-input"
              placeholder="Search student"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" className="tsp-search-btn">
              <img src="/assets/images/tutor/tutor-search.png" alt="" />
            </button>
          </div>
        </div>
      </div>

      {/* Content - Left/Right Columns */}
      <div className="tsp-content">
        {/* Left Column */}
        <div className="tsp-left">
          {/* Student Card */}
          <div className="tsp-student-card">
            <div className="tsp-avatar">
              <img 
                src={student.avatar} 
                alt={student.name}
                onError={(e) => { e.target.src = '/assets/images/icons/Ellipse 3.svg'; }}
              />
            </div>
            <h2 className="tsp-name">{student.name}</h2>
            <p className="tsp-email">{student.email}</p>
            <p className="tsp-bio">{student.bio}</p>
            
            <div className="tsp-contact">
              <div className="tsp-contact-row">
                <img src="/assets/images/icons/map.svg" alt="" className="tsp-contact-icon" />
                <span>{student.location}</span>
              </div>
              <div className="tsp-contact-row">
                <img src="/assets/images/icons/mail.svg" alt="" className="tsp-contact-icon" />
                <span>{student.contactEmail}</span>
              </div>
              <div className="tsp-contact-row">
                <img src="/assets/images/icons/time.svg" alt="" className="tsp-contact-icon" />
                <span>{student.timezone}</span>
              </div>
            </div>

            <p className="tsp-disclaimer">
              * Limited Access: <span>You can only view students assigned to your courses. To view other students, contact admin.</span>
            </p>
          </div>
        </div>

        {/* Right Column - Subject Sections */}
        <div className="tsp-right">
          {/* Subject Sections */}
          {SUBJECT_SECTIONS.map((section) => (
            <div key={section.id} className="tsp-section">
              <h3 className="tsp-section-title">{section.title}</h3>

              {/* Progress Block */}
              <div className="tsp-block">
                <h4 className="tsp-block-title">Progress</h4>
                <div className="tsp-progress-row">
                  <div className="tsp-progress-col">
                    <div className="tsp-progress-item">
                      <span className="tsp-label">Videos watched</span>
                      <span className="tsp-value">{section.progress.videosWatched}</span>
                    </div>
                    <div className="tsp-progress-item">
                      <span className="tsp-label">Questions Asked in Video Q&A</span>
                      <span className="tsp-value">{section.progress.questionsAsked}</span>
                    </div>
                  </div>
                  <div className="tsp-progress-col">
                    <div className="tsp-progress-item">
                      <span className="tsp-label">Quizzes Attempted</span>
                      <span className="tsp-value">{section.progress.quizzesAttempted}</span>
                    </div>
                    <div className="tsp-progress-item">
                      <span className="tsp-label">Time Spent Learning</span>
                      <span className="tsp-value">{section.progress.timeSpent}</span>
                    </div>
                  </div>
                  <div className="tsp-progress-col tsp-top-score-col">
                    <span className="tsp-label">Top Score</span>
                    <div className="tsp-bar-row">
                      <div className="tsp-bar-wrap">
                        <div className="tsp-bar" style={{ width: `${section.topScore}%` }} />
                      </div>
                      <span className="tsp-pct">{section.topScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapters Breakdown */}
              <div className="tsp-block">
                <h4 className="tsp-block-title">Chapters Breakdown</h4>
                <div className="tsp-breakdown-grid">
                  {section.chapters.map((ch) => (
                    <div key={ch.id} className="tsp-breakdown-item">
                      <div className="tsp-breakdown-top">
                        <div className="tsp-breakdown-info">
                          <span className="tsp-breakdown-name">{ch.name}</span>
                          <span className="tsp-breakdown-date">{ch.date}</span>
                        </div>
                        <button type="button" className="tsp-details-btn">See Details</button>
                      </div>
                      <div className="tsp-bar-row">
                        <div className="tsp-bar-wrap">
                          <div className="tsp-bar" style={{ width: `${ch.progress}%` }} />
                        </div>
                        <span className="tsp-pct">{ch.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock Test Breakdown */}
              <div className="tsp-block">
                <h4 className="tsp-block-title">Mock Test Breakdown</h4>
                <div className="tsp-breakdown-grid">
                  {section.mockTests.map((test) => (
                    <div key={test.id} className="tsp-breakdown-item">
                      <div className="tsp-breakdown-top">
                        <div className="tsp-breakdown-info">
                          <span className="tsp-breakdown-name">{test.name}</span>
                          <span className="tsp-breakdown-date">{test.date}</span>
                        </div>
                        <button type="button" className="tsp-details-btn">See Details</button>
                      </div>
                      <div className="tsp-bar-row">
                        <div className="tsp-bar-wrap">
                          <div className="tsp-bar" style={{ width: `${test.progress}%` }} />
                        </div>
                        <span className="tsp-pct">{test.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TutorStudentProfile;
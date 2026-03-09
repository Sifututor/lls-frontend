/**
 * Student Profile – Exact Figma Design
 * Layout: Header (full width top) → Left/Right columns below
 * URL: /tutor/engagement/progress-cards/student/:studentId
 */
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetTutorStudentAnalyticsQuery } from '../../store/api/authApi';
import '../../assets/css/tutor-student-profile.css';

function formatSecondsToHuman(seconds) {
  const n = Number(seconds) || 0;
  const h = Math.floor(n / 3600);
  const m = Math.floor((n % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function TutorStudentProfile() {
  const { studentId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, isError, error } = useGetTutorStudentAnalyticsQuery(studentId, { skip: !studentId });

  const student = data?.student || {};
  const sections = useMemo(() => {
    const list = data?.courses || [];
    return list.map((course) => ({
      id: course.course_id,
      title: course.course_title || 'Course',
      progress: {
        videosWatched: Number(course.videos_completed) || 0,
        quizzesAttempted: Array.isArray(course.mock_exams) ? course.mock_exams.length : 0,
        questionsAsked: 0,
        timeSpent: formatSecondsToHuman(course.time_spent_seconds),
      },
      topScore: Number(course.overall_progress) || 0,
      chapters: (course.chapters || []).map((ch) => ({
        id: ch.chapter_id,
        name: ch.chapter_title || 'Chapter',
        date: '',
        progress: Number(ch.progress) || 0,
      })),
      mockTests: (course.mock_exams || []).map((m, idx) => ({
        id: m.id || idx + 1,
        name: m.title || m.name || 'Mock Test',
        date: m.submitted_on || '',
        progress: Number(m.score) || 0,
      })),
    }));
  }, [data]);

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
                src="/assets/images/icons/Ellipse 3.svg"
                alt={student.name || 'Student'}
                onError={(e) => { e.target.src = '/assets/images/icons/Ellipse 3.svg'; }}
              />
            </div>
            <h2 className="tsp-name">{student.name || 'Student'}</h2>
            <p className="tsp-email">{student.email || '—'}</p>
            <p className="tsp-bio">{student.bio || '—'}</p>
            
            <div className="tsp-contact">
              <div className="tsp-contact-row">
                <img src="/assets/images/icons/map.svg" alt="" className="tsp-contact-icon" />
                <span>—</span>
              </div>
              <div className="tsp-contact-row">
                <img src="/assets/images/icons/mail.svg" alt="" className="tsp-contact-icon" />
                <span>{student.email || '—'}</span>
              </div>
              <div className="tsp-contact-row">
                <img src="/assets/images/icons/time.svg" alt="" className="tsp-contact-icon" />
                <span>—</span>
              </div>
            </div>

            <p className="tsp-disclaimer">
              * Limited Access: <span>You can only view students assigned to your courses. To view other students, contact admin.</span>
            </p>
          </div>
        </div>

        {/* Right Column - Subject Sections */}
        <div className="tsp-right">
          {isLoading && <p style={{ color: '#9A9A9A' }}>Loading student analytics...</p>}
          {isError && (
            <p style={{ color: '#DD4040' }}>
              Failed to load analytics. {error?.data?.message || error?.message || ''}
            </p>
          )}
          {/* Subject Sections */}
          {!isLoading && !isError && sections.length === 0 && (
            <p style={{ color: '#9A9A9A' }}>No course analytics found.</p>
          )}
          {sections.map((section) => (
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
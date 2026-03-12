import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetParentAccessByTokenQuery } from '../../store/api/authApi';
import '../../assets/css/parent-dashboard.css';

function ParentAccessLanding() {
  const { token } = useParams();
  const { data, isLoading, isError } = useGetParentAccessByTokenQuery(token, {
    skip: !token,
  });

  if (!token) {
    return (
      <div className="dashboard-content">
        <div style={{ maxWidth: 640, margin: '80px auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#163300', marginBottom: 8 }}>
            Invalid link
          </h1>
          <p style={{ color: '#6B7280' }}>Parent access token is missing or invalid.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="dashboard-content">
        <div style={{ maxWidth: 640, margin: '80px auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#163300', marginBottom: 8 }}>
            Loading student dashboard…
          </h1>
          <p style={{ color: '#6B7280' }}>Please wait while we fetch the student details.</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="dashboard-content">
        <div style={{ maxWidth: 640, margin: '80px auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#163300', marginBottom: 8 }}>
            Link expired or revoked
          </h1>
          <p style={{ color: '#6B7280' }}>
            This parent access link is no longer valid. Please ask your child to generate a new link
            from their account.
          </p>
        </div>
      </div>
    );
  }

  const student = data.student || {};
  const stats = data.stats || {};
  const courses = Array.isArray(data.courses) ? data.courses : [];

  return (
    <div className="dashboard-content">
      <section className="parent-dashboard-hero">
        <h1 className="welcome-title" style={{ marginBottom: 4 }}>
          Parent Access
        </h1>
        <p className="welcome-subtitle">
          You are viewing the learning overview for&nbsp;
          <strong>{student.name || 'Student'}</strong>.
        </p>
      </section>

      <section className="enrolled-courses-grid" style={{ marginTop: 24 }}>
        <article className="enrolled-course-card" style={{ maxWidth: 320 }}>
          <div className="enrolled-course-info">
            <h4 className="enrolled-course-title">Overview</h4>
            <p className="enrolled-course-activity">
              Email: {student.email || '—'}
            </p>
            <div className="enrolled-stats">
              <div className="enrolled-stat-row">
                <span className="stat-label">Total courses</span>
                <span className="stat-value">{stats.total_courses ?? 0}</span>
              </div>
              <div className="enrolled-stat-row">
                <span className="stat-label">Completed courses</span>
                <span className="stat-value">{stats.completed_courses ?? 0}</span>
              </div>
              <div className="enrolled-stat-row">
                <span className="stat-label">Quiz attempts</span>
                <span className="stat-value">{stats.quiz_attempts ?? 0}</span>
              </div>
              <div className="enrolled-stat-row">
                <span className="stat-label">Average score</span>
                <span className="stat-value">
                  {(stats.average_score ?? 0).toFixed ? (stats.average_score || 0).toFixed(1) : stats.average_score ?? 0}%
                </span>
              </div>
            </div>
          </div>
        </article>

        {courses.map((course) => (
          <article key={course.course_id} className="enrolled-course-card">
            <div className="enrolled-course-info">
              <h4 className="enrolled-course-title">{course.title}</h4>
              <div className="enrolled-progress-row">
                <span className="progress-label">Progress</span>
                <span className="progress-percent">
                  {course.progress != null ? `${course.progress}%` : 'Not started'}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ParentAccessLanding;


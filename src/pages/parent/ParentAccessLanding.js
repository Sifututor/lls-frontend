import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetParentAccessByTokenQuery } from '../../store/api/authApi';
import { API_BASE } from '../../config/apiConfig';
import '../../assets/css/parent-dashboard.css';

function ParentAccessLanding() {
  const { token } = useParams();
  const { data, isLoading, isError, error } = useGetParentAccessByTokenQuery(token, {
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
    const backendMessage =
      error?.data?.message ||
      error?.message ||
      (typeof error?.error === 'string' ? error.error : null);
    const is404 = error?.status === 404;

    return (
      <div className="dashboard-content">
        <div style={{ maxWidth: 640, margin: '80px auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#163300', marginBottom: 8 }}>
            {backendMessage || 'Link expired or revoked'}
          </h1>
          <p style={{ color: '#6B7280', marginBottom: 8 }}>
            {backendMessage ||
              'This parent access link is no longer valid. Please ask your child to generate a new link from their account.'}
          </p>
          {is404 && (
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 16 }}>
              The server returned “not found”. Ensure the app’s API URL (e.g. <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: 4 }}>REACT_APP_API_URL</code>) points to the backend that has the <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: 4 }}>GET /api/parent-access/:token</code> route.
            </p>
          )}
        </div>
      </div>
    );
  }

  const student = data.student || {};
  const stats = data.stats || {};
  const courses = Array.isArray(data.courses) ? data.courses : [];
  const recentQuizzes = Array.isArray(data.recent_quizzes) ? data.recent_quizzes : [];

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="dashboard-content">
      <section className="parent-dashboard-hero">
        <h1 className="welcome-title" style={{ marginBottom: 4 }}>
          Parent Access
        </h1>
        <p className="welcome-subtitle">
          You are viewing the learning overview for&nbsp;
          <strong>{student.name || 'Student'}</strong>
          {student.email && (
            <span style={{ display: 'block', marginTop: 4, fontSize: 14, color: '#6B7280' }}>
              {student.email}
            </span>
          )}
        </p>
      </section>

      <section className="enrolled-courses-grid" style={{ marginTop: 24 }}>
        <article className="enrolled-course-card" style={{ maxWidth: 320 }}>
          <div className="enrolled-course-info">
            <h4 className="enrolled-course-title">Overview</h4>
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
                  {typeof stats.average_score === 'number' ? `${Number(stats.average_score).toFixed(1)}%` : (stats.average_score ?? '0%')}
                </span>
              </div>
            </div>
          </div>
        </article>

        {courses.map((course) => (
          <article key={course.course_id} className="enrolled-course-card">
            <div className="enrolled-course-info">
              <h4 className="enrolled-course-title">{course.title || 'Course'}</h4>
              <div className="enrolled-progress-row">
                <span className="progress-label">Progress</span>
                <span className="progress-percent">
                  {course.progress != null && course.progress !== '' ? `${course.progress}%` : 'Not started'}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {recentQuizzes.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h3 className="section-title" style={{ marginBottom: 16 }}>Recent quizzes</h3>
          <div className="enrolled-courses-grid">
            {recentQuizzes.map((q, idx) => (
              <article key={q.quiz_id || idx} className="enrolled-course-card">
                <div className="enrolled-course-info">
                  <h4 className="enrolled-course-title">Quiz #{q.quiz_id ?? idx + 1}</h4>
                  <div className="enrolled-stat-row">
                    <span className="stat-label">Score</span>
                    <span className="stat-value">{q.score != null ? `${q.score}%` : '—'}</span>
                  </div>
                  <div className="enrolled-stat-row">
                    <span className="stat-label">Submitted</span>
                    <span className="stat-value">{formatDate(q.submitted_at)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ParentAccessLanding;


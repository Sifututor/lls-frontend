import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetParentAccessByTokenQuery } from '../../store/api/authApi';
import StatCard from '../../components/StatCard';
import '../../assets/css/parent-dashboard.css';

function EnrolledCourseCard({ course }) {
  const [progressWidth, setProgressWidth] = useState(0);
  const progress = course.progress != null && course.progress !== '' ? Number(course.progress) : 0;
  const hasProgress = course.progress != null && course.progress !== '';

  useEffect(() => {
    const timer = setTimeout(() => setProgressWidth(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <article className="enrolled-course-card">
      <div className="enrolled-course-info">
        <h4 className="enrolled-course-title">{course.title || 'Course'}</h4>

        <div className="enrolled-progress-row">
          <span className="progress-label">Progress</span>
          <span className="progress-percent">
            {hasProgress ? `${progress}% Complete` : 'Not started'}
          </span>
        </div>
        {hasProgress && (
          <div className="enrolled-progress-bar">
            <div className="progress-fill" style={{ width: `${progressWidth}%` }} />
          </div>
        )}
      </div>
    </article>
  );
}

function RecentQuizCard({ quiz }) {
  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <article className="recent-quiz-card">
      <h4 className="quiz-title">Quiz #{quiz.quiz_id}</h4>

      <div className="quiz-tags">
        <span className="quiz-tag">Score: {quiz.score != null ? `${quiz.score}%` : '—'}</span>
      </div>

      <div className="quiz-progress-row">
        <span className="progress-label">Submitted</span>
        <span className="progress-percent">{formatDate(quiz.submitted_at)}</span>
      </div>
      <div className="quiz-progress-bar">
        <div className="progress-fill" style={{ width: `${Math.min(quiz.score ?? 0, 100)}%` }} />
      </div>
    </article>
  );
}

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

    return (
      <div className="dashboard-content">
        <div style={{ maxWidth: 640, margin: '80px auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#163300', marginBottom: 8 }}>
            {backendMessage || 'Link expired or revoked'}
          </h1>
          <p style={{ color: '#6B7280' }}>
            {backendMessage ||
              'This parent access link is no longer valid. Please ask your child to generate a new link from their account.'}
          </p>
        </div>
      </div>
    );
  }

  const student = data.student || {};
  const stats = data.stats || {};
  const courses = Array.isArray(data.courses) ? data.courses : [];
  const recentQuizzes = Array.isArray(data.recent_quizzes) ? data.recent_quizzes : [];

  const statsData = [
    {
      id: 1,
      type: 'blue',
      label: `${stats.total_courses ?? 0} enrolled`,
      icon: '/assets/images/icons/042-graduation.svg',
      value: stats.total_courses ?? 0,
      title: 'Total Courses',
      progressText: 'Completed',
      progressValue: `${stats.completed_courses ?? 0} of ${stats.total_courses ?? 0}`,
      progress: stats.total_courses ? Math.round(((stats.completed_courses ?? 0) / stats.total_courses) * 100) : 0,
    },
    {
      id: 2,
      type: 'green',
      label: `${stats.completed_courses ?? 0} done`,
      icon: '/assets/images/icons/001-analytics.svg',
      value: stats.completed_courses ?? 0,
      title: 'Completed Courses',
      progressText: 'Progress',
      progressValue: `${stats.completed_courses ?? 0} of ${stats.total_courses ?? 0}`,
      progress: stats.total_courses ? Math.round(((stats.completed_courses ?? 0) / stats.total_courses) * 100) : 0,
    },
    {
      id: 3,
      type: 'purple',
      label: `${stats.quiz_attempts ?? 0} attempts`,
      icon: '/assets/images/icons/140-video.svg',
      value: stats.quiz_attempts ?? 0,
      title: 'Quiz Attempts',
      progressText: 'Performance',
      progressValue: stats.quiz_attempts ? 'Active' : 'No attempts yet',
      progress: stats.quiz_attempts ? Math.min(stats.quiz_attempts * 10, 100) : 0,
    },
    {
      id: 4,
      type: 'orange',
      label: `${typeof stats.average_score === 'number' ? stats.average_score.toFixed(1) : 0}%`,
      icon: '/assets/images/icons/127-time.svg',
      value: `${typeof stats.average_score === 'number' ? Math.round(stats.average_score) : 0}%`,
      title: 'Average Score',
      progressText: 'Score',
      progressValue: `${typeof stats.average_score === 'number' ? stats.average_score.toFixed(1) : 0}%`,
      progress: typeof stats.average_score === 'number' ? Math.round(stats.average_score) : 0,
    },
  ];

  return (
    <div className="dashboard-content">
      {/* Welcome + Stats */}
      <section className="welcome-stats-container">
        <div className="welcome-section">
          <div className="welcome-text">
            <h1 className="welcome-title">
              {student.name ? `${student.name}'s Learning Overview` : 'Student Overview'}
            </h1>
            <p className="welcome-subtitle">
              {student.email || 'Viewing student learning progress via parent access link.'}
            </p>
          </div>
        </div>

        <div className="stats-grid">
          {statsData.map((stat) => (
            <StatCard key={stat.id} data={stat} />
          ))}
        </div>
      </section>

      {/* Enrolled Courses */}
      <section className="welcome-stats-container">
        <div className="section-header stats">
          <h3 className="section-title">Enrolled Courses</h3>
        </div>
        <div className="enrolled-courses-grid">
          {courses.length > 0 ? (
            courses.map((course) => (
              <EnrolledCourseCard key={course.course_id} course={course} />
            ))
          ) : (
            <p style={{ color: '#9A9A9A', fontFamily: 'Inter, sans-serif' }}>No courses enrolled yet.</p>
          )}
        </div>
      </section>

      {/* Recent Quiz Scores */}
      <section className="welcome-stats-container">
        <div className="section-header stats">
          <h3 className="section-title">Recent Quiz Scores</h3>
        </div>
        <div className="recent-quizzes-grid">
          {recentQuizzes.length > 0 ? (
            recentQuizzes.map((quiz, idx) => (
              <RecentQuizCard key={quiz.quiz_id || idx} quiz={quiz} />
            ))
          ) : (
            <p style={{ color: '#9A9A9A', fontFamily: 'Inter, sans-serif' }}>No quiz attempts yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ParentAccessLanding;

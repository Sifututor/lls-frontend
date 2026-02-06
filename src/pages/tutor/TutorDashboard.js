// src/pages/tutor/TutorDashboard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  useGetTutorDashboardQuery,
  useGetTutorUpcomingClassesQuery,
  useGetTutorStudentsProgressQuery,
  useGetTutorPendingQnAQuery,
  useGetTutorSubmissionsQuery,
} from '../../store/api/authApi';
import '../../assets/css/tutor.css';

const statsData = [
  {
    icon: 'graduation-cap',
    badge: '2 this week',
    badgeColor: 'green',
    value: 156,
    label: 'Assigned Students',
    progressLabel: 'Progress',
    progressValue: '12 of 20',
    progressPercent: 60,
    progressColor: 'green',
  },
  {
    icon: 'video',
    badge: '3 this week',
    badgeColor: 'blue',
    value: 24,
    label: 'Lessons Uploaded',
    progressLabel: 'Progress',
    progressValue: '148 of 200',
    progressPercent: 74,
    progressColor: 'blue',
  },
  {
    icon: 'chart',
    badge: '5 this month',
    badgeColor: 'yellow',
    value: 18,
    label: 'Quiz Created',
    progressLabel: 'Performance',
    progressValue: 'Excellent',
    progressPercent: 100,
    progressColor: 'green',
  },
  {
    icon: 'clock',
    badge: '85 Answered',
    badgeColor: 'red',
    value: 5,
    label: 'Pending Q&A',
    progressLabel: 'Weekly Goal',
    progressValue: '48 of 100h',
    progressPercent: 48,
    progressColor: 'yellow',
  },
];

const quickActions = [
  { icon: 'plus', label: 'Add Lesson', route: '/tutor/courses/upload' },
  { icon: 'quiz', label: 'Create Quiz', route: '/tutor/courses/quiz/create' },
  { icon: 'calendar', label: 'Schedule Class', route: '/tutor/live-classes/schedule' },
  { icon: 'message', label: 'Answer Q&A', route: '/tutor/engagement/qna' },
  { icon: 'chart', label: 'View Progress', route: '/tutor/engagement/progress' },
];

const defaultClasses = [
  {
    id: 1,
    title: 'Form 4 Mathematics - Algebra',
    form_level: 'Form 4',
    subject: 'Mathematics',
    course: 'Algebra',
    date: '15 Jan 2025',
    time: '10:00 AM',
  },
  {
    id: 2,
    title: 'Form 5 Physics - Mechanics',
    form_level: 'Form 5',
    subject: 'Physics',
    course: 'Mechanics',
    date: '16 Jan 2025',
    time: '2:00 PM',
  },
];

const defaultStudents = [
  { id: 1, name: 'Ahmad', avatar: '/assets/images/student-img.png', form_level: 'Form 4', course: 'Mathematics', progress: 72 },
  { id: 2, name: 'Siti', avatar: '/assets/images/student-img.png', form_level: 'Form 5', course: 'Physics', progress: 85 },
  { id: 3, name: 'Raj', avatar: '/assets/images/student-img.png', form_level: 'Form 4', course: 'Chemistry', progress: 58 },
];

const defaultQuestions = [
  {
    id: 1,
    question: 'How do I solve quadratic equations using the formula?',
    chapter: 'Chapter 2: Quadratic Equations',
    timestamp: '12:34',
    student_name: 'Ahmad',
    student_avatar: '/assets/images/student-img.png',
    form_level: 'Form 4',
    subject: 'Mathematics',
    upvotes: 3,
    time_left: '2h left',
  },
  {
    id: 2,
    question: 'What is Newton\'s second law of motion?',
    chapter: 'Chapter 3: Forces',
    timestamp: '08:12',
    student_name: 'Siti',
    student_avatar: '/assets/images/student-img.png',
    form_level: 'Form 5',
    subject: 'Physics',
    upvotes: 5,
    time_left: '5h left',
  },
];

const defaultSubmissions = [
  { id: 1, title: 'Algebra Assignment - Week 2', description: 'Submitted by Ahmad', status: 'Pending', color: '#F59E0B' },
  { id: 2, title: 'Physics Lab Report', description: 'Submitted by Siti', status: 'Approved', color: '#10B981' },
  { id: 3, title: 'Chemistry Quiz Answers', description: 'Submitted by Raj', status: 'Pending', color: '#F59E0B' },
];

function TutorDashboard() {
  const navigate = useNavigate();
  const userDataRaw = localStorage.getItem('userData') || Cookies.get('userData');
  const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
  const tutorName = userData.name || userData.email?.split('@')[0] || 'Tutor';

  const { data: dashboardData } = useGetTutorDashboardQuery(undefined, { skip: false });
  const { data: upcomingData } = useGetTutorUpcomingClassesQuery(undefined, { skip: false });
  const { data: studentsData } = useGetTutorStudentsProgressQuery(undefined, { skip: false });
  const { data: qnaData } = useGetTutorPendingQnAQuery(undefined, { skip: false });
  const { data: submissionsData } = useGetTutorSubmissionsQuery(undefined, { skip: false });

  const classes = upcomingData?.classes ?? upcomingData ?? defaultClasses;
  const students = studentsData?.students ?? studentsData ?? defaultStudents;
  const questions = qnaData?.questions ?? qnaData ?? defaultQuestions;
  const submissions = submissionsData?.submissions ?? submissionsData ?? defaultSubmissions;

  const stats = Array.isArray(dashboardData?.stats) ? dashboardData.stats : statsData;

  return (
    <div className="tutor-dashboard">
      {/* A. Welcome Section */}
      <div className="tutor-welcome">
        <h1>Welcome back, {tutorName}!</h1>
        <p>You&apos;ve completed 80% of your weekly goal, Keep it up!</p>
      </div>

      {/* B. Stats Cards */}
      <div className="tutor-stats-grid">
        {stats.map((card, i) => (
          <div key={i} className={`tutor-stat-card tutor-stat-${card.progressColor}`}>
            <div className="tutor-stat-header">
              <span className={`tutor-stat-badge tutor-badge-${card.badgeColor}`}>{card.badge}</span>
              <span className="tutor-stat-icon" data-icon={card.icon} />
            </div>
            <div className="tutor-stat-value">{card.value}</div>
            <div className="tutor-stat-label">{card.label}</div>
            <div className="tutor-stat-progress">
              <div className="tutor-progress-meta">
                <span>{card.progressLabel}</span>
                <span>{card.progressValue}</span>
              </div>
              <div className="tutor-progress-bar">
                <div
                  className={`tutor-progress-fill tutor-fill-${card.progressColor}`}
                  style={{ width: `${card.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* C. Quick Actions */}
      <div className="tutor-quick-actions">
        {quickActions.map((action, i) => (
          <button
            key={i}
            type="button"
            className="tutor-quick-action-btn"
            onClick={() => navigate(action.route)}
          >
            <span className="tutor-quick-icon" data-icon={action.icon} />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      <div className="tutor-dashboard-grid">
        {/* Left column: Upcoming Classes + Students Progress + Submissions */}
        <div className="tutor-dashboard-main">
          {/* D. Upcoming Live Classes */}
          <section className="tutor-section upcoming-classes">
            <div className="section-header">
              <h3>Upcoming Live Classes</h3>
              <Link to="/tutor/live-classes">View all</Link>
            </div>
            <div className="tutor-class-list">
              {(Array.isArray(classes) ? classes : []).map((cls) => (
                <div key={cls.id || cls.title} className="tutor-class-card">
                  <h4>{cls.title}</h4>
                  <p className="tutor-class-meta">
                    {cls.form_level} • {cls.subject} • {cls.course} • {cls.date} • {cls.time}
                  </p>
                  <div className="tutor-class-actions">
                    <button type="button" className="btn-outline">Edit Class</button>
                    <button type="button" className="btn-primary">Start Class</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* E. Assigned Students Progress */}
          <section className="tutor-section students-progress">
            <div className="section-header">
              <h3>Assigned Students Progress</h3>
              <Link to="/tutor/engagement/progress">View all</Link>
            </div>
            <div className="tutor-students-list">
              {(Array.isArray(students) ? students : []).map((student) => (
                <div key={student.id || student.name} className="tutor-student-card">
                  <img src={student.avatar} alt={student.name} className="tutor-student-avatar" />
                  <div className="tutor-student-info">
                    <h4>{student.name}</h4>
                    <p>{student.form_level} • {student.course}</p>
                  </div>
                  <div className="tutor-student-progress">
                    <span>Progress</span>
                    <span>{student.progress}% Complete</span>
                    <div className="tutor-progress-bar">
                      <div
                        className="tutor-progress-fill tutor-fill-green"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* G. Pending & Recent Submissions */}
          <section className="tutor-section submissions">
            <div className="section-header">
              <h3>Pending & Recent Submissions</h3>
              <Link to="/tutor/courses/pending">View all</Link>
            </div>
            <div className="tutor-submissions-list">
              {(Array.isArray(submissions) ? submissions : []).map((sub) => (
                <div key={sub.id || sub.title} className="tutor-submission-card">
                  <div className="tutor-submission-icon" style={{ background: sub.color }} />
                  <div className="tutor-submission-info">
                    <h4>{sub.title}</h4>
                    <p>{sub.description}</p>
                  </div>
                  <span className={`tutor-status-badge tutor-status-${(sub.status || '').toLowerCase()}`}>
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column: Pending Q&A */}
        <aside className="tutor-dashboard-sidebar">
          {/* F. Pending Q&A */}
          <section className="tutor-section pending-qna">
            <div className="section-header">
              <h3>Pending Q&A</h3>
              <Link to="/tutor/engagement/qna">View all</Link>
            </div>
            <div className="tutor-qna-list">
              {(Array.isArray(questions) ? questions : []).map((q) => (
                <div key={q.id || q.question} className="tutor-qna-card">
                  <h4>{q.question}</h4>
                  <p className="tutor-qna-chapter">▶ {q.chapter} at {q.timestamp}</p>
                  <p className="tutor-qna-meta">
                    <img src={q.student_avatar} alt="" className="tutor-qna-avatar" />
                    {q.student_name} • {q.form_level} • {q.subject} • {q.upvotes} Upvoted •{' '}
                    <span className="tutor-qna-urgent">{q.time_left}</span>
                  </p>
                  <button type="button" className="btn-primary btn-full">View Question</button>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default TutorDashboard;

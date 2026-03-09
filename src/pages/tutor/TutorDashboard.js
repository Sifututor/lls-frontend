// src/pages/tutor/TutorDashboard.js
import React from 'react';
import Cookies from 'js-cookie';
import StatCard from '../../components/StatCard';
import QuickActions from '../../components/tutor/QuickActions';
import UpcomingLiveClasses from '../../components/tutor/UpcomingLiveClasses';
import AssignedStudentsProgress from '../../components/tutor/AssignedStudentsProgress';
import PendingQA from '../../components/tutor/PendingQA';
import PendingSubmissions from '../../components/tutor/PendingSubmissions';
import {
  useGetTutorDashboardQuery,
  useGetTutorUpcomingClassesQuery,
  useGetTutorStudentsQuery,
  useGetTutorVideoQAQuery,
  useGetTutorSubmissionsQuery,
} from '../../store/api/authApi';
import './TutorDashboard.css';

const DEFAULT_STATS = [
  { id: 1, type: 'blue', label: '', icon: '/assets/images/icons/042-graduation.svg', value: 0, title: 'Assigned Students', progressText: 'Progress', progressValue: '—', progress: 0 },
  { id: 2, type: 'purple', label: '', icon: '/assets/images/icons/140-video.svg', value: 0, title: 'Lessons Uploaded', progressText: 'Progress', progressValue: '—', progress: 0 },
  { id: 3, type: 'green', label: '', icon: '/assets/images/icons/001-analytics.svg', value: 0, title: 'Quiz Created', progressText: 'Performance', progressValue: '—', progress: 0 },
  { id: 4, type: 'orange', label: '', icon: '/assets/images/icons/127-time.svg', value: 0, title: 'Pending Q&A', progressText: 'Weekly Goal', progressValue: '—', progress: 0 },
];

function mapDashboardToStats(d) {
  if (!d) return DEFAULT_STATS;
  const data = d?.data ?? d;
  return [
    { ...DEFAULT_STATS[0], value: data.assigned_students ?? data.students_count ?? 0, progressValue: data.students_progress ?? '—', progress: data.students_progress_pct ?? 0 },
    { ...DEFAULT_STATS[1], value: data.lessons_uploaded ?? data.lessons_count ?? 0, progressValue: data.lessons_progress ?? '—', progress: data.lessons_progress_pct ?? 0 },
    { ...DEFAULT_STATS[2], value: data.quizzes_created ?? data.quizzes_count ?? 0, progressValue: data.quiz_performance ?? '—', progress: data.quiz_progress_pct ?? 0 },
    { ...DEFAULT_STATS[3], value: data.pending_qa ?? data.pending_qna_count ?? 0, progressValue: data.weekly_goal ?? '—', progress: data.weekly_goal_pct ?? 0 },
  ];
}

function mapUpcomingToClasses(list) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 5).map((c) => {
    const dt = c.scheduled_at ? new Date(c.scheduled_at) : null;
    return {
      id: c.id,
      title: c.title || 'Untitled',
      form: c.course?.level ?? c.form_level ?? '—',
      subject: c.course?.subject ?? c.subject ?? '—',
      topic: c.course?.title ?? c.topic ?? '—',
      date: dt ? dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
      time: dt ? dt.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }) : '—',
      canStart: !!c.can_start,
    };
  });
}

function mapStudentsToProgress(list) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 5).map((s) => {
    const p = s.progress ?? s.completion_percent ?? 0;
    return {
      id: s.id,
      name: s.name ?? s.full_name ?? '—',
      avatar: s.profile_image ?? s.avatar ?? '/assets/images/avatars/student1.jpg',
      form: s.form_level ?? s.form ?? '—',
      subject: s.subject ?? '—',
      progress: p,
      progressColor: p >= 70 ? 'green' : p >= 40 ? 'orange' : 'red',
    };
  });
}

function mapVideoQAToPending(list) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 5).map((q) => ({
    id: q.id,
    question: q.question_text ?? q.question ?? '',
    chapter: q.lesson?.title ?? q.chapter ?? '',
    student: q.student?.name ?? q.user?.name ?? '—',
    form: q.form_level ?? '',
    subject: q.subject ?? '',
    upvotes: q.upvotes_count ?? q.upvotes ?? 0,
    timeLeft: q.created_at ? '—' : '',
    urgent: !!q.urgent,
  }));
}

function mapSubmissionsToPending(list) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 5).map((s) => ({
    id: s.id,
    title: s.title ?? s.content ?? '—',
    meta: s.meta ?? s.course ?? '',
    status: s.status ?? 'Pending',
    statusColor: (s.status || '').toLowerCase() === 'rejected' ? 'red' : (s.status || '').toLowerCase() === 'approved' ? 'green' : 'orange',
  }));
}

function TutorDashboard() {
  const userDataRaw = localStorage.getItem('userData') || Cookies.get('userData');
  const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
  const userName = userData?.name?.split(' ')[0] || userData?.first_name || 'Tutor';

  const { data: dashboardData } = useGetTutorDashboardQuery();
  const { data: upcomingData } = useGetTutorUpcomingClassesQuery();
  const { data: studentsData } = useGetTutorStudentsQuery(1);
  const { data: videoQAData } = useGetTutorVideoQAQuery({ filter: 'unanswered', page: 1 });
  const { data: submissionsData } = useGetTutorSubmissionsQuery();

  const statsData = mapDashboardToStats(dashboardData);
  const upcomingClasses = mapUpcomingToClasses(upcomingData?.data ?? upcomingData);
  const studentsList = mapStudentsToProgress(studentsData?.data ?? studentsData);
  const pendingQA = mapVideoQAToPending(videoQAData?.data ?? videoQAData);
  const pendingSubs = mapSubmissionsToPending(submissionsData?.data ?? submissionsData);

  return (
    <div className="tutor-dashboard-content">
      {/* Welcome + Stats Section - SAME as Parent Dashboard */}
      <section className="welcome-stats-container">
        <div className="welcome-section">
          <div className="welcome-text">
            <h1 className="welcome-title">Welcome back, {userName}!</h1>
            <p className="welcome-subtitle">You've completed 80% of your weekly goal, Keep it up!</p>
          </div>
        </div>
        
        {/* Stats Grid - Using existing StatCard component */}
        <div className="stats-grid">
          {statsData.map((stat) => (
            <StatCard key={stat.id} data={stat} />
          ))}
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="tutor-dashboard-column">
        {/* Left Column */}
        <div className="tutor-dashboard-left">
          <QuickActions />
          <UpcomingLiveClasses classes={upcomingClasses} />
          <AssignedStudentsProgress students={studentsList} />
        </div>

        {/* Right Column */}
        <div className="tutor-dashboard-right">
          <PendingQA questions={pendingQA} />
          <PendingSubmissions submissions={pendingSubs} />
        </div>
      </div>
    </div>
  );
}

export default TutorDashboard;
// src/pages/tutor/TutorDashboard.js
import React from 'react';
import Cookies from 'js-cookie';
import StatCard from '../../components/StatCard';
import QuickActions from '../../components/tutor/QuickActions';
import UpcomingLiveClasses from '../../components/tutor/UpcomingLiveClasses';
import AssignedStudentsProgress from '../../components/tutor/AssignedStudentsProgress';
import PendingQA from '../../components/tutor/PendingQA';
import PendingSubmissions from '../../components/tutor/PendingSubmissions';
import './TutorDashboard.css';

function TutorDashboard() {
  const userDataRaw = localStorage.getItem('userData') || Cookies.get('userData');
  const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
  const userName = userData?.name?.split(' ')[0] || userData?.first_name || 'Tutor';

  // Stats Data - SAME FORMAT as Parent Dashboard (using StatCard component)
  const statsData = [
    {
      id: 1,
      type: 'blue',
      label: '↑ 2 this week',
      icon: '/assets/images/icons/042-graduation.svg',
      value: 156,
      title: 'Assigned Students',
      progressText: 'Progress',
      progressValue: '12 of 20',
      progress: 60
    },
    {
      id: 2,
      type: 'purple',
      label: '↑ 3 this week',
      icon: '/assets/images/icons/140-video.svg',
      value: 24,
      title: 'Lessons Uploaded',
      progressText: 'Progress',
      progressValue: '148 of 200',
      progress: 74
    },
    {
      id: 3,
      type: 'green',
      label: '↑ 5 this month',
      icon: '/assets/images/icons/001-analytics.svg',
      value: 18,
      title: 'Quiz Created',
      progressText: 'Performance',
      progressValue: 'Excellent',
      progress: 90
    },
    {
      id: 4,
      type: 'orange',
      label: '↑ 85 Answered',
      icon: '/assets/images/icons/127-time.svg',
      value: 5,
      title: 'Pending Q&A',
      progressText: 'Weekly Goal',
      progressValue: '48 of 100h',
      progress: 48
    }
  ];

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
          <UpcomingLiveClasses />
          <AssignedStudentsProgress />
        </div>

        {/* Right Column */}
        <div className="tutor-dashboard-right">
          <PendingQA />
          <PendingSubmissions />
        </div>
      </div>
    </div>
  );
}

export default TutorDashboard;
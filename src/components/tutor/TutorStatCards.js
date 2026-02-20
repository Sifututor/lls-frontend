import React from 'react';

const IconGraduate = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
  </svg>
);
const IconVideo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);
const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
  </svg>
);
const IconQuestion = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
  </svg>
);

function TutorStatCards({ stats }) {
  const statCardsData = [
    {
      id: 1,
      icon: <IconGraduate />,
      value: stats?.assignedStudents ?? 156,
      label: 'Assigned Students',
      change: '2 this week',
      changeType: 'increase',
      progressLabel: 'Progress',
      progressValue: '12 of 20',
      progressPercent: 60,
      bgColor: 'blue',
    },
    {
      id: 2,
      icon: <IconVideo />,
      value: stats?.lessonsUploaded ?? 24,
      label: 'Lessons Uploaded',
      change: '3 this week',
      changeType: 'increase',
      progressLabel: 'Progress',
      progressValue: '148 of 200',
      progressPercent: 74,
      bgColor: 'pink',
    },
    {
      id: 3,
      icon: <IconClipboard />,
      value: stats?.quizCreated ?? 18,
      label: 'Quiz Created',
      change: '5 this month',
      changeType: 'increase',
      progressLabel: 'Performance',
      progressValue: 'Excellent',
      progressPercent: 90,
      bgColor: 'green',
    },
    {
      id: 4,
      icon: <IconQuestion />,
      value: stats?.pendingQA ?? 5,
      label: 'Pending Q&A',
      change: '85 Answered',
      changeType: 'increase',
      progressLabel: 'Weekly Goal',
      progressValue: '48 of 100h',
      progressPercent: 48,
      bgColor: 'yellow',
    },
  ];

  return (
    <div className="tutor-stat-cards">
      {statCardsData.map((stat) => (
        <div key={stat.id} className={`tutor-stat-card tutor-stat-card-${stat.bgColor}`}>
          <div className={`stat-change ${stat.changeType}`}>
            <span className="arrow">↑</span>
            <span>{stat.change}</span>
          </div>
          <div className="stat-main">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
          <div className="stat-progress">
            <div className="progress-labels">
              <span className="progress-label">{stat.progressLabel}</span>
              <span className="progress-value">{stat.progressValue}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${stat.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TutorStatCards;

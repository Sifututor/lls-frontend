// src/pages/parent/ParentDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';

// ========================================
// ENROLLED COURSE CARD COMPONENT
// ========================================
function EnrolledCourseCard({ course, onClick }) {
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(course.progress || 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [course.progress]);

  return (
    <article className="enrolled-course-card" onClick={onClick}>
      <div className="enrolled-course-thumbnail">
        <img 
          src={course.thumbnail || '/assets/images/live-classes.png'} 
          alt={course.title}
          onError={(e) => e.target.src = '/assets/images/live-classes.png'}
        />
      </div>

      <div className="enrolled-course-badge">
        <span className="form-badge">{course.form}</span>
      </div>

      <div className="enrolled-course-info">
        <h4 className="enrolled-course-title">{course.title}</h4>
        <p className="enrolled-course-activity">Last activity: {course.lastActivity}</p>

        <div className="enrolled-progress-row">
          <span className="progress-label">Progress</span>
          <span className="progress-percent">{course.progress}% Complete</span>
        </div>
        <div className="enrolled-progress-bar">
          <div className="progress-fill" style={{ width: `${progressWidth}%` }} />
        </div>

        <div className="enrolled-stats">
          <div className="enrolled-stat-row">
            <span className="stat-label">Videos watched</span>
            <span className="stat-value">{course.videosWatched}<span className="stat-total">/{course.totalVideos}</span></span>
          </div>
          <div className="enrolled-stat-row">
            <span className="stat-label">Quiz scores</span>
            <span className="stat-value highlight">{course.quizScore}%</span>
          </div>
          
          {course.quizBreakdown?.map((quiz, index) => (
            <div key={index} className="enrolled-stat-row sub">
              <span className="stat-label stat-label-sub">- {quiz.name}</span>
              <span className="stat-value">{quiz.score}%</span>
            </div>
          ))}

          <div className="enrolled-stat-row">
            <span className="stat-label">Learning time in this course</span>
            <span className="stat-value highlight">{course.learningTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// ========================================
// RECENT QUIZ CARD COMPONENT
// ========================================
function RecentQuizCard({ quiz, onClick }) {
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(quiz.progress || 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [quiz.progress]);

  return (
    <article className="recent-quiz-card" onClick={onClick}>
      <h4 className="quiz-title">{quiz.title}</h4>
      <p className="quiz-description">{quiz.description}</p>

      <div className="quiz-tags">
        {quiz.tags?.map((tag, index) => (
          <span key={index} className="quiz-tag">{tag}</span>
        ))}
      </div>

      <div className="quiz-progress-row">
        <span className="progress-label">Progress</span>
        <span className="progress-percent">{quiz.progress}% Complete</span>
      </div>
      <div className="quiz-progress-bar">
        <div className="progress-fill" style={{ width: `${progressWidth}%` }} />
      </div>
    </article>
  );
}

// ========================================
// MAIN PARENT DASHBOARD COMPONENT
// ========================================
function ParentDashboard() {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    try {
      const childData = JSON.parse(localStorage.getItem('selectedChild') || '{}');
      setSelectedChild(childData);
    } catch {
      setSelectedChild({ name: 'Alex' });
    }
  }, []);

 // Stats Data - Using same format as student Dashboard
const statsData = [
  {
    id: 1,
    type: 'blue',  // ← Change kiya
    label: '↑ 2 this week',
    icon: '/assets/images/icons/042-graduation.svg',
    value: 3,
    title: 'Total Courses',
    progressText: 'Progress',
    progressValue: '3 of 20',
    progress: 15
  },
  {
    id: 2,
    type: 'purple',  // ← Change kiya
    label: '↑ 3 this week',
    icon: '/assets/images/icons/140-video.svg',
    value: 45,
    title: 'Videos Watched',
    progressText: 'Progress',
    progressValue: '45 of 100',
    progress: 45
  },
  {
    id: 3,
    type: 'green',  // ← Change kiya
    label: '↑ 5 this month',
    icon: '/assets/images/icons/001-analytics.svg',
    value: 32,
    title: 'Quizzes Completed',
    progressText: 'Performance',
    progressValue: 'Excellent',
    progress: 85
  },
  {
    id: 4,
    type: 'orange',  // ← Change kiya
    label: '↑ 1 Hour',
    icon: '/assets/images/icons/127-time.svg',
    value: '4.5h',
    title: 'Learning Time',
    progressText: 'Weekly Goal',
    progressValue: '48 of 100h',
    progress: 48
  }
];

  // Enrolled Courses Data
  const enrolledCourses = [
    {
      id: 1,
      thumbnail: '/assets/images/live-classes.png',
      form: 'Form 4',
      title: 'Mathematics',
      lastActivity: '2 hours ago',
      progress: 45,
      videosWatched: 10,
      totalVideos: 50,
      quizScore: 85,
      quizBreakdown: [
        { name: 'Intermediate', score: 84 },
        { name: 'Intermediate I', score: 85 },
        { name: 'Intermediate II', score: 86 }
      ],
      learningTime: '45hrs'
    },
    {
      id: 2,
      thumbnail: '/assets/images/live-classes.png',
      form: 'Form 4',
      title: 'Mathematics',
      lastActivity: '2 hours ago',
      progress: 45,
      videosWatched: 10,
      totalVideos: 50,
      quizScore: 85,
      quizBreakdown: [
        { name: 'Intermediate', score: 84 },
        { name: 'Intermediate I', score: 85 },
        { name: 'Intermediate II', score: 86 }
      ],
      learningTime: '45hrs'
    },
    {
      id: 3,
      thumbnail: '/assets/images/live-classes.png',
      form: 'Form 4',
      title: 'Mathematics',
      lastActivity: '2 hours ago',
      progress: 45,
      videosWatched: 10,
      totalVideos: 50,
      quizScore: 85,
      quizBreakdown: [
        { name: 'Intermediate', score: 84 },
        { name: 'Intermediate I', score: 85 },
        { name: 'Intermediate II', score: 86 }
      ],
      learningTime: '45hrs'
    }
  ];

  // Recent Quiz Scores Data
  const recentQuizzes = [
    {
      id: 1,
      title: 'Quadratic Equations',
      description: "This lesson explores Big O notation, time complexity, and space complexity. By the end of this lesson, you'll be able to analyze algorithms and improve their efficiency.",
      tags: ['Mathematics', 'Additional Mathematics', 'Form 4'],
      progress: 45
    },
    {
      id: 2,
      title: 'Quadratic Equations',
      description: "This lesson explores Big O notation, time complexity, and space complexity. By the end of this lesson, you'll be able to analyze algorithms and improve their efficiency.",
      tags: ['Mathematics', 'Additional Mathematics', 'Form 4'],
      progress: 45
    },
    {
      id: 3,
      title: 'Quadratic Equations',
      description: "This lesson explores Big O notation, time complexity, and space complexity. By the end of this lesson, you'll be able to analyze algorithms and improve their efficiency.",
      tags: ['Mathematics', 'Additional Mathematics', 'Form 4'],
      progress: 45
    }
  ];

  const childName = selectedChild?.name || 'Alex';

  return (
    <div className="dashboard-content">
      {/* Welcome + Stats - Using same structure as student Dashboard */}
      <section className="welcome-stats-container">
        <div className="welcome-section">
          <div className="welcome-text">
            <h1 className="welcome-title">Welcome back, {childName}!</h1>
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

      {/* Enrolled Courses */}
      <section className="welcome-stats-container">
        <div className="section-header stats">
          <h3 className="section-title">Enrolled Courses</h3>
        </div>
        <div className="enrolled-courses-grid">
          {enrolledCourses.map((course) => (
            <EnrolledCourseCard 
              key={course.id} 
              course={course}
              onClick={() => navigate(`/parent/course/${course.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Recent Quiz Scores */}
      <section className="welcome-stats-container">
        <div className="section-header stats">
          <h3 className="section-title">Recent Quiz Scores</h3>
        </div>
        <div className="recent-quizzes-grid">
          {recentQuizzes.map((quiz) => (
            <RecentQuizCard 
              key={quiz.id} 
              quiz={quiz}
              onClick={() => navigate(`/parent/quiz/${quiz.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ParentDashboard;
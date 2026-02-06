// src/pages/QuizDetails.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SectionLoader } from '../components/ui/LoadingSpinner';
import { useGetQuizOverviewQuery } from '../store/api/authApi';
import { getTutorProfilePath } from '../utils/tutorProfileUtils';

function QuizDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agreedToRules, setAgreedToRules] = useState(false);

  // Fetch quiz data from API
  const { data: quizData, isLoading, error } = useGetQuizOverviewQuery(id);

  // Static data for sections not in API
  const staticData = {
    badges: ['Form 5', 'Computer Science', 'Data Structures & Algorithm Optimization', 'Chapter 2: React Performance'],
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    description: 'This test evaluates your understanding of basic and advanced sorting algorithms including implementation, complexity analysis, and practical applications.',
    topics: [
      'Bubble Sort',
      'Selection Sort',
      'Insertion Sort',
      'Merge Sort',
      'Quick Sort',
      'Time & Space Complexity',
      'Stable vs Unstable Sorting',
      'Best, Worst, Average Case Analysis'
    ],
    instructions: {
      general: [
        'You must complete the test in one sitting',
        'Timer starts immediately after you click Start Test',
        'You cannot pause or reset the timer',
        'Do not refresh or close the browser tab',
        'Once submitted, answers cannot be changed'
      ],
      behavior: [
        'You can move between questions freely'
      ],
      submission: [
        'Test auto-submits when time ends',
        'Score is shown immediately after submission'
      ]
    },
    requirements: {
      device: [
        { icon: '/assets/images/icons/035-desktop.svg', text: 'Use a laptop or desktop for best experience' },
        { icon: '/assets/images/icons/003-chart.svg', text: 'Stable internet connection required' }
      ],
      rules: [
        { icon: '/assets/images/icons/057-error sign.svg', text: 'Phone calls during test', allowed: false },
        { icon: '/assets/images/icons/057-error sign.svg', text: 'Switching browser tabs', allowed: false },
        { icon: '/assets/images/icons/057-error sign.svg', text: 'Copy/paste functionality', allowed: false },
        { icon: '/assets/images/icons/022-check.svg', text: 'Pen and paper for rough work', allowed: true }
      ]
    },
    questionTypes: [
      {
        type: 'MCQ',
        icon: '/assets/images/icons/MCQ.png',
        description: 'Multiple choice questions testing conceptual understanding',
        className: 'mcq-card'
      },
      {
        type: 'True/False',
        icon: '/assets/images/icons/Truefalse.png',
        description: 'True or false questions assessing conceptual clarity.',
        className: 'truefalse-card'
      }
    ]
  };

  // Build stats from API data
  const getStats = () => {
    if (!quizData?.quiz) return [];

    const quiz = quizData.quiz;
    const attempts = quizData.attempts;

    return [
      { 
        icon: '/assets/images/icons/003-alarm.svg', 
        label: 'Duration', 
        value: quiz.time_limit ? `${quiz.time_limit} Minutes` : 'No Limit', 
        size: 'short' 
      },
      { 
        icon: '/assets/images/icons/046-teacher.svg', 
        label: 'Questions', 
        value: `${quiz.total_questions} Questions`, 
        size: 'short' 
      },
      { 
        icon: '/assets/images/icons/055-notes.svg', 
        label: 'Test Type', 
        value: 'MCQ + True/False', 
        size: 'long' 
      },
      { 
        icon: '/assets/images/icons/060-favorite.svg', 
        label: 'Attempts', 
        value: attempts?.remaining_today || `${quiz.attempts_allowed} attempts`, 
        size: 'short' 
      },
      { 
        icon: '/assets/images/icons/047-trophy.svg', 
        label: 'Passing Score', 
        value: `${quiz.passing_score}% Required`, 
        size: 'medium' 
      }
    ];
  };

  const handleStartQuiz = () => {
    if (agreedToRules) {
      navigate(`/student/quiz/${id}/take`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="quiz-details-content">
        <SectionLoader message="Loading quiz details..." height="400px" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="quiz-details-content">
        <div className="error-container">
          <p>Failed to load quiz details. Please try again.</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const quiz = quizData?.quiz;
  const attempts = quizData?.attempts;
  const stats = getStats();

  return (
    <div className="quiz-details-content">
      <h2 className="quiz-page-title">Quiz Details</h2>

      {/* Quiz Header Section */}
      <div className="quiz-header-section">
        {/* Badge Pills */}
        <div className="quiz-badges">
          {staticData.badges.map((badge, index) => (
            <span key={index} className="quiz-badge-pill">{badge}</span>
          ))}
        </div>

        {/* Quiz Title - Dynamic */}
        <h1 className="quiz-main-title">{quiz?.title || 'Quiz'}</h1>

        {/* Best Score Badge - if available */}
        {attempts?.best_score !== null && (
          <div className="quiz-best-score">
            <span>Best Score: {attempts.best_score}%</span>
          </div>
        )}

        {/* Instructor Info - clickable to tutor profile */}
        <div
          className="quiz-instructor-info"
          onClick={() => {
            const path = getTutorProfilePath(staticData.instructor);
            if (path) navigate(path);
          }}
          role={getTutorProfilePath(staticData.instructor) ? 'button' : undefined}
          style={getTutorProfilePath(staticData.instructor) ? { cursor: 'pointer' } : undefined}
        >
          <img 
            src={staticData.instructor.avatar} 
            alt="Instructor" 
            className="instructor-avatar-small" 
          />
          <span className="instructor-name-text">{staticData.instructor.name}</span>
        </div>

        {/* Description Box */}
        <div className="quiz-description-box">
          <h3 className="quiz-section-title">Description</h3>
          <p className="quiz-description-text">{staticData.description}</p>
        </div>
      </div>

      {/* Stats Grid - Dynamic */}
      <div className="quiz-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`quiz-stat-card ${stat.size}-content`}>
            <div className="quiz-stat-icon">
              <img src={stat.icon} alt={stat.label} />
            </div>
            <div className="quiz-stat-content">
              <div className="quiz-stat-label">{stat.label}</div>
              <div className="quiz-stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="quiz-two-column">
        {/* Left Column */}
        <div className="quiz-left-column">
          {/* Topics Covered */}
          <div className="quiz-info-box">
            <h3 className="quiz-box-title">Topics Covered</h3>
            <div className="quiz-topics-list">
              {staticData.topics.map((topic, index) => (
                <span key={index} className="quiz-topic-pill">{topic}</span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="quiz-info-box">
            <h3 className="quiz-box-title">Instructions</h3>

            <div className="quiz-instructions-section">
              <h4 className="quiz-instructions-subtitle">General Instructions</h4>
              <ul className="quiz-instructions-list">
                {staticData.instructions.general.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>

            <div className="quiz-instructions-section">
              <h4 className="quiz-instructions-subtitle">Question Behavior</h4>
              <ul className="quiz-instructions-list">
                {staticData.instructions.behavior.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>

            <div className="quiz-instructions-section">
              <h4 className="quiz-instructions-subtitle">Submission Rules</h4>
              <ul className="quiz-instructions-list">
                {staticData.instructions.submission.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="quiz-right-column">
          {/* Requirements */}
          <div className="quiz-info-box">
            <h3 className="quiz-box-title">Requirements</h3>

            <div className="quiz-requirements-section">
              <h4 className="quiz-requirements-subtitle">Device Requirements</h4>
              {staticData.requirements.device.map((req, index) => (
                <div key={index} className="quiz-requirement-item">
                  <img src={req.icon} alt="" />
                  <span>{req.text}</span>
                </div>
              ))}
            </div>

            <div className="quiz-requirements-section">
              <h4 className="quiz-requirements-subtitle">Allowed / Not Allowed</h4>
              {staticData.requirements.rules.map((rule, index) => (
                <div 
                  key={index} 
                  className={`quiz-requirement-item ${rule.allowed ? 'allowed' : ''}`}
                >
                  <img src={rule.icon} alt="" />
                  <span>{rule.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Question Types */}
          <div className="quiz-info-box">
            <h3 className="quiz-box-title">Question Type(s)</h3>

            <div className="quiz-question-types">
              {staticData.questionTypes.map((qType, index) => (
                <div key={index} className={`quiz-type-card ${qType.className}`}>
                  <div className="quiz-type-icon">
                    <img src={qType.icon} alt={qType.type} />
                  </div>
                  <div className="quiz-type-content">
                    <div className="quiz-type-name">{qType.type}</div>
                    <div className="quiz-type-desc">{qType.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Start Test Section */}
      <div className="quiz-start-section">
        <label className="quiz-agreement-checkbox">
          <input 
            type="checkbox" 
            id="agreeCheckbox"
            checked={agreedToRules}
            onChange={(e) => setAgreedToRules(e.target.checked)}
          />
          <span>I have read and agree to all the test instructions and rules</span>
        </label>
        <button 
          className="btn-start-test" 
          id="startTestBtn"
          disabled={!agreedToRules}
          onClick={handleStartQuiz}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 4L14 10L6 16V4Z" fill="currentColor"/>
          </svg>
          Start Test
        </button>
      </div>
    </div>
  );
}

export default QuizDetails;
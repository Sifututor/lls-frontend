import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

function QuizDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agreedToRules, setAgreedToRules] = useState(false);

  // Quiz Data
  const quizData = {
    title: 'Why Performance Matters',
    badges: ['Form 5', 'Computer Science', 'Data Structures & Algorithm Optimization', 'Chapter 2: React Performance'],
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    description: 'This test evaluates your understanding of basic and advanced sorting algorithms including implementation, complexity analysis, and practical applications.',
    stats: [
      { icon: '/assets/images/icons/003-alarm.svg', label: 'Duration', value: '25 Minutes', size: 'short' },
      { icon: '/assets/images/icons/046-teacher.svg', label: 'Questions', value: '10 Questions', size: 'short' },
      { icon: '/assets/images/icons/055-notes.svg', label: 'Test Type', value: 'MCQ + True/False', size: 'long' },
      { icon: '/assets/images/icons/060-favorite.svg', label: 'Attempts', value: '2/3', size: 'short' },
      { icon: '/assets/images/icons/047-trophy.svg', label: 'Passing Score', value: '70% Required', size: 'medium' }
    ],
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

  const handleStartQuiz = () => {
    if (agreedToRules) {
      navigate(`/quiz-take/${id}`);
    }
  };

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <TopNavbar title="My Courses" breadcrumb="Data Structures" />

        {/* Quiz Details Content */}
        <div className="quiz-details-content">
          <h2 className="quiz-page-title">Quiz Details</h2>

          {/* Quiz Header Section */}
          <div className="quiz-header-section">
            {/* Badge Pills */}
            <div className="quiz-badges">
              {quizData.badges.map((badge, index) => (
                <span key={index} className="quiz-badge-pill">{badge}</span>
              ))}
            </div>

            {/* Quiz Title */}
            <h1 className="quiz-main-title">{quizData.title}</h1>

            {/* Instructor Info */}
            <div className="quiz-instructor-info">
              <img 
                src={quizData.instructor.avatar} 
                alt="Instructor" 
                className="instructor-avatar-small" 
              />
              <span className="instructor-name-text">{quizData.instructor.name}</span>
            </div>

            {/* Description Box */}
            <div className="quiz-description-box">
              <h3 className="quiz-section-title">Description</h3>
              <p className="quiz-description-text">{quizData.description}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="quiz-stats-grid">
            {quizData.stats.map((stat, index) => (
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
                  {quizData.topics.map((topic, index) => (
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
                    {quizData.instructions.general.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>

                <div className="quiz-instructions-section">
                  <h4 className="quiz-instructions-subtitle">Question Behavior</h4>
                  <ul className="quiz-instructions-list">
                    {quizData.instructions.behavior.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>

                <div className="quiz-instructions-section">
                  <h4 className="quiz-instructions-subtitle">Submission Rules</h4>
                  <ul className="quiz-instructions-list">
                    {quizData.instructions.submission.map((instruction, index) => (
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
                  {quizData.requirements.device.map((req, index) => (
                    <div key={index} className="quiz-requirement-item">
                      <img src={req.icon} alt="" />
                      <span>{req.text}</span>
                    </div>
                  ))}
                </div>

                <div className="quiz-requirements-section">
                  <h4 className="quiz-requirements-subtitle">Allowed / Not Allowed</h4>
                  {quizData.requirements.rules.map((rule, index) => (
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
                  {quizData.questionTypes.map((qType, index) => (
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
      </main>
    </>
  );
}

export default QuizDetails;
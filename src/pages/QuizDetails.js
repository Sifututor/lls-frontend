// src/pages/QuizDetails.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SectionLoader } from '../components/ui/LoadingSpinner';
import { useGetQuizOverviewQuery, useStartQuizAttemptMutation } from '../store/api/authApi';
import { getTutorProfilePath } from '../utils/tutorProfileUtils';
import { useQuizLimit } from '../hooks/useQuizLimit';

function QuizDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agreedToRules, setAgreedToRules] = useState(false);

  // Fetch quiz data from API
  const { data: quizData, isLoading, error } = useGetQuizOverviewQuery(id);
  const [startQuiz, { isLoading: isStarting }] = useStartQuizAttemptMutation();
  
  // ✅ NEW: Quiz daily limit hook (3 attempts/day for free users)
  const {
    canStartAttempt,
    usedAttempts,
    maxAttempts,
    remainingAttempts,
    hoursUntilReset,
    recordAttempt,
    isPremium
  } = useQuizLimit(id);

  // ⚠️ BACKEND TODO: API should provide these fields in quiz overview response
  // For now, using fallback data structure (backend team needs to add these fields)
  const staticData = {
    // These should come from API: quiz.badges or quiz.course_info
    badges: quizData?.quiz?.badges || [],
    
    // Should come from API: quiz.instructor
    instructor: quizData?.quiz?.instructor || {
      name: 'Instructor',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    
    // Should come from API: quiz.description
    description: quizData?.quiz?.description || 'Complete this quiz to test your understanding of the topic.',
    
    // Should come from API: quiz.topics_covered
    topics: quizData?.quiz?.topics_covered || quizData?.quiz?.topics || [],
    
    // Should come from API: quiz.instructions
    instructions: quizData?.quiz?.instructions || {
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
    
    // Should come from API: quiz.requirements
    requirements: quizData?.quiz?.requirements || {
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
    
    // Should come from API: quiz.question_types
    questionTypes: quizData?.quiz?.question_types || [
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
        value: isPremium 
          ? 'Unlimited' 
          : `${remainingAttempts}/${maxAttempts} remaining today`, 
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

  const handleStartQuiz = async () => {
    if (!agreedToRules) {
      toast.warning('Please agree to the test instructions and rules');
      return;
    }
    
    // ✅ CHECK QUIZ LIMIT (Free users: 3 attempts/day)
    if (!canStartAttempt) {
      toast.error(
        `You have used all ${maxAttempts} quiz attempts for today. ` +
        `Your limit will reset in ${hoursUntilReset} hour${hoursUntilReset !== 1 ? 's' : ''}. ` +
        `Upgrade to Premium for unlimited attempts!`
      );
      return;
    }
    
    try {
      const result = await startQuiz(id).unwrap();
      
      // ✅ RECORD ATTEMPT (increments free user count)
      const recorded = recordAttempt();
      if (!recorded && !isPremium) {
        toast.error('Failed to record quiz attempt');
        return;
      }
      
      const attemptId = result.attempt_id ?? result.attemptId;
      const timeLimit = result.time_limit ?? result.timeLimit ?? (quizData?.quiz?.time_limit ? quizData.quiz.time_limit * 60 : 600);
      
      if (attemptId) {
        navigate(`/student/quiz-attempt/${attemptId}`, {
          state: { attemptId, timeLimit: typeof timeLimit === 'number' ? timeLimit : 600, quizId: id },
        });
      } else {
        navigate(`/student/quiz/${id}/take`);
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to start quiz:', err);
      toast.error(err?.data?.message || err?.message || 'Failed to start quiz');
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
        {/* ✅ Show daily limit warning for free users */}
        {!isPremium && remainingAttempts <= 1 && remainingAttempts > 0 && (
          <div className="quiz-limit-warning" style={{
            padding: '12px 16px',
            background: '#FFF3CD',
            border: '1px solid #FFE69C',
            borderRadius: '8px',
            marginBottom: '16px',
            color: '#856404'
          }}>
            ⚠️ This is your last attempt for today. Your limit resets in {hoursUntilReset} hour{hoursUntilReset !== 1 ? 's' : ''}.
          </div>
        )}
        
        {!isPremium && remainingAttempts === 0 && (
          <div className="quiz-limit-error" style={{
            padding: '12px 16px',
            background: '#F8D7DA',
            border: '1px solid #F5C2C7',
            borderRadius: '8px',
            marginBottom: '16px',
            color: '#842029'
          }}>
            ❌ You have used all {maxAttempts} attempts for today. Try again in {hoursUntilReset} hour{hoursUntilReset !== 1 ? 's' : ''} or upgrade to Premium for unlimited attempts!
          </div>
        )}
        
        <label className="quiz-agreement-checkbox">
          <input 
            type="checkbox" 
            id="agreeCheckbox"
            checked={agreedToRules}
            onChange={(e) => setAgreedToRules(e.target.checked)}
            disabled={!canStartAttempt}
          />
          <span>I have read and agree to all the test instructions and rules</span>
        </label>
        <button 
          className="btn-start-test" 
          id="startTestBtn"
          disabled={!agreedToRules || isStarting || !canStartAttempt}
          onClick={handleStartQuiz}
          title={!canStartAttempt ? 'Daily limit reached' : ''}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 4L14 10L6 16V4Z" fill="currentColor"/>
          </svg>
          {!canStartAttempt ? 'Limit Reached' : 'Start Test'}
        </button>
      </div>
    </div>
  );
}

export default QuizDetails;
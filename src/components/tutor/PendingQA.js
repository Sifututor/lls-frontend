// src/components/tutor/PendingQA.js
import React from 'react';
import { Link } from 'react-router-dom';

const defaultQuestions = [
  {
    id: 1,
    question: 'How do I solve this quadratic when the discriminant is negative?',
    chapter: 'Chapter 5: Quadratic Equations at 12:34',
    student: 'Siti Aminah',
    form: 'Form 5',
    subject: 'Additional Mathematics',
    upvotes: 25,
    timeLeft: '2 hrs left',
    urgent: true,
  },
  {
    id: 2,
    question: 'Can you explain the difference between sin and cosine graphs',
    chapter: 'Chapter 7: Trigonometric Functions at 8:22',
    student: 'Ahmad Razak',
    form: '',
    subject: '',
    upvotes: 0,
    timeLeft: '18 hrs left',
    urgent: false,
  },
];

function PendingQA({ questions = defaultQuestions }) {
  const hasRealData = Array.isArray(questions) && questions.length > 0;
  const list = hasRealData ? questions : defaultQuestions;

  return (
    <div className="pending-qa-section">
      <div className="section-header">
        <h3 className="section-title">Pending Q&A</h3>
        <Link to="/tutor/engagement/qna" className="view-all-link">View all</Link>
      </div>
      <div className="tutor-qa-list">
        {hasRealData ? (
          list.map((q) => (
            <div key={q.id} className={`qa-card ${q.urgent ? 'urgent' : ''}`}>
              <h4 className="tutor-qa-question">{q.question}</h4>
              <p className="qa-chapter">
                <span className="play-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M2.63115 0.956754C2.45086 0.849701 2.22698 0.847653 2.04476 0.951381C1.86253 1.05511 1.75 1.24865 1.75 1.45833V12.5417C1.75 12.7513 1.86253 12.9449 2.04476 13.0486C2.22698 13.1524 2.45086 13.1503 2.63115 13.0433L11.9645 7.50161C12.1415 7.39649 12.25 7.20586 12.25 7C12.25 6.79414 12.1415 6.60351 11.9645 6.49839L2.63115 0.956754Z" fill="#329256"/>
</svg></span> {q.chapter}
              </p>
              <div className="tutor-qa-meta">
              <img src="/assets/images/icons/Ellipse 2.svg" alt="Tutor" className="qa-instructor-avatar" />
                <span>{q.student}</span>
                {q.form && <span> • {q.form}</span>}
                {q.subject && <span> • {q.subject}</span>}
                {q.upvotes > 0 && <span> • {q.upvotes} Upvoted</span>}
                <span className={`time-left ${q.urgent ? 'urgent' : ''}`}> • {q.timeLeft}</span>
              </div>
              <Link to={`/tutor/engagement/qna?question=${q.id}`} className="btn-view-question">View Question</Link>
            </div>
          ))
        ) : (
          <p style={{ color: '#6B7280', fontSize: 14, margin: 0 }}>
            No pending video Q&amp;A. New student questions will appear here.
          </p>
        )}
      </div>
    </div>
  );
}

export default PendingQA;
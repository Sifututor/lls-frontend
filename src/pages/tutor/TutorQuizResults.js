/**
 * Quiz Results – Engagement. Filters (right of title), tabs (Mock Test / Quiz), table.
 * URL: /tutor/engagement/quiz-results
 */
import React, { useState } from 'react';
import '../../assets/css/tutor-quiz-results.css';

const SAMPLE_RESULTS = [
  { id: 1, student: 'Alice Johnson', quiz: 'Quadratic Equations Quiz', score: 92, scoreType: 'green', attempts: '1/2', submittedOn: 'Today, 2:30 PM' },
  { id: 2, student: 'Brian Smith', quiz: 'Trigonometry Basics', score: 95, scoreType: 'green', attempts: '2/2', submittedOn: 'Today, 1:15 PM' },
  { id: 3, student: 'David Brown', quiz: 'Algebra Fundamentals', score: 75, scoreType: 'orange', attempts: '1/2', submittedOn: 'Yesterday, 4:00 PM' },
  { id: 4, student: 'Catherine Lee', quiz: 'Quadratic Equations Quiz', score: 89, scoreType: 'green', attempts: '2/2', submittedOn: 'Yesterday, 11:20 AM' },
  { id: 5, student: 'Henry Adams', quiz: 'Trigonometry Basics', score: 79, scoreType: 'orange', attempts: '1/2', submittedOn: 'Yesterday, 9:00 AM' },
  { id: 6, student: 'Grace Hall', quiz: 'Algebra Fundamentals', score: 10, scoreType: 'red', attempts: '2/2', submittedOn: '15 Jan 2025' },
  { id: 7, student: 'Frank King', quiz: 'Quadratic Equations Quiz', score: 92, scoreType: 'green', attempts: '1/2', submittedOn: '15 Jan 2025' },
  { id: 8, student: 'Eva White', quiz: 'Trigonometry Basics', score: 83, scoreType: 'green', attempts: '2/2', submittedOn: '14 Jan 2025' },
  { id: 9, student: 'Jack Taylor', quiz: 'Algebra Fundamentals', score: 55, scoreType: 'orange', attempts: '1/2', submittedOn: '14 Jan 2025' },
];

function TutorQuizResults() {
  const [activeTab, setActiveTab] = useState('mock');
  const [course, setCourse] = useState('');
  const [chapter, setChapter] = useState('');
  const [lesson, setLesson] = useState('');
  const [score, setScore] = useState('');
  const [submittedDate, setSubmittedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = SAMPLE_RESULTS.filter(
    (r) =>
      !searchQuery ||
      r.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.quiz.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyFilters = () => {
    console.log('Apply filters', { course, chapter, lesson, score, submittedDate });
  };

  return (
    <div className="tqr-wrapper">
      {/* Header: title left, filters + search right */}
      <div className="tqr-header">
        <div className="tqr-header-left">
          <h1 className="tqr-title">Quiz Results</h1>
          <p className="tqr-subtitle">View student performance on your quizzes</p>
        </div>
        <div className="tqr-header-right">
          <div className="tqr-filters">
            <select className="tqr-select" value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">Course</option>
              <option value="Add Maths Form 4">Add Maths Form 4</option>
              <option value="Modern Maths Form 5">Modern Maths Form 5</option>
            </select>
            <select className="tqr-select" value={chapter} onChange={(e) => setChapter(e.target.value)}>
              <option value="">Chapter</option>
              <option value="Chapter 1">Chapter 1</option>
              <option value="Chapter 2">Chapter 2</option>
            </select>
            <select className="tqr-select" value={lesson} onChange={(e) => setLesson(e.target.value)}>
              <option value="">Lesson</option>
              <option value="Lesson 1">Lesson 1</option>
              <option value="Lesson 2">Lesson 2</option>
            </select>
            <select className="tqr-select" value={score} onChange={(e) => setScore(e.target.value)}>
              <option value="">Score</option>
              <option value="high">High (80%+)</option>
              <option value="medium">Medium (50-79%)</option>
              <option value="low">Low (&lt;50%)</option>
            </select>
            <select className="tqr-select" value={submittedDate} onChange={(e) => setSubmittedDate(e.target.value)}>
              <option value="">Submitted Date</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
            </select>
            <button type="button" className="tqr-btn-apply" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
          <div className="tqr-search-row">
            <input
              type="text"
              className="tqr-search-input"
              placeholder="Search student"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" className="tqr-search-btn" aria-label="Search">
              <img src="/assets/images/tutor/tutor-search.png" alt="" className="tqr-search-icon" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs – Mock Test (active with badge) / Quiz */}
      <div className="tqr-tabs">
        <button
          type="button"
          className={`tqr-tab ${activeTab === 'mock' ? 'active' : ''}`}
          onClick={() => setActiveTab('mock')}
        >
          Mock Test
          <span className="tqr-tab-badge">3</span>
        </button>
        <button
          type="button"
          className={`tqr-tab ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz
        </button>
      </div>

      {/* Table – Student Progress jaisa */}
      <div className="tqr-table-wrapper">
        <table className="tqr-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Quiz</th>
              <th>Score</th>
              <th>Attempts</th>
              <th>Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.student}</td>
                <td>{row.quiz}</td>
                <td>
                  <span className={`tqr-score tqr-score-${row.scoreType}`}>{row.score}%</span>
                </td>
                <td>{row.attempts}</td>
                <td>{row.submittedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer: Pagination + Disclaimer – Student Progress jaisa */}
      <div className="tqr-footer">
        <div className="tqr-pagination">
          <button type="button" className="tqr-page-btn prev" disabled={currentPage === 1}>
            ← Previous
          </button>
          <div className="tqr-page-numbers">
            <button type="button" className="tqr-page-num active">1</button>
            <button type="button" className="tqr-page-num">2</button>
            <button type="button" className="tqr-page-num">3</button>
            <span className="tqr-page-dots">...</span>
            <button type="button" className="tqr-page-num">67</button>
            <button type="button" className="tqr-page-num">68</button>
          </div>
          <button type="button" className="tqr-page-btn next">
            Next →
          </button>
        </div>
        <p className="tqr-disclaimer">
          * Limited Access: You can only view students assigned to your courses. To view other students, contact admin.
        </p>
      </div>
    </div>
  );
}

export default TutorQuizResults;

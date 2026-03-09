/**
 * Quiz Results – Engagement. Filters (right of title), tabs (Mock Test / Quiz), table.
 * URL: /tutor/engagement/quiz-results
 */
import React, { useMemo, useState } from 'react';
import { useGetTutorStudentsQuizResultsQuery } from '../../store/api/authApi';
import '../../assets/css/tutor-quiz-results.css';

function scoreTypeFromValue(score) {
  const n = Number(String(score || '').replace('%', ''));
  if (Number.isNaN(n)) return 'orange';
  if (n >= 80) return 'green';
  if (n >= 50) return 'orange';
  return 'red';
}

function TutorQuizResults() {
  const [activeTab, setActiveTab] = useState('mock');
  const [course, setCourse] = useState('');
  const [chapter, setChapter] = useState('');
  const [lesson, setLesson] = useState('');
  const [score, setScore] = useState('');
  const [submittedDate, setSubmittedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const quizType = activeTab === 'quiz' ? 'lesson_quiz' : 'exam_quiz';
  const { data, isLoading, isError, error } = useGetTutorStudentsQuizResultsQuery({
    page: currentPage,
    type: quizType,
  });

  const rows = useMemo(() => {
    const list = data?.data || [];
    return list.map((r, idx) => ({
      id: idx + 1,
      student: r.student_name || 'Student',
      quiz: r.quiz_title || 'Quiz',
      score: r.score || '0%',
      scoreType: scoreTypeFromValue(r.score),
      attempts: r.attempts || '—',
      submittedOn: r.submitted_on || '—',
    }));
  }, [data]);

  const filtered = rows.filter(
    (r) =>
      !searchQuery ||
      r.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.quiz.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyFilters = () => {
    setCurrentPage(1);
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
          onClick={() => {
            setActiveTab('mock');
            setCurrentPage(1);
          }}
        >
          Mock Test
          <span className="tqr-tab-badge">3</span>
        </button>
        <button
          type="button"
          className={`tqr-tab ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('quiz');
            setCurrentPage(1);
          }}
        >
          Quiz
        </button>
      </div>

      {/* Table – Student Progress jaisa */}
      <div className="tqr-table-wrapper">
        {isLoading ? (
          <p style={{ color: '#9A9A9A' }}>Loading quiz results...</p>
        ) : isError ? (
          <p style={{ color: '#DD4040' }}>
            Failed to load quiz results. {error?.data?.message || error?.message || ''}
          </p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#9A9A9A' }}>No quiz results found.</p>
        ) : (
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
                  <span className={`tqr-score tqr-score-${row.scoreType}`}>{row.score}</span>
                </td>
                <td>{row.attempts}</td>
                <td>{row.submittedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Footer: Pagination + Disclaimer – Student Progress jaisa */}
      <div className="tqr-footer">
        <div className="tqr-pagination">
          <button
            type="button"
            className="tqr-page-btn prev"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <div className="tqr-page-numbers">
            <button type="button" className="tqr-page-num active">{data?.current_page || 1}</button>
            <span className="tqr-page-dots">of</span>
            <button type="button" className="tqr-page-num">{data?.last_page || 1}</button>
          </div>
          <button
            type="button"
            className="tqr-page-btn next"
            disabled={(data?.last_page || 1) <= currentPage}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
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

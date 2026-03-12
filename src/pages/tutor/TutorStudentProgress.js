/**
 * Student Progress – Engagement. Exact Figma Design
 * Table: Student, Course, Progress (bar + %), Quizzes, Last Active
 * Card View: Grid layout with avatar, name, course, details
 * URL: /tutor/engagement/progress
 */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetTutorStudentsQuery } from '../../store/api/authApi';
import '../../assets/css/tutor-student-progress.css';
import '../../assets/css/tutor-empty-state.css';

function getProgressColor(progress) {
  const p = Number(progress) || 0;
  if (p >= 80) return 'green';
  if (p >= 50) return 'orange';
  return 'red';
}

function formatLastActive(value) {
  if (!value) return '—';
  try {
    return new Date(value.replace(' ', 'T')).toLocaleString();
  } catch {
    return value;
  }
}

function TutorStudentProgress() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');

  const { data, isLoading, isError, error } = useGetTutorStudentsQuery(currentPage);

  const rows = useMemo(() => {
    const list = data?.data || [];
    return list.map((s) => ({
      id: s.id,
      name: s.name || 'Student',
      course: Array.isArray(s.courses) ? s.courses.join(', ') : '—',
      progress: Number(s.overall_progress) || 0,
      progressColor: getProgressColor(s.overall_progress),
      quizzes: '—',
      lastActive: formatLastActive(s.last_active),
    }));
  }, [data]);

  const filtered = rows.filter(
    (s) =>
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleView = () => setViewMode((prev) => (prev === 'table' ? 'cards' : 'table'));

  return (
    <div className="student-progress-wrapper">
      {/* Header */}
      <div className="student-progress-header">
        <div className="student-progress-header-left">
          <h1 className="student-progress-title">Student Progress</h1>
          <p className="student-progress-subtitle">View progress of students assigned to your courses</p>
        </div>
        <div className="student-progress-header-right">
          <button
            type="button"
            className="student-progress-view-btn tutor-shuffle"
            onClick={toggleView}
            title={viewMode === 'table' ? 'Card view' : 'Table view'}
          >
            {viewMode === 'table' ? (
              <img src="/assets/images/tutor/tutor-shuffel.png" alt="" />
            ) : (
              <img src="/assets/images/tutor/tutor-shufel2.png" alt="" />
            )}
          </button>
          <div className="student-progress-search">
          
            <input
              type="text"
              className="search-input"
              placeholder="Search students"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" className="search-btn">
            <img src="/assets/images/tutor/tutor-search.png" alt="" className="search-icon" />
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="student-progress-table-wrapper">
          {isLoading ? (
            <p style={{ color: '#9A9A9A' }}>Loading students...</p>
          ) : isError ? (
            <p style={{ color: '#DD4040' }}>
              Failed to load students. {error?.data?.message || error?.message || ''}
            </p>
          ) : filtered.length === 0 ? (
            <div className="tutor-table-empty-state">
              <div className="tutor-table-empty-icon" aria-hidden="true">👥</div>
              <h3 className="tutor-table-empty-title">No students found</h3>
              <p className="tutor-table-empty-desc">
                {rows.length === 0
                  ? 'Assigned students will appear here once they are enrolled in your courses.'
                  : 'No students match your search. Try a different search term.'}
              </p>
            </div>
          ) : (
          <table className="student-progress-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Progress</th>
                <th>Quizzes</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link to={`/tutor/engagement/progress-cards/student/${row.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {row.name}
                    </Link>
                  </td>
                  <td>{row.course}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar-wrap">
                        <div
                          className={`progress-bar progress-${row.progressColor}`}
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                      <span className="progress-pct">{row.progress}%</span>
                    </div>
                  </td>
                  <td>{row.quizzes}</td>
                  <td>{row.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="student-progress-cards-grid">
          {isLoading ? (
            <p style={{ color: '#9A9A9A' }}>Loading students...</p>
          ) : filtered.length === 0 ? (
            <div className="tutor-table-empty-state">
              <div className="tutor-table-empty-icon" aria-hidden="true">👥</div>
              <h3 className="tutor-table-empty-title">No students found</h3>
              <p className="tutor-table-empty-desc">
                {rows.length === 0
                  ? 'Assigned students will appear here once they are enrolled in your courses.'
                  : 'No students match your search. Try a different search term.'}
              </p>
            </div>
          ) : filtered.map((row) => (
            <div key={row.id} className="student-progress-card">
              <div className="card-avatar">
                <img
                  src="/assets/images/icons/Ellipse 3.svg"
                  alt={row.name}
                />
              </div>
              <h3 className="card-name">{row.name}</h3>
              <p className="card-course">{row.course}</p>
              <div className="card-details">
                <div className="card-row">
                  <span className="card-label">Quizzes Attempted</span>
                  <span className="card-value">{row.quizzes}</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Progress</span>
                  <span className="card-value">{row.progress}%</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Last Active</span>
                  <span className="card-value">{row.lastActive}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer: Pagination + Disclaimer */}
      <div className="student-progress-footer">
        <div className="student-progress-pagination">
          <button
            type="button"
            className="pagination-btn prev"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <div className="pagination-numbers">
            <button type="button" className="page-num active">{data?.current_page || 1}</button>
            <span className="page-dots">of</span>
            <button type="button" className="page-num">{data?.last_page || 1}</button>
          </div>
          <button
            type="button"
            className="pagination-btn next"
            disabled={(data?.last_page || 1) <= currentPage}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
        <p className="student-progress-disclaimer">
          * Limited Access: You can only view students assigned to your courses. To view other students, contact admin.
        </p>
      </div>
    </div>
  );
}

export default TutorStudentProgress;
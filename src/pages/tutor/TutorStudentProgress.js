/**
 * Student Progress – Engagement. Exact Figma Design
 * Table: Student, Course, Progress (bar + %), Quizzes, Last Active
 * Card View: Grid layout with avatar, name, course, details
 * URL: /tutor/engagement/progress
 */
import React, { useState } from 'react';
import '../../assets/css/tutor-student-progress.css';

const SAMPLE_STUDENTS = [
  { id: 1, name: 'Alice Johnson', avatar: '/assets/images/avatars/student1.jpg', course: 'Add Maths Form 4', progress: 82, progressColor: 'green', quizzes: '7/8', lastActive: '2 hrs ago' },
  { id: 2, name: 'Brian Smith', avatar: '/assets/images/avatars/student2.jpg', course: 'Add Maths Form 4', progress: 82, progressColor: 'green', quizzes: '6/8', lastActive: '3.5 hrs ago' },
  { id: 3, name: 'David Brown', avatar: '/assets/images/avatars/student3.jpg', course: 'Modern Maths Form 5', progress: 82, progressColor: 'green', quizzes: '7/8', lastActive: '3.8 hrs ago' },
  { id: 4, name: 'Catherine Lee', avatar: '/assets/images/avatars/student4.jpg', course: 'Modern Maths Form 5', progress: 82, progressColor: 'green', quizzes: '7/8', lastActive: '4 hrs ago' },
  { id: 5, name: 'Henry Adams', avatar: '/assets/images/avatars/student5.jpg', course: 'Modern Maths Form 5', progress: 82, progressColor: 'orange', quizzes: '5/8', lastActive: '4.1 hrs ago' },
  { id: 6, name: 'Grace Hall', avatar: '/assets/images/avatars/student6.jpg', course: 'Modern Maths Form 5', progress: 82, progressColor: 'red', quizzes: '1/8', lastActive: '6 hrs ago' },
  { id: 7, name: 'Frank King', avatar: '/assets/images/avatars/student7.jpg', course: 'Add Maths Form 4', progress: 82, progressColor: 'blue', quizzes: '6/8', lastActive: '9 hrs ago' },
  { id: 8, name: 'Eva White', avatar: '/assets/images/avatars/student8.jpg', course: 'Add Maths Form 4', progress: 82, progressColor: 'green', quizzes: '8/8', lastActive: 'Yesterday' },
  { id: 9, name: 'Jack Taylor', avatar: '/assets/images/avatars/student9.jpg', course: 'Modern Maths Form 5', progress: 82, progressColor: 'red', quizzes: '3/8', lastActive: 'Yesterday' },
  { id: 10, name: 'Isabella Walker', avatar: '/assets/images/avatars/student10.jpg', course: 'Add Maths Form 4', progress: 82, progressColor: 'green', quizzes: '7/8', lastActive: 'Yesterday' },
];

function TutorStudentProgress() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');

  const filtered = SAMPLE_STUDENTS.filter(
    (s) => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.course.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <td>{row.name}</td>
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
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="student-progress-cards-grid">
          {filtered.map((row) => (
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
          <button type="button" className="pagination-btn prev" disabled={currentPage === 1}>
            ← Previous
          </button>
          <div className="pagination-numbers">
            <button type="button" className="page-num active">1</button>
            <button type="button" className="page-num">2</button>
            <button type="button" className="page-num">3</button>
            <span className="page-dots">...</span>
            <button type="button" className="page-num">67</button>
            <button type="button" className="page-num">68</button>
          </div>
          <button type="button" className="pagination-btn next">
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
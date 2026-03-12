/**
 * Student Progress Cards – Exact Figma Design
 * Card: Avatar + Name/Company/Email inline, Enrolled in, course tags, See Details
 * URL: /tutor/engagement/progress-cards
 */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetTutorStudentsQuery } from '../../store/api/authApi';
import '../../assets/css/tutor-student-progress-cards.css';
import '../../assets/css/tutor-empty-state.css';

function TutorStudentProgressCards() {
  const [course, setCourse] = useState('');
  const [subject, setSubject] = useState('');
  const [formLevel, setFormLevel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useGetTutorStudentsQuery(currentPage);
  const rows = useMemo(() => {
    const list = data?.data || [];
    return list.map((s) => ({
      id: s.id,
      name: s.name || 'Student',
      company: 'Student',
      email: s.email || '—',
      courses: Array.isArray(s.courses) ? s.courses : [],
    }));
  }, [data]);

  const filtered = rows.filter(
    (s) =>
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  return (
    <div className="spc-wrapper">
      {/* Row 1: Header full width */}
      <div className="spc-header">
        <h1 className="spc-title">Student Progress</h1>
        <p className="spc-subtitle">View progress of students assigned to your courses</p>
        <p className="spc-disclaimer-top">
          * Limited Access: You can only view students assigned to your courses.
          To view other students, contact admin.
        </p>
      </div>

      {/* Row 2: Filters + Search full width in one row */}
      <div className="spc-toolbar">
  <select className="spc-select" value={course} onChange={(e) => setCourse(e.target.value)}>
    <option value="">Course</option>
    <option value="Add Maths Form 4">Add Maths Form 4</option>
    <option value="Modern Maths Form 5">Modern Maths Form 5</option>
  </select>

  <select className="spc-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
    <option value="">Subject</option>
    <option value="Mathematics">Mathematics</option>
    <option value="Physics">Physics</option>
  </select>

  <select className="spc-select" value={formLevel} onChange={(e) => setFormLevel(e.target.value)}>
    <option value="">Form Level</option>
    <option value="Form 4">Form 4</option>
    <option value="Form 5">Form 5</option>
  </select>

  <button type="button" className="spc-btn-apply" onClick={handleApplyFilters}>
    Apply Filters
  </button>

  <div className="spc-search-row">
    <input
      type="text"
      className="spc-search-input"
      placeholder="Search student"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <button type="button" className="spc-search-btn" aria-label="Search">
      <img src="/assets/images/tutor/tutor-search.png" alt="" className="spc-search-icon" />
    </button>
  </div>
</div>


      {/* Cards Grid - 4 columns */}
      <div className="spc-cards-grid">
        {isLoading && <p style={{ color: '#9A9A9A' }}>Loading students...</p>}
        {isError && <p style={{ color: '#DD4040' }}>Failed to load students.</p>}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="tutor-table-empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="tutor-table-empty-icon" aria-hidden="true">👥</div>
            <h3 className="tutor-table-empty-title">No students found</h3>
            <p className="tutor-table-empty-desc">
              {rows.length === 0
                ? 'Assigned students will appear here once they are enrolled in your courses.'
                : 'No students match your filters. Try adjusting search or filters.'}
            </p>
          </div>
        )}
        {filtered.length > 0 && filtered.map((row) => (
          <div key={row.id} className="spc-card">
            {/* Top Row: Avatar + Info */}
            <div className="spc-card-top">
              <div className="spc-card-avatar">
                <img src="/assets/images/icons/Ellipse 3.svg" alt={row.name} />
              </div>
              <div className="spc-card-info">
                <h3 className="spc-card-name">{row.name}</h3>
                <p className="spc-card-company">{row.company}</p>
                <p className="spc-card-email">{row.email}</p>
              </div>
            </div>

            {/* Enrolled Label */}
            <p className="spc-card-enrolled">Enrolled in</p>

            {/* Course Tags */}
            <div className="spc-card-tags">
              {row.courses.map((c, idx) => (
                <span key={idx} className="spc-card-tag">{c}</span>
              ))}
            </div>

            {/* See Details Button – opens Student Profile */}
            <Link to={`/tutor/engagement/progress-cards/student/${row.id}`} className="spc-card-btn">
              See Details
            </Link>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="spc-footer">
        <div className="spc-pagination">
          <button
            type="button"
            className="spc-page-btn prev"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <div className="spc-page-numbers">
            <button type="button" className="spc-page-num active">{data?.current_page || 1}</button>
            <span className="spc-page-dots">of</span>
            <button type="button" className="spc-page-num">{data?.last_page || 1}</button>
          </div>
          <button
            type="button"
            className="spc-page-btn next"
            disabled={(data?.last_page || 1) <= currentPage}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
        <p className="spc-disclaimer-bottom">
          * Limited Access: <span>You can only view students assigned to your courses. To view other students, contact admin.</span>
        </p>
      </div>
    </div>
  );
}

export default TutorStudentProgressCards;
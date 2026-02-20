/**
 * Student Progress Cards – Exact Figma Design
 * Card: Avatar + Name/Company/Email inline, Enrolled in, course tags, See Details
 * URL: /tutor/engagement/progress-cards
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/tutor-student-progress-cards.css';

const SAMPLE_STUDENTS = [
  { id: 1, name: 'Bob Smith', company: 'Smith & Co.', email: 'bob@lms.my', avatar: '/assets/images/avatars/student1.jpg', courses: ['Data Structures', 'Algorithms', 'Algorithms'] },
  { id: 2, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student2.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 3, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student3.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 4, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student4.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 5, name: 'Catherine Lee', company: 'Lee Holdings', email: 'catherine@lms.my', avatar: '/assets/images/avatars/student5.jpg', courses: ['Web Development', 'Database Management', 'Database Management'] },
  { id: 6, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student6.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 7, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student7.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 8, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student8.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 9, name: 'David Kim', company: 'Kim Industries', email: 'david@lms.my', avatar: '/assets/images/avatars/student9.jpg', courses: ['Machine Learning', 'Artificial Intelligence', 'Artificial Intelligence'] },
  { id: 10, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student10.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 11, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student11.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 12, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student12.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 13, name: 'Ella Thompson', company: 'Thompson Group', email: 'ella@lms.my', avatar: '/assets/images/avatars/student13.jpg', courses: ['Digital Marketing', 'SEO Basics', 'SEO Basics'] },
  { id: 14, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student14.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 15, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student15.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 16, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student16.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 17, name: 'Frank White', company: 'White & Sons', email: 'frank@lms.my', avatar: '/assets/images/avatars/student17.jpg', courses: ['Cybersecurity', 'Network Security', 'Network Security'] },
  { id: 18, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student18.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 19, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student19.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
  { id: 20, name: 'Alice Johnson', company: 'Johnson Dawson', email: 'alex@lms.my', avatar: '/assets/images/avatars/student20.jpg', courses: ['Additional Mathematics', 'Modern Physics', 'Modern Physics'] },
];

function TutorStudentProgressCards() {
  const [course, setCourse] = useState('');
  const [subject, setSubject] = useState('');
  const [formLevel, setFormLevel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = SAMPLE_STUDENTS.filter(
    (s) =>
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyFilters = () => {
    console.log('Apply filters', { course, subject, formLevel });
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
        {filtered.map((row) => (
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
          <button type="button" className="spc-page-btn prev" disabled={currentPage === 1}>
            ← Previous
          </button>
          <div className="spc-page-numbers">
            <button type="button" className="spc-page-num active">1</button>
            <button type="button" className="spc-page-num">2</button>
            <button type="button" className="spc-page-num">3</button>
            <span className="spc-page-dots">...</span>
            <button type="button" className="spc-page-num">67</button>
            <button type="button" className="spc-page-num">68</button>
          </div>
          <button type="button" className="spc-page-btn next">
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
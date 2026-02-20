/**
 * Pending Approval page – tutor portal.
 * Content: title, subtitle, filter tabs (All Submissions, Pending, Approved, Rejected), dropdowns, table (Content, Type, Course, Requested date, Status, Action).
 */
import React, { useState } from 'react';
import '../../assets/css/tutor-course-inner.css';
import '../../assets/css/tutor-pending-approval.css';

const INITIAL_SUBMISSIONS = [
  { id: 1, content: 'Chapter 5: Quadratic Equations', type: 'Lesson', course: 'Add Maths Form 4', requestedDate: '12 Jan 2025', status: 'pending' },
  { id: 2, content: 'Chapter 3: Linear Equations', type: 'Lesson', course: 'Add Maths Form 4', requestedDate: '10 Jan 2025', status: 'approved' },
  { id: 3, content: 'Algebra Basics Quiz', type: 'Quiz', course: 'Mathematics Form 5', requestedDate: '8 Jan 2025', status: 'rejected' },
  { id: 4, content: 'Chapter 1: Number Base', type: 'Lesson', course: 'Mathematics Form 5', requestedDate: '5 Jan 2025', status: 'approved' },
  { id: 5, content: 'Trigonometry Quiz', type: 'Quiz', course: 'Add Maths Form 4', requestedDate: '14 Jan 2025', status: 'pending' },
];

const STATUS_COUNTS = { all: INITIAL_SUBMISSIONS.length, pending: 3, approved: 18, rejected: 1 };

function TutorPendingApproval() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const [submissions] = useState(INITIAL_SUBMISSIONS);
  const [actionOpenId, setActionOpenId] = useState(null);

  const getStatusClass = (status) => {
    if (status === 'pending') return 'pending-status pending-status-pending';
    if (status === 'rejected') return 'pending-status pending-status-rejected';
    return 'pending-status pending-status-published'; // approved
  };

  const getStatusLabel = (status) => {
    if (status === 'pending') return 'Pending';
    if (status === 'rejected') return 'Rejected';
    return 'Approved';
  };

  const filteredSubmissions = submissions.filter((row) => {
    if (activeFilter !== 'all' && row.status !== activeFilter) return false;
    if (statusFilter && row.status !== statusFilter) return false;
    if (courseFilter && row.course !== courseFilter) return false;
    if (contentTypeFilter && row.type !== contentTypeFilter) return false;
    return true;
  });

  return (
    <div className="tutor-pending-approval-wrapper">
      <div className="tutor-pending-approval-header">
        <h1 className="tutor-pending-approval-title">Pending Approval</h1>
        <p className="tutor-pending-approval-subtitle">
          Track your content submissions and edit rejected items
        </p>
      </div>

      <div className="tutor-pending-approval-filter-bar">
        <div className="tutor-pending-approval-tabs">
          <button
            type="button"
            className={`tutor-pending-approval-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Submissions
          </button>
          <button
            type="button"
            className={`tutor-pending-approval-tab ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pending')}
          >
            Pending
            <span className="tutor-pending-approval-tab-badge">{STATUS_COUNTS.pending}</span>
          </button>
          <button
            type="button"
            className={`tutor-pending-approval-tab ${activeFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveFilter('approved')}
          >
            Approved
            <span className="tutor-pending-approval-tab-badge">{STATUS_COUNTS.approved}</span>
          </button>
          <button
            type="button"
            className={`tutor-pending-approval-tab ${activeFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveFilter('rejected')}
          >
            Rejected
            <span className="tutor-pending-approval-tab-badge">{STATUS_COUNTS.rejected}</span>
          </button>
        </div>
        <div className="tutor-pending-approval-dropdowns">
          <select
            className="tutor-pending-approval-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            className="tutor-pending-approval-select"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="">Course</option>
            <option value="Add Maths Form 4">Add Maths Form 4</option>
            <option value="Mathematics Form 5">Mathematics Form 5</option>
          </select>
          <select
            className="tutor-pending-approval-select"
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
          >
            <option value="">Content Type</option>
            <option value="Lesson">Lesson</option>
            <option value="Quiz">Quiz</option>
          </select>
        </div>
      </div>

      <div className="tutor-pending-approval-table-wrapper">
        <table className="tutor-pending-approval-table">
          <thead>
            <tr>
              <th>Content</th>
              <th>Type</th>
              <th>Course</th>
              <th>Requested date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((row) => (
              <tr key={row.id}>
                <td>{row.content}</td>
                <td>{row.type}</td>
                <td>{row.course}</td>
                <td>{row.requestedDate}</td>
                <td>
                  <span className={getStatusClass(row.status)}>
                    {getStatusLabel(row.status)}
                  </span>
                </td>
                <td style={{ position: 'relative' }}>
                <button
                    type="button"
                    className="tutor-pending-approval-action-btn"
                    onClick={() => setActionOpenId(actionOpenId === row.id ? null : row.id)}
                    aria-label="More actions"
                  >
                    <img
                      src="/assets/images/icons/simple-line-icons_options-vertical.svg"
                      alt="more actions"
                      className="comment-avatar-img"
                    />
                  </button>

                  {actionOpenId === row.id && (
                    <div className="tutor-course-inner-dropdown" style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, zIndex: 10 }}>
                      <div className="tutor-course-inner-dropdown-item">Edit</div>
                      <div className="tutor-course-inner-dropdown-item">View</div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TutorPendingApproval;

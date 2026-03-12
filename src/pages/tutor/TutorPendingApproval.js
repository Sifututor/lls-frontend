/**
 * Pending Approval page – dynamic from API GET /tutor/submissions
 */
import React, { useState, useMemo } from 'react';
import { useGetTutorSubmissionsQuery, useGetTutorQuizzesQuery } from '../../store/api/authApi';
import '../../assets/css/tutor-course-inner.css';
import '../../assets/css/tutor-pending-approval.css';
import '../../assets/css/tutor-empty-state.css';

function TutorPendingApproval() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const [actionOpenId, setActionOpenId] = useState(null);

  const { data, isLoading, isError } = useGetTutorSubmissionsQuery();
  const { data: quizzesResponse, isLoading: quizzesLoading } = useGetTutorQuizzesQuery(1);

  const rawList = (data?.data ?? data) || [];
  const submissions = useMemo(() => {
    const contentItems = Array.isArray(rawList)
      ? rawList.map((s) => ({
          id: s.id,
          content: s.title ?? s.content ?? '—',
          type: s.type ?? (s.quiz_id ? 'Quiz' : 'Lesson'),
          course: s.course?.title ?? s.course_name ?? '—',
          requestedDate:
            s.requested_at || s.created_at
              ? new Date(s.requested_at ?? s.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '—',
          // Normalize status so tabs & filters work:
          // backend uses 'pending' / 'published' / 'rejected'
          status: (() => {
            const rawStatus = (s.status || 'pending').toLowerCase();
            if (rawStatus === 'published') return 'approved';
            return rawStatus;
          })(),
        }))
      : [];

    const quizzesData = quizzesResponse?.data?.data || [];
    const quizItems = Array.isArray(quizzesData)
      ? quizzesData.map((q) => ({
          id: `quiz-${q.id}`,
          content: q.title || 'Untitled quiz',
          type: 'Quiz',
          course: q.lesson?.title || '—',
          requestedDate: q.created_at
            ? new Date(q.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : '—',
          status: (() => {
            const rawStatus = (q.status || 'pending').toLowerCase();
            if (rawStatus === 'published') return 'approved';
            return rawStatus;
          })(),
        }))
      : [];

    return [...contentItems, ...quizItems];
  }, [rawList, quizzesResponse]);

  const statusCounts = useMemo(() => ({
    all: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  }), [submissions]);

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

  const uniqueCourses = [...new Set(submissions.map((s) => s.course).filter(Boolean))];

  if (isLoading || quizzesLoading) {
    return (
      <div className="tutor-pending-approval-wrapper">
        <p style={{ color: '#9A9A9A' }}>Loading submissions...</p>
      </div>
    );
  }

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
            <span className="tutor-pending-approval-tab-badge">{statusCounts.pending}</span>
          </button>
          <button
            type="button"
            className={`tutor-pending-approval-tab ${activeFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveFilter('approved')}
          >
            Approved
            <span className="tutor-pending-approval-tab-badge">{statusCounts.approved}</span>
          </button>
          <button
            type="button"
            className={`tutor-pending-approval-tab ${activeFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveFilter('rejected')}
          >
            Rejected
            <span className="tutor-pending-approval-tab-badge">{statusCounts.rejected}</span>
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
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
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
        {filteredSubmissions.length === 0 ? (
          <div className="tutor-table-empty-state">
            <div className="tutor-table-empty-icon" aria-hidden="true">📋</div>
            <h3 className="tutor-table-empty-title">
              {submissions.length === 0 ? 'No submissions yet' : 'No submissions match your filters'}
            </h3>
            <p className="tutor-table-empty-desc">
              {submissions.length === 0
                ? 'When you submit lessons or quizzes for approval, they will appear here. Upload content from Upload Lesson to get started.'
                : 'Try changing the tabs or filters above to see more results.'}
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default TutorPendingApproval;

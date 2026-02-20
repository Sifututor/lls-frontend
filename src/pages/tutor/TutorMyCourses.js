// Tutor My Courses – dynamic from API GET /tutor/courses (paginated). Filter/search client-side.
import React, { useState, useMemo } from 'react';
import TutorFilterBar from '../../components/tutor/TutorFilterBar';
import TutorCourseCard from '../../components/tutor/TutorCourseCard';
import { useGetTutorCoursesQuery } from '../../store/api/authApi';
import { tutorCourseFilterOptions } from '../../data/tutorMyCoursesData';
import '../../assets/css/tutor-my-courses.css';

// List API returns subject_id, level_id (no names) – fallback labels for display
const SUBJECT_IDS = { 1: 'Mathematics', 2: 'Physics', 3: 'Biology', 4: 'Chemistry' };
const LEVEL_IDS = { 1: 'Form 1', 2: 'Form 2', 3: 'Form 3', 4: 'Form 4', 5: 'Form 5' };

function TutorMyCourses() {
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({ subject: '', level: '', searchText: '' });
  const [showActiveFilters, setShowActiveFilters] = useState(false);

  const { data, isLoading, isError, error } = useGetTutorCoursesQuery(page);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleApplyFilters = () => {
    const hasFilters = activeFilters.subject || activeFilters.level || (activeFilters.searchText || '').trim();
    setShowActiveFilters(!!hasFilters);
  };

  const handleClearAll = () => {
    setActiveFilters({ subject: '', level: '', searchText: '' });
    setShowActiveFilters(false);
  };

  const handleRemoveFilter = (filterType) => {
    setActiveFilters((prev) => ({ ...prev, [filterType]: '' }));
  };

  const rawList = data?.success && data?.courses?.data ? data.courses.data : [];
  const mappedList = rawList.map((c) => ({
    id: c.id,
    title: c.title || 'Untitled',
    subject: SUBJECT_IDS[c.subject_id] || c.subject_id != null ? `Subject ${c.subject_id}` : '—',
    level: LEVEL_IDS[c.level_id] || c.level_id != null ? `Form ${c.level_id}` : '—',
    videos: 0,
    quizzes: 0,
    students: 0,
    status: c.status || 'draft',
  }));

  const filteredCourses = useMemo(() => {
    if (!showActiveFilters) return mappedList;
    return mappedList.filter((course) => {
      if (activeFilters.searchText) {
        const q = (activeFilters.searchText || '').toLowerCase();
        if (
          !course.title.toLowerCase().includes(q) &&
          !String(course.subject).toLowerCase().includes(q) &&
          !String(course.level).toLowerCase().includes(q)
        ) return false;
      }
      if (activeFilters.subject && course.subject !== activeFilters.subject) return false;
      if (activeFilters.level && course.level !== activeFilters.level) return false;
      return true;
    });
  }, [showActiveFilters, activeFilters.subject, activeFilters.level, activeFilters.searchText, mappedList]);

  const pagination = data?.success && data?.courses
    ? {
        currentPage: data.courses.current_page,
        lastPage: data.courses.last_page,
        total: data.courses.total,
        perPage: data.courses.per_page,
        links: data.courses.links || [],
      }
    : null;

  if (isLoading) {
    return (
      <div className="tutor-course-dashboard-content">
        <div className="tutor-course-page-header-section">
          <h1 className="tutor-course-welcome-title">My Courses</h1>
          <p className="tutor-course-welcome-subtitle">View and manage content for your assigned courses</p>
        </div>
        <p style={{ color: '#9A9A9A' }}>Loading courses...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="tutor-course-dashboard-content">
        <div className="tutor-course-page-header-section">
          <h1 className="tutor-course-welcome-title">My Courses</h1>
          <p className="tutor-course-welcome-subtitle">View and manage content for your assigned courses</p>
        </div>
        <p style={{ color: '#DD4040' }}>
          Failed to load courses. {error?.data?.message || error?.message || 'Please try again.'}
        </p>
      </div>
    );
  }

  return (
    <div className="tutor-course-dashboard-content">
      <div className="tutor-course-page-header-section">
        <h1 className="tutor-course-welcome-title">My Courses</h1>
        <p className="tutor-course-welcome-subtitle">
          View and manage content for your assigned courses
        </p>
      </div>

      <TutorFilterBar
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onClearAll={handleClearAll}
        onRemoveFilter={handleRemoveFilter}
        showActiveFilters={showActiveFilters}
        filterOptions={tutorCourseFilterOptions}
      />

      <section className="tutor-course-welcome-stats-container tutor-course-section">
        <div className="tutor-course-courses-grid">
          {filteredCourses.map((course) => (
            <TutorCourseCard key={course.id} course={course} />
          ))}
        </div>
        {pagination && pagination.lastPage > 1 && (
          <div style={{ marginTop: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              disabled={pagination.currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={{ padding: '8px 16px', cursor: pagination.currentPage <= 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Previous
            </button>
            <span style={{ color: '#9A9A9A' }}>
              Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)
            </span>
            <button
              type="button"
              disabled={pagination.currentPage >= pagination.lastPage}
              onClick={() => setPage((p) => p + 1)}
              style={{ padding: '8px 16px', cursor: pagination.currentPage >= pagination.lastPage ? 'not-allowed' : 'pointer' }}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default TutorMyCourses;

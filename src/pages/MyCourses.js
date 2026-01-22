// src/pages/MyCourses.js
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import FilterBar from '../components/FilterBar';
import MyCourseCard from '../components/MyCourseCard';
import { useGetMyCoursesQuery } from '../store/api/authApi';

function MyCourses() {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState({
    subject: '',
    formLevel: '',
    tutor: '',
    searchText: ''
  });
  const [showActiveFilters, setShowActiveFilters] = useState(false);

  // API Call
  const { data: apiResponse, isLoading, isError, refetch } = useGetMyCoursesQuery({});

  // Process API data into 3 sections
  const { ongoingCourses, completedCourses, savedCourses, filterOptions } = useMemo(() => {
    // Default empty state
    if (!apiResponse) {
      return {
        ongoingCourses: [],
        completedCourses: [],
        savedCourses: [],
        filterOptions: { subjects: [], formLevels: [], tutors: [] }
      };
    }

    console.log('📦 Full API Response:', apiResponse);

    // ========================================
    // FIXED: Correct path to data
    // API structure: { success, data: { saved_courses, courses: { data: [...] } }, filters }
    // ========================================
    
    const coursesArray = apiResponse?.data?.courses?.data || [];
    const savedArray = apiResponse?.data?.saved_courses || [];
    const filtersData = apiResponse?.filters || {};

    console.log('📚 Courses Array:', coursesArray.length);
    console.log('⭐ Saved Array:', savedArray.length);

    // Transform API course to component format
    const transformCourse = (course, type) => {
      // Thumbnail - handle empty object {} or image-not-found
      let thumbnail = '/assets/images/live-classes.png';
      if (course.thumbnail_url && 
          typeof course.thumbnail_url === 'string' && 
          course.thumbnail_url.length > 0 &&
          !course.thumbnail_url.includes('image-not-found')) {
        thumbnail = course.thumbnail_url;
      }

      // Progress - directly from API
      const progress = course.progress_percentage ?? 0;

      return {
        id: course.id,
        slug: course.slug,
        thumbnail: thumbnail,
        badge: course.subject?.toLowerCase() || 'general',
        lastWatched: type === 'ongoing' && progress > 0,
        instructor: {
          name: course.creator?.name || 'Unknown',
          avatar: course.creator?.avatar || '/assets/images/icons/Ellipse 2.svg'
        },
        title: course.title,
        chapter: course.level || 'Form 1',
        progress: type === 'saved' ? undefined : progress,
        type: type
      };
    };

    // Separate courses by progress_percentage
    const ongoing = [];
    const completed = [];

    coursesArray.forEach(course => {
      const progress = course.progress_percentage ?? 0;
      console.log(`📖 ${course.title}: ${progress}%`);

      if (progress >= 100) {
        completed.push(transformCourse(course, 'completed'));
      } else {
        ongoing.push(transformCourse(course, 'ongoing'));
      }
    });

    // Saved courses (no progress bar)
    const saved = savedArray.map(course => {
      console.log(`⭐ Saved: ${course.title}`);
      return transformCourse(course, 'saved');
    });

    // Filter options from API
    const subjects = filtersData.subjects?.map(s => s.title) || [];
    const formLevels = filtersData.levels?.map(l => l.title) || [];
    const tutors = [...new Set(coursesArray.map(c => c.creator?.name).filter(Boolean))];

    console.log(`✅ Ongoing: ${ongoing.length} | Completed: ${completed.length} | Saved: ${saved.length}`);

    return {
      ongoingCourses: ongoing,
      completedCourses: completed,
      savedCourses: saved,
      filterOptions: { subjects, formLevels, tutors }
    };
  }, [apiResponse]);

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setActiveFilters({ ...activeFilters, [filterType]: value });
  };

  const handleApplyFilters = () => {
    const hasFilters = activeFilters.subject || activeFilters.formLevel || 
                       activeFilters.tutor || activeFilters.searchText.trim();
    setShowActiveFilters(hasFilters);
  };

  const handleClearAll = () => {
    setActiveFilters({ subject: '', formLevel: '', tutor: '', searchText: '' });
    setShowActiveFilters(false);
  };

  const handleRemoveFilter = (filterType) => {
    setActiveFilters({ ...activeFilters, [filterType]: '' });
  };

  // Navigation
  const handleCourseClick = (courseSlug) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate(`/course-details/${courseSlug}`), 100);
  };

  // Local filter function
  const filterCourses = (courses) => {
    if (!showActiveFilters) return courses;

    return courses.filter(course => {
      if (activeFilters.searchText) {
        const search = activeFilters.searchText.toLowerCase();
        const matches = 
          course.title.toLowerCase().includes(search) ||
          course.chapter.toLowerCase().includes(search) ||
          course.instructor.name.toLowerCase().includes(search);
        if (!matches) return false;
      }

      if (activeFilters.subject) {
        if (course.badge.toLowerCase() !== activeFilters.subject.toLowerCase()) return false;
      }

      if (activeFilters.formLevel) {
        if (!course.chapter.includes(activeFilters.formLevel)) return false;
      }

      if (activeFilters.tutor) {
        if (course.instructor.name !== activeFilters.tutor) return false;
      }

      return true;
    });
  };

  const filteredOngoing = filterCourses(ongoingCourses);
  const filteredCompleted = filterCourses(completedCourses);
  const filteredSaved = filterCourses(savedCourses);

  const hasNoResults = showActiveFilters &&
    filteredOngoing.length === 0 && 
    filteredCompleted.length === 0 && 
    filteredSaved.length === 0;

  return (
    <>
      <Sidebar />

      <main className="main-content">
        <TopNavbar title="My Courses" breadcrumb="Ongoing Courses" />

        <div className="dashboard-content">
          {/* Page Header */}
          <div className="page-header-section">
            <h1 className="welcome-title">My Courses</h1>
            <p className="welcome-subtitle">
              Discover new skills and advance your career with our expert-led courses
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar
            filters={activeFilters}
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilters}
            onClearAll={handleClearAll}
            onRemoveFilter={handleRemoveFilter}
            showActiveFilters={showActiveFilters}
            filterOptions={filterOptions}
          />

          {/* Loading */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', marginBottom: '24px' }}>
              <p style={{ color: '#6B7280' }}>Loading your courses...</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px' }}>Failed to load courses</h3>
              <button className="btn-apply-filters" onClick={() => refetch()}>Retry</button>
            </div>
          )}

          {/* No Results */}
          {!isLoading && hasNoResults && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>No courses found</h3>
              <p style={{ color: '#6B7280', marginBottom: '24px' }}>Try adjusting your filters</p>
              <button className="btn-apply-filters" onClick={handleClearAll}>Clear All Filters</button>
            </div>
          )}

          {/* ONGOING CLASSES */}
          {!isLoading && filteredOngoing.length > 0 && (
            <section className="welcome-stats-container course">
              <div className="section-header stats">
                <h3 className="section-title">
                  Ongoing Classes
                  {showActiveFilters && ` (${filteredOngoing.length})`}
                </h3>
              </div>
              <div className="courses-grid">
                {filteredOngoing.map(course => (
                  <MyCourseCard 
                    key={course.id} 
                    course={course}
                    onClick={() => handleCourseClick(course.slug)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* COMPLETED COURSES */}
          {!isLoading && filteredCompleted.length > 0 && (
            <section className="welcome-stats-container course">
              <div className="section-header stats">
                <h3 className="section-title">
                  Completed Courses
                  {showActiveFilters && ` (${filteredCompleted.length})`}
                </h3>
              </div>
              <div className="courses-grid">
                {filteredCompleted.map(course => (
                  <MyCourseCard 
                    key={course.id} 
                    course={course}
                    onClick={() => handleCourseClick(course.slug)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* SAVED COURSES */}
          {!isLoading && filteredSaved.length > 0 && (
            <section className="welcome-stats-container course">
              <div className="section-header stats">
                <h3 className="section-title">
                  Saved Courses
                  {showActiveFilters && ` (${filteredSaved.length})`}
                </h3>
              </div>
              <div className="courses-grid">
                {filteredSaved.map(course => (
                  <MyCourseCard 
                    key={course.id} 
                    course={course}
                    onClick={() => handleCourseClick(course.slug)}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}

export default MyCourses;
// src/pages/BrowseCourses.js
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import FilterBar from '../components/FilterBar';
import BrowseCourseCard from '../components/Browsecoursecard';
import { useGetBrowseCoursesQuery } from '../store/api/authApi';

function BrowseCourses() {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState({
    subject: '',
    formLevel: '',
    tutor: '',
    searchText: ''
  });
  const [showActiveFilters, setShowActiveFilters] = useState(false);

  // API Call
  const { data: apiResponse, isLoading, isError, refetch } = useGetBrowseCoursesQuery({});

  // Process API data
  const { browseCourses, filterOptions } = useMemo(() => {
    if (!apiResponse) {
      return {
        browseCourses: [],
        filterOptions: { subjects: [], formLevels: [], tutors: [] }
      };
    }

    console.log('📦 Browse Courses API:', apiResponse);

    // Get courses array from API
    const coursesArray = apiResponse?.data?.data || [];
    const filtersData = apiResponse?.filters || {};

    console.log('📚 Browse Courses:', coursesArray.length);

    // Transform API course to component format
    const transformedCourses = coursesArray.map(course => {
      return {
        id: course.id,
        slug: course.slug,
        // Use static fallback thumbnail
        thumbnail: '/assets/images/live-classes.png',
        badge: course.subject?.toLowerCase() || 'general',
        subject: course.subject,
        instructor: {
          name: course.tutor?.name || 'Unknown',
          // Use static fallback avatar
          avatar: '/assets/images/icons/Ellipse 2.svg'
        },
        title: course.title,
        description: course.description,
        lessons: course.level || 'Form 1',
        isPremium: course.is_premium === 'Premium'
      };
    });

    // Filter options from API
    const subjects = filtersData.subjects?.map(s => s.title) || [];
    const formLevels = filtersData.levels?.map(l => l.title) || [];
    const tutors = [...new Set(coursesArray.map(c => c.tutor?.name).filter(Boolean))];

    console.log(`✅ Total Courses: ${transformedCourses.length}`);

    return {
      browseCourses: transformedCourses,
      filterOptions: { subjects, formLevels, tutors }
    };
  }, [apiResponse]);

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setActiveFilters({ ...activeFilters, [filterType]: value });
  };

  const handleApplyFilters = () => {
    const hasFilters = 
      activeFilters.subject || 
      activeFilters.formLevel || 
      activeFilters.tutor ||
      activeFilters.searchText.trim();
    setShowActiveFilters(hasFilters);
  };

  const handleClearAll = () => {
    setActiveFilters({ subject: '', formLevel: '', tutor: '', searchText: '' });
    setShowActiveFilters(false);
  };

  const handleRemoveFilter = (filterType) => {
    setActiveFilters({ ...activeFilters, [filterType]: '' });
  };

  // Local filter function
  const filterCourses = (courses) => {
    if (!showActiveFilters) return courses;

    return courses.filter(course => {
      // Search text filter
      if (activeFilters.searchText) {
        const searchLower = activeFilters.searchText.toLowerCase();
        const matchesSearch = 
          course.title.toLowerCase().includes(searchLower) ||
          course.instructor.name.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Subject filter
      if (activeFilters.subject) {
        if (course.subject !== activeFilters.subject) return false;
      }

      // Form level filter
      if (activeFilters.formLevel) {
        if (!course.lessons.includes(activeFilters.formLevel)) return false;
      }

      // Tutor filter
      if (activeFilters.tutor) {
        if (course.instructor.name !== activeFilters.tutor) return false;
      }

      return true;
    });
  };

  const filteredCourses = filterCourses(browseCourses);

  // Handle course click
  const handleCourseClick = (courseSlug) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate(`/course-details/${courseSlug}`), 100);
  };

  return (
    <>
      <Sidebar />

      <main className="main-content">
        <TopNavbar title="Browse Courses" breadcrumb="Explore Catalog" />

        <div className="dashboard-content">
          
          {/* Page Header */}
          <div className="page-header-section">
            <h1 className="welcome-title">Explore Courses</h1>
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
              <p style={{ color: '#6B7280' }}>Loading courses...</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px' }}>Failed to load courses</h3>
              <button className="btn-apply-filters" onClick={() => refetch()}>Retry</button>
            </div>
          )}

          {/* No Results Message */}
          {!isLoading && showActiveFilters && filteredCourses.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'white',
              borderRadius: '16px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                No courses found
              </h3>
              <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '24px' }}>
                Try adjusting your filters or search term
              </p>
              <button 
                className="btn-apply-filters" 
                onClick={handleClearAll}
                style={{ display: 'inline-block' }}
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* All Courses Grid */}
          {!isLoading && filteredCourses.length > 0 && (
            <section className="welcome-stats-container course">
              <div className="courses-grid">
                {filteredCourses.map((course) => (
                  <BrowseCourseCard 
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

export default BrowseCourses;
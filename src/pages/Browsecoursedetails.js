// src/pages/BrowseCourseDetails.js
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BrowseCourseHeader from '../components/Browsecourseheader';
import BrowseCourseStats from '../components/Browsecoursestats';
import BrowseAboutSection from '../components/Browseaboutsection';
import BrowseCourseContent from '../components/Browsecoursecontent';
import BrowseUpcomingClass from '../components/Browseupcomingclass';
import BrowseRelatedCourses from '../components/Browserelatedcourses';
import { SkeletonCourseDetails } from '../components/ui/LoadingSpinner';
import { useGetBrowseCourseDetailsQuery, useGetBrowseCoursesQuery } from '../store/api/authApi';
import { showSuccess, showInfo } from '../utils/toast';

// Static data fallback for sections without API
import { browseCourseData as staticData } from '../data/Browsecoursedata';

function BrowseCourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // On mount: check if current course slug is in savedCourses
  useEffect(() => {
    let savedCourses = [];
    try {
      savedCourses = JSON.parse(localStorage.getItem('savedCourses') || '[]');
    } catch {
      savedCourses = [];
    }
    setIsSaved(Array.isArray(savedCourses) && savedCourses.includes(slug));
  }, [slug]);

  // ========== API CALLS ==========
  const { data: apiResponse, isLoading, isError, refetch } = useGetBrowseCourseDetailsQuery(slug, {
    skip: !slug,
  });

  // Get related courses from browse listing
  const { data: browseCoursesResponse } = useGetBrowseCoursesQuery({});

  // ========== TRANSFORM API DATA ==========
  const courseData = useMemo(() => {
    if (!apiResponse) return null;


    // Get course from API response - handle different response structures
    const course = apiResponse?.data || apiResponse?.course || apiResponse;

    if (!course || !course.id) {
      return null;
    }

    // Transform to component format with STATIC thumbnail/avatar
    return {
      // Header Data
      id: course.id,
      slug: course.slug,
      title: course.title || 'Untitled Course',
      description: course.description || 'No description available',
      subject: course.subject || 'General',
      level: course.level || 'Form 1',
      isPremium: course.is_premium === 'Premium',
      
      // Static thumbnail (like Dashboard)
      thumbnail: '/assets/images/live-classes.png',
      
      // Duration - use API or default
      duration: course.duration || course.duration_hours ? `${course.duration_hours}h` : '12 weeks',
      
      // Badges from API
      badges: [
        { id: 1, text: course.subject || 'General' },
        { id: 2, text: course.level || 'Form 1' },
        { id: 3, text: course.is_premium || 'Free' }
      ],
      
      // Instructor with static avatar + rating/reviews
      instructor: {
        name: course.tutor?.name || 'Unknown Tutor',
        avatar: '/assets/images/icons/Ellipse 2.svg',
        designation: 'Instructor',
        rating: course.rating || 4.5,
        reviews: course.reviews_count || course.enrolled_count || 128
      },

      // Stats - Use API data if available, else static
      stats: {
        lessons: course.total_lessons || staticData?.stats?.lessons || '24',
        quizzes: course.total_quizzes || staticData?.stats?.quizzes || '12',
        enrolledStudents: course.enrolled_count || staticData?.stats?.enrolledStudents || '1.2k',
        learningHours: course.duration_hours || staticData?.stats?.learningHours || '18h'
      },

      // About section - with both learningPoints and learningOutcomes for compatibility
      about: {
        title: 'About This Course',
        description: course.description || staticData?.about?.description || 'This course provides comprehensive learning materials.',
        learningPoints: course.learning_outcomes || staticData?.about?.learningOutcomes || staticData?.about?.learningPoints || [
          'Understand fundamental concepts',
          'Apply knowledge in practical scenarios',
          'Build problem-solving skills',
          'Prepare for examinations'
        ],
        learningOutcomes: course.learning_outcomes || staticData?.about?.learningOutcomes || staticData?.about?.learningPoints || [
          'Understand fundamental concepts',
          'Apply knowledge in practical scenarios',
          'Build problem-solving skills',
          'Prepare for examinations'
        ]
      },

      // Course Content - Static (no API for this yet)
      courseContent: course.chapters || staticData?.courseContent || [],

      // Upcoming Class - Static
      upcomingClass: staticData?.upcomingClass || null
    };
  }, [apiResponse]);

  // ========== RELATED COURSES ==========
  const relatedCourses = useMemo(() => {
    if (!browseCoursesResponse || !courseData) {
      return staticData?.relatedCourses || [];
    }

    const allCourses = browseCoursesResponse?.data?.data || browseCoursesResponse?.data || [];
    
    // Filter courses with same subject, exclude current course
    const related = allCourses
      .filter(c => c.subject === courseData.subject && c.slug !== slug)
      .slice(0, 4)
      .map(course => ({
        id: course.id,
        slug: course.slug,
        title: course.title,
        thumbnail: '/assets/images/live-classes.png',
        badge: course.subject?.toLowerCase() || 'general',
        instructor: {
          name: course.tutor?.name || 'Unknown',
          avatar: '/assets/images/icons/Ellipse 2.svg'
        },
        lessons: course.level || 'Form 1'
      }));

    // If no related courses found, return static data
    return related.length > 0 ? related : (staticData?.relatedCourses || []);
  }, [browseCoursesResponse, courseData, slug]);

  // ========== HANDLERS ==========
  const handleSave = () => {
    let savedCourses = [];
    try {
      savedCourses = JSON.parse(localStorage.getItem('savedCourses') || '[]');
    } catch {
      savedCourses = [];
    }
    if (!Array.isArray(savedCourses)) savedCourses = [];
    if (isSaved) {
      const updated = savedCourses.filter(s => s !== slug);
      localStorage.setItem('savedCourses', JSON.stringify(updated));
      setIsSaved(false);
      showSuccess('Course removed from saved');
    } else {
      savedCourses.push(slug);
      localStorage.setItem('savedCourses', JSON.stringify(savedCourses));
      setIsSaved(true);
      showSuccess('Course saved!');
    }
  };

  const handleEnroll = () => {
    // Navigate to enrolled course page
    navigate(`/student/course/${slug}`);
  };

  const handleNotifyMe = () => {
    const classTitle = courseData?.upcomingClass?.title || 'upcoming class';
    showInfo(`You'll be notified for "${classTitle}"!`);
  };

  const handleRelatedCourseClick = (courseSlug) => {
    window.scrollTo(0, 0);
    navigate(`/student/browse-course/${courseSlug}`);
  };

  // ========== LOADING STATE ==========
  if (isLoading) {
    return (
      <div className="dashboard-content">
        <SkeletonCourseDetails />
      </div>
    );
  }

  // ========== ERROR STATE ==========
  if (isError) {
    return (
      <div className="dashboard-content">
        <div style={{ 
          textAlign: 'center', 
          padding: '100px 20px', 
          background: 'white', 
          borderRadius: '16px'
        }}>
          <h3 style={{ marginBottom: '12px', color: '#1F2937' }}>Failed to load course</h3>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>
            The course might not exist or there was a network error.
          </p>
          <button 
            className="btn-apply-filters" 
            onClick={() => refetch()}
            style={{ marginRight: '12px' }}
          >
            Retry
          </button>
          <button 
            className="btn-save-course" 
            onClick={() => navigate('/student/browse-courses')}
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  // ========== NO DATA STATE ==========
  if (!courseData) {
    return (
      <div className="dashboard-content">
        <div style={{ 
          textAlign: 'center', 
          padding: '100px 20px', 
          background: 'white', 
          borderRadius: '16px'
        }}>
          <h3 style={{ marginBottom: '12px', color: '#1F2937' }}>Course not found</h3>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>
            The course "{slug}" could not be found.
          </p>
          <button 
            className="btn-apply-filters" 
            onClick={() => navigate('/student/browse-courses')}
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <div className="dashboard-content">
      <div className="browse-page-wrapper">
        {/* TWO COLUMN LAYOUT */}
        <div className="browse-main-grid">
          
          {/* LEFT COLUMN */}
          <div className="browse-left-section">
            {/* Course Header - API Data */}
            <BrowseCourseHeader courseData={courseData} />

            {/* Stats Bar - API Data */}
            <BrowseCourseStats 
              stats={courseData.stats}
              isSaved={isSaved}
              onSave={handleSave}
              onEnroll={handleEnroll}
            />

            {/* About Section - API + Static */}
            <BrowseAboutSection about={courseData.about} />

            {/* Course Content - Static (no API yet) */}
            <BrowseCourseContent courseContent={courseData.courseContent} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="browse-right-section">
            {/* Upcoming Live Class - Static */}
            {courseData.upcomingClass && (
              <BrowseUpcomingClass 
                classData={courseData.upcomingClass}
                onNotifyMe={handleNotifyMe}
              />
            )}

            {/* Related Courses - API Filtered */}
            <BrowseRelatedCourses 
              courses={relatedCourses}
              onCourseClick={handleRelatedCourseClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowseCourseDetails;
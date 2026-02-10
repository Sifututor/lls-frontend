// src/pages/CourseDetails.js
import React, { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseHeader from '../components/CourseHeader';
import VideoPlayer from '../components/VideoPlayer';
import CourseTabs from '../components/CourseTabs';
import DiscussionSection from '../components/DiscussionSection';
import CourseContentAccordion from '../components/CourseContentAccordion';
import AITutorBox from '../components/AITutorBox';
import { SkeletonCourseDetails } from '../components/ui/LoadingSpinner';
import { useGetCourseDetailsQuery } from '../store/api/authApi';
import { getTutorProfilePath } from '../utils/tutorProfileUtils';

// Keep only minimal static data for structure/icons
import {
  courseData as staticCourseData
} from '../data/courseDetailsData';

function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const videoPlayerRef = useRef(null);
  
  // State for bookmark timestamp
  const [bookmarkTimestamp, setBookmarkTimestamp] = useState(null);


  // API Call
  const { data: apiResponse, isLoading, isError, refetch } = useGetCourseDetailsQuery(slug, {
    skip: !slug,
  });

  // ✅ Get current lesson ID from API response only
  // Try multiple paths to get the lesson ID
  const currentLessonId = 
    apiResponse?.course?.current_lesson_id || 
    apiResponse?.course?.lessons?.[0]?.id ||
    apiResponse?.current_lesson?.id ||
    null; // No static fallback


  // Build courseData
  const courseData = apiResponse?.course ? {
    id: apiResponse.course.id,
    title: apiResponse.course.title,
    badges: [
      { id: 1, text: apiResponse.course.subject || 'General' },
      { id: 2, text: apiResponse.course.level || 'Form 1' }
    ],
    instructor: {
      name: apiResponse.course.tutor?.name || apiResponse.course.creator?.name || 'Unknown',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    progress: apiResponse.course.progress_percentage || 0,
    video: staticCourseData.video
  } : null;

  // Extract downloadable materials from API (course.chapters[].lessons[].supplementary_materials_url)
  const downloadsDataFromApi = useMemo(() => {
    const course = apiResponse?.course || apiResponse?.data?.course || apiResponse?.data;
    const chapters = course?.chapters;
    if (!chapters || !Array.isArray(chapters)) return [];

    const materials = [];
    chapters.forEach((chapter) => {
      const lessons = chapter.lessons || chapter.lesson || [];
      lessons.forEach((lesson) => {
        const url = lesson.supplementary_materials_url || lesson.supplementary_material_url;
        if (url) {
          materials.push({
            id: lesson.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            chapterTitle: chapter.title,
            url,
            name: lesson.title ? `${lesson.title} - Materials` : 'Document',
            displayName: lesson.title ? `${lesson.title} - Materials` : 'Document',
            size: chapter.title ? `PDF • ${chapter.title}` : 'PDF',
          });
        }
      });
    });
    return materials;
  }, [apiResponse]);

  // Use ONLY API downloads - no static fallback
  const downloadsDataResolved = downloadsDataFromApi;

  const handleBookmarkClick = (timestampData) => {
    setBookmarkTimestamp(timestampData);
  };

  const handleBookmarkHandled = () => {
    setBookmarkTimestamp(null);
  };

  const handleBack = () => {
    navigate('/student/my-courses');
  };

  const handleViewAllClasses = () => {
    navigate('/student/live-classes');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="dashboard-content">
        <SkeletonCourseDetails />
      </div>
    );
  }

  // Error state
  if (isError || !courseData) {
    return (
      <div className="dashboard-content">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '16px' }}>
          <p style={{ color: '#DC2626', fontSize: '18px' }}>Failed to load course</p>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Course: {slug || 'Unknown'}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-apply-filters" onClick={() => refetch()}>Retry</button>
            <button className="btn-save-course" onClick={handleBack}>Back to Courses</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Course Header */}
      <CourseHeader courseData={courseData} />

      {/* Course Details Content */}
      <div className="course-details-wrapper">
        {/* Left Content Area */}
        <div className="course-main-content">
          {/* Video Player */}
          <VideoPlayer 
            ref={videoPlayerRef}
            video={courseData.video}
            onBookmarkClick={handleBookmarkClick}
          />

          {/* Tabs (Lesson, Notes, Downloads) */}
          {/* No static data for notes/comments - will be from API */}
          <CourseTabs
            currentLesson={apiResponse?.current_lesson || null}
            notesData={[]}
            downloadsData={downloadsDataResolved}
            lessonId={currentLessonId}
            bookmarkTimestamp={bookmarkTimestamp}
            onBookmarkHandled={handleBookmarkHandled}
          />

          {/* ✅ Discussion Section - Pass lessonId correctly */}
          <DiscussionSection 
            lessonId={currentLessonId} 
            commentsData={[]}
          />
        </div>

        {/* Right Sidebar */}
        <div className="course-right-sidebar">
          {/* Course Content Accordion */}
          <CourseContentAccordion courseContentData={apiResponse?.course?.chapters || []} />

          {/* AI Tutor Box - No static chat data */}
          <AITutorBox />

          {/* Upcoming Classes Card */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h4 className="sidebar-card-title">Upcoming Classes</h4>
              <button 
                className="view-all-link" 
                onClick={handleViewAllClasses}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View All
              </button>
            </div>

            {/* No static upcoming class data - show empty state */}
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>
                No upcoming live classes
              </p>
              <button 
                className="btn-view-classes"
                onClick={() => navigate('/student/live-classes')}
                style={{
                  padding: '8px 16px',
                  background: '#9FE870',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#163300',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View All Classes
              </button>
            </div>
          </div>

          {/* Recorded Classes Card */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h4 className="sidebar-card-title">Recorded Classes</h4>
              <button 
                className="view-all-link" 
                onClick={handleViewAllClasses}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View All
              </button>
            </div>

            {/* No static recorded class data - show empty state */}
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>
                No recorded sessions
              </p>
              <button 
                className="btn-view-recordings"
                onClick={() => navigate('/student/past-sessions')}
                style={{
                  padding: '8px 16px',
                  background: '#9FE870',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#163300',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View Past Sessions
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetails;
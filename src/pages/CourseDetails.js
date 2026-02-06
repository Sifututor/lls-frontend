// src/pages/CourseDetails.js
import React, { useState, useRef } from 'react';
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

// Static data imports (same as before)
import {
  courseData as staticCourseData,
  currentLesson,
  notesData,
  downloadsData,
  commentsData,
  courseContentData,
  upcomingClassData,
  recordedClassData,
  aiChatData
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

  // ✅ Get current lesson ID from API response or static data
  // Try multiple paths to get the lesson ID
  const currentLessonId = 
    apiResponse?.course?.current_lesson_id || 
    apiResponse?.course?.lessons?.[0]?.id ||
    apiResponse?.current_lesson?.id ||
    currentLesson?.id || 
    2; // Default fallback


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
          <CourseTabs
            currentLesson={currentLesson}
            notesData={notesData}
            downloadsData={downloadsData}
            lessonId={currentLessonId}
            bookmarkTimestamp={bookmarkTimestamp}
            onBookmarkHandled={handleBookmarkHandled}
          />

          {/* ✅ Discussion Section - Pass lessonId correctly */}
          <DiscussionSection 
            lessonId={currentLessonId} 
            commentsData={commentsData} 
          />
        </div>

        {/* Right Sidebar */}
        <div className="course-right-sidebar">
          {/* Course Content Accordion */}
          <CourseContentAccordion courseContentData={courseContentData} />

          {/* AI Tutor Box */}
          <AITutorBox aiChatData={aiChatData} />

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

            <div className="upcoming-class-item">
              <div className="class-thumbnail">
                <img src={upcomingClassData.thumbnail} alt="Class" />
                <div className="class-badge-overlay">
                  <span className="badge-scheduled">{upcomingClassData.status}</span>
                  <span className="badge-time">{upcomingClassData.time}</span>
                  <span className="badge-duration">{upcomingClassData.duration}</span>
                </div>
              </div>
              <div className="class-info-sidebar">
                <div
                  className="class-instructor-small"
                  onClick={() => {
                    const path = getTutorProfilePath(upcomingClassData.instructor);
                    if (path) navigate(path);
                  }}
                  role={getTutorProfilePath(upcomingClassData.instructor) ? 'button' : undefined}
                  style={getTutorProfilePath(upcomingClassData.instructor) ? { cursor: 'pointer' } : undefined}
                >
                  <img src={upcomingClassData.instructor.avatar} alt="Instructor" />
                  <span>{upcomingClassData.instructor.name}</span>
                </div>
                <h5 className="class-title-small">{upcomingClassData.title}</h5>
                <p className="class-description-small">
                  {upcomingClassData.description}
                </p>
                <button className="btn-notify-me">Notify Me</button>
              </div>
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

            <div className="recorded-class-item">
              <div className="class-thumbnail">
                <img src={recordedClassData.thumbnail} alt="Class" />
                <div className="class-badge-overlay">
                  <span className="badge-recorded">Recorded</span>
                  <span className="badge-subject">{recordedClassData.subject}</span>
                  <span className="badge-duration">{recordedClassData.duration}</span>
                </div>
              </div>
              <div className="class-info-sidebar">
                <div
                  className="class-instructor-small"
                  onClick={() => {
                    const path = getTutorProfilePath(recordedClassData.instructor);
                    if (path) navigate(path);
                  }}
                  role={getTutorProfilePath(recordedClassData.instructor) ? 'button' : undefined}
                  style={getTutorProfilePath(recordedClassData.instructor) ? { cursor: 'pointer' } : undefined}
                >
                  <img src={recordedClassData.instructor.avatar} alt="Instructor" />
                  <span>{recordedClassData.instructor.name}</span>
                </div>
                <h5 className="class-title-small">{recordedClassData.title}</h5>
                <p className="class-description-small">
                  {recordedClassData.description}
                </p>
                <button className="btn-watch-recording">Watch Recording</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetails;
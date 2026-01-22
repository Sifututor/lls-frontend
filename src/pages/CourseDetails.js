// src/pages/CourseDetails.js
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import CourseHeader from '../components/CourseHeader';
import VideoPlayer from '../components/VideoPlayer';
import CourseTabs from '../components/CourseTabs';
import DiscussionSection from '../components/DiscussionSection';
import CourseContentAccordion from '../components/CourseContentAccordion';
import AITutorBox from '../components/AITutorBox';
import { useGetCourseDetailsQuery } from '../store/api/authApi';

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
  const { id: slug } = useParams();
  const videoPlayerRef = useRef(null);
  
  // State for bookmark timestamp (to pass from VideoPlayer to CourseTabs)
  const [bookmarkTimestamp, setBookmarkTimestamp] = useState(null);

  // API Call - Only for course header
  const { data: apiResponse, isLoading, isError, refetch } = useGetCourseDetailsQuery(slug);

  // Get current lesson ID from API or use static
  const currentLessonId = apiResponse?.course?.current_lesson_id || currentLesson?.id || 2;

  // Build courseData from API (for header) + static (for video)
  const courseData = apiResponse?.course ? {
    id: apiResponse.course.id,
    title: apiResponse.course.title,
    badges: [
      { id: 1, text: apiResponse.course.subject || 'General' },
      { id: 2, text: apiResponse.course.level || 'Form 1' }
    ],
    instructor: {
      name: apiResponse.course.tutor?.name || apiResponse.course.creator?.name || 'Unknown',
      avatar: apiResponse.course.tutor?.avatar || '/assets/images/icons/Ellipse 2.svg'
    },
    progress: apiResponse.course.progress_percentage || 0,
    video: staticCourseData.video // Video from static
  } : null;

  // Handle bookmark click from VideoPlayer
  const handleBookmarkClick = (timestampData) => {
    setBookmarkTimestamp(timestampData);
  };

  // Reset bookmark timestamp after it's been handled
  const handleBookmarkHandled = () => {
    setBookmarkTimestamp(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Sidebar />
        <main className="main-content">
          <TopNavbar title="My Courses" breadcrumb="Loading..." />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <p style={{ color: '#6B7280', fontSize: '18px' }}>Loading course...</p>
          </div>
        </main>
      </>
    );
  }

  // Error state
  if (isError || !courseData) {
    return (
      <>
        <Sidebar />
        <main className="main-content">
          <TopNavbar title="My Courses" breadcrumb="Error" />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '16px' }}>
            <p style={{ color: '#DC2626', fontSize: '18px' }}>Failed to load course</p>
            <button className="btn-apply-filters" onClick={() => refetch()}>Retry</button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <main className="main-content">
        <TopNavbar title="My Courses" breadcrumb={courseData.title} />

        {/* Course Header - FROM API */}
        <CourseHeader courseData={courseData} />

        {/* Course Details Content - ALL STATIC BELOW */}
        <div className="course-details-wrapper">
          {/* Left Content Area */}
          <div className="course-main-content">
            {/* Video Player - STATIC (with bookmark callback) */}
            <VideoPlayer 
              ref={videoPlayerRef}
              video={courseData.video}
              onBookmarkClick={handleBookmarkClick}
            />

            {/* Tabs (Lesson, Notes, Downloads) - WITH API INTEGRATION */}
            <CourseTabs
              currentLesson={currentLesson}
              notesData={notesData}
              downloadsData={downloadsData}
              lessonId={currentLessonId}
              bookmarkTimestamp={bookmarkTimestamp}
              onBookmarkHandled={handleBookmarkHandled}
            />

            {/* Discussion Section - STATIC */}
            <DiscussionSection commentsData={commentsData} />
          </div>

          {/* Right Sidebar */}
          <div className="course-right-sidebar">
            {/* Course Content Accordion - STATIC */}
            <CourseContentAccordion courseContentData={courseContentData} />

            {/* AI Tutor Box - STATIC */}
            <AITutorBox aiChatData={aiChatData} />

            {/* Upcoming Classes Card - STATIC */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <h4 className="sidebar-card-title">Upcoming Classes</h4>
                <a href="#" className="view-all-link">
                  View All
                </a>
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
                  <div className="class-instructor-small">
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

            {/* Recorded Classes Card - STATIC */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <h4 className="sidebar-card-title">Recorded Classes</h4>
                <a href="#" className="view-all-link">
                  View All
                </a>
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
                  <div className="class-instructor-small">
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
      </main>
    </>
  );
}

export default CourseDetails;
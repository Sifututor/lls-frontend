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

// Find a lesson by id from course.chapters[].lessons[]
function findLessonInChapters(chapters, lessonId) {
  if (!chapters || !lessonId) return null;
  for (const ch of chapters) {
    const lessons = ch.lessons || ch.lesson || [];
    const lesson = lessons.find((l) => l.id === lessonId || l.id === parseInt(lessonId, 10));
    if (lesson) return { chapter: ch, lesson };
  }
  return null;
}

// First lesson in course (fallback when no current_lesson_id)
function getFirstLesson(chapters) {
  if (!chapters?.length) return null;
  for (const ch of chapters) {
    const lessons = ch.lessons || ch.lesson || [];
    if (lessons.length) return lessons[0];
  }
  return null;
}

// Flat list of all lessons in order (chapters -> lessons) for next/previous
function getAllLessonsInOrder(chapters) {
  if (!chapters?.length) return [];
  const list = [];
  chapters.forEach((ch) => {
    (ch.lessons || ch.lesson || []).forEach((l) => list.push(l));
  });
  return list;
}

function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const videoPlayerRef = useRef(null);
  const [bookmarkTimestamp, setBookmarkTimestamp] = useState(null);
  // When user clicks a lesson in accordion, we show that lesson (override API current_lesson_id)
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const { data: apiResponse, isLoading, isError, refetch } = useGetCourseDetailsQuery(slug, {
    skip: !slug,
  });

  const chapters = apiResponse?.course?.chapters || [];
  const apiCurrentLessonId = apiResponse?.course?.current_lesson_id || apiResponse?.current_lesson?.id || null;
  const effectiveLessonId = selectedLessonId || apiCurrentLessonId || getFirstLesson(chapters)?.id || null;

  const currentLessonMeta = useMemo(() => {
    if (effectiveLessonId && chapters.length) {
      const found = findLessonInChapters(chapters, effectiveLessonId);
      if (found) return found.lesson;
    }
    const first = getFirstLesson(chapters);
    return first || null;
  }, [chapters, effectiveLessonId]);

  // Dynamic video from current lesson
  const videoFromLesson = useMemo(() => {
    if (!currentLessonMeta) return null;
    const url = currentLessonMeta.video_url || currentLessonMeta.video_url_url || currentLessonMeta.video?.url;
    if (!url) return null;
    return {
      url,
      thumbnail: currentLessonMeta.thumbnail || currentLessonMeta.thumbnail_url || '/assets/images/live-classes.png'
    };
  }, [currentLessonMeta]);

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
    video: videoFromLesson || { url: null, thumbnail: '/assets/images/live-classes.png' }
  } : null;

  const currentLessonForTabs = currentLessonMeta ? {
    id: currentLessonMeta.id,
    title: currentLessonMeta.title,
    description: currentLessonMeta.description || 'No description available for this lesson.',
    lastUpdated: currentLessonMeta.updated_at ? new Date(currentLessonMeta.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Last updated recently',
    language: 'English'
  } : null;

  // Notes come from show-course API: each lesson has video_bookmarks []
  const notesFromCourse = currentLessonMeta?.video_bookmarks ?? [];

  // Next/Previous lesson for video player controls
  const { nextLesson, previousLesson } = useMemo(() => {
    const all = getAllLessonsInOrder(chapters);
    const idx = effectiveLessonId ? all.findIndex((l) => l.id === effectiveLessonId || l.id === parseInt(effectiveLessonId, 10)) : -1;
    return {
      nextLesson: idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null,
      previousLesson: idx > 0 ? all[idx - 1] : null,
    };
  }, [chapters, effectiveLessonId]);

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
            lessonId={effectiveLessonId}
            onBookmarkClick={handleBookmarkClick}
            onNextLesson={nextLesson ? () => setSelectedLessonId(nextLesson.id) : undefined}
            onPreviousLesson={previousLesson ? () => setSelectedLessonId(previousLesson.id) : undefined}
            hasNextLesson={!!nextLesson}
            hasPreviousLesson={!!previousLesson}
          />

          {/* Tabs (Lesson, Notes, Downloads) */}
          {/* No static data for notes/comments - will be from API */}
          <CourseTabs
            currentLesson={currentLessonForTabs}
            downloadsData={downloadsDataResolved}
            lessonId={effectiveLessonId}
            courseSlug={slug}
            bookmarkTimestamp={bookmarkTimestamp}
            onBookmarkHandled={handleBookmarkHandled}
            getVideoCurrentTime={() => {
              const t = videoPlayerRef.current?.getCurrentTime?.() ?? 0;
              const secs = Math.floor(Number(t)) || 0;
              return { seconds: secs, formatted: videoPlayerRef.current?.getCurrentTimeFormatted?.() || '00:00:00' };
            }}
            notesFromCourse={notesFromCourse}
            onNoteAdded={refetch}
          />

          <DiscussionSection 
            lessonId={effectiveLessonId} 
            commentsData={[]}
          />
        </div>

        {/* Right Sidebar */}
        <div className="course-right-sidebar">
          {/* Course Content Accordion */}
          <CourseContentAccordion
            courseContentData={chapters}
            currentLessonId={effectiveLessonId}
            onLessonSelect={(lesson) => setSelectedLessonId(lesson?.id ?? null)}
          />

          {/* AI Tutor Box - Dynamic API */}
          <AITutorBox
            courseTitle={courseData?.title}
            lessonTitle={currentLessonForTabs?.title}
          />

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
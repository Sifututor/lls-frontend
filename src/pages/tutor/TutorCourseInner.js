/**
 * Tutor Course Inner page – dynamic from API GET /tutor/courses/:id.
 * Header (tags, title), chapters with lesson cards. Missing fields kept static.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTutorCourseByIdQuery } from '../../store/api/authApi';
import '../../assets/css/tutor-course-inner.css';

function TutorCourseInner() {
  const { id } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { data, isLoading, isError, error } = useGetTutorCourseByIdQuery(id, { skip: !id });

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  const course = data?.success && data?.course ? data.course : null;
  const totalLessons = course?.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0;
  const totalQuizzes = course?.chapters?.reduce(
    (sum, ch) => sum + (ch.lessons || []).reduce((s, l) => s + (l.quizzes_count || 0), 0),
    0
  ) || 0;

  const meta = course
    ? {
        title: course.title || 'Untitled',
        subject: course.subject || '—',
        level: course.level || '—',
        videos: totalLessons,
        quizzes: totalQuizzes,
        students: course.total_enrollments ?? 0,
      }
    : null;

  const chapters = (course?.chapters || []).map((ch) => ({
    id: ch.id,
    title: ch.title || `Chapter ${ch.id}`,
    status: ch.status || 'published',
    classesCount: ch.lessons?.length || 0,
    totalMins: (ch.lessons || []).reduce((m, l) => m + Math.ceil((l.video_duration || 0) / 60), 0),
    lessons: (ch.lessons || []).map((l) => ({
      id: l.id,
      title: l.title || 'Untitled',
      status: l.status || 'published',
      completed: 0,
      total: 1,
      mins: Math.ceil((l.video_duration || 0) / 60),
    })),
  }));

  const handleAddChapter = () => {
    // Placeholder: open add chapter flow
  };

  const handleAddMockTest = () => {
    // Placeholder: open add mock test flow
  };

  if (isLoading) {
    return (
      <div className="tutor-course-inner-wrapper">
        <p className="tutor-course-inner-error" style={{ color: '#9A9A9A' }}>Loading course...</p>
      </div>
    );
  }

  if (isError || !meta) {
    return (
      <div className="tutor-course-inner-wrapper">
        <p className="tutor-course-inner-error">
          {isError ? (error?.data?.message || error?.message || 'Failed to load course.') : 'Course not found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="tutor-course-inner-wrapper">
      {/* Course header: dark green banner with tags, title, Add Chapter / Add Mock Test, three dots */}
      <header className="tutor-course-inner-header">
        <div className="tutor-course-inner-header-tags">
          <span className="tutor-course-inner-tag">{meta.level}</span>
          <span className="tutor-course-inner-tag">{meta.subject}</span>
          <span className="tutor-course-inner-tag">{meta.videos} Videos</span>
          <span className="tutor-course-inner-tag">{meta.quizzes} Quizzes</span>
          <span className="tutor-course-inner-tag">{meta.students} Students</span>
        </div>
        <div className="tutor-course-inner-header-bottom">
          <h1 className="tutor-course-inner-title">{meta.title}</h1>
          <div className="tutor-course-inner-header-actions">
            <button
              type="button"
              className="tutor-course-inner-btn-add"
              onClick={handleAddChapter}
            >
              Add Chapter
            </button>
            <button
              type="button"
              className="tutor-course-inner-btn-add mock"
              onClick={handleAddMockTest}
            >
              Add Mock Test
            </button>
            <div className="tutor-course-inner-menu-wrap" ref={menuRef}>
              <button
                type="button"
                className="tutor-course-inner-btn-dots"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="More options"
              >
                <span />
                <span />
                <span />
              </button>
              {menuOpen && (
                <div className="tutor-course-inner-dropdown">
                  <div className="tutor-course-inner-dropdown-item">Edit course</div>
                  <div className="tutor-course-inner-dropdown-item">Settings</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Chapters and lesson cards */}
      <div className="tutor-course-inner-content">
        {chapters.map((chapter) => (
          <section key={chapter.id} className="tutor-course-inner-chapter">
            <div className="tutor-course-inner-chapter-head">
              <div className="tutor-course-inner-chapter-head-left">
                <h2 className="tutor-course-inner-chapter-title">{chapter.title}</h2>
                <span
                  className={`tutor-course-inner-status tutor-course-inner-status-${chapter.status.toLowerCase()}`}
                >
                  {chapter.status}
                </span>
              </div>
              <Link
                to={`/tutor/courses/${id}/chapters/${chapter.id}`}
                className="tutor-course-inner-link-view-chapter"
              >
                View Chapter Details
              </Link>
            </div>
            <p className="tutor-course-inner-chapter-meta">
              Classes: {chapter.classesCount} • {chapter.totalMins} mins
            </p>
            <div className="tutor-course-inner-lessons-row">
              {chapter.lessons.map((lesson) => (
                <div key={lesson.id} className="tutor-course-inner-lesson-card">
                  <div className="tutor-course-inner-lesson-card-top">
                    <div className="tutor-course-inner-lesson-tags">
                      <span className="tutor-course-inner-lesson-tag">{meta.subject}</span>
                      <span className="tutor-course-inner-lesson-tag">{meta.level}</span>
                    </div>
                    <span
                      className={`tutor-course-inner-status tutor-course-inner-status-${lesson.status.toLowerCase()}`}
                    >
                      {lesson.status}
                    </span>
                  </div>
                  <h3 className="tutor-course-inner-lesson-title">{lesson.title}</h3>
                  <p className="tutor-course-inner-lesson-meta">
                    {lesson.completed}/{lesson.total} • {lesson.mins} mins
                  </p>
                  <Link
                    to={`/tutor/courses/${id}/chapters/${chapter.id}/lessons/${lesson.id}`}
                    className="tutor-course-inner-btn-see-details"
                  >
                    See Details
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default TutorCourseInner;

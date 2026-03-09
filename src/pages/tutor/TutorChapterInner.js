/**
 * Tutor Chapter Inner page – dynamic from API: get course by id, find chapter in chapters
 */
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTutorCourseByIdQuery } from '../../store/api/authApi';
import EditChapterModal from '../../components/tutor/EditChapterModal';
import '../../assets/css/tutor-course-inner.css';

function TutorChapterInner() {
  const { id: courseId, chapterId } = useParams();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data, isLoading, isError } = useGetTutorCourseByIdQuery(courseId, { skip: !courseId });
  const course = data?.course ?? data;
  const chapter = useMemo(() => {
    const chList = course?.chapters ?? [];
    return chList.find((ch) => String(ch.id) === String(chapterId));
  }, [course, chapterId]);

  if (isLoading) {
    return (
      <div className="tutor-course-inner-wrapper">
        <p className="tutor-course-inner-error" style={{ color: '#9A9A9A' }}>Loading...</p>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="tutor-course-inner-wrapper">
        <p className="tutor-course-inner-error">Chapter not found.</p>
      </div>
    );
  }

  const level = course?.level ?? '—';
  const subject = course?.subject ?? '—';
  const courseTitle = course?.title ?? '—';
  const lessons = (chapter.lessons ?? []).map((l) => ({
    id: l.id,
    title: l.title || 'Untitled',
    status: l.status || 'published',
    completed: 0,
    total: 1,
    mins: Math.ceil((l.video_duration || 0) / 60),
  }));
  const totalMins = lessons.reduce((m, l) => m + l.mins, 0);

  const chapterNumber = chapter.title?.split(':')[0]?.trim() || chapter.title || 'Chapter';
  const chapterSubtitle = chapter.title?.includes(':')
    ? chapter.title.split(':').slice(1).join(':').trim()
    : chapter.title || '';

  return (
    <div className="tutor-course-inner-wrapper">
      {/* Dark green banner: tags, Chapter number, subtitle, status, Edit Chapter / Add Test / Add Lesson */}
      <header className="tutor-course-inner-header tutor-course-inner-chapter-header">
        <div className="tutor-course-inner-header-tags">
          <span className="tutor-course-inner-tag">{level}</span>
          <span className="tutor-course-inner-tag">{subject}</span>
          <span className="tutor-course-inner-tag">{courseTitle}</span>
          <span className="tutor-course-inner-tag">{lessons.length} Videos</span>
          <span className="tutor-course-inner-tag">0 Quizzes</span>
          <span className="tutor-course-inner-tag">{totalMins} mins</span>
        </div>
        <div className="tutor-course-inner-chapter-header-bottom">
          <div className="tutor-course-inner-chapter-header-left">
            <p className="tutor-course-inner-chapter-number">{chapterNumber}</p>
            <div className="tutor-course-inner-chapter-title-row">
              <h1 className="tutor-course-inner-chapter-subtitle">{chapterSubtitle || chapter.title}</h1>
              <span
                className={`tutor-course-inner-status tutor-course-inner-status-${chapter.status.toLowerCase()}`}
              >
                {chapter.status}
              </span>
            </div>
          </div>
          <div className="tutor-course-inner-header-actions">
            <button
              type="button"
              className="tutor-course-inner-btn-add mock"
              onClick={() => setEditModalOpen(true)}
            >
              Edit Chapter
            </button>
            <button type="button" className="tutor-course-inner-btn-add mock">
              Add Test
            </button>
            <button type="button" className="tutor-course-inner-btn-add">
              Add Lesson
            </button>
          </div>
        </div>
      </header>

      {/* About this chapter – white card */}
      <section className="tutor-course-inner-about-card">
        <h2 className="tutor-course-inner-about-heading">About this chapter</h2>
        <p className="tutor-course-inner-about-desc">{chapter.description || chapter.about_description || '—'}</p>
      </section>

      {/* Lessons – white card with lesson cards */}
      <section className="tutor-course-inner-lessons-section">
        <h2 className="tutor-course-inner-lessons-heading">Lessons</h2>
        <div className="tutor-course-inner-lessons-row">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="tutor-course-inner-lesson-card">
              <div className="tutor-course-inner-lesson-card-top">
                <div className="tutor-course-inner-lesson-tags">
                  <span className="tutor-course-inner-lesson-tag">{subject}</span>
                  <span className="tutor-course-inner-lesson-tag tutor-course-inner-lesson-tag-level">
                    {level}
                  </span>
                </div>
                <span
                  className={`tutor-course-inner-status tutor-course-inner-status-${lesson.status.toLowerCase()}`}
                >
                  {lesson.status}
                </span>
              </div>
              <h3 className="tutor-course-inner-lesson-title">{lesson.title}</h3>
              <p className="tutor-course-inner-lesson-meta">
                {lesson.mins} mins
              </p>
              <Link
                to={`/tutor/courses/${courseId}/chapters/${chapterId}/lessons/${lesson.id}`}
                className="tutor-course-inner-btn-see-details"
              >
                See Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      <EditChapterModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        chapter={{ ...chapter, title: chapter.title, aboutDescription: chapter.description }}
      />
    </div>
  );
}

export default TutorChapterInner;

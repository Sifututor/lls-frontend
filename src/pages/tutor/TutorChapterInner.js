/**
 * Tutor Chapter Inner page – opens when user clicks "View Chapter Details" on course inner.
 * Design as per image: dark green banner (tags, Chapter X, title, Published, Edit Chapter / Add Test / Add Lesson),
 * About this chapter card, Lessons section with lesson cards. Uses tutor-course-inner-* CSS only.
 */
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChapterDetailByChapterId } from '../../data/tutorCourseInnerData';
import EditChapterModal from '../../components/tutor/EditChapterModal';
import '../../assets/css/tutor-course-inner.css';

function TutorChapterInner() {
  const { id: courseId, chapterId } = useParams();
  const chapter = getChapterDetailByChapterId(chapterId);
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (!chapter) {
    return (
      <div className="tutor-course-inner-wrapper">
        <p className="tutor-course-inner-error">Chapter not found.</p>
      </div>
    );
  }

  // "Chapter 1: Introduction" -> number "Chapter 1", subtitle "Introduction"
  const chapterNumber = chapter.title.split(':')[0]?.trim() || chapter.title;
  const chapterSubtitle = chapter.title.includes(':')
    ? chapter.title.split(':').slice(1).join(':').trim()
    : '';

  return (
    <div className="tutor-course-inner-wrapper">
      {/* Dark green banner: tags, Chapter number, subtitle, status, Edit Chapter / Add Test / Add Lesson */}
      <header className="tutor-course-inner-header tutor-course-inner-chapter-header">
        <div className="tutor-course-inner-header-tags">
          <span className="tutor-course-inner-tag">{chapter.level}</span>
          <span className="tutor-course-inner-tag">{chapter.subject}</span>
          <span className="tutor-course-inner-tag">{chapter.courseTitle}</span>
          <span className="tutor-course-inner-tag">
            {chapter.videos} Videos
          </span>
          <span className="tutor-course-inner-tag">
            {chapter.quizzes} Quizzes
          </span>
          <span className="tutor-course-inner-tag">
            {chapter.totalMins} mins
          </span>
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
        <h2 className="tutor-course-inner-about-heading">{chapter.aboutHeading}</h2>
        <p className="tutor-course-inner-about-desc">{chapter.aboutDescription}</p>
        <p className="tutor-course-inner-about-bullet-title">{chapter.aboutBulletTitle}</p>
        <ul className="tutor-course-inner-about-bullets">
          {chapter.aboutBullets.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Lessons – white card with lesson cards */}
      <section className="tutor-course-inner-lessons-section">
        <h2 className="tutor-course-inner-lessons-heading">Lessons</h2>
        <div className="tutor-course-inner-lessons-row">
          {chapter.lessons.map((lesson) => (
            <div key={lesson.id} className="tutor-course-inner-lesson-card">
              <div className="tutor-course-inner-lesson-card-top">
                <div className="tutor-course-inner-lesson-tags">
                  <span className="tutor-course-inner-lesson-tag">{chapter.subject}</span>
                  <span className="tutor-course-inner-lesson-tag tutor-course-inner-lesson-tag-level">
                    {chapter.level}
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
                {lesson.completed}/{lesson.total} • {lesson.mins} mins
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
        chapter={chapter}
      />
    </div>
  );
}

export default TutorChapterInner;

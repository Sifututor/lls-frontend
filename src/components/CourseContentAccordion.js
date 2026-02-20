// src/components/CourseContentAccordion.js
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizModal from './Quizmodal';

function formatDuration(seconds) {
  if (seconds == null || isNaN(seconds)) return '0:00';
  const m = Math.floor(Number(seconds) / 60);
  const s = Math.floor(Number(seconds) % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Normalize API chapters to accordion shape: meta, score, lessons with duration, completed, locked, playing
function normalizeChapters(courseContentData, currentLessonId) {
  if (!courseContentData?.length) return [];
  return courseContentData.map((chapter, chapterIndex) => {
    const lessons = chapter.lessons || chapter.lesson || [];
    const completedCount = lessons.filter((l) => l.completed || l.is_completed).length;
    const total = lessons.length;
    const durationMins = lessons.reduce((sum, l) => sum + (Number(l.video_duration) || 0), 0) / 60;
    const durationStr = durationMins >= 60 ? `${Math.floor(durationMins / 60)}h ${Math.round(durationMins % 60)} mins` : `${Math.round(durationMins)} mins`;
    const allCompleted = total > 0 && completedCount >= total;
    const attemptsLeft = chapter.quiz_attempts_left ?? chapter.attempts_left ?? 0;
    const attemptsTotal = chapter.quiz_attempts_total ?? chapter.attempts_total ?? 0;
    const meta = `${completedCount}/${total} • ${durationStr}${attemptsTotal ? ` • Attempts: ${attemptsLeft}/${attemptsTotal} Left` : ''}`;
    const normalizedLessons = lessons.map((lesson) => {
      const secs = lesson.video_duration != null ? lesson.video_duration : 0;
      const completed = !!lesson.completed || !!lesson.is_completed;
      const locked = !!lesson.is_locked || !!lesson.locked;
      const isPlaying = currentLessonId != null && (lesson.id === currentLessonId || lesson.id === parseInt(currentLessonId, 10));
      const hasQuiz = !!(lesson.quiz_id ?? lesson.quiz?.id) || !!lesson.completed;
      return {
        ...lesson,
        duration: locked ? `🔒 ${formatDuration(secs)}` : `► ${formatDuration(secs)}${isPlaying ? ' • Playing' : ''}`,
        completed,
        locked,
        isPlaying,
        hasQuiz
      };
    });
    return {
      ...chapter,
      isOpen: chapterIndex === 0 || (currentLessonId && lessons.some((l) => l.id === currentLessonId || l.id === parseInt(currentLessonId, 10))),
      completed: allCompleted,
      buttonDisabled: !allCompleted,
      meta,
      score: chapter.score ?? null,
      buttonText: chapter.button_text || (attemptsLeft > 0 ? `Start Mock Test (${attemptsLeft}/${attemptsTotal} Attempt Left)` : 'Start Mock Test'),
      lessons: normalizedLessons
    };
  });
}

function CourseContentAccordion({ courseContentData, currentLessonId, onLessonSelect }) {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const normalized = useMemo(
    () => normalizeChapters(courseContentData, currentLessonId),
    [courseContentData, currentLessonId]
  );

  React.useEffect(() => {
    setChapters(normalized);
  }, [normalized]);

  const toggleChapter = (chapterId) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId ? { ...ch, isOpen: !ch.isOpen } : ch
      )
    );
  };

  const collapseAll = () => {
    setChapters((prev) => prev.map((ch) => ({ ...ch, isOpen: false })));
  };

  const handleLessonClick = (lesson, e) => {
    if (lesson.locked) return;
    e?.preventDefault?.();
    if (onLessonSelect) onLessonSelect(lesson);
  };

  const handleButtonClick = (chapterId, e) => {
    e.preventDefault();
    const chapter = chapters.find((ch) => ch.id === chapterId);
    if (!chapter?.buttonText) return;
    if (chapter.buttonDisabled) return;
    const quizId = chapter.quizId ?? chapter.quiz_id ?? chapter.id;
    if (quizId != null) {
      navigate(`/student/quiz/${quizId}`);
    }
  };

  const handleQuizClick = (e, lesson) => {
    e.stopPropagation();
    setSelectedLesson(lesson);
    setShowQuizModal(true);
  };

  const handleStartQuiz = () => {
    setShowQuizModal(false);
  };

  return (
    <>
      <div className="course-content-section">
        <div className="content-section-header">
          <h3 className="content-section-title">Course Content</h3>
          <a href="#" className="collapse-all-btn" onClick={(e) => {e.preventDefault(); collapseAll();}}>
            Collapse All
          </a>
        </div>

        <div className="content-accordion">
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapter.id} className={`accordion-item ${chapter.isOpen ? 'active' : ''}`}>
              <div className="accordion-header" onClick={() => toggleChapter(chapter.id)}>
                <div className="accordion-left">
                  <div className={`status-indicator ${chapter.completed ? 'completed' : ''}`}>
                    <span className="accordion-title">{chapter.title}</span>
                    {chapter.score && <span className="lesson-score">({chapter.score} Score)</span>}
                  </div>
                  <span className="accordion-meta">{chapter.meta}</span>
                </div>
                <div className="accordion-right">
                  <span className="accordion-arrow">{chapter.isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              <div className={`accordion-body ${chapter.isOpen ? 'expanded' : ''}`}>
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="chapter-lesson-item">
                    <input
                      type="checkbox"
                      className="lesson-checkbox"
                      id={`lesson-${chapter.id}-${lesson.id}`}
                      checked={!!lesson.completed}
                      readOnly
                      disabled
                    />
                    <label
                      htmlFor={`lesson-${chapter.id}-${lesson.id}`}
                      className="lesson-label"
                      onClick={(e) => handleLessonClick(lesson, e)}
                      style={{ cursor: lesson.locked ? 'not-allowed' : 'pointer' }}
                    >
                      <div className="lesson-content">
                        <span className="lesson-title">{lesson.title}</span>
                        <span className="lesson-duration">{lesson.duration}</span>
                      </div>
                      {lesson.score != null && (
                        <span className="lesson-score">({lesson.score} Score)</span>
                      )}
                    </label>

                    {lesson.hasQuiz && (
                      <button
                        type="button"
                        className="btn-quiz-available"
                        onClick={(e) => handleQuizClick(e, lesson)}
                      >
                        Quiz Available
                      </button>
                    )}
                  </div>
                ))}

                {chapter.buttonText && (
                  <button
                    type="button"
                    className={`btn-chapter-status ${chapter.buttonDisabled ? 'disabled' : ''}`}
                    onClick={(e) => handleButtonClick(chapter.id, e)}
                  >
                    {chapter.buttonText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Modal Component */}
      <QuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        lessonName={selectedLesson?.title}
        quizId={selectedLesson?.quiz_id ?? selectedLesson?.quizId ?? selectedLesson?.quiz?.id ?? 1}
        onStartQuiz={handleStartQuiz}
      />
    </>
  );
}

export default CourseContentAccordion;
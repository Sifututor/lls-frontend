// src/components/CourseContentAccordion.js
import React, { useState, useEffect } from 'react';
import QuizModal from './Quizmodal';

function CourseContentAccordion({ courseContentData }) {
  const [chapters, setChapters] = useState(courseContentData);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    setChapters(prevChapters =>
      prevChapters.map(chapter => {
        const allLessonsCompleted = chapter.lessons.every(lesson => lesson.completed);
        return {
          ...chapter,
          buttonDisabled: !allLessonsCompleted
        };
      })
    );
  }, [chapters]);

  const toggleChapter = (chapterId) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  };

  const collapseAll = () => {
    setChapters(chapters.map((chapter) => ({ ...chapter, isOpen: false })));
  };

  const toggleLesson = (chapterId, lessonId) => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === chapterId) {
          const updatedLessons = chapter.lessons.map((lesson) =>
            lesson.id === lessonId
              ? { ...lesson, completed: !lesson.completed }
              : lesson
          );
          
          const allCompleted = updatedLessons.every(lesson => lesson.completed);
          
          return {
            ...chapter,
            lessons: updatedLessons,
            buttonDisabled: !allCompleted,
            completed: allCompleted
          };
        }
        return chapter;
      })
    );
  };

  const handleButtonClick = (chapterId, e) => {
    e.preventDefault();
    const chapter = chapters.find(ch => ch.id === chapterId);
    
    if (!chapter.buttonDisabled) {
      console.log('Starting test for chapter:', chapterId);
    }
  };

  const handleQuizClick = (e, lesson) => {
    e.stopPropagation();
    setSelectedLesson(lesson);
    setShowQuizModal(true);
  };

  const handleStartQuiz = () => {
    console.log('Starting quiz for lesson:', selectedLesson?.title);
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
                      id={lesson.id}
                      checked={lesson.completed}
                      onChange={() => toggleLesson(chapter.id, lesson.id)}
                    />
                    <label htmlFor={lesson.id} className="lesson-label">
                      <div className="lesson-content">
                        <span className="lesson-title">{lesson.title}</span>
                        <span className="lesson-duration">{lesson.duration}</span>
                      </div>
                      {/* Score - Hide in 2nd chapter (index 1) */}
                      {chapterIndex !== 1 && (
                        <span className="lesson-score">({lesson.score} Score)</span>
                      )}
                    </label>

                    {/* Quiz Available - Only in 2nd chapter (index 1), 1st lesson (index 0) */}
                    {chapterIndex === 1 && lessonIndex === 0 && (
                      <button 
                        className="btn-quiz-available"
                        onClick={(e) => handleQuizClick(e, lesson)}
                      >
                        Quiz Available
                      </button>
                    )}
                  </div>
                ))}

                <a
                  href="#"
                  className={`btn-chapter-status ${chapter.buttonDisabled ? 'disabled' : ''}`}
                  onClick={(e) => handleButtonClick(chapter.id, e)}
                >
                  {chapter.buttonText}
                </a>
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
        onStartQuiz={handleStartQuiz}
      />
    </>
  );
}

export default CourseContentAccordion;
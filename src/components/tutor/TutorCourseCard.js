// Tutor course card - no thumbnail. Tags (subject green, level grey), title, stats, See Details.
import React from 'react';
import { Link } from 'react-router-dom';

function TutorCourseCard({ course }) {
  const stats = `${course.videos} Videos • ${course.quizzes} Quizzes • ${course.students} Students`;

  return (
    <article className="tutor-course-card">
      <div className="tutor-course-badges-row">
        <span className="tutor-course-badge tutor-course-badge-subject">{course.subject}</span>
        <span className="tutor-course-badge tutor-course-badge-level">{course.level}</span>
      </div>
      <div className="tutor-course-info">
        <h4 className="tutor-course-title">{course.title}</h4>
        <p className="tutor-course-stats">{stats}</p>
        <div className="tutor-course-actions">
          <Link
            to={`/tutor/courses/${course.slug || course.id}`}
            state={{ courseTitle: course.title }}
            className="tutor-course-btn-see-details"
          >
            See Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default TutorCourseCard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTutorProfilePath } from '../utils/tutorProfileUtils';

function BrowseRelatedCourses({ courses, onCourseClick }) {
  const navigate = useNavigate();

  return (
    <div className="browse-related-card">
      <h3 className="browse-related-title">Related Courses</h3>

      <div className="browse-related-courses">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="browse-related-course-card"
            onClick={() => onCourseClick(course.slug)}
            style={{ cursor: 'pointer' }}
          >
            <div className="browse-related-thumbnail">
              <img src={course.thumbnail} alt={course.title} />
            </div>

            <div className="browse-related-content">
              <div
                className="browse-related-instructor"
                onClick={(e) => {
                  e.stopPropagation();
                  const path = getTutorProfilePath(course.instructor);
                  if (path) navigate(path);
                }}
                role={getTutorProfilePath(course.instructor) ? 'button' : undefined}
                style={getTutorProfilePath(course.instructor) ? { cursor: 'pointer' } : undefined}
              >
                <img 
                  src={course.instructor.avatar} 
                  alt={course.instructor.name}
                  className="browse-related-avatar"
                />
                <span className="browse-related-instructor-name">
                  {course.instructor.name}
                </span>
              </div>

              <h4 className="browse-related-title">{course.title}</h4>
              <p className="browse-related-subtitle">{course.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseRelatedCourses;
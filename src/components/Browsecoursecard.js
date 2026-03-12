// src/components/BrowseCourseCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTutorProfilePath } from '../utils/tutorProfileUtils';
import { useEnrollCourseMutation } from '../store/api/authApi';
import { showError, showInfo } from '../utils/toast';

function BrowseCourseCard({ course, onClick }) {
  const navigate = useNavigate();
  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();
  const [enrolled, setEnrolled] = useState(Boolean(course?.isEnrolled));

  const handleCardClick = () => {
    if (onClick) onClick(course.slug);
  };

  const handleEnrollClick = async (e) => {
    e.stopPropagation();
    
    try {
      const result = await enrollCourse(course.slug).unwrap();
      
      // Stay on browse course details - just show enrolled state
      setEnrolled(true);
      
      // Navigate to BROWSE COURSE details page (About this course)
      setTimeout(() => {
        navigate(`/student/browse-course/${course.slug}`);
      }, 500);
      
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Enrollment failed:', error);
      
      // Check if already enrolled
      if (error?.data?.message?.toLowerCase().includes('already enrolled')) {
        showInfo('You are already enrolled in this course!');
        setEnrolled(true);
      } else {
        showError(error?.data?.message || 'Failed to enroll. Please try again.');
      }
    }
  };

  const handleInstructorClick = (e) => {
    e.stopPropagation();
    const path = getTutorProfilePath(course.instructor);
    if (path) navigate(path);
  };

  return (
    <article className="course-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="course-thumbnail">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          onError={(e) => e.target.src = '/assets/images/live-classes.png'}
        />
      </div>

      <div className="class-badges-row">
        <span className={`course-badge ${course.badge || ''}`}>
          {course.badge ? course.badge.charAt(0).toUpperCase() + course.badge.slice(1) : ''}
        </span>
      </div>

      <div className="course-info">
        <div
          className="course-instructor"
          onClick={handleInstructorClick}
          role={getTutorProfilePath(course.instructor) ? 'button' : undefined}
          style={getTutorProfilePath(course.instructor) ? { cursor: 'pointer' } : undefined}
        >
          <img 
            src={course.instructor?.avatar} 
            alt={course.instructor?.name} 
            className="instructor-avatar"
            onError={(e) => e.target.src = '/assets/images/icons/Ellipse 2.svg'}
          />
          <span className="course-instructor-name">{course.instructor?.name}</span>
        </div>

        <h4 className="course-title">{course.title}</h4>
        <p className="course-chapter">{course.lessons || course.chapter || ''}</p>

        <div className="course-actions">
          <button 
            className={`btn-enroll-now ${enrolled ? 'enrolled' : ''}`}
            onClick={handleEnrollClick}
            disabled={isEnrolling || enrolled}
          >
            {isEnrolling ? 'Enrolling...' : enrolled ? '✓ Enrolled' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default BrowseCourseCard;
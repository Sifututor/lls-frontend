// src/components/Browsecoursestats.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEnrollCourseMutation } from '../store/api/authApi';
import { showError, showInfo } from '../utils/toast';

function BrowseCourseStats({ stats, isSaved, onSave, onEnroll }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = async () => {
    try {
      const result = await enrollCourse(slug).unwrap();
      
      // Stay on browse course details - just show enrolled state
      setEnrolled(true);
      
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

  return (
    <div className="browse-stats-container">
      <div className="browse-stats-row">
        <div className="browse-stat-item">
          <div className="browse-stat-label">Lessons</div>
          <div className="browse-stat-value">{stats.lessons}</div>
        </div>

        <div className="browse-stat-item">
          <div className="browse-stat-label">Quizzes</div>
          <div className="browse-stat-value">{stats.quizzes}</div>
        </div>

        <div className="browse-stat-item">
          <div className="browse-stat-label">Enrolled Students</div>
          <div className="browse-stat-value">{stats.enrolledStudents}</div>
        </div>

        <div className="browse-stat-item">
          <div className="browse-stat-label">Learning Hours</div>
          <div className="browse-stat-value">{stats.learningHours}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="browse-actions-row">
        <button 
          className={`btn-browse-save ${isSaved ? 'saved' : ''}`}
          onClick={onSave}
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button 
          className={`btn-browse-enroll ${enrolled ? 'enrolled' : ''}`}
          onClick={handleEnroll}
          disabled={isEnrolling || enrolled}
        >
          {isEnrolling ? 'Enrolling...' : enrolled ? '✓ Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
}

export default BrowseCourseStats;
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import BrowseCourseStats from '../components/Browsecoursestats';
import BrowseAboutSection from '../components/Browseaboutsection';
import TutorCard from '../components/Tutorcard';
import CourseCard from '../components/CourseCard';
import { tutorProfileData } from '../data/Tutorprofiledata';

function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSendMessage = () => {
    alert(`Send message to ${tutorProfileData.tutorCard.name}`);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/browse-course/${courseId}`);
  };

  return (
    <>
      <Sidebar />

      <main className="main-content">
        <TopNavbar title="Tutor Profile" breadcrumb={tutorProfileData.tutorCard.name} />

        <div className="instructor-profile-wrapper">
          {/* Top Grid - Stats/About + Tutor Card */}
          <div className="instructor-top-grid">
            {/* LEFT COLUMN - Stats + About Me */}
            <div className="instructor-left-column">
              {/* Reuse BrowseCourseStats - change labels via custom display */}
              <div className="browse-stats-container">
                <div className="browse-stats-row">
                  <div className="browse-stat-item">
                    <div className="browse-stat-label">Total Learners</div>
                    <div className="browse-stat-value">{tutorProfileData.stats.lessons}</div>
                  </div>

                  <div className="browse-stat-item">
                    <div className="browse-stat-label">Reviews</div>
                    <div className="browse-stat-value">{tutorProfileData.stats.quizzes}</div>
                  </div>
                </div>
              </div>

              {/* Reuse BrowseAboutSection */}
              <BrowseAboutSection about={tutorProfileData.about} />
            </div>

            {/* RIGHT COLUMN - Tutor Card (NEW component) */}
            <div className="instructor-right-column">
              <TutorCard 
                tutor={tutorProfileData.tutorCard}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>

          {/* My Courses Section - FULL WIDTH BELOW */}
          <div className="instructor-courses-section">
            <h2 className="instructor-courses-heading">My Courses</h2>
            
            {/* Reuse CourseCard */}
            <div className="courses-grid">
              {tutorProfileData.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleCourseClick(course.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default TutorProfile;